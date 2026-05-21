import Link from "next/link";
import { Icon, type IconName } from "@/components/atoms/Icon";
import { home } from "@/content/home";

type FeatureIconKey =
  | "app-window"
  | "calendar"
  | "bell"
  | "sync"
  | "command"
  | "shield"
  | "check"
  | "gauge";

const iconMap: Record<FeatureIconKey, IconName> = {
  "app-window": "app-window",
  calendar: "calendar",
  bell: "bell",
  sync: "sync",
  command: "command",
  shield: "shield",
  check: "check",
  gauge: "gauge",
};

export function FeaturesStory() {
  const f = home.features;

  return (
    <section
      id="features"
      className="relative overflow-hidden border-y border-white/8 bg-[#0b0c0f] py-20 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 720px 420px at 0% 0%, rgba(255,56,60,0.10), transparent 64%)," +
            "radial-gradient(ellipse 760px 480px at 100% 36%, rgba(131,199,255,0.10), transparent 64%)",
        }}
      />

      <div className="relative mx-auto max-w-[1180px] px-6">
        <div className="max-w-5xl">
          <h2
            data-anim="features-title"
            className="text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl"
          >
            {f.heading.prefix}
            <span className="text-accent"> {f.heading.suffixGradient}</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
          {f.items.map((item) => {
            const icon = iconMap[item.icon];
            return (
              <article
                key={item.title}
                data-anim="feature-card"
                className="group relative min-h-[14.5rem] overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] transition-colors duration-300 hover:border-accent/25 hover:bg-white/[0.055] md:p-7"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,56,60,0.22) 0%, transparent 70%)",
                  }}
                />

                <span
                  data-anim="feature-icon"
                  className="relative inline-flex h-11 w-11 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                >
                  <Icon name={icon} size={20} />
                </span>

                <h3 className="relative mt-8 text-lg font-semibold leading-tight tracking-tight text-text md:text-xl">
                  {item.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted md:text-[15px]">
                  {item.body}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-16 text-center md:mt-20">
          <Link
            href={f.allFeaturesLink.href}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 text-sm text-muted transition-colors hover:border-accent/40 hover:bg-white/[0.07] hover:text-text"
          >
            {f.allFeaturesLink.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
