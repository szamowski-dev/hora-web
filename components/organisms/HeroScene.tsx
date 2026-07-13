import Image from "next/image";
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
    <section className="relative flex min-h-180 w-full flex-col overflow-hidden border-b border-white/8 lg:min-h-195">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <HeroShader />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,12,0.78)_0%,rgba(8,9,12,0.36)_43%,rgba(8,9,12,0.08)_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,12,0.12)_0%,rgba(8,9,12,0.18)_62%,#0a0a0a_100%)]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-8 px-6 pb-14 pt-10 md:grid-cols-[0.72fr_1.28fr] md:gap-8 md:pb-12 md:pt-12 lg:gap-10">
        <div className="max-w-140 text-left">
          <div className="inline-flex items-center rounded-md border border-accent/35 bg-accent/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            Now on the Mac App Store
          </div>

          <h1 className="mt-6 max-w-[12ch] text-5xl font-semibold leading-[1.02] tracking-tight text-text md:text-[68px] lg:text-[78px]">
            The Mac Calendar{" "}
            <span className="text-accent">Google never built.</span>
          </h1>

          <p className="mt-5 max-w-md text-pretty text-lg leading-8 text-muted md:text-[19px]">
            Fast, Native, Beautiful. Built for keyboard-driven workflows.
            Finally, Google Calendar feels at home on your Mac.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={site.cta.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={site.cta.primary.label}
              {...analyticsAttrs("app_store_cta_click", {
                placement: "hero",
                destination: "mac_app_store",
              })}
              className="inline-flex h-12 items-center rounded-xl transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Image
                src={site.macAppStoreBadgeSrc}
                alt={site.cta.primary.label}
                width={162}
                height={50}
                className="h-12 w-auto"
              />
            </a>
            <a
              href="#watch-demo"
              data-scroll-align="center"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/12 bg-white/5.5 px-5 text-sm font-semibold text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl transition-colors hover:border-white/24 hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
              already use hora.{" "}
              <span>Now on the Mac App Store.</span>
            </p>
          </div>
        </div>

        <div className="relative md:-mt-14 lg:-mt-18">
          <div
            aria-hidden
            className="absolute -inset-5 rounded-4xl bg-[radial-gradient(ellipse_at_58%_42%,rgba(255,56,60,0.20),rgba(34,79,136,0.12)_38%,transparent_68%)] blur-3xl"
          />
          <div
            aria-hidden
            className="absolute inset-x-[7%] -bottom-8 h-24 rounded-full bg-[radial-gradient(ellipse,rgba(255,56,60,0.28)_0%,rgba(34,79,136,0.20)_38%,transparent_74%)] blur-[34px]"
          />
          <div
            aria-hidden
            className="absolute inset-x-[14%] -bottom-10 h-16 rounded-full bg-black/90 blur-[38px]"
          />
          <div className="relative overflow-hidden rounded-[18px] shadow-[0_48px_120px_-42px_rgba(0,0,0,0.98),0_34px_90px_-58px_rgba(255,56,60,0.75),0_22px_80px_-60px_rgba(34,79,136,0.9)]">
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
