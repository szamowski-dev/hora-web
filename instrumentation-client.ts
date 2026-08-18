import posthog from "posthog-js";

import {
  captureFirstTouch,
  POSTHOG_BROWSER_EVENT,
  type EventProps,
} from "@/lib/analytics";

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
    debug: process.env.NODE_ENV === "development",
    cookieless_mode: "always",
  });

  window.addEventListener(POSTHOG_BROWSER_EVENT, capturePostHogEvent);
}

// GA4 is initialized before hydration in app/layout.tsx. Capture first-touch
// attribution after the app becomes interactive.
captureFirstTouch();
