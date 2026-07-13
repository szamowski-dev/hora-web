import type { Metadata } from "next";
import Image from "next/image";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import Link from "next/link";
import { Icon, type IconName } from "@/components/atoms/Icon";
import { SectionBackdrop } from "@/components/atoms/SectionBackdrop";
import { AnimatedCount } from "@/components/molecules/AnimatedCount";
import { WaitlistCard } from "@/components/molecules/WaitlistCard";
import { HeroShader } from "@/components/organisms/HeroShader";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
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

const heroStats = [
  { value: "0", label: "telemetry" },
  { value: "Swift 6", label: "native macOS app" },
  { value: "1 click", label: "to join meetings" },
];

const heroTechPills: {
  icon: IconName;
  label: string;
}[] = [
  { icon: "apple", label: "Native SwiftUI" },
  { icon: "javascript", label: "No Electron" },
  { icon: "chrome", label: "No WebView" },
  { icon: "sync", label: "Push sync" },
];

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
    iconSrc: "/assets/redesign_raw/google-calendar.svg",
    title: "Google API sync",
    body: "Real-time calendar updates without CalDAV drift. Event colors, blocking events, cross-calendar moves, and multiple Google accounts work natively.",
  },
  {
    icon: "meet",
    iconSrcs: [
      "/assets/redesign_raw/zoom.svg",
      "/assets/redesign_raw/microsoft-teams-2018.svg",
    ],
    title: "Zoom and Teams built in",
    body: "Create meeting links while editing events and join calls from hora in one click.",
  },
  {
    icon: "shield",
    iconSrc: "/assets/keychain-access-2021-05-03.png.webp",
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
      <HeroBackground />

      <section className="relative border-b border-line">
        <div className="mx-auto grid min-h-[calc(100svh-64px)] w-full max-w-295 items-center gap-10 px-6 py-14 md:grid-cols-[0.88fr_1.12fr] md:py-20 lg:gap-12">
          <div className="max-w-156">
            <p className="inline-flex items-center gap-2 rounded-md border border-accent/35 bg-accent/10 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.12)]">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_oklch(0.6456_0.2492_25.7/0.9)]" />
              Now on the Mac App Store
            </p>

            <h1 className="mt-6 max-w-[13ch] text-5xl font-semibold leading-[1.02] tracking-tight text-text md:text-[68px] lg:text-[78px]">
              The Mac calendar{" "}
              <span className="text-accent">Google never built.</span>
            </h1>

            <p className="mt-5 max-w-xl text-pretty text-lg leading-8 text-muted md:text-[19px]">
              Download hora Calendar from the Mac App Store: native SwiftUI,
              real-time Google Calendar sync, menu bar workflows, and privacy
              that stays on your Mac.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <AppStoreLink
                href={site.cta.primary.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={site.cta.primary.label}
                {...analyticsAttrs("app_store_cta_click", {
                  placement: "testflight_hero",
                  destination: "mac_app_store",
                })}
                className="app-store-interactive inline-flex h-14 cursor-pointer items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <Image
                  src={site.macAppStoreBadgeSrc}
                  alt={site.cta.primary.label}
                  width={162}
                  height={50}
                  className="h-14 w-auto"
                />
              </AppStoreLink>
              <a
                href={site.community.discord.href}
                target="_blank"
                rel="noopener noreferrer"
                {...analyticsAttrs("discord_click", {
                  location: "testflight_hero",
                })}
                className="discord-cta-button inline-flex h-14 cursor-pointer items-center justify-center gap-2 rounded-md border border-discord-hover/45 px-6 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-discord-hover focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <Icon name="discord" size={18} />
                Join Discord
              </a>
            </div>

            <div className="mt-7 flex flex-col items-start gap-3 xl:flex-row xl:items-center xl:gap-6">
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
              <p className="max-w-md text-sm leading-snug text-muted">
                <span className="font-semibold text-text">
                  <AnimatedCount value={liveCount} />+ Mac users
                </span>{" "}
                already use hora Calendar.<br />Now a one-tap install from the Mac App Store.
              </p>
            </div>

            <div className="mt-8 grid gap-2.5 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="ui-panel-soft rounded-md p-3"
                >
                  <p className="text-lg font-semibold tabular-nums text-text">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-8 rounded-4xl bg-[radial-gradient(ellipse_at_50%_45%,oklch(0.6456_0.2492_25.7/0.25),transparent_64%)] blur-3xl"
            />
            <div className="shader-panel ui-panel relative overflow-hidden rounded-xl shadow-[0_40px_110px_-48px_oklch(0_0_0/0.94),-18px_20px_84px_-72px_oklch(0.6532_0.2328_25.7/0.42),20px_-16px_84px_-72px_oklch(0.4269_0.1069_255.7/0.48)]">
              <Image
                src={home.hero.demo.posterSrc}
                alt="hora Calendar macOS app interface"
                width={3188}
                height={1903}
                priority
                quality={88}
                sizes="(min-width: 1280px) 720px, (min-width: 768px) 56vw, 100vw"
                className="w-full object-contain"
              />
            </div>

            <div className="relative z-10 mt-4 grid grid-cols-2 gap-2 text-xs text-muted sm:grid-cols-4">
              {heroTechPills.map((item) => (
                <div
                  key={item.label}
                  className="ui-interactive ui-panel-soft group flex h-10 items-center justify-center gap-2 rounded-md px-2.5 text-[11px] font-medium leading-none backdrop-blur-xl hover:text-text"
                >
                  <Icon
                    name={item.icon}
                    size={14}
                    className="text-accent/85 transition-colors duration-200 group-hover:text-accent"
                  />
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section relative overflow-hidden border-b py-16 md:py-20">
        <SectionBackdrop direction="left" grid={false} />
        <div className="relative mx-auto max-w-295 px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {coreReasons.map((item) => (
              <FeaturePanel key={item.title} {...item} emphasized />
            ))}
          </div>
        </div>
      </section>

      <section className="home-section relative overflow-hidden border-b py-16 md:py-20">
        <SectionBackdrop direction="right" />
        <div className="relative mx-auto max-w-295 px-6">
          <div className="mb-8 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Built for calendar-heavy work
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
              Less admin. More actual work.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workflowFeatures.map((item) => (
              <FeaturePanel key={item.title} {...item} />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {detailChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-line bg-overlay px-3 py-1.5 text-xs leading-5 text-muted"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section relative overflow-hidden py-16 md:py-24">
        <SectionBackdrop direction="left" grid={false} />
        <div className="relative mx-auto grid max-w-295 gap-6 px-6 md:grid-cols-[0.95fr_1.05fr]">
          <div className="shader-panel ui-panel-deep rounded-xl p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Get it now
            </p>
            <h2 className="mt-4 max-w-[13ch] text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
              Download for Mac, then stay close.
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
                  placement: "testflight_final",
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

          <WaitlistCard
            id="newsletter"
            placement="testflight"
            eyebrow="Newsletter"
            headline="Get launch notes and iOS/iPadOS beta updates."
            subheadline="hora is on the Mac App Store now. Subscribe here for short release notes and a heads-up when the iOS/iPadOS beta is ready."
            subheadlineMobile="Get launch notes and the iOS/iPadOS beta heads-up."
            liveCount={liveCount}
            socialLabel={socialProof.label}
            avatars={socialProof.avatars}
            variant="hero"
            className="h-fit self-center"
          />
        </div>
      </section>
    </main>
  );
}

function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[920px] overflow-hidden">
      <HeroShader />
      <div className="absolute inset-0 bg-bg/55" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-bg/20 to-bg" />
    </div>
  );
}

function FeaturePanel({
  icon,
  iconSrc,
  iconSrcs,
  iconClassName,
  title,
  body,
  emphasized = false,
}: {
  icon: IconName;
  iconSrc?: string;
  iconSrcs?: readonly string[];
  iconClassName?: string;
  title: string;
  body: string;
  emphasized?: boolean;
}) {
  return (
    <article
      className={cn(
        "p-5",
        emphasized
          ? "shader-panel ui-panel rounded-xl"
          : "ui-panel-soft rounded-lg",
      )}
    >
      <div className="mb-4 flex h-11 items-center gap-2">
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
      <h3 className="text-lg font-semibold leading-tight tracking-tight text-text">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
    </article>
  );
}
