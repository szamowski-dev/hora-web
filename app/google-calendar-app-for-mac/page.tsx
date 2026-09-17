import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MdDownloadForOffline, MdOutlineSecurity } from "react-icons/md";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import { LandingFeatureList } from "@/components/landing/LandingFeatureList";
import { ThemedProductImage } from "@/components/molecules/ThemedProductImage";
import { BlogDownloadCta } from "@/components/organisms/BlogDownloadCta";
import { PricingPlans } from "@/components/organisms/PricingPlans";
import { ProductHeroShader } from "@/components/organisms/ProductHeroShader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { defaultProductLanding } from "@/content/home-landing";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { ANALYTICS_EVENTS, ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";
import { DIRECT_DOWNLOAD_HREF } from "@/lib/direct/commerce-contract";
import { getBlogCta } from "@/lib/blog-cta-repository";
import { breadcrumbList } from "@/lib/jsonld";
import { defaultOg } from "@/lib/og";
import { getPricingPage } from "@/lib/pricing-repository";
import { getGoogleCalendarMacPage } from "@/lib/site-page-repository";

export const revalidate = 600;

const PATH = "/google-calendar-app-for-mac/";
const CANONICAL = `https://horacal.app${PATH}`;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getGoogleCalendarMacPage();

  return {
    title: { absolute: seo.metaTitle },
    description: seo.metaDescription,
    alternates: { canonical: PATH },
    ...(seo.noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: defaultOg({
      title: seo.ogTitle ?? seo.metaTitle,
      description: seo.ogDescription ?? seo.metaDescription,
      url: CANONICAL,
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

/** Same heading scale and rhythm the homepage uses in ProductLanding. */
function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
      <h2 className="text-balance text-4xl font-semibold tracking-[-0.045em] text-text sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-balance text-base leading-7 text-muted sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function SectionDivider() {
  return (
    <Separator
      aria-hidden="true"
      className="mx-auto max-w-16 bg-text/15 sm:max-w-24"
    />
  );
}

function DownloadCta({
  label,
  placement,
  showDirectDownload,
  macAppStoreLabel,
}: {
  label: string;
  placement: string;
  showDirectDownload: boolean;
  macAppStoreLabel: string;
}) {
  const appStoreBadge = (
    <AppStoreLink
      href={site.cta.primary.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={macAppStoreLabel}
      className="app-store-interactive inline-flex h-12 items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      {...analyticsAttrs("app_store_cta_click", {
        placement,
        destination: "mac_app_store",
      })}
    >
      <Image
        src={site.macAppStoreBadgeSrc}
        alt={macAppStoreLabel}
        width={162}
        height={50}
        className="h-12 w-auto"
      />
    </AppStoreLink>
  );

  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
      {showDirectDownload ? (
        <>
          <Button asChild size="lg" variant="accent">
            <a
              href={DIRECT_DOWNLOAD_HREF}
              {...analyticsAttrs(ANALYTICS_EVENTS.directDownloadClick, {
                link_text: label,
                link_url: DIRECT_DOWNLOAD_HREF,
                placement,
                destination: "direct_download",
              })}
            >
              <MdDownloadForOffline
                data-icon="inline-start"
                aria-hidden="true"
              />
              {label}
            </a>
          </Button>
          {appStoreBadge}
        </>
      ) : (
        appStoreBadge
      )}
    </div>
  );
}

