"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useId, useState } from "react";
import { cn } from "@/lib/cn";

const VideoShowcaseTelemetry = dynamic(
  () =>
    import("@/components/organisms/VideoShowcaseTelemetry").then(
      (mod) => mod.VideoShowcaseTelemetry,
    ),
  { ssr: false },
);

const YT_THUMBNAIL_BASE = "https://i.ytimg.com/vi";

export function VideoShowcaseMedia({
  videoId,
  ariaLabel,
}: {
  videoId: string;
  ariaLabel: string;
}) {
  const baseId = useId().replace(/:/g, "");
  const iframeId = `${baseId}-iframe`;
  const [thumbnailSrc, setThumbnailSrc] = useState(
    `${YT_THUMBNAIL_BASE}/${videoId}/hqdefault.jpg`,
  );
  const [reducedMotion, setReducedMotion] = useState(false);
  const [manuallyStarted, setManuallyStarted] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [nearViewport, setNearViewport] = useState(
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
    const el = document.getElementById(baseId);
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNearViewport(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [baseId]);

  const startReducedMotionPlayback = useCallback(() => {
    setManuallyStarted(true);
  }, []);

  const motionOk = !reducedMotion || manuallyStarted;
  const shouldMountIframe = motionOk && nearViewport;
  const showPoster = !motionOk || !iframeLoaded;
  const showReducedMotionPlayButton = reducedMotion && !manuallyStarted;
  const embedUrl =
    `https://www.youtube.com/embed/${videoId}` +
    `?autoplay=1&mute=1&loop=1&playlist=${videoId}` +
    "&modestbranding=1&rel=0&playsinline=1&enablejsapi=1";

  return (
    <>
      <div
        id={baseId}
        className="relative aspect-video overflow-hidden rounded-2xl bg-black ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_60px_120px_-30px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.04)]"
      >
        {shouldMountIframe ? (
          <iframe
            id={iframeId}
            src={embedUrl}
            title={ariaLabel}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture; web-share"
            allowFullScreen
            onLoad={() => setIframeLoaded(true)}
            className={cn(
              "absolute inset-0 h-full w-full border-0 transition-opacity duration-300",
              iframeLoaded ? "opacity-100" : "opacity-0",
            )}
          />
        ) : null}

        {showPoster ? (
          <button
            type="button"
            onClick={
              showReducedMotionPlayButton ? startReducedMotionPlayback : undefined
            }
            tabIndex={showReducedMotionPlayButton ? 0 : -1}
            aria-label="Play demo video"
            aria-hidden={!showReducedMotionPlayButton}
            className="group absolute inset-0 flex items-center justify-center focus-visible:outline-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailSrc}
              alt="hora Calendar macOS app demo preview"
              onError={() =>
                setThumbnailSrc(`${YT_THUMBNAIL_BASE}/${videoId}/mqdefault.jpg`)
              }
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            {showReducedMotionPlayButton ? (
              <>
                <span className="pointer-events-none absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />
                <span className="pointer-events-none relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-[0_18px_42px_-22px_oklch(0_0_0/0.96)]">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </>
            ) : null}
          </button>
        ) : null}
      </div>

      {nearViewport ? (
        <VideoShowcaseTelemetry
          iframeId={iframeId}
          iframeLoaded={iframeLoaded}
          videoId={videoId}
        />
      ) : null}
    </>
  );
}
