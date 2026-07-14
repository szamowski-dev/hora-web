"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type VideoSource = {
  src: string;
  type: string;
};

export function VideoShowcaseNativeVideo({
  ariaLabel,
  poster,
  sources,
  videoId,
  active = true,
  className,
}: {
  ariaLabel: string;
  poster: string;
  sources: readonly VideoSource[];
  videoId: string;
  active?: boolean;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackedViewedRef = useRef(false);
  const trackedPlayedRef = useRef(false);
  const trackedUnmutedRef = useRef(false);
  const trackedQuartilesRef = useRef<Set<number>>(new Set());
  const [reducedMotion, setReducedMotion] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(
    () => typeof window !== "undefined" && !("IntersectionObserver" in window),
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reducedMotion || !active) {
      video.pause();
      return;
    }

    if (shouldLoad) {
      video.play().catch(() => {});
    }
  }, [active, reducedMotion, shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldLoad) {
      if (trackedViewedRef.current) return;
      trackedViewedRef.current = true;
      track("demo_viewed", { asset: "hero_gif" });
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || trackedViewedRef.current) return;
        setShouldLoad(true);
        trackedViewedRef.current = true;
        track("demo_viewed", { asset: "hero_gif" });
        io.disconnect();
      },
      { rootMargin: "360px 0px", threshold: 0.25 },
    );

    io.observe(video);
    return () => io.disconnect();
  }, [shouldLoad]);

  const trackProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const pct = (video.currentTime / video.duration) * 100;
    for (const quartile of [25, 50, 75, 95] as const) {
      if (pct >= quartile && !trackedQuartilesRef.current.has(quartile)) {
        trackedQuartilesRef.current.add(quartile);
        track("demo_progress", {
          video_id: videoId,
          quartile,
        });
      }
    }
  }, [videoId]);

  const trackPlayed = useCallback(() => {
    if (trackedPlayedRef.current) return;
    trackedPlayedRef.current = true;
    track("demo_played", { video_id: videoId });
  }, [videoId]);

  const trackUnmuted = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.muted || trackedUnmutedRef.current) return;
    trackedUnmutedRef.current = true;
    track("demo_unmuted", { video_id: videoId });
  }, [videoId]);

  return (
    <video
      ref={videoRef}
      className={cn(
        "w-full bg-black object-cover",
        className ?? "aspect-video",
      )}
      autoPlay={active && !reducedMotion}
      controls
      loop={!reducedMotion}
      muted
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={ariaLabel}
      onPlay={trackPlayed}
      onTimeUpdate={trackProgress}
      onVolumeChange={trackUnmuted}
    >
      {shouldLoad
        ? sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))
        : null}
    </video>
  );
}
