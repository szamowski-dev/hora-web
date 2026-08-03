import type { Metadata } from "next";
import Image from "next/image";
import { MdCheck, MdDownloadForOffline } from "react-icons/md";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import { FaqItem } from "@/components/molecules/FaqItem";
import { HomebrewCommand } from "@/components/molecules/HomebrewCommand";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <main className="px-5 pb-28 pt-12 sm:px-10 sm:pb-40">
        <section
          aria-label="Plans"
          className="mx-auto max-w-3xl rounded-[28px] border border-line bg-panel/55 p-6 shadow-[0_24px_70px_-42px_var(--ui-shadow-neutral)] sm:p-10"
        >
          <div className="grid gap-4 sm:grid-cols-2">
          {content.plans.map((plan) => (
            <Card
              key={`${plan.name}-${plan.price}`}
              className={
                plan.featured
                  ? "border-accent/35 bg-accent/[0.055]"
                  : "bg-overlay"
              }
            >
              <CardHeader>
                <CardDescription className="font-semibold uppercase tracking-[0.14em]">
                  {plan.name}
                </CardDescription>
                <CardTitle className="mt-3 text-5xl tracking-[-0.055em]">
                  {plan.price}
                  <span className="ml-1 text-lg font-medium tracking-normal text-muted">
                    {plan.suffix}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm leading-6 text-muted">{plan.description}</p>
                <ul className="mt-7 space-y-3 text-sm text-text">
                  {content.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <MdCheck className="mt-0.5 size-5 text-success" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              {content.direct.showDownload ? (
                <CardFooter>
                  <Button
                    asChild
                    size="lg"
                    variant={plan.featured ? "accent" : "outline"}
                    className="w-full"
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
                      {content.direct.downloadLabel}
                    </a>
                  </Button>
                </CardFooter>
              ) : null}
            </Card>
          ))}
          </div>

          {showTerminalPrompt ? (
            <div className="mt-6 flex flex-col items-center text-center">
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
            <div className="mt-10 border-t border-line pt-10 text-center">
            <h2 className="text-2xl font-semibold tracking-[-0.035em] text-text sm:text-3xl">
              {content.distribution.title}
            </h2>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {content.distribution.showMacAppStore ? (
                <AppStoreLink
                  href={site.cta.primary.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={content.distribution.macAppStoreLabel}
                  className="app-store-interactive inline-flex h-11 items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  {...analyticsAttrs("app_store_cta_click", {
                    placement: ANALYTICS_PLACEMENTS.pricing,
                    destination: "mac_app_store",
                  })}
                >
                  <Image
                    src={site.macAppStoreBadgeSrc}
                    alt={content.distribution.macAppStoreLabel}
                    width={162}
                    height={50}
                    className="h-11 w-auto"
                  />
                </AppStoreLink>
              ) : null}
              {content.distribution.showSetapp ? (
                <Button asChild size="lg" variant="outline">
                  <a
                    href={content.distribution.setappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...analyticsAttrs("nav_click", {
                      placement: ANALYTICS_PLACEMENTS.pricing,
                      link_text: content.distribution.setappLabel,
                      link_url: content.distribution.setappHref,
                    })}
                  >
                    {content.distribution.setappLabel}
                  </a>
                </Button>
              ) : null}
            </div>
            </div>
          ) : null}
        </section>

        <section className="mx-auto mt-20 max-w-3xl border-t border-line pt-16 sm:mt-28">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.05em] text-text sm:text-5xl">
              {content.faq.title}
            </h2>
            <p className="mt-5 text-balance text-base leading-7 text-muted sm:text-lg">
              {content.faq.description}
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl space-y-3">
            {content.faq.items.map((item, index) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
                index={index}
              />
            ))}
          </div>
        </section>

        <p className="mx-auto mt-12 max-w-2xl text-center text-sm leading-6 text-muted">
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
