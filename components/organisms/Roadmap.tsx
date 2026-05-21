import { home } from "@/content/home";
import { cn } from "@/lib/cn";

type Status = "Open Beta Tests" | "Up next" | "Planned" | "On the horizon";

const statusStyles: Record<
  Status,
  { pill: string; dot: string; connector: string }
> = {
  "Open Beta Tests": {
    pill: "border-accent/50 bg-accent/10 text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_0_28px_rgba(255,56,60,0.35)]",
    dot: "bg-accent shadow-[0_0_14px_rgba(255,56,60,1)] ring-4 ring-accent/20",
    connector: "from-accent/70",
  },
  "Up next": {
    pill: "border-accent/25 bg-accent/5 text-accent/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
    dot: "bg-accent/70 shadow-[0_0_10px_rgba(255,56,60,0.55)] ring-4 ring-accent/10",
    connector: "from-accent/40",
  },
  Planned: {
    pill: "border-white/12 bg-white/5 text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
    dot: "bg-white/30 ring-4 ring-white/5",
    connector: "from-white/20",
  },
  "On the horizon": {
    pill: "border-white/10 bg-white/3 text-muted/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
    dot: "bg-white/15 ring-4 ring-white/3",
    connector: "from-white/10",
  },
};

export function Roadmap() {
  const r = home.roadmap;
  const items = r.items;

  return (
    <section
      id="roadmap"
      className="relative overflow-hidden border-y border-white/8 bg-[#0b0c0f] py-20 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 700px 400px at 80% 0%, rgba(255,56,60,0.10), transparent 64%)," +
            "radial-gradient(ellipse 780px 460px at 22% 88%, rgba(131,199,255,0.08), transparent 68%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 20%, black 82%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[1180px] px-6">
        <div className="max-w-5xl">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
            {r.heading.prefix}
            <span className="text-accent"> {r.heading.suffixGradient}</span>
          </h2>
        </div>

        <ol className="mt-12 space-y-4 md:mt-14 md:space-y-5">
          {items.map((item, i) => {
            const styles = statusStyles[item.status];
            const isLast = i === items.length - 1;
            return (
              <li key={item.title} data-anim="roadmap-item" className="relative flex gap-4 md:gap-5">
                <div className="relative flex shrink-0 flex-col items-center">
                  <span
                    className={cn(
                      "relative z-10 h-4 w-4 rounded-full",
                      styles.dot,
                    )}
                  />
                  {!isLast ? (
                    <span
                      aria-hidden
                      data-anim="roadmap-connector"
                      className={cn(
                        "mt-2 w-px flex-1 bg-linear-to-b to-transparent",
                        styles.connector,
                      )}
                    />
                  ) : null}
                </div>

                <div className="relative flex-1 overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] md:p-6">
                  {item.status === "Open Beta Tests" ? (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 opacity-90 blur-3xl"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255,56,60,0.24) 0%, transparent 70%)",
                      }}
                    />
                  ) : null}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent"
                  />

                  <span
                    className={cn(
                      "relative inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur-xl",
                      styles.pill,
                    )}
                  >
                    {item.status === "Open Beta Tests" ? (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                      </span>
                    ) : null}
                    {item.status}
                  </span>

                  <h3 className="relative mt-3 text-xl font-semibold tracking-tight text-text md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="relative mt-2 max-w-xl text-sm leading-relaxed text-muted md:text-base">
                    {item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
