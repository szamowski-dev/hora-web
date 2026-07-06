import { captureFirstTouch } from "@/lib/analytics";

// Persist first-touch attribution on the very first page load. Plausible's own
// pageview + custom events are loaded via the <Script> tags in app/layout.tsx.
captureFirstTouch();
