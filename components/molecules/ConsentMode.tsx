"use client";

import { useEffect } from "react";

function updateConsentMode() {
  const consent = window.Cookiebot?.consent;
  if (!consent || typeof window.gtag !== "function") return;

  const analyticsStorage = consent.statistics ? "granted" : "denied";
  const adStorage = consent.marketing ? "granted" : "denied";

  window.gtag("consent", "update", {
    analytics_storage: analyticsStorage,
    ad_storage: adStorage,
    ad_user_data: adStorage,
    ad_personalization: adStorage,
  });
}

export function ConsentMode() {
  useEffect(() => {
    const events = [
      "CookiebotOnConsentReady",
      "CookiebotOnAccept",
      "CookiebotOnDecline",
      "CookiebotOnWithdraw",
    ];

    for (const event of events) {
      window.addEventListener(event, updateConsentMode);
    }
    updateConsentMode();

    return () => {
      for (const event of events) {
        window.removeEventListener(event, updateConsentMode);
      }
    };
  }, []);

  return null;
}
