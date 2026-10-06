import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Hand-drawn marker arrows modelled on the curved red arrows in the App Store
 * v2 boards and the ads deck (arrow-curve.png / arrow-loop.png). Purely
 * decorative: always aria-hidden and never part of the heading outline.
 */
const arrows = {
  /** Starts top-left, swings right, lands pointing down (bottom-right). */
  curve: {
    viewBox: "0 0 200 120",
    body: "M8 14 C 70 4, 150 12, 172 52 C 184 74, 182 96, 176 112",
    head: "M188.2 103.3 L176 112 L172.5 97.4",
  },
  /** Short sweep from the right that ends pointing left. */
  swoop: {
    viewBox: "0 0 160 70",
    body: "M152 14 C 128 46, 76 58, 14 44",
    head: "M24.3 54.9 L14 44 L28 38.6",
  },
  /** Runs right with a small loop, then drops pointing down. */
  loop: {
    viewBox: "0 0 220 150",
    body: "M10 30 C 60 22, 110 14, 140 22 C 162 28, 164 54, 146 60 C 128 66, 118 44, 136 32 C 168 12, 200 48, 204 84 C 206 106, 202 124, 198 140",
    head: "M209.2 130 L198 140 L192.9 125.9",
  },
} as const;

export type HandArrowVariant = keyof typeof arrows;

export function HandArrow({
  variant = "curve",
  flip = false,
  className,
}: {
  variant?: HandArrowVariant;
  /** Mirror horizontally. */
  flip?: boolean;
  className?: string;
}) {
  const arrow = arrows[variant];
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={arrow.viewBox}
      fill="none"
      className={cn(
        "block h-auto shrink-0 overflow-visible text-accent",
        flip && "-scale-x-100",
        className,
      )}
    >
      {[arrow.body, arrow.head].map((d) => (
        <path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/** Lowercase handwritten label (Kalam) in the accent red. */
export function HandLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "block whitespace-nowrap font-hand text-[1.3rem] font-bold leading-[1.15] text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Absolutely positioned, decorative annotation wrapper. Position it with
 * `className` relative to the nearest positioned ancestor; hide it on small
 * screens there (e.g. `hidden lg:flex`) so it never overlaps content.
 */
export function Annotation({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute select-none", className)}
    >
      {children}
    </div>
  );
}
