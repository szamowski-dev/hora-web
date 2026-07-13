import Image from "next/image";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import { AnimatedCount } from "@/components/molecules/AnimatedCount";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { HeroShader } from "./HeroShader";

export function HeroScene({ liveCount }: { liveCount: number }) {
  const hero = home.hero;
  const newsletter = hero.newsletter;
  const socialProof = newsletter.socialProof;

  return (
    <section
      data-nav-underlay="flush"
      className="relative -mt-[70px] flex min-h-180 w-full flex-col overflow-hidden border-b border-white/8 pt-[70px] md:mt-0 md:pt-0 lg:min-h-195"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <HeroShader />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_78%_78%_at_4%_42%,oklch(0.105_0.008_261.8/0.82)_0%,oklch(0.12_0.008_261.8/0.58)_44%,transparent_76%)] md:bg-[radial-gradient(ellipse_58%_84%_at_8%_44%,oklch(0.105_0.008_261.8/0.86)_0%,oklch(0.12_0.008_261.8/0.6)_46%,transparent_78%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.1392_0.0097_261.8/0.78)_0%,oklch(0.1392_0.0097_261.8/0.36)_43%,oklch(0.1392_0.0097_261.8/0.08)_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.1392_0.0097_261.8/0.12)_0%,oklch(0.1392_0.0097_261.8/0.18)_62%,var(--color-bg)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-8 px-6 pb-14 pt-10 md:grid-cols-[0.72fr_1.28fr] md:gap-8 md:pb-12 md:pt-28 lg:gap-10">
        <div className="max-w-140 text-left">
          <h1 className="max-w-[12ch] text-5xl font-semibold leading-[1.02] tracking-tight text-text md:text-[68px] lg:text-[78px]">
            The Mac Calendar{" "}
            <span className="text-accent">Google never built.</span>
          </h1>

          <p className="mt-5 max-w-md text-pretty text-lg leading-8 text-muted md:text-[19px]">
            Fast, Native, Beautiful. Built for keyboard-driven workflows.
            Finally, Google Calendar feels at home on your Mac.
          </p>

          <div className="mt-7 flex flex-row items-stretch gap-2 sm:items-center sm:gap-3">
            <AppStoreLink
              href={site.cta.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={site.cta.primary.label}
              {...analyticsAttrs("app_store_cta_click", {
                placement: "hero",
                destination: "mac_app_store",
              })}
              className="app-store-interactive inline-flex h-12 min-w-0 items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Image
                src={site.macAppStoreBadgeSrc}
                alt={site.cta.primary.label}
                width={162}
                height={50}
                className="h-12 w-full object-contain"
              />
            </AppStoreLink>
            <a
              href="#watch-demo"
              data-scroll-align="center"
              className="ui-interactive inline-flex h-12 min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-line-strong bg-overlay px-2 text-[11px] font-semibold text-text shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.12)] backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent min-[360px]:px-3 min-[360px]:text-xs sm:gap-2 sm:px-5 sm:text-sm"
            >
              Watch 1:43 Demo
              <span aria-hidden>▸</span>
            </a>
          </div>

          <div className="mt-6 flex flex-col items-start gap-3 xl:flex-row xl:items-center xl:gap-6">
            <div className="flex shrink-0 -space-x-2">
              {socialProof.avatars.slice(0, 5).map((avatar) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={avatar.src}
                  src={avatar.src}
                  alt={avatar.alt}
                  width={34}
                  height={34}
                  className="h-8.5 w-8.5 rounded-full border-2 border-bg object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
            <p className="max-w-100 text-sm leading-snug text-muted sm:max-w-108">
              <span className="font-semibold text-text">
                <AnimatedCount value={liveCount} />+ Mac users
              </span>{" "}
              already use hora.
            </p>
          </div>
        </div>

        <div className="relative -mr-6 w-[calc(100%+6rem)] md:-mt-14 md:mr-0 md:w-auto md:max-[1440px]:-mr-48 md:max-[1440px]:-mt-24 md:max-[1440px]:w-[calc(100%+12rem)] lg:-mt-18 xl:max-[1440px]:-mr-24 xl:max-[1440px]:w-[calc(100%+6rem)] xl:max-[1440px]:translate-x-16">
          <div className="relative overflow-visible rounded-none shadow-[0_0_72px_16px_oklch(0_0_0/0.78)] md:overflow-hidden md:rounded-[12px]">
            <Image
              src={hero.demo.posterSrc}
              alt="hora Calendar macOS app interface"
              width={3188}
              height={1903}
              priority
              quality={90}
              sizes="(min-width: 1280px) 820px, (min-width: 1024px) 68vw, 100vw"
              className="w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
