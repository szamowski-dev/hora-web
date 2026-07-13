"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";

type Testimonial = {
  text: string;
  author: string;
  handle: string;
  href: string;
  avatarSrc: string;
};

export function TestimonialsCarousel({
  quotes,
}: {
  quotes: readonly Testimonial[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (
      paused ||
      quotes.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % quotes.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [paused, quotes.length]);

  if (quotes.length === 0) return null;

  return (
    <div
      className="shader-panel-soft ui-panel-soft relative min-h-[13.5rem] overflow-hidden rounded-lg md:h-[14.5rem]"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-5 top-4 z-20 text-3xl font-semibold leading-none text-accent md:left-6"
      >
        &ldquo;
      </span>

      <div className="relative h-[13.5rem] md:h-[14.5rem]">
        {quotes.map((quote, index) => {
          const isActive = index === activeIndex;
          const compact = quote.text.length > 120;

          return (
            <figure
              key={quote.href}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 flex flex-col px-5 py-5 text-left md:px-6 md:py-6",
                isActive ? "pointer-events-auto" : "pointer-events-none",
              )}
            >
              <div
                className={cn(
                  "relative flex h-[7.1rem] items-center pt-5 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
                  isActive
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0",
                )}
              >
                <blockquote
                  className={cn(
                    "max-w-2xl text-pretty font-semibold tracking-tight text-text/95",
                    compact
                      ? "text-[0.8rem] leading-[1.24] md:text-[0.92rem] md:leading-[1.32]"
                      : "text-[1.18rem] leading-[1.18] md:text-[1.45rem] md:leading-[1.2]",
                  )}
                >
                  {quote.text}
                </blockquote>
              </div>

              <figcaption
                className={cn(
                  "relative mt-auto flex items-center gap-2.5 border-t border-line pt-3 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
                  isActive
                    ? "translate-y-0 opacity-100 delay-75"
                    : "translate-y-2 opacity-0 delay-0",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={quote.avatarSrc}
                  alt={`${quote.author} avatar`}
                  width={48}
                  height={48}
                  loading="lazy"
                  decoding="async"
                  className="h-9 w-9 rounded-full border border-line-strong bg-overlay object-cover"
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-text">
                    {quote.author}
                  </p>
                  <a
                    href={quote.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={isActive ? 0 : -1}
                    aria-label={`Open ${quote.author} on X`}
                    className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:text-accent"
                  >
                    <Icon name="x" size={12} />
                    {quote.handle}
                  </a>
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
