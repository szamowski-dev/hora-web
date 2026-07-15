import type { Metadata } from "next";
import Image from "next/image";
import { FeatureCard } from "@/components/molecules/FeatureCard";
import { defaultOg } from "@/lib/og";
import { getFeaturesPage } from "@/lib/site-page-repository";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getFeaturesPage();
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: { canonical: "/features/" },
    ...(seo.noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: defaultOg({
      title: seo.ogTitle ?? seo.metaTitle,
      description: seo.ogDescription ?? seo.metaDescription,
      url: "https://horacal.app/features/",
      ...(seo.ogImage
        ? {
            images: [
              {
                url: seo.ogImage.src,
                width: seo.ogImage.width,
                height: seo.ogImage.height,
                alt: seo.ogImage.alt,
              },
            ],
          }
        : {}),
    }),
  };
}

export default async function FeaturesPage() {
  const features = await getFeaturesPage();

  return (
    <>
      <div className="mx-auto max-w-295 px-6 pb-14 pt-16 md:pb-16 md:pt-24">
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-text md:text-6xl">
          {features.hero.title.prefix}{" "}
          <span className="text-accent">
            {features.hero.title.accent}
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
          {features.hero.subtitle}
        </p>
      </div>

      {features.sections.map((section) => (
        <section
          key={section.label}
          className="mx-auto max-w-295 px-6 pb-16 md:pb-20"
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
              <div className="rounded-xl border border-border bg-white/2 p-6 md:col-span-2">
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
                              className="inline-flex min-w-[26px] items-center justify-center rounded-md border border-white/10 bg-white/8 px-2 py-0.5 text-xs text-text"
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
                    "radial-gradient(ellipse 60% 80% at 35% 50%, oklch(0.6532 0.2328 25.7 / 0.2), transparent 72%), radial-gradient(ellipse 58% 76% at 68% 48%, oklch(0.4269 0.1069 255.7 / 0.22), transparent 74%)",
                }}
              />
              <div className="relative z-10">
                <Image
                  src={section.screenshot.src}
                  alt={section.screenshot.alt}
                  width={section.screenshot.width}
                  height={section.screenshot.height}
                  placeholder={
                    section.screenshot.blurDataUrl ? "blur" : undefined
                  }
                  blurDataURL={section.screenshot.blurDataUrl}
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
