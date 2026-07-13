import { home } from "@/content/home";
import { SectionBackdrop } from "@/components/atoms/SectionBackdrop";
import { cn } from "@/lib/cn";

type Status =
  "Shipped" | "Open Beta Tests" | "Up next" | "Planned" | "On the horizon";

const statusStyles: Record<
  Status,
  { pill: string; dot: string; connector: string }
> = {
  Shipped: {
    pill: "border-success/50 bg-success/10 text-success shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.18),0_0_24px_oklch(0.7556_0.2082_147/0.28)]",
    dot: "bg-success shadow-[0_0_12px_oklch(0.7556_0.2082_147/0.85)] ring-4 ring-success/15",
    connector: "from-success/60",
  },
  "Open Beta Tests": {
    pill: "border-accent/50 bg-accent/10 text-accent shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.18),0_0_28px_oklch(0.6532_0.2328_25.7/0.35)]",
    dot: "bg-accent shadow-[0_0_14px_oklch(0.6532_0.2328_25.7)] ring-4 ring-accent/20",
    connector: "from-accent/70",
  },
  "Up next": {
    pill: "border-accent/25 bg-accent/5 text-accent/90 shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.12)]",
    dot: "bg-accent/70 shadow-[0_0_10px_oklch(0.6532_0.2328_25.7/0.55)] ring-4 ring-accent/10",
    connector: "from-accent/40",
  },
  Planned: {
    pill: "border-line-strong bg-overlay text-muted shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.08)]",
    dot: "bg-dim ring-4 ring-overlay",
    connector: "from-line-strong",
  },
  "On the horizon": {
    pill: "border-line bg-overlay text-muted/80 shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.06)]",
    dot: "bg-line-strong ring-4 ring-overlay",
    connector: "from-line",
  },
};

export function Roadmap() {
  const r = home.roadmap;
  const items = r.items;

  return (
    <section
      id="roadmap"
      className="home-section relative overflow-hidden border-y py-20 md:py-24"
    >
      <SectionBackdrop direction="right" />

      <div className="relative mx-auto max-w-295 px-6">
        <div className="max-w-5xl">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
            {r.heading.prefix}
            <span className="text-accent"> {r.heading.suffixGradient}</span>
          </h2>
        </div>

        <div className="relative mt-12">
          <span
            aria-hidden
            className="absolute top-2 right-[16.666%] left-[16.666%] hidden h-px bg-linear-to-r from-success/50 via-accent/40 to-line md:block"
          />
          <ol className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
            {items.map((item, i) => {
              const styles = statusStyles[item.status];
              const isLast = i === items.length - 1;
              return (
                <li
                  key={item.title}
                  data-anim="roadmap-item"
                  className="relative flex gap-4 md:flex-col md:gap-4"
                >
                  <div className="relative flex shrink-0 flex-col items-center md:h-4 md:w-full md:flex-row md:justify-center">
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
                          "mt-2 w-px flex-1 bg-linear-to-b to-transparent md:hidden",
                          styles.connector,
                        )}
                      />
                    ) : null}
                  </div>

                  <div className="shader-panel-soft ui-panel-soft relative flex-1 overflow-hidden rounded-lg p-5 md:h-full md:p-6">
                    {item.status === "Up next" ? (
                      <div
                        aria-hidden
                        className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 opacity-90 blur-3xl"
                        style={{
                          background:
                            "radial-gradient(circle, var(--ui-glow-accent-medium) 0%, var(--ui-glow-cool-faint) 38%, transparent 70%)",
                        }}
                      />
                    ) : null}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-line-strong to-transparent"
                    />

                    <span
                      className={cn(
                        "relative inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur-xl",
                        styles.pill,
                      )}
                    >
                      {item.status === "Up next" ? (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                        </span>
                      ) : null}
                      {item.status === "Shipped" ? (
                        <span aria-hidden className="text-[11px] leading-none">
                          ✓
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
      </div>
    </section>
  );
}
