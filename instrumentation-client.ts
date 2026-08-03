import { captureFirstTouch } from "@/lib/analytics";

window.dataLayer = window.dataLayer || [];
window.gtag = (...args: unknown[]) => {
  window.dataLayer.push(args);
};
window.gtag("consent", "default", {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  functionality_storage: "denied",
  personalization_storage: "denied",
  security_storage: "granted",
  wait_for_update: 500,
});
window.gtag("set", "ads_data_redaction", true);
window.gtag("set", "url_passthrough", true);

// Persist first-touch attribution on the very first page load. GA4 page views
// and custom events are dispatched by the shared analytics layer.
captureFirstTouch();
