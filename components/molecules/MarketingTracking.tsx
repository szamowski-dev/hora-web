"use client";

import { useEffect } from "react";
import { GOOGLE_ADS_ID } from "@/lib/analytics";

export function MarketingTracking() {
  useEffect(() => {
    let activated = false;

    const activate = () => {
      if (activated || !window.Cookiebot?.consent?.marketing) return;
      activated = true;

      const configureGoogleAds = () => {
        if (window.Cookiebot?.consent?.marketing) {
          window.gtag?.("config", GOOGLE_ADS_ID);
        }
      };
      if (window.horaGtagReady) {
        configureGoogleAds();
      } else {
        window.addEventListener("hora-gtag-ready", configureGoogleAds, {
          once: true,
        });
      }

    };

    window.addEventListener("CookiebotOnConsentReady", activate);
    window.addEventListener("CookiebotOnAccept", activate);
    activate();

    return () => {
      window.removeEventListener("CookiebotOnConsentReady", activate);
      window.removeEventListener("CookiebotOnAccept", activate);
    };
  }, []);

  return null;
}