export default async function GoogleCalendarAppForMacPage() {
  const [content, pricing, blogCta] = await Promise.all([
    getGoogleCalendarMacPage(),
    getPricingPage(),
    getBlogCta(),
  ]);
  const showDirectDownload = pricing.direct.showDownload;
  const heroMedia = defaultProductLanding.media.hero;

  const softwareAppLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "hora Calendar",
    description: content.seo.metaDescription,
    url: CANONICAL,
    downloadUrl: "https://horacal.app/download/direct/",
    applicationCategory: "BusinessApplication",
    operatingSystem: "macOS",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "2.99",
      highPrice: "29.99",
      priceCurrency: "USD",
      offerCount: 2,
    },
    publisher: {
      "@type": "Organization",
      name: "NA SERIO Maciej Szamowski",
      url: "https://horacal.app",
    },
    image: "https://horacal.app/assets/brand/hora-icon.png",
    screenshot: heroMedia.light.src,
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const breadcrumbLd = breadcrumbList([
    { name: "hora Calendar", url: "https://horacal.app/" },
    { name: content.hero.title, url: CANONICAL },
  ]);

  return (
    <>
      <div
        data-nav-underlay="cover"
        className="relative isolate overflow-hidden bg-bg"
      >
        <section className="relative px-5 pb-24 pt-28 sm:px-10 sm:pb-32 sm:pt-40 md:pt-48">
          <ProductHeroShader />

          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
            <h1 className="w-full max-w-4xl text-balance text-5xl font-semibold tracking-[-0.055em] text-text sm:text-7xl md:text-[5.5rem] md:leading-[0.98]">
              {content.hero.title}
            </h1>
            <p className="mt-7 max-w-2xl whitespace-pre-line text-balance text-lg leading-8 text-muted sm:text-xl">
              {content.hero.description}
            </p>
            <div className="mt-9">
              <DownloadCta
                label={content.hero.primaryCtaLabel}
                placement={ANALYTICS_PLACEMENTS.hero}
                showDirectDownload={showDirectDownload}
                macAppStoreLabel={content.hero.macAppStoreLabel}
              />
            </div>
            <Link
              href="/pricing/"
              className="mt-4 inline-flex text-sm font-medium text-muted underline decoration-line underline-offset-4 transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {content.hero.trialNote}
            </Link>
            <p className="mt-3 text-xs text-muted">
              {content.hero.requirement}
            </p>
          </div>

          <div className="relative z-0 mx-auto mt-20 max-w-landing sm:mt-24">
            <div
              aria-hidden="true"
              className="absolute inset-x-[12%] bottom-0 top-[25%] bg-[radial-gradient(ellipse_at_center,var(--ui-glow-accent-soft),transparent_68%)] blur-3xl"
            />
            <div className="relative">
              <ThemedProductImage
                alt={heroMedia.light.alt}
                lightSrc={heroMedia.light.src}
                darkSrc={heroMedia.dark.src}
                width={heroMedia.light.width}
                height={heroMedia.light.height}
                sizes="(max-width: 1280px) 94vw, 1216px"
                preload
                fetchPriority="high"
                className="h-auto w-full"
              />
            </div>
          </div>
        </section>

        <SectionDivider />

        <section className="px-5 py-28 sm:px-10 sm:py-40">
          <SectionHeading title={content.answer.heading} />
          <div className="mx-auto mt-16 grid max-w-landing gap-5 sm:mt-20 md:grid-cols-2">
            {content.answer.items.map((item) => (
              <Card
                key={item.eyebrow}
                className="gap-4 px-7 py-9 sm:px-9 sm:py-10"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  {item.eyebrow}
                </span>
                <p className="text-base leading-8 text-text/90 sm:text-lg">
                  {item.body}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <SectionDivider />

        <section className="px-5 py-28 sm:px-10 sm:py-40">
          <SectionHeading
            title={content.features.title}
            description={content.features.description}
          />
          <div className="mx-auto mt-20 max-w-landing sm:mt-28">
            <LandingFeatureList features={content.features.items} prominent />
          </div>
        </section>

        <SectionDivider />

        <section className="px-5 py-20 sm:px-10 sm:py-32">
          <Card
            variant="privacy"
            className="mx-auto min-h-[19rem] max-w-landing items-center justify-center px-6 py-[4.6875rem] sm:px-12"
          >
            <CardHeader className="w-full max-w-3xl justify-items-center gap-4 px-0">
              <MdOutlineSecurity
                aria-hidden="true"
                className="size-14 text-label-blue"
              />
              <CardTitle>
                <h2 className="text-3xl tracking-[-0.035em]">
                  {content.trust.title}
                </h2>
              </CardTitle>
              <CardDescription className="max-w-3xl text-base sm:text-lg">
                {content.trust.description}
              </CardDescription>
            </CardHeader>
            <Link
              href="/trust/"
              className="inline-flex text-sm font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              {content.trust.linkLabel}
            </Link>
          </Card>
        </section>

        <SectionDivider />

        <section className="px-5 py-28 sm:px-10 sm:py-40">
          <SectionHeading
            title={content.pricing.title}
            description={content.pricing.description}
          />
          <PricingPlans
            plans={pricing.plans}
            showDirectDownload={showDirectDownload}
            className="mt-16 sm:mt-20"
          />
          <p className="mt-10 text-center">
            <Link
              href="/pricing/"
              className="inline-flex text-sm font-medium text-text underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {content.pricing.linkLabel}
            </Link>
          </p>
        </section>

        <SectionDivider />

        <section className="px-5 py-28 sm:px-10 sm:py-40">
          <SectionHeading title={content.faq.title} />
          <div className="mx-auto mt-16 max-w-[960px] overflow-hidden rounded-[28px] border border-line bg-panel/55 sm:mt-20">
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

        <SectionDivider />

        <section className="px-5 pb-32 pt-20 sm:px-10 sm:pb-44 sm:pt-28">
          <BlogDownloadCta
            variant="band"
            content={blogCta}
            showDirectDownload={showDirectDownload}
            placement={ANALYTICS_PLACEMENTS.download}
            className="mx-auto max-w-landing"
          />
          <p className="mt-10 text-center">
            <Link
              href={content.closing.guideHref}
              className="inline-flex text-sm font-medium text-muted underline decoration-line underline-offset-4 transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {content.closing.guideLabel}
            </Link>
          </p>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareAppLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
