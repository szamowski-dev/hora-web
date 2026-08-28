import posthog from "posthog-js";
import { GOOGLE_ADS_ID } from "@/lib/analytics";
export { requiresCookieConsent } from "@/lib/consent-policy";

export const COOKIE_CONSENT_KEY = "cookie_consent";
export const ANALYTICS_CONSENT_CHANGED_EVENT = "hora-analytics-consent-changed";

export type CookieConsent = "yes" | "no";

let appliedConsent: CookieConsent | null = null;

export function readCookieConsent(): CookieConsent | null {
  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    return value === "yes" || value === "no" ? value : null;
  } catch {
    return null;
  }
}

export function applyCookieConsent(consent: CookieConsent) {
  const granted = consent === "yes";
  appliedConsent = consent;
  posthog.set_config({
    persistence: granted ? "localStorage+cookie" : "memory",
  });

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: granted ? "granted" : "denied",
      ad_user_data: granted ? "granted" : "denied",
      ad_personalization: granted ? "granted" : "denied",
    });
    if (granted) window.gtag("config", GOOGLE_ADS_ID);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(ANALYTICS_CONSENT_CHANGED_EVENT, {
        detail: { granted },
      }),
    );
  }
}

export function isAnalyticsConsentGranted(): boolean {
  return appliedConsent === "yes" || readCookieConsent() === "yes";
}

export function saveCookieConsent(consent: CookieConsent) {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, consent);
  } catch {
    // The current visit still receives the selected in-memory configuration.
  }
  applyCookieConsent(consent);
}
