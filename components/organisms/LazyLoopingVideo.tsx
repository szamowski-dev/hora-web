"use client";

import { useEffect, useRef, useState } from "react";

export function LazyLoopingVideo({
  src,
  label,
}: {
  src: string;
  label: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(
    () => typeof window !== "undefined" && !("IntersectionObserver" in window),
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || shouldLoad) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoad(true);
        io.disconnect();
      },
      { rootMargin: "360px 0px" },
    );

    io.observe(root);
    return () => io.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={rootRef} className="h-full w-full bg-black">
      {shouldLoad ? (
        <video
          className="h-full w-full bg-black object-cover"
          autoPlay
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
