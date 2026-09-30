import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  MdHelpOutline,
  MdLanguage,
  MdOutlinePerson,
  MdDownloadForOffline,
} from "react-icons/md";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import { SetappBadge } from "@/components/atoms/SetappBadge";
import { PricingPlans } from "@/components/organisms/PricingPlans";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { ANALYTICS_EVENTS, ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";
import { DIRECT_DOWNLOAD_HREF } from "@/lib/direct/commerce-contract";
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
  const visiblePlanCount = content.plans.filter(
    (plan) => !plan.directOnly || content.direct.showDownload,
  ).length;
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
      <section className="px-5 pb-10 pt-32 text-center sm:px-8 sm:pb-12 sm:pt-48">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Pricing
        </p>
        <h1 className="mx-auto mt-4 max-w-5xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.055em] text-text sm:text-6xl">
          {content.hero.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl whitespace-pre-line text-balance text-lg leading-7 text-muted sm:text-xl">
          {content.hero.description}
        </p>
      </section>
      <main className="px-5 pb-20 sm:px-8 sm:pb-28">
        <div className={`mx-auto ${visiblePlanCount > 2 ? "max-w-landing" : "max-w-[960px]"}`}>
          <PricingPlans
            plans={content.plans}
            showDirectDownload={content.direct.showDownload}
          />

          <div className="mt-5 flex flex-col items-start justify-between gap-5 rounded-[28px] border border-line bg-panel/25 px-7 py-6 shadow-[0_14px_40px_-30px_var(--ui-shadow-neutral)] sm:flex-row sm:items-center">
            <div>
              <p className="text-lg font-semibold text-text">{content.includedNote}</p>
              <p className="mt-1 text-sm text-muted">
                Choose your plan in the app after the 7-day free trial.
              </p>
            </div>
            <Button asChild size="lg" className="w-full rounded-xl sm:w-auto">
              <a
                href={content.direct.showDownload ? DIRECT_DOWNLOAD_HREF : site.cta.primary.href}
                {...analyticsAttrs(content.direct.showDownload ? ANALYTICS_EVENTS.directDownloadClick : "app_store_cta_click", {
                  placement: ANALYTICS_PLACEMENTS.pricing,
                  destination: content.direct.showDownload ? "direct_download" : "mac_app_store",
                })}
                {...(!content.direct.showDownload ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <MdDownloadForOffline data-icon="inline-start" aria-hidden />
                {content.direct.showDownload ? content.direct.downloadLabel : "Download on the Mac App Store"}
              </a>
            </Button>
          </div>
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
