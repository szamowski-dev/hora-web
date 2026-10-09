import type { Metadata } from "next";
import { Annotation, HandArrow, HandLabel } from "@/components/atoms/HandArrow";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Page not found — hora Calendar",
  description: "This page isn’t on the calendar. Head back to hora Calendar, the native macOS client for Google Calendar.",
  robots: { index: false, follow: true },
};

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
// February 2026 as the macOS mini month picker lays it out (Monday first, ISO
// week numbers). The Sunday after the 28th is where March 1 belongs; this page
// "booked" the day that doesn't exist instead.
const MISSING_DAY = 30;
type Cell = { day: number; other?: boolean; missing?: boolean };
const range = (from: number, to: number, other = false): Cell[] =>
  Array.from({ length: to - from + 1 }, (_, i) => ({ day: from + i, other }));
const WEEKS: { week: number; cells: Cell[] }[] = [
  { week: 5, cells: [...range(26, 31, true), { day: 1 }] },
  { week: 6, cells: range(2, 8) },
  { week: 7, cells: range(9, 15) },
  { week: 8, cells: range(16, 22) },
  { week: 9, cells: [...range(23, 28), { day: MISSING_DAY, missing: true }] },
  { week: 10, cells: range(2, 8, true) },
];

export default function NotFound() {
  return (
    <section className="relative bg-bg px-5 pb-20 pt-32 sm:px-10 sm:pb-28 sm:pt-44">
      <div className="relative mx-auto flex max-w-landing flex-col items-center text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-line bg-overlay px-3.5 py-1.5 text-sm font-medium text-muted">
          <span className="size-2 rounded-full bg-accent" />
          Error 404 · Event not found
        </p>

        <h1 className="mt-7 text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-text sm:text-7xl">
          This page isn’t on the calendar.
          <span className="block text-accent">Neither is February 30.</span>
        </h1>

        <p className="mt-7 max-w-2xl text-balance text-lg leading-8 text-muted sm:text-xl">
          The link you followed points to a day that was never scheduled, or to
          a page that has been moved. Pick a day that exists:
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href="/" size="lg">
            Back to Home
          </Button>
          <Button href="/google-calendar-app-for-mac/" variant="outline" size="lg">
            Google Calendar for Mac
          </Button>
          <Button href="/blog/" variant="outline" size="lg">
            Blog
          </Button>
        </div>

        <div className="mt-14 flex w-full max-w-[19rem] flex-col items-center gap-3">
          <div className="relative w-full">
            <Annotation className="left-full top-[68%] ml-3 hidden w-28 items-start gap-1 lg:flex lg:flex-col">
              <HandLabel>no such day</HandLabel>
              <HandArrow variant="swoop" className="w-24" />
            </Annotation>
            <MonthCard />
          </div>
          <p
            aria-hidden="true"
            className="flex items-center gap-2 rounded-md bg-accent/15 py-1 pl-2 pr-3 text-xs font-medium text-accent"
          >
            <span className="h-4 w-0.5 rounded-full bg-accent" />
            <span className="line-through">Page you were looking for</span>
            <span className="font-semibold uppercase tracking-[0.06em]">Cancelled</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/** Decorative: the surrounding heading and text carry the meaning. */
function MonthCard() {
  return (
    <div
      aria-hidden="true"
      className="rounded-[10px] border border-black/10 bg-white/80 px-4 pb-3 pt-3.5 text-text shadow-[0_18px_40px_-16px_oklch(0_0_0/0.28)] backdrop-blur-xl [html[data-theme=dark]_&]:border-white/10 [html[data-theme=dark]_&]:bg-[#2b2b2b]/90 [html[data-theme=dark]_&]:shadow-[0_18px_40px_-16px_oklch(0_0_0/0.7)]"
    >
      <div className="flex items-center justify-between px-1 text-muted">
        <span className="text-lg leading-none">‹</span>
        <p className="text-sm font-bold text-muted">February 2026</p>
        <span className="text-lg leading-none">›</span>
      </div>

      <div className="mt-3 grid grid-cols-8 gap-y-1 text-center text-sm tabular-nums">
        <span />
        {WEEKDAYS.map((day, i) => (
          <span key={i} className="pb-1 text-xs font-bold text-text">
            {day}
          </span>
        ))}
        {WEEKS.map(({ week, cells }) => (
          <Week key={week} week={week} cells={cells} />
        ))}
      </div>
    </div>
  );
}

function Week({ week, cells }: { week: number; cells: Cell[] }) {
  return (
    <>
      <span className="flex items-center justify-center text-[10px] text-muted/70">
        {week}
      </span>
      {cells.map(({ day, other, missing }, i) => (
        <span
          key={i}
          className={cn(
            "mx-auto flex size-7 items-center justify-center rounded-full font-bold",
            other && "font-semibold text-muted/50",
            missing && "bg-accent text-white",
          )}
        >
          {day}
        </span>
      ))}
    </>
  );
}
