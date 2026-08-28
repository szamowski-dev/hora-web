"use client";

import { useEffect } from "react";
import { createDownloadId, track, type EventProps } from "@/lib/analytics";
import { recordAttributionCta } from "@/lib/attribution-handoff";
import { ANALYTICS_EVENTS } from "@/lib/analyticsSchema";
import { trackMetaPixel } from "@/lib/meta-pixel";

const DIRECT_HANDOFF_NAVIGATION_TIMEOUT_MS = 750;

function parseProps(raw?: string): EventProps | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as EventProps;
  } catch {
    return undefined;
  }
}

function shouldWaitForDirectHandoff(event: MouseEvent, anchor: HTMLAnchorElement) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    (!anchor.target || anchor.target === "_self") &&
    !anchor.hasAttribute("download")
  );
}

function navigateAfterDirectHandoff(handoff: Promise<void>, href: string) {
  let didNavigate = false;
  const navigate = () => {
    if (didNavigate) return;
    didNavigate = true;
    window.location.assign(href);
  };
  const timeout = window.setTimeout(navigate, DIRECT_HANDOFF_NAVIGATION_TIMEOUT_MS);
  void handoff.then(
    () => {
      window.clearTimeout(timeout);
      navigate();
    },
    () => {
      window.clearTimeout(timeout);
      navigate();
    },
  );
}

export function AnalyticsDelegates() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const el = target?.closest?.<HTMLElement>("[data-analytics-event]");
      const eventName = el?.dataset.analyticsEvent;
      const props = parseProps(el?.dataset.analyticsProps);

      const anchor = target?.closest?.<HTMLAnchorElement>("a[href]");
      if (!anchor) {
        if (el && eventName) track(eventName, props);
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      const normalizedPath = url.pathname.replace(/\/+$/, "");
      const isDirectDownload =
        normalizedPath === "/download/direct" &&
        eventName === ANALYTICS_EVENTS.directDownloadClick;
      const isInternalDirectDownload =
        isDirectDownload && url.origin === window.location.origin;
      const originalLinkUrl = `${url.pathname}${url.search}${url.hash}`;
      const downloadId = isInternalDirectDownload ? createDownloadId() : undefined;

      if (downloadId) {
        url.searchParams.set("download_id", downloadId);
        anchor.href = `${url.pathname}${url.search}${url.hash}`;
      }

      if (el && eventName) {
        const trackedProps = {
          ...props,
          ...(downloadId ? { download_id: downloadId } : {}),
        };
        track(eventName, trackedProps);
        if (
          eventName === ANALYTICS_EVENTS.directDownloadClick ||
          eventName === "app_store_cta_click" ||
          eventName === ANALYTICS_EVENTS.downloadClick
        ) {
          trackMetaPixel(
            "Lead",
            {
              content_category: "distribution",
              content_name:
                eventName === ANALYTICS_EVENTS.directDownloadClick
                  ? "direct_download"
                  : eventName === "app_store_cta_click"
                    ? "mac_app_store"
                    : "download",
            },
            downloadId,
          );
        }
        const handoff = recordAttributionCta(eventName, trackedProps);
        if (
          isInternalDirectDownload &&
          shouldWaitForDirectHandoff(event, anchor)
        ) {
          event.preventDefault();
          navigateAfterDirectHandoff(handoff, anchor.href);
          return;
        }
      }

      if (
        url.origin !== window.location.origin ||
        normalizedPath !== "/download/direct" ||
        eventName === ANALYTICS_EVENTS.downloadClick ||
        eventName === ANALYTICS_EVENTS.directDownloadClick
      ) {
        return;
      }

      track(
        isDirectDownload
          ? ANALYTICS_EVENTS.directDownloadClick
          : ANALYTICS_EVENTS.downloadClick,
        {
          ...props,
          link_text:
            props?.link_text ||
            anchor.textContent?.replace(/\s+/g, " ").trim() ||
            "Download",
          link_url: originalLinkUrl,
          ...(downloadId ? { download_id: downloadId } : {}),
        },
      );
    }

    function onToggle(event: Event) {
      const details = event.target;
      if (!(details instanceof HTMLDetailsElement) || !details.open) return;

      const eventName = details.dataset.analyticsOpenEvent;
      if (!eventName) return;

      track(eventName, parseProps(details.dataset.analyticsOpenProps));
    }

    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("toggle", onToggle, { capture: true });
    return () =>
      {
        document.removeEventListener("click", onClick, { capture: true });
        document.removeEventListener("toggle", onToggle, { capture: true });
      };
  }, []);

  return null;
}
