import type { NextConfig } from "next";

import { legacyBlogAssetRedirects } from "./lib/legacy-blog-asset-redirects";

const legacyAssetRedirects = [
  ["/assets/Download_on_the_Mac_App_Store_Badge_US-UK_RGB_blk_092917.svg", "/assets/brand/mac-app-store-badge.svg"],
  ["/assets/hora-apple-touch-180.png", "/assets/brand/apple-touch-icon-180.png"],
  ["/assets/hora-favicon-32.png", "/assets/brand/favicon-32.png"],
  ["/assets/hora-icon-512.png", "/assets/brand/hora-icon-512.png"],
  ["/assets/hora-icon.png", "/assets/brand/hora-icon.png"],
  ["/assets/hora-demo.gif", "/assets/demo/hora-demo.gif"],
  ["/assets/hora-demo.vtt", "/assets/demo/hora-demo.vtt"],
  ["/assets/redesign/hora_demo_poster.webp", "/assets/demo/hora-demo-poster.webp"],
  ["/assets/hero_image_poster.webp", "/assets/hero/launch-poster.webp"],
  ["/assets/hora_brand_new.mp4", "/assets/hero/launch.mp4"],
  ["/assets/hora_brand_new.webm", "/assets/hero/launch.webm"],
  ["/assets/redesign/updated/hora_hero.webp", "/assets/hero/product-preview.webp"],
  ["/assets/hero_features/updated/hora_accounts.webp", "/assets/features/images/hora-accounts.webp"],
  ["/assets/hero_features/updated/hora_themes.webp", "/assets/features/images/hora-themes.webp"],
  ["/assets/hero_features/updated/hora_week_view.webp", "/assets/features/images/hora-week-view.webp"],
  ["/assets/hero_features/updated/hora_widget_menubar.webp", "/assets/features/images/hora-widget-menubar.webp"],
  ["/assets/hero_features/updated/new_event.webp", "/assets/features/images/new-event.webp"],
  ["/assets/redesign/updated/focus_time-card.webm", "/assets/features/card-videos/focus-time.webm"],
  ["/assets/redesign/updated/hora_menubar-card.webm", "/assets/features/card-videos/hora-menubar.webm"],
  ["/assets/redesign/updated/hora_quickadd-card.webm", "/assets/features/card-videos/hora-quick-add.webm"],
  ["/assets/redesign/updated/hora_themes-card.webm", "/assets/features/card-videos/hora-themes.webm"],
  ["/assets/redesign/updated/focus_time.mp4", "/assets/features/videos/focus-time.mp4"],
  ["/assets/redesign/updated/hora_menubar.mp4", "/assets/features/videos/hora-menubar.mp4"],
  ["/assets/redesign/updated/hora_quickadd.mp4", "/assets/features/videos/hora-quick-add.mp4"],
  ["/assets/redesign/updated/hora_themes.mp4", "/assets/features/videos/hora-themes.mp4"],
  ["/assets/redesign_raw/Apple_Intelligence.svg", "/assets/integrations/apple-intelligence.svg"],
  ["/assets/redesign_raw/google-calendar.svg", "/assets/integrations/google-calendar.svg"],
  ["/assets/redesign_raw/microsoft-teams-2018.svg", "/assets/integrations/microsoft-teams.svg"],
  ["/assets/redesign_raw/zoom.svg", "/assets/integrations/zoom.svg"],
  ["/assets/maciej_szamowski.jpg", "/assets/people/maciej-szamowski.jpg"],
  ["/assets/og-image.png", "/assets/seo/default-og-image.png"],
  ["/assets/ufind-badge.svg", "/assets/social/ufind-badge.svg"],
  ["/assets/keychain-access-2021-05-03.png.webp", "/assets/support/keychain-access.webp"],
] as const;

const nextConfig: NextConfig = {
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    qualities: [60, 75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/tbqxupiq/production/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/blog/2026-04-13-v0.6-qa-grind/",
        destination: "/blog/2026-04-13-v0-6-qa-grind/",
        permanent: true,
      },
      {
        source: "/blog/2026-04-13-v0.6-qa-grind",
        destination: "/blog/2026-04-13-v0-6-qa-grind/",
        permanent: true,
      },
      {
        source: "/blog/fantastical-alternative-google-calendar/",
        destination: "/blog/2026-05-06-fantastical-alternative-google-calendar/",
        permanent: true,
      },
      {
        source: "/blog/fantastical-alternative-google-calendar",
        destination: "/blog/2026-05-06-fantastical-alternative-google-calendar/",
        permanent: true,
      },
      {
        source: "/blog/2026-03-27-two-days-of-shipping/",
        destination: "/blog/native-macos-google-calendar-app-48-hours/",
        permanent: true,
      },
      {
        source: "/blog/2026-03-27-two-days-of-shipping",
        destination: "/blog/native-macos-google-calendar-app-48-hours/",
        permanent: true,
      },
      {
        source: "/blog/2026-04-16-from-polling-to-push/",
        destination: "/blog/real-time-google-calendar-sync-macos/",
        permanent: true,
      },
      {
        source: "/blog/2026-04-16-from-polling-to-push",
        destination: "/blog/real-time-google-calendar-sync-macos/",
        permanent: true,
      },
      {
        source: "/blog/from-polling-to-push/",
        destination: "/blog/real-time-google-calendar-sync-macos/",
        permanent: true,
      },
      {
        source: "/blog/from-polling-to-push",
        destination: "/blog/real-time-google-calendar-sync-macos/",
        permanent: true,
      },
      {
        source: "/blog/native-app-vs-electron-pwa/",
        destination: "/blog/2026-04-14-native-app-vs-electron-pwa/",
        permanent: true,
      },
      {
        source: "/blog/native-app-vs-electron-pwa",
        destination: "/blog/2026-04-14-native-app-vs-electron-pwa/",
        permanent: true,
      },
      {
        source: "/testflight/",
        destination: "/download/",
        permanent: true,
      },
      {
        source: "/testflight",
        destination: "/download/",
        permanent: true,
      },
      ...legacyAssetRedirects.map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      ...legacyBlogAssetRedirects.map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
