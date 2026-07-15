"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";
import type { HomePageContent } from "@/lib/home-model";

export function TestimonialsCarousel({
  quotes,
}: {
  quotes: ReadonlyArray<
    HomePageContent["socialProof"]["testimonials"][number]
  >;
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
      className="shader-panel-soft ui-panel-soft relative h-[13.5rem] overflow-hidden rounded-lg md:h-full"
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

      <div className="relative h-full">
        {quotes.map((quote, index) => {
          const isActive = index === activeIndex;
          const short = quote.quote.length < 90;
          const compact = quote.quote.length > 120;
          const veryCompact = quote.quote.length > 190;
          const isReddit = quote.platform === "reddit";
          const isDiscord = quote.platform === "discord";
          const platformLabel = isReddit
            ? "Reddit"
            : isDiscord
              ? "Discord"
              : "X";
          const platformIcon = isReddit
            ? "reddit"
            : isDiscord
              ? "discord"
              : "x";

          return (
            <figure
              key={quote.id}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 flex flex-col px-5 py-5 text-left md:px-6 md:py-6",
                isActive ? "pointer-events-auto" : "pointer-events-none",
              )}
            >
              <div
                className={cn(
                  "relative flex min-h-0 flex-1 items-center pb-1 pt-3 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none md:pt-2",
                  isActive
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0",
                )}
              >
                <blockquote
                  className={cn(
                    "max-w-2xl text-pretty font-semibold tracking-tight text-text/95 md:-translate-y-[20%]",
                    veryCompact
                      ? "text-[0.8rem] leading-[1.24] md:text-[1.08rem] md:leading-[1.26]"
                      : compact
                        ? "text-[0.9rem] leading-[1.24] md:text-[1.2rem] md:leading-[1.25]"
                        : short
                          ? "text-[1.32rem] leading-[1.14] md:text-[2rem] md:leading-[1.12]"
                          : "text-[1.14rem] leading-[1.18] md:text-[1.55rem] md:leading-[1.16]",
                  )}
                >
                  {quote.quote}
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
                  src={quote.avatarUrl}
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
                    aria-label={`Open ${quote.author} on ${platformLabel}`}
                    className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:text-accent"
                  >
                    <Icon name={platformIcon} size={12} />
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
