import type { Metadata, Viewport } from "next";
import { draftMode } from "next/headers";
import Script from "next/script";
import localFont from "next/font/local";
import { Geist, Newsreader } from "next/font/google";
import { Nav } from "@/components/organisms/Nav";
import { Footer } from "@/components/organisms/Footer";
import { AmbientGlow } from "@/components/organisms/AmbientGlow";
import { LayoutEnhancements } from "@/components/molecules/LayoutEnhancements";
import { DraftModeTools } from "@/components/sanity/DraftModeTools";
import { ConsentMode } from "@/components/molecules/ConsentMode";
import { MarketingTracking } from "@/components/molecules/MarketingTracking";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { getPricingPage } from "@/lib/pricing-repository";
import { getFooterSettings } from "@/lib/footer-settings-repository";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  preload: false,
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
      { url: "/assets/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/assets/brand/apple-touch-icon-180.png", sizes: "180x180", type: "image/png" },
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
    images: [{ url: "/assets/seo/default-og-image.png", width: 1200, height: 630 }],
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
  themeColor: "oklch(0.1448 0 0)",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  const [{ isEnabled: isDraftMode }, pricing, footerSettings] = await Promise.all([
    draftMode(),
    getPricingPage(),
    getFooterSettings(),
  ]);

  return (
    <html
      lang="en"
      data-theme="light"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geist.variable} ${newsreader.variable} ${bumbbled.variable}`}
      style={{ overscrollBehaviorY: "none" }}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try { const theme = localStorage.getItem('hora-theme'); if (theme === 'dark') { document.documentElement.dataset.theme = theme; document.documentElement.style.colorScheme = theme; } } catch {}`,
          }}
        />
        <link rel="dns-prefetch" href="https://consent.cookiebot.com" />
        <link rel="dns-prefetch" href="https://consentcdn.cookiebot.com" />
      </head>
      <body
        className="min-h-dvh flex flex-col text-text"
        style={{ overscrollBehaviorY: "none" }}
      >
        {/* Consent Mode starts before hydration; Cookiebot follows as soon as
            the app is interactive so it can apply the visitor's choice. */}
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="93e42c2d-57e2-448f-9699-a65ce0fffdbd"
          data-blockingmode="auto"
          strategy="afterInteractive"
        />

        <AmbientGlow />
        <LayoutEnhancements />
        <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6">
          <Nav showDirectDownload={pricing.direct.showDownload} />
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 pt-[70px] max-md:[&>:first-child]:-mt-[70px] max-md:[&>:first-child]:pt-[104px] max-md:[&>[data-nav-underlay=flush]]:pt-[70px] max-md:[&>[data-nav-underlay=cover]]:pt-0 md:pt-0"
        >
          {children}
        </main>
        <Footer copyright={footerSettings.copyright} />
        {modal}

        {isDraftMode ? <DraftModeTools /> : null}

        <Script
          id="gads-init"
          strategy="beforeInteractive"
          data-cookieconsent="ignore"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
            window.gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'denied',
              personalization_storage: 'denied',
              security_storage: 'granted',
              wait_for_update: 500,
            });
            window.gtag('set', 'ads_data_redaction', true);
            window.gtag('set', 'url_passthrough', true);
            window.gtag('js', new Date());
            window.gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
            window.horaGtagReady = true;
            window.dispatchEvent(new Event('hora-gtag-ready'));
          `}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="beforeInteractive"
          data-cookieconsent="ignore"
        />
        <ConsentMode />
        <MarketingTracking />

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
                  logo: "https://horacal.app/assets/brand/hora-icon.png",
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
