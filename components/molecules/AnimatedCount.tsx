"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedCount({
  value,
  duration = 1100,
  offset,
}: {
  value: number;
  duration?: number;
  offset?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const span = Math.min(offset ?? Math.max(28, Math.round(value * 0.16)), value);
  const startValue = Math.max(0, value - span);
  const [display, setDisplay] = useState(startValue);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      const frame = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(frame);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        setDisplay(startValue);
        const start = performance.now();
        const ease = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setDisplay(Math.round(startValue + ease(t) * span));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration, span, startValue]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString()}
    </span>
  );
}
