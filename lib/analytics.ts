import { normalizeUtmMedium } from "./utm";

declare global {
  interface Window {
    dataLayer: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GOOGLE_ADS_ID = "AW-18070613857";

export type EventProps = Record<string, string | number | boolean>;

export const POSTHOG_BROWSER_EVENT = "hora-posthog-capture";

export function createDownloadId(): string | undefined {
  if (typeof globalThis === "undefined" || !globalThis.crypto) return undefined;

  const cryptoApi = globalThis.crypto;
  if (typeof cryptoApi.randomUUID === "function") return cryptoApi.randomUUID();
  if (typeof cryptoApi.getRandomValues !== "function") return undefined;

  const bytes = new Uint8Array(16);
  cryptoApi.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
}

const POSTHOG_EVENTS = new Set([
  "download_click",
  "direct_download_clicked",
  "app_store_cta_click",
  "brew_copy_click",
  "distribution_menu_open",
  "newsletter_submit",
  "newsletter_form_success",
  "newsletter_signup_error",
  "post_signup_share_click",
  "post_signup_discord_click",
  "support_request_submitted",
  "support_request_failed",
  "support_request_metadata_failed",
  "blog_share_click",
  "testflight_cta_click",
  "testflight_delayed_open",
  "testflight_manual_open",
  "testflight_prompt_discord_click",
]);

function posthogProps(props?: EventProps): EventProps | undefined {
  if (!props) return undefined;

  const safeProps = { ...props };
  delete safeProps.first_touch_referrer;
  delete safeProps.first_touch_landing_page;
  return safeProps;
}

export function track(event: string, props?: EventProps) {
  if (typeof window === "undefined") return;

  if (
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
    POSTHOG_EVENTS.has(event)
  ) {
    window.dispatchEvent(
      new CustomEvent(POSTHOG_BROWSER_EVENT, {
        detail: { event, props: posthogProps(props) },
      }),
    );
  }
}

// First-touch attribution is forwarded with PostHog conversion events after
// the visitor has allowed browser storage.

const FIRST_TOUCH_KEY = "hora_first_touch_v1";

type FirstTouch = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
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

export function captureFirstTouch(storageAllowed = false) {
  if (typeof window === "undefined") return;
  try {
    if (!storageAllowed && window.localStorage?.getItem("cookie_consent") !== "yes") {
      return;
    }
    if (window.localStorage?.getItem(FIRST_TOUCH_KEY)) return;
    const url = new URL(window.location.href);
    const param = (k: string) => url.searchParams.get(k) || undefined;
    const data: FirstTouch = {
      source: param("utm_source"),
      medium: normalizeUtmMedium(param("utm_medium")),
      campaign: param("utm_campaign"),
      term: param("utm_term"),
      content: param("utm_content"),
      gclid: param("gclid"),
      gbraid: param("gbraid"),
      wbraid: param("wbraid"),
      fbclid: param("fbclid"),
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
  if (ft.gclid) props.gclid = ft.gclid;
  if (ft.gbraid) props.gbraid = ft.gbraid;
  if (ft.wbraid) props.wbraid = ft.wbraid;
  if (ft.fbclid) props.fbclid = ft.fbclid;
  if (ft.referrer) props.first_touch_referrer = ft.referrer;
  if (ft.landing_page) props.first_touch_landing_page = ft.landing_page;
  props.first_touch_at = ft.at;
  return props;
}
