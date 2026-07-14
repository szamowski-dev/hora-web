import Link from "next/link";
import Image from "next/image";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import { SectionBackdrop } from "@/components/atoms/SectionBackdrop";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";

export function PricingSection() {
  const pricing = home.pricing;

  return (
    <section
      id="pricing"
      className="home-section relative overflow-hidden border-y py-20 md:py-24"
    >
      <SectionBackdrop direction="right" />

      <div className="relative mx-auto max-w-295 px-6">
        <div className="shader-panel ui-panel rounded-xl p-6 md:p-8">
          <div className="grid gap-5 border-b border-line pb-7 md:grid-cols-[0.82fr_1.18fr] md:items-end md:gap-10">
            <h2
              data-anim="pricing-title"
              className="text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl"
            >
              {pricing.heading.prefix}{" "}
              <span className="text-accent">
                {pricing.heading.suffixGradient}
              </span>
            </h2>
            <div>
              <p
                data-anim="pricing-copy"
                className="max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8"
              >
                {pricing.body}
              </p>
              <p className="mt-1 text-base font-medium leading-7 text-text/90 md:text-lg md:leading-8">
                {pricing.familySharing}
              </p>
              <p className="mt-3 text-sm font-medium text-muted">
                {pricing.crossPlatform}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div
              data-anim="pricing-card"
              className="ui-panel-soft relative overflow-hidden rounded-lg border-accent/40 bg-accent/8 p-5 shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.12),0_18px_44px_-30px_oklch(0_0_0/0.82)] md:p-6"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-accent/80 to-transparent"
              />
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  One-time
                </p>
                <span className="inline-flex rounded-full border border-accent/35 bg-accent/12 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
                  Launch Offer
                </span>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-text">
                {pricing.oneTime}
              </p>
            </div>
            <div
              data-anim="pricing-card"
              className="ui-panel-soft rounded-lg p-5 md:p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Subscription
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-text">
                {pricing.yearly}
              </p>
            </div>
          </div>

          <details className="group ui-panel-deep mt-5 overflow-hidden rounded-lg">
            <summary className="flex min-h-13 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-semibold text-text transition-colors hover:bg-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent [&::-webkit-details-marker]:hidden">
              <span>
                Compare pricing alternatives
                <span className="ml-2 font-normal text-muted">
                  hora, Fantastical, and Notion Calendar
                </span>
              </span>
              <span
                aria-hidden
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line-strong bg-overlay text-lg font-light text-accent transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>

            <div className="border-t border-line p-4 md:p-5">
              <div className="mb-3 grid grid-cols-[1fr_auto] border-b border-line pb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                <p>Alternative</p>
                <p>Price</p>
              </div>
              {pricing.comparison.map((item) => {
                const isHora = item.name.toLowerCase().includes("hora");
                return (
                  <div
                    key={item.name}
                    data-anim={isHora ? "pricing-hora" : "pricing-row"}
                    className={`grid grid-cols-1 gap-x-3 gap-y-1 border-b py-3 last:border-b-0 sm:grid-cols-[1.2fr_auto] ${
                      isHora
                        ? "rounded-sm border-accent/30 bg-accent/8"
                        : "border-line"
                    }`}
                  >
                    <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-text">
                      <span>{item.name}</span>
                      {isHora ? (
                        <span className="inline-flex rounded-sm border border-accent/35 bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
                          Best for Mac
                        </span>
                      ) : null}
                    </p>
                    <p
                      className={`text-sm font-medium sm:text-right ${isHora ? "text-accent" : "text-text"}`}
                    >
                      {item.price}
                    </p>
                    <p
                      className={`text-xs sm:col-span-2 ${isHora ? "text-text/90" : "text-muted"}`}
                    >
                      {item.detail}
                    </p>
                  </div>
                );
              })}

              <Link
                href={pricing.comparisonCta.href}
                className="ui-interactive mt-4 inline-flex h-10 w-fit items-center rounded-md border border-line bg-overlay px-4 text-sm text-muted hover:text-text"
              >
                {pricing.comparisonCta.label}
              </Link>
            </div>
          </details>

          <div className="mt-5 flex flex-col gap-4 border-t border-line pt-5 md:flex-row md:items-center md:justify-end">

            <div className="flex flex-wrap items-center gap-3">
              <AppStoreLink
                href={pricing.appStoreHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={pricing.appStoreLabel}
                {...analyticsAttrs("app_store_cta_click", {
                  placement: ANALYTICS_PLACEMENTS.pricing,
                  destination: "mac_app_store",
                })}
                className="app-store-interactive inline-flex h-11 items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <Image
                  src={site.macAppStoreBadgeSrc}
                  alt={pricing.appStoreLabel}
                  width={162}
                  height={50}
                  className="h-11 w-auto"
                />
              </AppStoreLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
