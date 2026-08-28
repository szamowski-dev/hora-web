"use client";

import { useEffect } from "react";
import {
  ANALYTICS_CONSENT_CHANGED_EVENT,
  isAnalyticsConsentGranted,
} from "@/lib/cookie-consent";
import { initializeMetaPixel } from "@/lib/meta-pixel";

export function MetaPixel() {
  useEffect(() => {
    const startWhenConsented = () => {
      if (isAnalyticsConsentGranted()) initializeMetaPixel();
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
