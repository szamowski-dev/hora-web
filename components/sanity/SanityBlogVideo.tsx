"use client";

import { useEffect, useRef, useState } from "react";
import { stegaClean } from "next-sanity";
import { cn } from "@/lib/cn";
import type { SanityBlogVideoValue } from "@/sanity/lib/queries";

export function SanityBlogVideo({ value }: { value: SanityBlogVideoValue }) {
  const figureRef = useRef<HTMLElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const webmUrl = value.webmUrl ? stegaClean(value.webmUrl) : undefined;
  const mp4Url = value.mp4Url ? stegaClean(value.mp4Url) : undefined;
  const poster = value.poster?.asset?.url
    ? stegaClean(value.poster.asset.url)
    : undefined;
  const hasGlow = stegaClean(value.presentation) === "glow";
  const autoPlay = value.autoplay ?? true;

  useEffect(() => {
    if (!webmUrl) return;
    const figure = figureRef.current;
    if (!figure || !("IntersectionObserver" in window)) {
      const timer = window.setTimeout(() => setNearViewport(true), 0);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: "480px 0px" },
    );
    observer.observe(figure);
    return () => observer.disconnect();
  }, [webmUrl]);

  if (!webmUrl) return null;

  return (
    <figure
      ref={figureRef}
      aria-label={value.accessibilityLabel}
      className="blog-wide my-8"
    >
      <video
        autoPlay={autoPlay && nearViewport}
        loop={value.loop ?? true}
        muted={value.muted ?? true}
        controls={!autoPlay}
        playsInline
        preload="metadata"
        poster={poster}
        className={cn(
          "m-0 h-auto w-full rounded-xl border-0",
          hasGlow &&
            "shadow-[0_28px_86px_-54px_rgba(255,56,60,0.48),0_36px_100px_-42px_rgba(0,0,0,0.9)]",
        )}
      >
        <source src={webmUrl} type="video/webm" />
        {mp4Url ? <source src={mp4Url} type="video/mp4" /> : null}
      </video>
      {value.caption ? (
        <figcaption className="mt-3 text-center font-sans text-sm leading-5 text-muted">
          {value.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
