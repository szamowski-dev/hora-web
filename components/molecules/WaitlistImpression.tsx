"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

export function WaitlistImpression({ placement }: { placement: string }) {
  const sentinelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = sentinelRef.current?.parentElement;
    if (!host || typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) {
      track("newsletter_card_view", { placement });
      return;
    }

    let fired = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired) {
            fired = true;
            track("newsletter_card_view", { placement });
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, [placement]);

  return <span ref={sentinelRef} aria-hidden className="hidden" />;
}
