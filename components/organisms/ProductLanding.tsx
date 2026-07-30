import Image from "next/image";
import Link from "next/link";
import {
  MdArrowForward,
  MdDownload,
  MdLockOutline,
  MdPlayCircleOutline,
} from "react-icons/md";
import { LandingFeatureList } from "@/components/landing/LandingFeatureList";
import {
  GoogleCalendarVisual,
  HoraWorkflowVisual,
} from "@/components/landing/LandingVisuals";
import { NewsletterForm } from "@/components/molecules/NewsletterForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { HomePageContent } from "@/lib/home-model";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";

const videoUrl = "https://www.youtube.com/watch?v=ahVV5J25cYM";

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

export function ProductLanding({ content }: { content: HomePageContent }) {
  const landing = content.productLanding;
  const googleFeatures = [
    ...landing.googleCalendar.primaryFeatures,
    ...landing.googleCalendar.secondaryFeatures,
  ];

  return (
    <div
      data-nav-underlay="flush"
      className="relative isolate overflow-hidden bg-bg"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[52rem] bg-[radial-gradient(circle_at_50%_-20%,var(--ui-glow-cool-medium),transparent_48%)] opacity-60"
      />

      <section className="relative px-5 pb-24 pt-28 sm:px-8 sm:pb-32 sm:pt-40 md:pt-48">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-[-0.055em] text-text sm:text-7xl md:text-[5.5rem] md:leading-[0.98]">
            {landing.hero.title}
          </h1>
          <p className="mt-7 max-w-2xl text-balance text-lg leading-8 text-muted sm:text-xl">
            {landing.hero.description}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link
                href="/download/"
                {...analyticsAttrs("nav_click", {
                  link_text: landing.hero.primaryCtaLabel,
                  link_url: "/download/",
                })}
              >
                <MdDownload data-icon="inline-start" aria-hidden="true" />
                {landing.hero.primaryCtaLabel}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                {...analyticsAttrs("nav_click", {
                  link_text: landing.hero.watchVideoLabel,
                  link_url: videoUrl,
                })}
              >
                <MdPlayCircleOutline
                  data-icon="inline-start"
                  aria-hidden="true"
                />
                {landing.hero.watchVideoLabel}
              </a>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted">{landing.hero.requirement}</p>
        </div>

        <div className="relative mx-auto mt-20 max-w-7xl sm:mt-24">
          <div
            aria-hidden="true"
            className="absolute inset-x-[12%] bottom-0 top-[25%] bg-[radial-gradient(ellipse_at_center,var(--ui-glow-accent-soft),transparent_68%)] blur-3xl"
          />
          <div className="relative overflow-hidden rounded-[22px] border border-line bg-panel-deep p-1.5 shadow-[0_50px_140px_-64px_var(--ui-shadow-neutral)] sm:rounded-[30px] sm:p-2.5">
            <Image
              src={content.hero.screenshot.src}
              alt={content.hero.screenshot.alt}
              width={content.hero.screenshot.width}
              height={content.hero.screenshot.height}
              priority
              sizes="(max-width: 1280px) 94vw, 1216px"
              placeholder={
                content.hero.screenshot.blurDataURL ? "blur" : "empty"
              }
              blurDataURL={content.hero.screenshot.blurDataURL}
              className="h-auto w-full rounded-[16px] sm:rounded-[22px]"
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <Card className="mx-auto max-w-6xl items-center gap-7 px-5 py-12 text-center sm:px-10 sm:py-16">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white">
            <Image
              src="/assets/integrations/google-calendar.svg"
              alt=""
              width={42}
              height={42}
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

      <section
        id="features"
        className="scroll-mt-28 px-5 py-28 sm:px-8 sm:py-40"
      >
        <SectionHeading
          title={landing.googleCalendar.title}
          description={landing.googleCalendar.description}
        />
        <div className="mt-20 sm:mt-24">
          <GoogleCalendarVisual />
        </div>
        <div className="mx-auto mt-20 max-w-6xl sm:mt-28">
          <LandingFeatureList features={googleFeatures} />
        </div>
      </section>

      <Separator className="mx-auto max-w-24" />

      <section className="px-5 py-28 sm:px-8 sm:py-40">
        <SectionHeading
          title={landing.hora.title}
          description={landing.hora.description}
        />
        <div className="mt-20 sm:mt-24">
          <HoraWorkflowVisual />
        </div>
        <div className="mx-auto mt-20 max-w-6xl sm:mt-28">
          <LandingFeatureList features={landing.hora.features} />
        </div>
      </section>

      <section
        id="privacy"
        className="scroll-mt-28 px-5 py-20 sm:px-8 sm:py-32"
      >
        <Card className="mx-auto max-w-6xl overflow-hidden px-1 py-1">
          <div className="grid gap-16 rounded-[26px] bg-[radial-gradient(circle_at_18%_15%,var(--ui-glow-cool-soft),transparent_40%),var(--color-panel-deep)] px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-16 lg:py-20">
            <CardHeader className="content-start gap-5 px-0">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-label-green/12 text-label-green">
                <MdLockOutline aria-hidden="true" className="size-6" />
              </span>
              <CardTitle>
                <h2 className="max-w-xl text-4xl tracking-[-0.04em] sm:text-5xl">
                  {landing.privacy.title}
                </h2>
              </CardTitle>
              <CardDescription className="max-w-xl text-base sm:text-lg">
                {landing.privacy.description}
              </CardDescription>
              <Button asChild variant="link" className="w-fit px-0">
                <Link href="/privacy/">
                  Read our privacy policy
                  <MdArrowForward data-icon="inline-end" aria-hidden="true" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="px-0">
              <LandingFeatureList
                features={landing.privacy.features}
                compact
                className="grid-cols-1"
              />
            </CardContent>
          </div>
        </Card>
      </section>

      <section
        id="macos"
        className="scroll-mt-28 px-5 py-28 sm:px-8 sm:py-40"
      >
        <SectionHeading
          title={landing.macos.title}
          description={landing.macos.description}
        />
        <div className="mx-auto mt-20 max-w-6xl sm:mt-28">
          <LandingFeatureList
            features={landing.macos.features}
            className="lg:grid-cols-4"
          />
        </div>
      </section>

      <Separator className="mx-auto max-w-24" />

      <section className="px-5 py-28 sm:px-8 sm:py-40">
        <SectionHeading
          title={landing.featureGrid.title}
          description={landing.featureGrid.description}
        />
        <div className="mx-auto mt-20 max-w-6xl sm:mt-28">
          <LandingFeatureList
            features={landing.featureGrid.features}
            compact
          />
        </div>
      </section>

      <section className="px-5 pb-32 pt-20 sm:px-8 sm:pb-44 sm:pt-28">
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
