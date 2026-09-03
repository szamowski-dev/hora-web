"use client";

import { useEffect, useState } from "react";

/**
 * Fades its children out while the watched element is on screen. Used by the
 * blog post rail so it steps aside the moment the wide banner above Topics
 * scrolls into the viewport, instead of two identical asks competing.
 */
export function HideWhenInView({
  watchId,
  className,
  children,
}: {
  watchId: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [watchedInView, setWatchedInView] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const target = document.getElementById(watchId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setWatchedInView(entry.isIntersecting),
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, [watchId]);

  return (
    <div
      data-out-of-view={watchedInView ? "true" : undefined}
      aria-hidden={watchedInView || undefined}
      className={className}
    >
      {children}
    </div>
  );
}
