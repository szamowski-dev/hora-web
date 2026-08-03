import type { Metadata } from "next";
import Image from "next/image";
import { MdCheck, MdDownloadForOffline } from "react-icons/md";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import { SetappBadge } from "@/components/atoms/SetappBadge";
import { HomebrewCommand } from "@/components/molecules/HomebrewCommand";
import { Button } from "@/components/ui/button";
import { SitePageHero } from "@/components/templates/SitePageHero";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { ANALYTICS_EVENTS, ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";
import { defaultOg } from "@/lib/og";
import { getPricingPage } from "@/lib/pricing-repository";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPricingPage();

  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: { canonical: "/pricing/" },
    openGraph: defaultOg({
      title: `hora Calendar ${content.seo.title}`,
      description: content.seo.description,
      url: "https://horacal.app/pricing/",
    }),
  };
}

export default async function PricingPage() {
  const content = await getPricingPage();
  const showTerminalPrompt =
    content.direct.showDownload && content.direct.showTerminalPrompt;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <SitePageHero
        align="center"
        title={content.hero.title}
        description={content.hero.description}
      />
      <main className="px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16">
        <section
          aria-label="Plans"
          className="mx-auto grid max-w-[960px] gap-4 md:grid-cols-2"
        >
          {content.plans.map((plan) => (
            <article
              key={`${plan.name}-${plan.price}`}
              className="flex min-h-[24rem] flex-col rounded-[28px] border border-line bg-panel/55 p-6 shadow-[0_24px_70px_-42px_var(--ui-shadow-neutral)] sm:p-7"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
                {plan.name}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-text sm:text-4xl">
                {plan.price}
                {plan.suffix ? (
                  <span className="ml-1.5 text-base font-medium tracking-normal text-muted sm:text-lg">
                    {plan.suffix}
                  </span>
                ) : null}
              </p>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">
                {plan.description}
              </p>
              <ul className="mt-7 space-y-2.5 text-sm text-text sm:mt-8 sm:text-base">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <MdCheck className="size-5 shrink-0 text-success" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {content.direct.showDownload ? (
                <Button
                  asChild
                  size="lg"
                  variant={plan.featured ? "accent" : "outline"}
                  className="mt-auto w-full"
                >
                  <a
                    href={site.cta.direct.href}
                    {...analyticsAttrs(ANALYTICS_EVENTS.downloadClick, {
                      placement: ANALYTICS_PLACEMENTS.pricing,
                      destination: "direct_download",
                      plan: plan.name.toLowerCase(),
                    })}
                  >
                    <MdDownloadForOffline data-icon="inline-start" aria-hidden />
                    {plan.ctaLabel}
                  </a>
                </Button>
              ) : null}
            </article>
          ))}
        </section>

        {showTerminalPrompt ? (
          <div className="mx-auto mt-5 flex max-w-[960px] flex-col items-center text-center">
            <HomebrewCommand
              command={content.direct.terminalCommand}
              copyLabel={content.direct.copyLabel}
              copiedLabel={content.direct.copiedLabel}
            />
            <p className="mt-3 text-xs text-muted">
              {content.direct.terminalRequirement}
            </p>
          </div>
        ) : null}

        {(content.distribution.showMacAppStore || content.distribution.showSetapp) ? (
          <section className="mx-auto mt-24 max-w-[960px] sm:mt-28">
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.055em] text-text sm:text-4xl">
              {content.distribution.title}
            </h2>
            <p className="mt-4 max-w-3xl text-balance text-base leading-7 text-muted">
              {content.distribution.description}
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {content.distribution.showMacAppStore ? (
                <article className="flex min-h-[18rem] flex-col rounded-[28px] border border-line bg-panel/55 p-6 sm:p-7">
                  <h3 className="text-xl font-semibold tracking-[-0.045em] text-text sm:text-2xl">
                    {content.distribution.macAppStoreTitle}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-7 text-muted">
                    {content.distribution.macAppStoreDescription}
                  </p>
                  <AppStoreLink
                    href={site.cta.primary.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={content.distribution.macAppStoreLabel}
                    className="app-store-interactive mt-auto inline-flex h-12 w-fit items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    {...analyticsAttrs("app_store_cta_click", {
                      placement: ANALYTICS_PLACEMENTS.pricing,
                      destination: "mac_app_store",
                    })}
                  >
                    <Image
                      src={content.distribution.macAppStoreBadge.src}
                      alt={content.distribution.macAppStoreBadge.alt}
                      width={content.distribution.macAppStoreBadge.width}
                      height={content.distribution.macAppStoreBadge.height}
                      className="h-12 w-auto"
                    />
                  </AppStoreLink>
                </article>
              ) : null}
              {content.distribution.showSetapp ? (
                <article className="flex min-h-[18rem] flex-col rounded-[28px] border border-line bg-panel/55 p-6 sm:p-7">
                  <h3 className="text-xl font-semibold tracking-[-0.045em] text-text sm:text-2xl">
                    {content.distribution.setappTitle}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-7 text-muted">
                    {content.distribution.setappDescription}
                  </p>
                  <div className="mt-auto">
                    <SetappBadge />
                  </div>
                </article>
              ) : null}
            </div>
          </section>
        ) : null}

        <section className="mx-auto mt-24 max-w-[960px] sm:mt-28">
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.055em] text-text sm:text-4xl">
            {content.faq.title}
          </h2>
          <div className="mt-7 overflow-hidden rounded-[28px] border border-line bg-panel/55">
            {content.faq.items.map((item) => (
              <details
                key={item.question}
                className="group border-b border-line last:border-b-0"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-left text-base font-semibold text-text transition-colors hover:bg-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent sm:px-7 sm:py-6 sm:text-lg [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-3xl font-light leading-none text-muted transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="border-t border-line px-6 pb-6 pt-5 text-base leading-7 text-muted sm:px-8 sm:pb-7">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <p className="mx-auto mt-14 max-w-2xl text-center text-sm leading-6 text-muted">
          {content.footer}
        </p>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
