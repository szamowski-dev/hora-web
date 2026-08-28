"use client";

import { useEffect } from "react";
import {
  ANALYTICS_CONSENT_CHANGED_EVENT,
  isAnalyticsConsentGranted,
} from "@/lib/cookie-consent";

const META_PIXEL_ID = "1955694115117687";

type MetaPixelFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  push?: MetaPixelFunction;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    _fbq?: MetaPixelFunction;
    fbq?: MetaPixelFunction;
  }
}

function initializeMetaPixel() {
  if (typeof window.fbq === "function") return;

  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
      return;
    }
    fbq.queue?.push(args);
  }) as MetaPixelFunction;

  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.append(script);

  fbq("init", META_PIXEL_ID);
  fbq("track", "PageView");
}

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
