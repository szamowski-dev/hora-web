import posthog from "posthog-js";

import {
  captureFirstTouch,
  POSTHOG_BROWSER_EVENT,
  type EventProps,
} from "@/lib/analytics";
import {
  applyCookieConsent,
  readCookieConsent,
} from "@/lib/cookie-consent";
import { filterPostHogEvent } from "@/lib/posthog-error-filter";
import { limitRepeatedLogs } from "@/lib/posthog-log-limit";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function capturePostHogEvent(event: Event) {
  const { event: eventName, props } = (
    event as CustomEvent<{ event: string; props?: EventProps }>
  ).detail;
  posthog.capture(eventName, props);
}

if (!projectToken || !host) {
  if (process.env.NODE_ENV === "development") {
    const missingVariable = !projectToken
      ? "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN"
      : "NEXT_PUBLIC_POSTHOG_HOST";
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  posthog.init(projectToken, {
    api_host: host,
    ui_host: "https://us.posthog.com",
    defaults: "2026-05-30",
    capture_exceptions: true,
    before_send: filterPostHogEvent,
    // Console capture stays governed by the project's remote config; this only
    // caps repeats once a record has been captured.
    logs: { beforeSend: limitRepeatedLogs },
    opt_in_site_apps: true,
    debug: process.env.NODE_ENV === "development",
    persistence: "memory",
  });

  // Apply a prior choice during startup, before React renders the banner.
  const savedConsent = readCookieConsent();
  if (savedConsent) {
    applyCookieConsent(savedConsent);
  }

  window.addEventListener(POSTHOG_BROWSER_EVENT, capturePostHogEvent);
}

// Save first-touch attribution only where browser storage is allowed.
captureFirstTouch();
