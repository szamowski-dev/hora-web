"use client";

import { useEffect, useRef, useState } from "react";

export function LazyLoopingVideo({
  src,
  label,
  active = true,
}: {
  src: string;
  label: string;
  active?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(
    () => typeof window !== "undefined" && !("IntersectionObserver" in window),
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || shouldLoad || !active) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoad(true);
        io.disconnect();
      },
      { rootMargin: "0px", threshold: 0.15 },
    );

    io.observe(root);
    return () => io.disconnect();
  }, [active, shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (active) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [active, shouldLoad]);

  return (
    <div ref={rootRef} className="h-full w-full bg-black">
      {shouldLoad ? (
        <video
          ref={videoRef}
          className="h-full w-full bg-black object-cover"
          autoPlay={active}
          loop
          muted
          playsInline
          preload="none"
          aria-label={label}
        >
          <source src={src} type="video/webm" />
        </video>
      ) : null}
    </div>
  );
}
