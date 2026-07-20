import { isTestEmail, normalizeEmail } from "@/lib/identity";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    rdt?: (...args: unknown[]) => void;
  }
}

export const REDDIT_PIXEL_ID = "a2_j1933bxzyyfr";
export const GA_MEASUREMENT_ID = "G-WQZ32S81FX";

export type EventProps = Record<string, string | number | boolean>;

export function track(event: string, props?: EventProps) {
  if (typeof window === "undefined") return;
  // Guard with typeof, not optional chain: privacy extensions (Brave shields,
  // uBlock, AdGuard) can stub window.gtag as a non-callable object.
  if (typeof window.gtag === "function") {
    window.gtag("event", event, props);
  }
}

export function trackPageView(pagePath: string) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: pagePath,
      page_title: document.title,
    });
  }
}

export const CONVERSION_TAGS = {
  waitlistSignup: "AW-18070613857/NVQcCNP48ZscEOHe3qhD",
} as const;

export function trackConversion(sendTo: string) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", { send_to: sendTo });
  }
}

async function sha256Hex(text: string): Promise<string | null> {
  if (typeof crypto === "undefined" || !crypto.subtle) return null;
  try {
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(text),
    );
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return null;
  }
}

// Re-init the Reddit Pixel with hashed email so advanced matching attaches
// to subsequent events. Reddit accepts SHA-256 of a normalized (trim+lower)
// email; we never send the raw address.
export async function redditIdentify(email: string) {
  if (typeof window === "undefined") return;
  const normalized = normalizeEmail(email);
  if (!normalized || isTestEmail(normalized)) return;
  const hashed = await sha256Hex(normalized);
  if (!hashed) return;
  if (typeof window.rdt === "function") {
    window.rdt("init", REDDIT_PIXEL_ID, { email: hashed });
  }
}

export function redditTrack(event: string, props?: EventProps) {
  if (typeof window === "undefined") return;
  if (typeof window.rdt === "function") {
    window.rdt("track", event, props);
  }
}

// First-touch attribution — persisted across sessions in localStorage so that a
// signup three days / two visits later still knows where the user originally
// came from. We attach it directly to conversion events for GA4 funnels and
// breakdowns.

const FIRST_TOUCH_KEY = "hora_first_touch_v1";

type FirstTouch = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  referrer?: string;
  landing_page?: string;
  at: string;
};

function readFirstTouch(): FirstTouch | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage?.getItem(FIRST_TOUCH_KEY);
    return raw ? (JSON.parse(raw) as FirstTouch) : null;
  } catch {
    return null;
  }
}

export function captureFirstTouch() {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage?.getItem(FIRST_TOUCH_KEY)) return;
    const url = new URL(window.location.href);
    const param = (k: string) => url.searchParams.get(k) || undefined;
    const data: FirstTouch = {
      source: param("utm_source"),
      medium: param("utm_medium"),
      campaign: param("utm_campaign"),
      term: param("utm_term"),
      content: param("utm_content"),
      referrer: document.referrer || undefined,
      landing_page: url.pathname + url.search,
      at: new Date().toISOString(),
    };
    window.localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(data));
  } catch {
    /* localStorage blocked (Safari ITP / private mode) — safe to skip */
  }
}

export function getAttribution(): EventProps {
  const props: EventProps = {};
  const ft = readFirstTouch();
  if (!ft) return props;
  if (ft.source) props.first_touch_utm_source = ft.source;
  if (ft.medium) props.first_touch_utm_medium = ft.medium;
  if (ft.campaign) props.first_touch_utm_campaign = ft.campaign;
  if (ft.term) props.first_touch_utm_term = ft.term;
  if (ft.content) props.first_touch_utm_content = ft.content;
  if (ft.referrer) props.first_touch_referrer = ft.referrer;
  if (ft.landing_page) props.first_touch_landing_page = ft.landing_page;
  props.first_touch_at = ft.at;
  return props;
}
