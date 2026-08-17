import posthog from "posthog-js";

import {
  captureFirstTouch,
  POSTHOG_BROWSER_EVENT,
  type EventProps,
} from "@/lib/analytics";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function syncPostHogConsent() {
  if (window.Cookiebot?.consent?.statistics) {
    posthog.opt_in_capturing({ captureEventName: false });
  } else {
    posthog.opt_out_capturing();
  }
}

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
    defaults: "2026-01-30",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
    opt_out_capturing_by_default: true,
    opt_out_persistence_by_default: true,
    loaded: syncPostHogConsent,
  });

  const consentEvents = [
    "CookiebotOnConsentReady",
    "CookiebotOnAccept",
    "CookiebotOnDecline",
    "CookiebotOnWithdraw",
  ];
  consentEvents.forEach((eventName) => {
    window.addEventListener(eventName, syncPostHogConsent);
  });
  window.addEventListener(POSTHOG_BROWSER_EVENT, capturePostHogEvent);
}

// GA4 is initialized before hydration in app/layout.tsx. Capture first-touch
// attribution after the app becomes interactive.
captureFirstTouch();
