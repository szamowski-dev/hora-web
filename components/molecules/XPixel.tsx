"use client";

import { useEffect } from "react";
import {
  ANALYTICS_CONSENT_CHANGED_EVENT,
  isAnalyticsConsentGranted,
} from "@/lib/cookie-consent";
import { initializeXPixel } from "@/lib/x-pixel";

export function XPixel() {
  useEffect(() => {
    const startWhenConsented = () => {
      if (isAnalyticsConsentGranted()) initializeXPixel();
    };

    startWhenConsented();
    window.addEventListener(ANALYTICS_CONSENT_CHANGED_EVENT, startWhenConsented);
    return () =>
      window.removeEventListener(
        ANALYTICS_CONSENT_CHANGED_EVENT,
        startWhenConsented,
      );
  }, []);

  return null;
}
