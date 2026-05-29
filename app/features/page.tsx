import type { Metadata } from "next";
import Image from "next/image";
import { FeatureCard } from "@/components/molecules/FeatureCard";
import { features } from "@/content/features";
import { defaultOg } from "@/lib/og";

export const metadata: Metadata = {
  title: features.seo.title,
  description: features.seo.description,
  alternates: { canonical: "/features/" },
  openGraph: defaultOg({
    title: features.seo.ogTitle,
    description: features.seo.ogDescription,
    url: "https://horacal.app/features/",
  }),
};

export default function FeaturesPage() {
  return (
    <>
      <div className="mx-auto max-w-[1180px] px-6 pb-14 pt-16 md:pb-16 md:pt-24">
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-text md:text-6xl">
          {features.hero.title.prefix}{" "}
          <span className="text-accent">
            {features.hero.title.suffixGradient}
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
          {features.hero.subtitle}
        </p>
      </div>

      {features.sections.map((section) => (
        <section
          key={section.label}
          className="mx-auto max-w-[1180px] px-6 pb-16 md:pb-20"
        >
          <div className="mb-6 flex flex-col gap-3 border-t border-white/10 pt-7 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl font-semibold leading-tight text-text md:text-3xl">
              {section.label}
            </h2>
            <span
              className="h-px flex-1 bg-linear-to-r from-accent/55 to-transparent sm:mb-4"
              aria-hidden
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
            {"wideShortcutsCard" in section && section.wideShortcutsCard ? (
              <div className="rounded-xl border border-border bg-white/[0.02] p-6 md:col-span-2">
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                  <div className="flex-1">
                    <h3 className="mb-1.5 text-base font-semibold text-text">
                      {section.wideShortcutsCard.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted">
                      {section.wideShortcutsCard.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 rounded-lg bg-surface p-4 font-mono text-[13px] text-muted">
                    {section.wideShortcutsCard.shortcuts.map((s) => (
                      <div
                        key={s.label}
                        className="flex items-center gap-2 py-1.5"
                      >
                        <span className="flex gap-1">
                          {s.keys.map((k) => (
                            <kbd
                              key={k}
                              className="inline-flex min-w-[26px] items-center justify-center rounded-md border border-white/10 bg-white/[0.08] px-2 py-0.5 text-xs text-text"
                            >
                              {k}
                            </kbd>
                          ))}
                        </span>
                        <span>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
            {section.items.map((item) => (
              <FeatureCard
                key={item.title}
                title={item.title}
                description={item.description}
                badges={"badges" in item ? item.badges : undefined}
              />
            ))}
          </div>

          {"screenshot" in section && section.screenshot ? (
            <div className="relative mt-8 mb-2 pb-12 md:pb-14">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-[4%] bottom-2 h-28 rounded-full blur-[48px] md:bottom-3 md:h-36"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(255,56,60,0.42) 0%, rgba(255,56,60,0.22) 34%, rgba(255,56,60,0.08) 58%, transparent 76%)",
                }}
              />
              <div className="relative z-10">
                <Image
                  src={section.screenshot.src}
                  alt={section.screenshot.alt}
                  width={section.screenshot.width ?? 1600}
                  height={section.screenshot.height ?? 1000}
                  className="block h-auto w-full shadow-[0_36px_100px_-42px_rgba(0,0,0,0.9)]"
                />
              </div>
            </div>
          ) : null}
        </section>
      ))}
    </>
  );
}
