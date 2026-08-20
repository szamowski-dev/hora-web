import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  MdCheck,
  MdDownloadForOffline,
  MdHelpOutline,
  MdLanguage,
  MdOutlinePerson,
  MdOutlineStarBorder,
} from "react-icons/md";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import { SetappBadge } from "@/components/atoms/SetappBadge";
import { Button } from "@/components/ui/button";
import { SitePageHero } from "@/components/templates/SitePageHero";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { ANALYTICS_EVENTS, ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";
import { defaultOg } from "@/lib/og";
import { getPricingPage } from "@/lib/pricing-repository";
import {
  DIRECT_DOWNLOAD_HREF,
} from "@/lib/direct/commerce-contract";

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
        className="pb-14 pt-28 sm:pb-16 sm:pt-36"
      />
      <main className="px-5 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-12">
        <section
          aria-label="Plans"
          className="mx-auto grid max-w-[960px] gap-5 md:grid-cols-2"
        >
          {content.plans.map((plan) => (
            <article
              key={`${plan.name}-${plan.price}`}
              className={`relative flex min-h-[30rem] flex-col rounded-[28px] border bg-panel/35 p-7 shadow-[0_24px_70px_-42px_var(--ui-shadow-neutral)] sm:p-9 ${
                plan.featured ? "border-success/65" : "border-line"
              }`}
            >
              {plan.featured && plan.featuredLabel ? (
                <span className="absolute right-5 top-0 -translate-y-1/2 rounded-md bg-success px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_10px_26px_-14px_var(--color-success)]">
                  {plan.featuredLabel}
                </span>
              ) : null}
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
                  {plan.name}
                </p>
                {plan.savingsLabel ? (
                  <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-success">
                    {plan.savingsLabel}
                  </span>
                ) : null}
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <p className="text-5xl font-semibold tracking-[-0.07em] text-text sm:text-6xl">
                  {plan.price}
                </p>
                {plan.suffix ? (
                  <span className="text-base font-medium tracking-normal text-muted sm:text-lg">
                    {plan.suffix}
                  </span>
                ) : null}
              </div>
              {plan.priceDetail ? (
                <p className="mt-2 text-lg font-semibold text-success">
                  {plan.priceDetail}
                </p>
              ) : null}
              <p className="mt-2 text-base leading-7 text-muted">
                {plan.billingLabel}
              </p>
              <div className="mt-8 border-t border-line" />
              <ul className="mt-7 space-y-4 text-base text-text">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <MdCheck className="size-5 shrink-0 text-success" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-xl"
                >
                  <a
                    href={
                      content.direct.showDownload
                        ? DIRECT_DOWNLOAD_HREF
                        : site.cta.primary.href
                    }
                    {...(content.direct.showDownload
                      ? analyticsAttrs(ANALYTICS_EVENTS.directDownloadClick, {
                          placement: ANALYTICS_PLACEMENTS.pricing,
                          destination: "direct_download",
                        })
                      : analyticsAttrs("app_store_cta_click", {
                          placement: ANALYTICS_PLACEMENTS.pricing,
                          destination: "mac_app_store",
                        }))}
                    {...(!content.direct.showDownload
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <MdDownloadForOffline data-icon="inline-start" aria-hidden />
                    {plan.ctaLabel}
                  </a>
                </Button>
                <p className="mt-3 text-center text-base leading-6 text-muted">
                  {plan.ctaHelper}
                </p>
              </div>
            </article>
          ))}
        </section>

        <div className="mx-auto mt-8 flex w-fit max-w-full items-center gap-3 rounded-full border border-line bg-panel/25 px-5 py-3 text-center text-sm text-text shadow-[0_14px_40px_-30px_var(--ui-shadow-neutral)] sm:px-6 sm:text-base">
          <MdOutlineStarBorder className="size-6 shrink-0 text-muted" aria-hidden />
          <span>{content.includedNote}</span>
        </div>

        <div className="mx-auto mt-8 flex max-w-[960px] flex-col gap-3 border-t border-line pt-6 text-sm leading-6 text-muted sm:mt-9 sm:pt-7">
          <p className="flex items-start gap-3">
            <MdOutlinePerson className="mt-0.5 size-5 shrink-0" aria-hidden />
            <span>{content.accountNote}</span>
          </p>
          <p className="flex items-start gap-3">
            <MdLanguage className="mt-0.5 size-5 shrink-0" aria-hidden />
            <span>{content.currencyNote}</span>
          </p>
          <p className="flex items-start gap-3">
            <MdHelpOutline className="mt-0.5 size-5 shrink-0" aria-hidden />
            <span>
              Direct purchase questions? Read our{" "}
              <Link
                href="/refunds/"
                className="font-medium text-text underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent"
              >
                Refunds & Cancellations Policy
              </Link>
              .
            </span>
          </p>
        </div>

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
