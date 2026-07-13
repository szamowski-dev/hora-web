"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { LazyLoopingVideo } from "@/components/organisms/LazyLoopingVideo";
import { VideoShowcaseNativeVideo } from "@/components/organisms/VideoShowcaseNativeVideo";

type VideoSource = {
  src: string;
  type: string;
};

type ActionCard = {
  title: string;
  body: string;
  src: string;
  label: string;
};

export function MobileVideoCarousel({
  launchVideo,
  actionCards,
  videoId,
}: {
  launchVideo: {
    ariaLabel: string;
    poster: string;
    sources: readonly VideoSource[];
  };
  actionCards: readonly ActionCard[];
  videoId: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = actionCards.length + 1;

  const updateActiveSlide = useCallback(() => {
    if (frameRef.current !== null) return;

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      const scroller = scrollerRef.current;
      const firstSlide = scroller?.firstElementChild as HTMLElement | null;
      if (!scroller || !firstSlide) return;

      const gap = 12;
      const nextIndex = Math.round(
        scroller.scrollLeft / (firstSlide.offsetWidth + gap),
      );
      setActiveIndex(Math.max(0, Math.min(slideCount - 1, nextIndex)));
    });
  }, [slideCount]);

  return (
    <div className="-mx-6 mt-8 md:hidden">
      <div
        ref={scrollerRef}
        onScroll={updateActiveSlide}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="hora product videos"
      >
        <article
          className="shader-panel ui-panel w-[calc(100vw-3rem)] shrink-0 snap-center overflow-hidden rounded-xl"
          aria-label={`Slide 1 of ${slideCount}`}
        >
          <div className="overflow-hidden border-b border-line">
            <VideoShowcaseNativeVideo
              ariaLabel={launchVideo.ariaLabel}
              poster={launchVideo.poster}
              sources={launchVideo.sources}
              videoId={videoId}
              active={activeIndex === 0}
            />
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] tracking-[0.16em] text-accent/75">
                01
              </span>
              <h3 className="text-sm font-semibold tracking-tight text-text">
                Learn more about hora and its features.
              </h3>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted">
              Watch this short video to learn more about hora and its features.
            </p>
          </div>
        </article>

        {actionCards.map((card, index) => {
          const slideIndex = index + 1;

          return (
            <article
              key={card.title}
              className="shader-panel-soft ui-panel-soft w-[calc(100vw-3rem)] shrink-0 snap-center overflow-hidden rounded-xl"
              aria-label={`Slide ${slideIndex + 1} of ${slideCount}`}
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
                <LazyLoopingVideo
                  src={card.src}
                  label={card.label}
                  active={activeIndex === slideIndex}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-accent/75">
                    {String(slideIndex + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-sm font-semibold tracking-tight text-text">
                    {card.title}
                  </h3>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted">{card.body}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div
        className="mt-2 flex items-center justify-center gap-1.5"
        aria-hidden
      >
        {Array.from({ length: slideCount }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-1.5 rounded-full transition-[width,background-color] duration-200",
              index === activeIndex
                ? "w-5 bg-accent"
                : "w-1.5 bg-line-strong",
            )}
          />
        ))}
      </div>
    </div>
  );
}
