import type { Metadata } from "next";
import Image from "next/image";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import Link from "next/link";
import { Icon, type IconName } from "@/components/atoms/Icon";
import { SectionBackdrop } from "@/components/atoms/SectionBackdrop";
import { AnimatedCount } from "@/components/molecules/AnimatedCount";
import { NewsletterForm } from "@/components/molecules/NewsletterForm";
import { WaitlistImpression } from "@/components/molecules/WaitlistImpression";
import { HeroShader } from "@/components/organisms/HeroShader";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";
import { cn } from "@/lib/cn";
import { getTestFlightTesterCount } from "@/lib/testflight";

export const dynamic = "force-dynamic";

const title = "Download hora Calendar for Mac";
const description =
  "hora Calendar is on the Mac App Store: the native macOS Google Calendar client with real-time sync, menu bar access, Quick Add, Focus Time, availability sharing, and zero middleware. iOS/iPad coming next.";

export const metadata: Metadata = {
  title: "Download hora Calendar",
  description,
  alternates: { canonical: "/download/" },
  openGraph: {
    type: "website",
    url: "https://horacal.app/download/",
    siteName: "hora Calendar",
    title,
    description,
    images: [
      {
        url: "/assets/social/testflight-share.png",
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@moto_szama",
    creator: "@moto_szama",
    title,
    description,
    images: ["/assets/social/testflight-share.png"],
  },
};

const coreReasons: {
  icon: IconName;
  iconSrc?: string;
  iconSrcs?: readonly string[];
  iconClassName?: string;
  title: string;
  body: string;
}[] = [
  {
    icon: "sync",
    iconSrc: "/assets/integrations/google-calendar.svg",
    title: "Google API sync",
    body: "Real-time calendar updates without CalDAV drift. Event colors, blocking events, cross-calendar moves, and multiple Google accounts work natively.",
  },
  {
    icon: "meet",
    iconSrcs: [
      "/assets/integrations/zoom.svg",
      "/assets/integrations/microsoft-teams.svg",
    ],
    title: "Zoom and Teams built in",
    body: "Create meeting links while editing events and join calls from hora in one click.",
  },
  {
    icon: "shield",
    iconSrc: "/assets/support/keychain-access.webp",
    iconClassName: "h-[31px] w-[31px]",
    title: "Private by design",
    body: "Tokens stay in macOS Keychain. No telemetry pipeline, no middleware, no server sitting between your Mac and Google.",
  },
];

const workflowFeatures: {
  icon: IconName;
  title: string;
  body: string;
}[] = [
  {
    icon: "calendar",
    title: "Menu bar and Agenda widgets",
    body: "Check today and tomorrow, see what is next, and jump into meetings without opening a browser.",
  },
  {
    icon: "edit",
    title: "Multilingual Quick Add",
    body: "Natural language parsing for EN, PL, ES, PT, DE, FR and more, with Apple Intelligence help where available.",
  },
  {
    icon: "gauge",
    title: "Focus Time Scheduler",
    body: "Select a day or week and let hora place deep-work blocks around your real calendar.",
  },
  {
    icon: "mail",
    title: "Share Availability",
    body: "One shortcut creates a clean message you can paste into email or chat.",
  },
  {
    icon: "bell",
    title: "Meeting alerts for packed days",
    body: "Get warned when meetings are ending or when one running long can make you late.",
  },
  {
    icon: "users",
    title: "Contacts-aware scheduling",
    body: "macOS Contacts plus Google Other Contacts power one-touch guest suggestions.",
  },
];

const detailChips = [
  "Instant Search",
  "Day, 3/5/7-day week, and month views",
  "Pomodoro Timer",
  "Invitation accept, decline, and ignore",
  "Delete and decline without email notifications",
  "Time zones, week starts, and time formats",
  "Apple Maps travel time",
  "Tokyo Night, Catppuccin, Gruvbox, Osaka Jade, and more...",
  "Nerd Font support",
  "Apple Intelligence TL;DR for long event notes",
];

export default async function DownloadPage() {
  const newsletter = home.hero.newsletter;
  const socialProof = newsletter.socialProof;
  const liveCount = await getTestFlightTesterCount(socialProof.count);

  return (
    <main className="relative overflow-hidden">
      <section className="relative -mt-[70px] min-h-180 overflow-hidden border-b border-white/8 pt-[70px] md:mt-0 md:min-h-195 md:pt-0">
        <HeroBackground />

        <div className="relative z-10 mx-auto grid min-h-180 w-full max-w-7xl items-center gap-10 px-6 pb-16 pt-12 md:min-h-195 md:grid-cols-[0.72fr_1.28fr] md:gap-8 md:pb-14 md:pt-28 lg:gap-10">
          <div className="max-w-140">
            <h1 className="max-w-[12ch] text-5xl font-semibold leading-[1.02] tracking-tight text-text md:text-[68px] lg:text-[78px]">
              The Mac calendar{" "}
              <span className="text-accent">Google never built.</span>
            </h1>

            <p className="mt-5 max-w-md text-pretty text-lg leading-8 text-muted md:text-[19px]">
              Download hora Calendar from the Mac App Store: native SwiftUI,
              real-time Google Calendar sync, menu bar workflows, and privacy
              that stays on your Mac.
            </p>

            <div className="mt-7 flex flex-row items-stretch gap-2 sm:items-center sm:gap-3">
              <AppStoreLink
                href={site.cta.primary.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={site.cta.primary.label}
                {...analyticsAttrs("app_store_cta_click", {
                  placement: ANALYTICS_PLACEMENTS.download,
                  destination: "mac_app_store",
                })}
                className="app-store-interactive inline-flex h-12 min-w-0 cursor-pointer items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
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
                href={site.community.discord.href}
                target="_blank"
                rel="noopener noreferrer"
                {...analyticsAttrs("discord_click", {
                  placement: ANALYTICS_PLACEMENTS.download,
                })}
                className="discord-cta-button inline-flex h-12 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-discord-hover/45 px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-discord-hover focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:px-5 sm:text-sm"
              >
                <Icon name="discord" size={18} />
                Join Discord
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
                src={home.hero.demo.posterSrc}
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

      <section
        id="download-reasons"
        className="home-section relative overflow-hidden border-b py-20 md:py-24"
      >
        <SectionBackdrop direction="left" />
        <div className="relative mx-auto max-w-295 px-6">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-16">
            <div className="max-w-xl lg:sticky lg:top-28">
              <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
                Native on your Mac.{" "}
                <span className="text-accent">Connected where it counts.</span>
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-muted md:text-lg md:leading-8">
                Real-time Google Calendar sync, built-in meeting tools, and
                privacy that stays on your Mac.
              </p>
            </div>

            <div className="shader-panel ui-panel-deep overflow-hidden rounded-xl">
              {coreReasons.map((item) => (
                <ReasonRow key={item.title} {...item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="download-workflows"
        className="home-section relative overflow-hidden border-b py-20 md:py-24"
      >
        <SectionBackdrop direction="right" />
        <div className="relative mx-auto max-w-295 px-6">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Built for calendar-heavy work
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
              Less admin. More actual work.
            </h2>
          </div>

          <div className="ui-panel-deep mt-10 grid overflow-hidden rounded-xl md:mt-12 md:grid-cols-2">
            {workflowFeatures.map((item) => (
              <WorkflowItem key={item.title} {...item} />
            ))}
          </div>

          <div className="mt-10 grid gap-x-10 gap-y-3 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {detailChips.map((chip) => (
              <div key={chip} className="flex items-start gap-2.5 text-sm leading-6 text-muted">
                <Icon name="check" size={15} className="mt-1 shrink-0 text-accent" />
                <span>{chip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="newsletter"
        className="home-section relative overflow-hidden py-20 md:py-24"
      >
        <SectionBackdrop direction="left" grid={false} />
        <WaitlistImpression placement={ANALYTICS_PLACEMENTS.download} />
        <div className="relative mx-auto max-w-295 px-6">
          <div className="shader-panel ui-panel grid overflow-hidden rounded-xl md:grid-cols-2">
            <div className="border-b border-line p-6 sm:p-8 md:border-r md:border-b-0 lg:p-10">
              <h2 className="max-w-[13ch] text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
                Download for Mac, then{" "}
                <span className="text-accent">stay close.</span>
              </h2>
              <p className="mt-4 max-w-lg text-base leading-7 text-muted">
                The Mac App Store gets you the app. Discord gets you the feedback
                loop. Newsletter gets you launch notes and the iOS/iPadOS beta
                heads-up.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <AppStoreLink
                  href={site.cta.primary.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={site.cta.primary.label}
                  {...analyticsAttrs("app_store_cta_click", {
                    placement: ANALYTICS_PLACEMENTS.download,
                    destination: "mac_app_store",
                  })}
                  className="app-store-interactive inline-flex h-12 cursor-pointer items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  <Image
                    src={site.macAppStoreBadgeSrc}
                    alt={site.cta.primary.label}
                    width={162}
                    height={50}
                    className="h-12 w-auto"
                  />
                </AppStoreLink>
                <Link
                  href="/"
                  className="ui-interactive inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-md border border-line-strong bg-overlay px-5 text-sm font-semibold text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  See full site
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 opacity-90"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse 72% 92% at 10% 110%, var(--ui-glow-accent-medium) 0%, transparent 68%), radial-gradient(ellipse 68% 82% at 90% 112%, var(--ui-glow-cool-medium) 0%, transparent 72%), linear-gradient(160deg, transparent 24%, var(--ui-glow-accent-faint) 72%, var(--ui-glow-cool-faint) 100%)",
                }}
              />

              <div className="relative z-10">
                <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight text-text md:text-4xl">
                  {home.betaCta.heading}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-muted md:text-base md:leading-7">
                  {home.betaCta.subtitle}
                </p>

                <div className="mt-7">
                  <NewsletterForm
                    placement={ANALYTICS_PLACEMENTS.download}
                    className="max-w-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <HeroShader />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_78%_78%_at_4%_42%,oklch(0.105_0.008_261.8/0.82)_0%,oklch(0.12_0.008_261.8/0.58)_44%,transparent_76%)] md:bg-[radial-gradient(ellipse_58%_84%_at_8%_44%,oklch(0.105_0.008_261.8/0.86)_0%,oklch(0.12_0.008_261.8/0.6)_46%,transparent_78%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.1392_0.0097_261.8/0.78)_0%,oklch(0.1392_0.0097_261.8/0.36)_43%,oklch(0.1392_0.0097_261.8/0.08)_72%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.1392_0.0097_261.8/0.12)_0%,oklch(0.1392_0.0097_261.8/0.18)_62%,var(--color-bg)_100%)]" />
    </div>
  );
}

function ReasonRow({
  icon,
  iconSrc,
  iconSrcs,
  iconClassName,
  title,
  body,
}: {
  icon: IconName;
  iconSrc?: string;
  iconSrcs?: readonly string[];
  iconClassName?: string;
  title: string;
  body: string;
}) {
  return (
    <article className="grid gap-5 border-b border-line p-6 last:border-b-0 sm:grid-cols-[auto_1fr] sm:items-start sm:p-7 lg:p-8">
      <div
        className={cn(
          "flex min-h-11 items-center gap-2",
          iconSrcs && "flex-col",
        )}
      >
        {iconSrcs ? (
          iconSrcs.map((src) => (
            <span
              key={src}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-accent/25 bg-accent/10 shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.12)]"
            >
              <Image
                src={src}
                alt=""
                width={22}
                height={22}
                className="h-5.5 w-5.5 object-contain"
              />
            </span>
          ))
        ) : (
          <span
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-md border shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.12)]",
              "border-accent/25 bg-accent/10 text-accent",
            )}
          >
            {iconSrc ? (
              <Image
                src={iconSrc}
                alt=""
                width={36}
                height={36}
                className={cn("object-contain", iconClassName ?? "h-5.5 w-5.5")}
              />
            ) : (
              <Icon name={icon} size={18} />
            )}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-xl font-semibold leading-tight tracking-tight text-text">
          {title}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted md:text-base md:leading-7">
          {body}
        </p>
      </div>
    </article>
  );
}

function WorkflowItem({
  icon,
  title,
  body,
}: {
  icon: IconName;
  title: string;
  body: string;
}) {
  return (
    <article className="grid gap-4 border-b border-line p-5 sm:grid-cols-[auto_1fr] sm:p-6 md:odd:border-r md:[&:nth-last-child(-n+2)]:border-b-0">
      <span className="flex h-10 w-10 items-center justify-center rounded-md border border-accent/25 bg-accent/10 text-accent shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.12)]">
        <Icon name={icon} size={17} />
      </span>
      <div>
        <h3 className="text-base font-semibold leading-tight tracking-tight text-text md:text-lg">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
      </div>
    </article>
  );
}
