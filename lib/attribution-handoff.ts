import { createDownloadId, getAttribution, type EventProps } from "@/lib/analytics";
import { isAnalyticsConsentGranted } from "@/lib/cookie-consent";

const HANDOFF_SESSION_KEY = "hora_attribution_handoff_session_v1";
const HANDOFF_ENDPOINT =
  process.env.NEXT_PUBLIC_ATTRIBUTION_HANDOFF_URL ??
  "https://download.horacal.app/attribution/touch";

type TouchKind = "page_view" | "cta_click";

type HandoffTouch = {
  schema_version: 1;
  handoff_session_id: string;
  kind: TouchKind;
  occurred_at: string;
  path: string;
  placement?: string;
  destination?: string;
  event_name?: string;
  attribution: EventProps;
};

function sessionID(): string | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const existing = window.sessionStorage.getItem(HANDOFF_SESSION_KEY);
    if (existing) return existing;

    const created = createDownloadId();
    if (!created) return undefined;
    window.sessionStorage.setItem(HANDOFF_SESSION_KEY, created);
    return created;
  } catch {
    return undefined;
  }
}

function currentPath(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return `${window.location.pathname}${window.location.search}`;
}

function sendTouch(touch: HandoffTouch) {
  void fetch(HANDOFF_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify(touch),
    credentials: "omit",
    keepalive: true,
    mode: "cors",
  }).catch(() => {
    // Attribution is best-effort and must never affect page navigation.
  });
}

function recordTouch(
  kind: TouchKind,
  details: {
    path?: string;
    placement?: string;
    destination?: string;
    eventName?: string;
  } = {},
) {
  if (!isAnalyticsConsentGranted()) return;

  const handoffSessionID = sessionID();
  const path = details.path ?? currentPath();
  if (!handoffSessionID || !path) return;

  sendTouch({
    schema_version: 1,
    handoff_session_id: handoffSessionID,
    kind,
    occurred_at: new Date().toISOString(),
    path,
    ...(details.placement ? { placement: details.placement } : {}),
    ...(details.destination ? { destination: details.destination } : {}),
    ...(details.eventName ? { event_name: details.eventName } : {}),
    attribution: getAttribution(),
  });
}

export function recordAttributionPageView(path?: string) {
  recordTouch("page_view", { path });
}

export function recordAttributionCta(
  eventName: string,
  props?: EventProps,
) {
  recordTouch("cta_click", {
    placement: typeof props?.placement === "string" ? props.placement : undefined,
    destination:
      typeof props?.destination === "string" ? props.destination : undefined,
    eventName,
  });
}
