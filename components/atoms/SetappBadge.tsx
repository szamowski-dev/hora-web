"use client";

import { useEffect, useRef } from "react";

const SETAPP_BADGE_SCRIPT = "https://developer.setapp.com/setapp-badge/index.js";

export function SetappBadge() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const badge = document.createElement("setapp-badge");
    badge.setAttribute("appId", "1977");
    badge.setAttribute("vendorId", "1584");
    badge.setAttribute("theme", "dark");
    container.replaceChildren(badge);

    if (
      !document.querySelector(
        `script[src="${SETAPP_BADGE_SCRIPT}"]`,
      )
    ) {
      const script = document.createElement("script");
      script.src = SETAPP_BADGE_SCRIPT;
      script.async = true;
      document.body.appendChild(script);
    }

    return () => container.replaceChildren();
  }, []);

  return <div ref={containerRef} aria-label="Available on Setapp" />;
}
