import type { Metadata } from "next";
import Image from "next/image";
import { MdCheck, MdDownloadForOffline } from "react-icons/md";
import { SiSetapp } from "react-icons/si";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
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
      <main className="px-5 pb-28 pt-20 sm:px-10 sm:pb-40 sm:pt-28">
        <section
          aria-label="Plans"
          className="mx-auto grid max-w-[1360px] gap-8 md:grid-cols-2"
        >
          {content.plans.map((plan) => (
            <article
              key={`${plan.name}-${plan.price}`}
              className="flex min-h-[34rem] flex-col rounded-[40px] border border-line bg-panel/55 p-8 shadow-[0_24px_70px_-42px_var(--ui-shadow-neutral)] sm:p-12"
            >
              <p className="text-lg font-semibold uppercase tracking-[0.14em] text-muted">
                {plan.name}
              </p>
              <p className="mt-6 text-5xl font-semibold tracking-[-0.06em] text-text sm:text-7xl">
                {plan.price}
                {plan.suffix ? (
                  <span className="ml-2 text-2xl font-medium tracking-normal text-muted sm:text-3xl">
                    {plan.suffix}
                  </span>
                ) : null}
              </p>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted sm:text-xl">
                {plan.description}
              </p>
              <ul className="mt-10 space-y-4 text-lg text-text sm:mt-12">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-4">
                    <MdCheck className="size-6 shrink-0 text-success" aria-hidden />
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
          <div className="mx-auto mt-8 flex max-w-[1360px] flex-col items-center text-center">
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

        <section className="mx-auto mt-40 max-w-[1600px] sm:mt-56">
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.055em] text-text sm:text-6xl">
            {content.faq.title}
          </h2>
          <div className="mt-12 overflow-hidden rounded-[40px] border border-line bg-panel/55">
            {content.faq.items.map((item) => (
              <details
                key={item.question}
                className="group border-b border-line last:border-b-0"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-7 text-left text-xl font-semibold text-text transition-colors hover:bg-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent sm:px-11 sm:py-10 sm:text-2xl [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-4xl font-light leading-none text-muted transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="border-t border-line px-6 pb-7 pt-6 text-base leading-7 text-muted sm:px-11 sm:pb-10 sm:text-lg">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {(content.distribution.showMacAppStore || content.distribution.showSetapp) ? (
          <section className="mx-auto mt-40 max-w-[1600px] sm:mt-56">
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.055em] text-text sm:text-6xl">
              {content.distribution.title}
            </h2>
            <p className="mt-6 max-w-4xl text-balance text-xl leading-9 text-muted sm:text-2xl">
              {content.distribution.description}
            </p>
            <div className="mt-16 grid gap-8 md:grid-cols-2">
              {content.distribution.showMacAppStore ? (
                <article className="flex min-h-[25rem] flex-col rounded-[40px] border border-line bg-panel/55 p-8 sm:p-14">
                  <h3 className="text-3xl font-semibold tracking-[-0.045em] text-text sm:text-4xl">
                    {content.distribution.macAppStoreTitle}
                  </h3>
                  <p className="mt-7 max-w-xl text-xl leading-9 text-muted">
                    {content.distribution.macAppStoreDescription}
                  </p>
                  <AppStoreLink
                    href={site.cta.primary.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={content.distribution.macAppStoreLabel}
                    className="app-store-interactive mt-auto inline-flex h-14 w-fit items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    {...analyticsAttrs("app_store_cta_click", {
                      placement: ANALYTICS_PLACEMENTS.pricing,
                      destination: "mac_app_store",
                    })}
                  >
                    <Image
                      src={site.macAppStoreBadgeSrc}
                      alt={content.distribution.macAppStoreLabel}
                      width={194}
                      height={60}
                      className="h-14 w-auto"
                    />
                  </AppStoreLink>
                </article>
              ) : null}
              {content.distribution.showSetapp ? (
                <article className="flex min-h-[25rem] flex-col rounded-[40px] border border-line bg-panel/55 p-8 sm:p-14">
                  <h3 className="text-3xl font-semibold tracking-[-0.045em] text-text sm:text-4xl">
                    {content.distribution.setappTitle}
                  </h3>
                  <p className="mt-7 max-w-xl text-xl leading-9 text-muted">
                    {content.distribution.setappDescription}
                  </p>
                  <a
                    href={content.distribution.setappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex h-14 w-fit items-center gap-3 rounded-xl bg-black px-5 text-left text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    {...analyticsAttrs("nav_click", {
                      placement: ANALYTICS_PLACEMENTS.pricing,
                      link_text: content.distribution.setappLabel,
                      link_url: content.distribution.setappHref,
                    })}
                  >
                    <SiSetapp className="size-8 text-fuchsia-400" aria-hidden />
                    <span className="flex flex-col leading-none">
                      <span className="text-[10px] font-medium">Available on</span>
                      <span className="mt-1 text-xl font-semibold">Setapp</span>
                    </span>
                  </a>
                </article>
              ) : null}
            </div>
          </section>
        ) : null}

        <p className="mx-auto mt-20 max-w-2xl text-center text-sm leading-6 text-muted">
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
