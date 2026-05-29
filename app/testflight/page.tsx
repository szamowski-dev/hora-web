import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WaitlistCard } from "@/components/molecules/WaitlistCard";
import { home } from "@/content/home";
import { getTestFlightTesterCount } from "@/lib/testflight";

export const dynamic = "force-dynamic";

const title = "I’ve joined the TestFlight for a new calendar app on macOS";
const description =
  "hora Calendar — a native macOS Google Calendar client, built with SwiftUI. No Electron, no bloat. Currently in open beta.";

export const metadata: Metadata = {
  title: "Join the TestFlight — hora Calendar",
  description,
  alternates: { canonical: "/testflight/" },
  openGraph: {
    type: "website",
    url: "https://horacal.app/testflight/",
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

export default async function TestFlightPage() {
  const newsletter = home.hero.newsletter;
  const socialProof = newsletter.socialProof;
  const liveCount = await getTestFlightTesterCount(socialProof.count);

  return (
    <section className="relative flex min-h-[calc(100svh-80px)] w-full flex-col overflow-hidden">
      {/* Background: dimmed poster + warm red tints + fade — same recipe as HeroScene */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <Image
          src={home.hero.demo.posterSrc}
          alt="hora Calendar TestFlight beta preview"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.22]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 800px 500px at 15% 25%, rgba(255,56,60,0.22), transparent 65%), " +
              "radial-gradient(ellipse 700px 500px at 85% 70%, rgba(255,115,110,0.18), transparent 65%), " +
              "radial-gradient(ellipse 900px 600px at 50% 50%, rgba(10,10,10,0.35), transparent 70%)",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-bg/55 via-bg/30 to-bg" />
      </div>

      <div className="relative mx-auto flex w-full max-w-page flex-1 flex-col items-center justify-center gap-10 px-6 py-20 text-center md:gap-12 md:py-28">
      <div className="flex flex-col items-center gap-5 md:gap-7">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl">
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(255,56,60,0.95)]" />
          Someone invited you
        </span>
        <h1 className="max-w-3xl text-balance font-brand text-4xl font-normal leading-[1.2] tracking-tight text-text md:text-6xl">
          You’ve just been put on{" "}
          <span className="inline-block bg-linear-to-br from-accent to-accent-glow bg-clip-text pr-[0.12em] pl-[0.04em] text-transparent">
            hora Calendar&apos;s
          </span>{" "}
          radar.
        </h1>
        <p className="max-w-2xl text-balance text-2xl font-semibold leading-tight tracking-tight text-text md:text-3xl">
          The Mac calendar Google never built.
        </p>
      </div>

      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-[0_40px_80px_-24px_rgba(255,56,60,0.28)]">
        <Image
          src="/assets/hero_image.webp"
          alt="hora Calendar week view"
          width={1600}
          height={900}
          priority
          sizes="(max-width: 768px) 100vw, 900px"
          className="h-auto w-full"
        />
      </div>

      <WaitlistCard
        id="newsletter"
        placement="testflight"
        eyebrow="Newsletter"
        headline="Get launch and iOS/iPadOS beta updates."
        subheadline="TestFlight is open now. Subscribe here for launch notes and a heads-up when the iOS/iPadOS beta is ready."
        subheadlineMobile="Get launch notes and the iOS/iPadOS beta heads-up."
        liveCount={liveCount}
        socialLabel={socialProof.label}
        avatars={socialProof.avatars}
        variant="hero"
        className="max-w-xl text-left"
      />
      <Link
        href="/"
        className="text-sm text-muted underline-offset-4 hover:text-text hover:underline"
      >
        Or see what hora is about first
      </Link>
      </div>
    </section>
  );
}
