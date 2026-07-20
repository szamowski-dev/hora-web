import { captureFirstTouch } from "@/lib/analytics";

// Persist first-touch attribution on the very first page load. GA4 page views
// and custom events are dispatched by the shared analytics layer.
captureFirstTouch();
