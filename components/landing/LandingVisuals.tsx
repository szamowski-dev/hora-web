import {
  MdArrowDropDown,
  MdCheck,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdMoreHoriz,
  MdOutlineVideocam,
  MdPause,
  MdPlayArrow,
  MdSearch,
  MdTimer,
} from "react-icons/md";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function EventBlock({
  className,
  title,
  time,
}: {
  className: string;
  title: string;
  time: string;
}) {
  return (
    <div
      className={`absolute rounded-lg border px-2 py-1.5 shadow-sm ${className}`}
    >
      <p className="truncate text-[10px] font-semibold text-text sm:text-xs">
        {title}
      </p>
      <p className="mt-0.5 text-[9px] text-text/65 sm:text-[10px]">{time}</p>
    </div>
  );
}

export function GoogleCalendarVisual() {
  return (
    <div
      aria-label="hora week view showing a Google Calendar event editor"
      role="img"
      className="relative mx-auto min-h-[34rem] w-full max-w-6xl overflow-hidden rounded-[30px] border border-line bg-panel-deep shadow-[0_46px_120px_-62px_var(--ui-shadow-neutral)] sm:min-h-[39rem]"
    >
      <div className="flex h-14 items-center justify-between border-b border-line px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="size-3 rounded-full bg-label-red" />
          <span className="size-3 rounded-full bg-label-yellow" />
          <span className="size-3 rounded-full bg-label-green" />
        </div>
        <div className="hidden items-center gap-1 text-sm text-muted sm:flex">
          <MdChevronLeft aria-hidden="true" className="size-5" />
          <span className="px-3 font-medium text-text">July 27 - August 2</span>
          <MdChevronRight aria-hidden="true" className="size-5" />
        </div>
        <div className="flex items-center gap-3 text-muted">
          <MdSearch aria-hidden="true" className="size-5" />
          <MdMoreHoriz aria-hidden="true" className="size-5" />
        </div>
      </div>

      <div className="landing-calendar-grid absolute inset-x-0 bottom-0 top-14 opacity-80" />

      <div className="absolute inset-x-3 top-20 grid grid-cols-7 text-center text-[10px] text-muted sm:inset-x-8 sm:text-xs">
        {["MON 27", "TUE 28", "WED 29", "THU 30", "FRI 31", "SAT 1", "SUN 2"].map(
          (day) => (
            <span key={day}>{day}</span>
          ),
        )}
      </div>

      <EventBlock
        className="left-[15%] top-40 w-[22%] border-label-blue/35 bg-label-blue/17"
        title="Design sync"
        time="10:00 - 10:45"
      />
      <EventBlock
        className="left-[43%] top-28 w-[21%] border-label-purple/35 bg-label-purple/17"
        title="Product review"
        time="09:00 - 10:00"
      />
      <EventBlock
        className="left-[29%] top-[22rem] w-[20%] border-label-yellow/35 bg-label-yellow/15"
        title="Focus time"
        time="14:00 - 16:00"
      />
      <EventBlock
        className="left-[68%] top-48 w-[21%] border-label-green/35 bg-label-green/15"
        title="Customer call"
        time="11:30 - 12:15"
      />
      <EventBlock
        className="left-[7%] top-[27rem] w-[18%] border-label-red/35 bg-label-red/15"
        title="Project deadline"
        time="16:30"
      />

      <Card className="absolute left-1/2 top-24 w-[min(90%,25rem)] -translate-x-1/2 gap-5 rounded-[22px] bg-panel/94 py-5 sm:left-auto sm:right-[8%] sm:top-28 sm:translate-x-0">
        <CardHeader className="gap-3 px-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-xs text-label-red">
              <span className="size-2.5 rounded-full bg-label-red" />
              Product
              <MdArrowDropDown aria-hidden="true" className="size-4" />
            </span>
            <MdClose aria-hidden="true" className="size-5 text-muted" />
          </div>
          <CardTitle className="text-xl">Design system review</CardTitle>
          <CardDescription>Thursday, July 30 · 10:00 - 11:00</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-5">
          <div className="flex items-center gap-3 rounded-xl border border-line bg-overlay px-3 py-2.5">
            <MdOutlineVideocam
              aria-hidden="true"
              className="size-5 text-label-green"
            />
            <span className="min-w-0 flex-1 truncate text-sm text-text">
              Google Meet
            </span>
            <span className="text-xs font-medium text-label-blue">Join</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            {["MS", "AK", "JL"].map((initials, index) => (
              <span
                key={initials}
                className="-mr-1 inline-flex size-8 items-center justify-center rounded-full border border-panel bg-surface text-[10px] font-medium text-text"
                style={{ zIndex: 3 - index }}
              >
                {initials}
              </span>
            ))}
            <span className="ml-2">3 guests</span>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-4">
            <span className="text-xs text-muted">Event color</span>
            <div className="flex items-center gap-2">
              {[
                "bg-label-red",
                "bg-label-blue",
                "bg-label-green",
                "bg-label-yellow",
                "bg-label-purple",
              ].map((color, index) => (
                <span
                  key={color}
                  className={`inline-flex size-5 items-center justify-center rounded-full ${color}`}
                >
                  {index === 0 ? (
                    <MdCheck aria-hidden="true" className="size-3 text-bg" />
                  ) : null}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function HoraWorkflowVisual() {
  return (
    <div
      aria-label="hora menu bar, Pomodoro, and focus-time controls"
      role="img"
      className="relative mx-auto min-h-[31rem] w-full max-w-5xl overflow-hidden rounded-[30px] border border-line bg-[radial-gradient(circle_at_50%_10%,var(--ui-glow-cool-soft),transparent_36%),var(--color-panel-deep)] shadow-[0_46px_120px_-62px_var(--ui-shadow-neutral)] sm:min-h-[35rem]"
    >
      <div className="absolute inset-x-0 top-0 flex h-9 items-center justify-end gap-4 border-b border-line bg-overlay px-5 text-[11px] text-muted sm:px-8">
        <span>Thu Jul 30</span>
        <span>10:24</span>
        <span className="inline-flex items-center gap-1.5 text-text">
          <MdTimer aria-hidden="true" className="size-4 text-label-red" />
          24:18
        </span>
      </div>

      <Card className="absolute left-1/2 top-20 w-[min(90%,26rem)] -translate-x-1/2 gap-5 rounded-[24px] bg-panel/94 py-5">
        <CardHeader className="px-5 text-center">
          <div className="mx-auto mb-1 inline-flex size-12 items-center justify-center rounded-2xl bg-label-red/15 text-label-red">
            <MdTimer aria-hidden="true" className="size-6" />
          </div>
          <CardTitle className="text-2xl">Focus session</CardTitle>
          <CardDescription>Product strategy · until 11:00</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 px-5">
          <div className="text-center text-5xl font-medium tracking-[-0.06em] text-text sm:text-6xl">
            24:18
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-overlay-strong">
            <div className="h-full w-[58%] rounded-full bg-label-red" />
          </div>
          <div className="flex justify-center gap-3">
            <span className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong bg-overlay text-text">
              <MdPause aria-hidden="true" className="size-5" />
            </span>
            <span className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line-strong bg-overlay px-5 text-sm font-medium text-text">
              <MdPlayArrow aria-hidden="true" className="size-5" />
              Join next meeting
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="absolute inset-x-4 bottom-5 grid grid-cols-3 gap-2 sm:inset-x-10 sm:bottom-8 sm:gap-4">
        {[
          ["Next event", "11:00 · Weekly sync", "text-label-blue"],
          ["Todoist", "3 tasks today", "text-label-red"],
          ["Availability", "Share open times", "text-label-green"],
        ].map(([label, value, color]) => (
          <div
            key={label}
            className="landing-glass min-w-0 rounded-2xl px-3 py-3 sm:px-4 sm:py-4"
          >
            <p className={`text-[10px] font-medium sm:text-xs ${color}`}>
              {label}
            </p>
            <p className="mt-1 truncate text-[10px] text-text sm:text-sm">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
