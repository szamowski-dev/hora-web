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
import { ProductVideoDialog } from "@/components/molecules/ProductVideoDialog";
import { FeaturedOn } from "@/components/organisms/FeaturedOn";
import { ProductHeroShader } from "@/components/organisms/ProductHeroShader";
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
import { ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";

const GOOGLE_FEATURE_IMAGES = [
  {
    src: "/assets/product/event-color-labels.png",
    alt: "hora calendar showing Google Calendar event color labels",
    width: 667,
    height: 256,
  },
  {
    src: "/assets/product/event-types.png",
    alt: "hora focus-time event settings",
    width: 296,
    height: 256,
  },
  {
    src: "/assets/product/meet-and-contacts.png",
    alt: "hora event details with Google Meet and Google Contacts guests",
    width: 296,
    height: 256,
  },
  {
    src: "/assets/product/accounts-multiple-swiftui.png",
    alt: "hora Google Accounts settings with multiple connected accounts",
    width: 1334,
    height: 512,
  },
];

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

export function ProductLanding({ content }: { content: HomePageContent }) {
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
      data-nav-underlay="flush"
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
            <Button asChild size="lg" variant="accent">
              <Link
                href="/download/"
                {...analyticsAttrs("nav_click", {
                  link_text: landing.hero.primaryCtaLabel,
                  link_url: "/download/",
                })}
              >
                <MdDownloadForOffline
                  data-icon="inline-start"
                  aria-hidden="true"
                />
                {landing.hero.primaryCtaLabel}
              </Link>
            </Button>
            <ProductVideoDialog label={landing.hero.watchVideoLabel} />
          </div>
          <HomebrewCommand command={landing.hero.homebrewCommand} />
          <p className="mt-3 text-xs text-muted">{landing.hero.requirement}</p>
        </div>

        <div className="relative z-10 mx-auto mt-20 max-w-landing sm:mt-24">
          <div
            aria-hidden="true"
            className="absolute inset-x-[12%] bottom-0 top-[25%] bg-[radial-gradient(ellipse_at_center,var(--ui-glow-accent-soft),transparent_68%)] blur-3xl"
          />
          <div className="relative">
            <Image
              src="/assets/product/hero.png"
              alt="hora Calendar week view with event details, Google Meet, and focus timer"
              width={3090}
              height={2052}
              priority
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
            images={GOOGLE_FEATURE_IMAGES}
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
          <HoraWorkflowVisual />
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
