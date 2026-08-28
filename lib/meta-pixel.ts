import { isAnalyticsConsentGranted } from "@/lib/cookie-consent";

export const META_PIXEL_ID = "1955694115117687";

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

export type MetaAttribution = {
  fbp?: string;
  fbc?: string;
};

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  const prefix = `${name}=`;
  for (const item of document.cookie.split(";")) {
    const value = item.trim();
    if (!value.startsWith(prefix)) continue;
    const decoded = decodeURIComponent(value.slice(prefix.length)).trim();
    return decoded && decoded.length <= 200 ? decoded : undefined;
  }
  return undefined;
}

export function metaAttribution(): MetaAttribution | undefined {
  if (!isAnalyticsConsentGranted()) return undefined;

  const attribution = {
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc"),
  };
  return attribution.fbp || attribution.fbc ? attribution : undefined;
}

export function initializeMetaPixel() {
  if (typeof window === "undefined" || typeof window.fbq === "function") return;

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

export function trackMetaPixel(
  eventName: string,
  parameters?: Record<string, string | number | boolean>,
  eventID?: string,
) {
  if (!isAnalyticsConsentGranted() || typeof window?.fbq !== "function") return;
  window.fbq("track", eventName, parameters ?? {}, eventID ? { eventID } : undefined);
}
