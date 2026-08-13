"use client";

import { useEffect } from "react";
import { track, type EventProps } from "@/lib/analytics";
import { ANALYTICS_EVENTS } from "@/lib/analyticsSchema";

function parseProps(raw?: string): EventProps | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as EventProps;
  } catch {
    return undefined;
  }
}

export function AnalyticsDelegates() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const el = target?.closest?.<HTMLElement>("[data-analytics-event]");
      const eventName = el?.dataset.analyticsEvent;
      const props = parseProps(el?.dataset.analyticsProps);

      if (el && eventName) {
        track(eventName, props);
      }

      const anchor = target?.closest?.<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      const url = new URL(anchor.href, window.location.href);
      const normalizedPath = url.pathname.replace(/\/+$/, "");
      const isDirectDownload = normalizedPath === "/download/direct";
      if (
        url.origin !== window.location.origin ||
        (normalizedPath !== "/download" && !isDirectDownload) ||
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
          link_url: `${url.pathname}${url.search}${url.hash}`,
        },
      );
    }

    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
