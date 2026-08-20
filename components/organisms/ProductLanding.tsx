import Image from "next/image";
import Link from "next/link";
import {
  MdDownloadForOffline,
  MdOutlineSecurity,
} from "react-icons/md";
import { LandingFeatureList } from "@/components/landing/LandingFeatureList";
import { HoraWorkflowVisual } from "@/components/landing/LandingVisuals";
import { LandingFeatureCards } from "@/components/landing/LandingFeatureCards";
import { HomebrewCommand } from "@/components/molecules/HomebrewCommand";
import { NewsletterForm } from "@/components/molecules/NewsletterForm";
import { ThemedProductImage } from "@/components/molecules/ThemedProductImage";
import { FeaturedOn } from "@/components/organisms/FeaturedOn";
import { ProductHeroShader } from "@/components/organisms/ProductHeroShader";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { HomePageContent } from "@/lib/home-model";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { ANALYTICS_EVENTS, ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";
import { site } from "@/content/site";
import { DIRECT_DOWNLOAD_HREF } from "@/lib/direct/commerce-contract";

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
      <h2 className="text-balance text-4xl font-semibold tracking-[-0.045em] text-text sm:text-5xl md:text-6xl">
        {title}
      </h2>
      <p className="max-w-2xl text-balance text-base leading-7 text-muted sm:text-lg">
        {description}
      </p>
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

export function ProductLanding({
  content,
  showDirectDownload = false,
}: {
  content: HomePageContent;
  showDirectDownload?: boolean;
}) {
  const landing = content.productLanding;
  const googleFeatureCandidates = [
    ...landing.googleCalendar.primaryFeatures,
    ...landing.googleCalendar.secondaryFeatures,
  ];
  const googleMainFeatures = googleFeatureCandidates.slice(0, 4);
  const googleFeatures = [
    ...googleFeatureCandidates.slice(4),
    ...landing.featureGrid.features,
  ];

  return (
    <div
      data-nav-underlay="cover"
      className="relative isolate overflow-hidden bg-bg"
    >
      <section className="relative px-5 pb-24 pt-28 sm:px-10 sm:pb-32 sm:pt-40 md:pt-48">
        <ProductHeroShader />

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
          <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-[-0.055em] text-text sm:text-7xl md:text-[5.5rem] md:leading-[0.98]">
            {landing.hero.title}
          </h1>
          <p className="mt-7 max-w-2xl whitespace-pre-line text-balance text-lg leading-8 text-muted sm:text-xl">
            {landing.hero.description}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {showDirectDownload ? (
              <Button asChild size="lg" variant="accent">
                <Link
                  href={DIRECT_DOWNLOAD_HREF}
                  {...analyticsAttrs(ANALYTICS_EVENTS.directDownloadClick, {
                    link_text: landing.hero.primaryCtaLabel,
                    link_url: DIRECT_DOWNLOAD_HREF,
                    placement: ANALYTICS_PLACEMENTS.hero,
                  })}
                >
                  <MdDownloadForOffline
                    data-icon="inline-start"
                    aria-hidden="true"
                  />
                  {landing.hero.primaryCtaLabel}
                </Link>
              </Button>
            ) : (
              <AppStoreLink
                href={site.cta.primary.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={landing.hero.macAppStoreLabel}
                className="app-store-interactive inline-flex h-12 items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                {...analyticsAttrs("app_store_cta_click", {
                  placement: ANALYTICS_PLACEMENTS.hero,
                  destination: "mac_app_store",
                })}
              >
                <Image
                  src={site.macAppStoreBadgeSrc}
                  alt={landing.hero.macAppStoreLabel}
                  width={162}
                  height={50}
                  className="h-12 w-auto"
                />
              </AppStoreLink>
            )}
          </div>
          <Link
            href="/pricing/"
            className="mt-4 inline-flex text-sm font-medium text-muted underline decoration-line underline-offset-4 transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {landing.hero.trialNote}
          </Link>
          {showDirectDownload && landing.hero.showTerminalPrompt ? (
            <>
              <HomebrewCommand
                command={landing.hero.homebrewCommand}
                copyLabel={landing.hero.copyLabel}
                copiedLabel={landing.hero.copiedLabel}
              />
            </>
          ) : null}
          {showDirectDownload ? (
            <p className="mt-3 text-xs text-muted">
              {landing.hero.requirement}
            </p>
          ) : null}
        </div>

        <div className="relative z-10 mx-auto mt-20 max-w-landing sm:mt-24">
          <div
            aria-hidden="true"
            className="absolute inset-x-[12%] bottom-0 top-[25%] bg-[radial-gradient(ellipse_at_center,var(--ui-glow-accent-soft),transparent_68%)] blur-3xl"
          />
          <div className="relative">
            <ThemedProductImage
              lightSrc={landing.media.hero.light.src}
              darkSrc={landing.media.hero.dark.src}
              alt={landing.media.hero.light.alt}
              width={landing.media.hero.light.width}
              height={landing.media.hero.light.height}
              preload
              fetchPriority="high"
              sizes="(max-width: 1280px) 94vw, 1216px"
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 py-16 sm:px-10 sm:py-24">
        <Card className="mx-auto max-w-landing items-center gap-7 px-5 py-12 text-center sm:px-10 sm:py-16">
          <div className="flex size-16 shrink-0 items-center justify-center">
            <Image
              src="/assets/integrations/google-calendar-material.svg"
              alt=""
              width={64}
              height={64}
              aria-hidden="true"
            />
          </div>
          <CardHeader className="w-full gap-2 px-0">
            <CardTitle>
              <h2 className="text-2xl sm:text-3xl">{landing.api.title}</h2>
            </CardTitle>
            <CardDescription className="mx-auto max-w-2xl text-base">
              {landing.api.description}
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <SectionDivider />

      <section
        id="features"
        className="scroll-mt-28 px-5 py-28 sm:px-10 sm:py-40"
      >
        <SectionHeading
          title={landing.googleCalendar.title}
          description={landing.googleCalendar.description}
        />
        <div className="mx-auto mt-20 max-w-landing sm:mt-24">
          <LandingFeatureCards
            features={googleMainFeatures}
            images={landing.media.googleCalendarCards.map((image) => ({
              lightSrc: image.light.src,
              darkSrc: image.dark.src,
              alt: image.light.alt,
              width: image.light.width,
              height: image.light.height,
            }))}
          />
        </div>
        <div className="mx-auto mt-20 max-w-landing sm:mt-28">
          <LandingFeatureList features={googleFeatures} prominent />
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 py-28 sm:px-10 sm:py-40">
        <SectionHeading
          title={landing.hora.title}
          description={landing.hora.description}
        />
        <div className="mt-20 sm:mt-24">
          <HoraWorkflowVisual image={landing.media.workflow} />
        </div>
        <div className="mx-auto mt-20 max-w-landing sm:mt-28">
          <LandingFeatureList features={landing.hora.features} prominent />
        </div>
      </section>

      <SectionDivider />

      <section
        id="privacy"
        className="scroll-mt-28 px-5 py-20 sm:px-10 sm:py-32"
      >
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
                {landing.privacy.title}
              </h2>
            </CardTitle>
            <CardDescription className="max-w-3xl text-base sm:text-lg">
              {landing.privacy.description}
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <SectionDivider />

      <section
        id="macos"
        className="scroll-mt-28 px-5 py-28 sm:px-10 sm:py-40"
      >
        <SectionHeading
          title={landing.macos.title}
          description={landing.macos.description}
        />
        <div className="mx-auto mt-20 max-w-landing sm:mt-28">
          <LandingFeatureList
            features={landing.macos.features}
            showDescriptions={false}
            titleOnly
          />
        </div>
      </section>

      <SectionDivider />

      <FeaturedOn content={content.featuredOn} />

      <SectionDivider />

      <section className="px-5 pb-32 pt-20 sm:px-10 sm:pb-44 sm:pt-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.045em] text-text sm:text-5xl">
              {landing.newsletter.title}
            </h2>
            <p className="max-w-2xl text-balance text-base leading-7 text-muted sm:text-lg">
              {landing.newsletter.description}
            </p>
          </div>
          <NewsletterForm
            placement={ANALYTICS_PLACEMENTS.betaCta}
            placeholder={landing.newsletter.placeholder}
            buttonLabel={landing.newsletter.buttonLabel}
            showButtonIcon={false}
          />
        </div>
      </section>
    </div>
  );
}
