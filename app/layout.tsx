import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { Geist } from "next/font/google";
import { Nav } from "@/components/organisms/Nav";
import { Footer } from "@/components/organisms/Footer";
import { AmbientGlow } from "@/components/organisms/AmbientGlow";
import { LayoutEnhancements } from "@/components/molecules/LayoutEnhancements";
import { REDDIT_PIXEL_ID } from "@/lib/analytics";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const bumbbled = localFont({
  src: "../public/fonts/Bumbbled.woff2",
  variable: "--font-bumbbled",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://horacal.app"),
  title: {
    default: "hora Calendar — Native macOS Google Calendar Client",
    template: "%s — hora Calendar",
  },
  description:
    "hora Calendar is a native macOS client for Google Calendar. Built with SwiftUI. No Electron. No CalDAV. Just fast.",
  applicationName: "hora Calendar",
  authors: [{ name: "Maciej Szamowski", url: "https://szamowski.dev" }],
  creator: "Maciej Szamowski",
  manifest: "/manifest.webmanifest",
  // Native Apple Smart App Banner. Renders in Safari on iOS/iPadOS only (never
  // macOS / other browsers). app-id is the App Store ID from the listing URL
  // apps.apple.com/app/apple-store/id6761409895 — shared across the macOS app
  // and the coming iOS app via universal purchase.
  itunes: {
    appId: "6761409895",
    appArgument: "https://horacal.app",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/assets/hora-favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/assets/hora-apple-touch-180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/blog/feed.xml", title: "hora Calendar Blog" },
      ],
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "hora Calendar",
    url: "https://horacal.app/",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@moto_szama",
    creator: "@moto_szama",
  },
  other: {
    llms: "/llms.txt",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

const GA_MEASUREMENT_ID = "G-WQZ32S81FX";
const GOOGLE_ADS_ID = "AW-18070613857";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${bumbbled.variable}`}>
      <head>
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://plausible.io" />
        <link rel="dns-prefetch" href="https://consent.cookiebot.com" />
        <link rel="dns-prefetch" href="https://consentcdn.cookiebot.com" />
      </head>
      <body className="min-h-dvh flex flex-col text-text">
        <Script
          id="gads-consent"
          strategy="beforeInteractive"
          data-cookieconsent="ignore"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'denied',
              personalization_storage: 'denied',
              security_storage: 'granted',
              wait_for_update: 500
            });
            gtag('set', 'ads_data_redaction', true);
            gtag('set', 'url_passthrough', true);
          `}
        </Script>

        {/* Cookiebot is moved to lazyOnload because its dialog markup was
            being picked as the LCP element (2.4s render delay on mobile).
            The default-denied gtag consent above keeps us compliant until
            the banner finishes loading post window.load. */}
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="93e42c2d-57e2-448f-9699-a65ce0fffdbd"
          data-blockingmode="auto"
          strategy="lazyOnload"
        />

        <AmbientGlow />
        <LayoutEnhancements />
        <header>
          <Nav />
        </header>
        <main className="flex-1">{children}</main>
        <Footer />

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script id="gads-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
            window.gtag('js', new Date());
            window.gtag('config', '${GA_MEASUREMENT_ID}');
            window.gtag('config', '${GOOGLE_ADS_ID}');
          `}
        </Script>

        {/* Privacy-friendly analytics by Plausible. The init shim queues any
            track() calls that fire before the async script finishes loading, so
            early click events are never dropped. */}
        <Script
          id="plausible"
          src="https://plausible.io/js/pa-wsB6_ypdQmpn7Lf06SUrR.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
        </Script>

        <Script id="reddit-pixel" strategy="lazyOnload">
          {`
            !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js?pixel_id=${REDDIT_PIXEL_ID}",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','${REDDIT_PIXEL_ID}');rdt('track', 'PageVisit');
          `}
        </Script>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://horacal.app/#organization",
                  name: "hora Calendar",
                  url: "https://horacal.app/",
                  logo: "https://horacal.app/assets/hora-icon.png",
                  sameAs: [
                    "https://x.com/moto_szama",
                    "https://github.com/szamski",
                    "https://bsky.app/profile/szamski.bsky.social",
                    "https://discord.gg/8JFz4FfBGQ",
                  ],
                  founder: {
                    "@type": "Person",
                    name: "Maciej Szamowski",
                    url: "https://szamowski.dev",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://horacal.app/#website",
                  url: "https://horacal.app/",
                  name: "hora Calendar",
                  description:
                    "Native macOS client for Google Calendar. Built with SwiftUI. No Electron. No CalDAV. Just fast.",
                  publisher: { "@id": "https://horacal.app/#organization" },
                  inLanguage: "en-US",
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
