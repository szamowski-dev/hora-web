"use client";

import posthog from "posthog-js";
import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { captureFirstTouch } from "@/lib/analytics";
import {
  applyCookieConsent,
  readCookieConsent,
  requiresCookieConsent,
  saveCookieConsent,
} from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const savedConsent = readCookieConsent();
    if (savedConsent) {
      applyCookieConsent(savedConsent);
      return;
    }

    const countryCode = posthog.get_property("$geoip_country_code");
    if (requiresCookieConsent(countryCode)) {
      const frame = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    // Outside GDPR-regulated regions, browser persistence is enabled without
    // rendering the consent UI.
    applyCookieConsent("yes");
    captureFirstTouch(true);
  }, []);

  if (!visible) return null;

  function choose(consent: "yes" | "no") {
    saveCookieConsent(consent);
    if (consent === "yes") captureFirstTouch();
    setVisible(false);
  }

  return (
    <aside
      aria-describedby="cookie-consent-description"
      aria-labelledby="cookie-consent-title"
      role="region"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto flex max-w-3xl flex-col gap-5 rounded-2xl border border-line-strong bg-panel p-5 shadow-2xl md:inset-x-6 md:flex-row md:items-center md:justify-between md:p-6"
    >
      <div className="max-w-2xl">
        <h2 id="cookie-consent-title" className="text-base font-semibold text-text">
          Cookie preferences
        </h2>
        <p
          id="cookie-consent-description"
          className="mt-1 text-sm leading-6 text-text"
        >
          We use cookies to remember your preferences and improve our marketing.
          <br />
          You can accept or reject optional cookies.
        </p>
      </div>
      <div
        aria-label="Cookie preference actions"
        className="flex shrink-0 flex-col gap-2 sm:flex-row"
        role="group"
      >
        <Button
          className="min-h-11 w-full sm:w-auto"
          variant="outline"
          onClick={() => choose("no")}
        >
          Reject
        </Button>
        <Button className="min-h-11 w-full sm:w-auto" onClick={() => choose("yes")}>
          Accept
        </Button>
      </div>
    </aside>
  );
}
