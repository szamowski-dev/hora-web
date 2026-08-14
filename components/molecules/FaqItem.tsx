"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";

export function FaqItem({
  question,
  answer,
  className,
  index,
  variant = "card",
  density = "default",
}: {
  question: string;
  answer: ReactNode;
  className?: string;
  index?: number;
  variant?: "card" | "integrated" | "pricing";
  density?: "default" | "compact";
}) {
  const isIntegrated = variant === "integrated";
  const isPricing = variant === "pricing";
  const isCompact = density === "compact";

  return (
    <details
      onToggle={(event) => {
        if (event.currentTarget.open) {
          track("faq_expand", { question: question.slice(0, 60) });
        }
      }}
      className={cn(
        "group relative h-full overflow-hidden",
        isPricing
          ? "border-b border-line last:border-b-0"
          : isIntegrated
          ? "bg-transparent open:bg-overlay-strong hover:bg-overlay"
          : "rounded-md border border-line bg-overlay shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.1),0_16px_40px_-28px_oklch(0_0_0/0.55)] backdrop-blur-xl open:border-accent/35 open:bg-overlay-strong open:shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.16),0_22px_46px_-24px_oklch(0_0_0/0.86)] hover:border-line-strong hover:bg-overlay-strong",
        className,
      )}
    >
      {isIntegrated ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-px bg-linear-to-b from-accent/20 via-accent to-accent-glow/20 opacity-0 transition-opacity group-open:opacity-100"
        />
      ) : null}
      {!isIntegrated ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-5 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent"
        />
      ) : null}
      <summary
        className={cn(
          "flex w-full cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-medium text-text touch-manipulation select-none [&::-webkit-details-marker]:hidden",
          isPricing
            ? "px-6 py-5 text-base font-semibold sm:px-7 sm:py-6 sm:text-lg"
            : isIntegrated
            ? isCompact
              ? "px-5 py-4 sm:px-6 sm:py-5"
              : "px-5 py-5 md:px-6 md:py-6"
            : "px-4 py-3.5 md:px-5 md:py-4",
        )}
      >
        <span
          className={cn(
            "flex min-w-0 flex-1 items-start",
            isCompact ? "gap-3.5 sm:gap-5" : "gap-4",
          )}
        >
          {isIntegrated && index !== undefined ? (
            <span
              aria-hidden
              className={cn(
                "mt-0.5 font-mono tracking-[0.16em] text-dim",
                isCompact ? "text-[11px]" : "text-[10px]",
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : null}
          <span
            className={cn(
              "text-balance",
              isCompact && "text-base leading-6 sm:text-lg",
            )}
        >
          {question}
        </span>
        </span>
        {isPricing ? (
          <span
            aria-hidden
            className="shrink-0 text-3xl font-light leading-none text-muted transition-transform group-open:rotate-45"
          >
            +
          </span>
        ) : (
          <span
          aria-hidden
          className={cn(
            "relative flex shrink-0 items-center justify-center border transition-all duration-300",
            isCompact
              ? "h-8 w-8 text-muted group-hover:text-accent"
              : "h-7 w-7 text-accent",
            isIntegrated
              ? "rounded-full shadow-none"
              : "rounded-md shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.15)]",
            "border-line bg-overlay group-open:rotate-45 group-open:border-accent/60 group-open:bg-accent/15 group-open:shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.2),0_10px_24px_-16px_oklch(0_0_0/0.9)]",
          )}
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          </span>
        )}
      </summary>
      <div
        className={cn(
          "text-sm leading-relaxed text-muted md:text-base",
          isPricing
            ? "border-t border-line px-6 pb-6 pt-5 sm:px-8 sm:pb-7"
            : isIntegrated
            ? isCompact
              ? "px-5 pb-5 pl-[3.625rem] sm:px-6 sm:pb-6 sm:pl-[4.5rem]"
              : "px-5 pb-6 pl-[3.75rem] md:px-6 md:pb-7 md:pl-[4.25rem]"
            : "border-t border-line px-5 pb-5 pt-4 md:px-6 md:pb-6",
        )}
      >
        {answer}
      </div>
    </details>
  );
}
