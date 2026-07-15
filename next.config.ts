import type { NextConfig } from "next";

import { legacyBlogAssetRedirects } from "./lib/legacy-blog-asset-redirects";

const sanitySiteAssetUrls = {
  demoPoster:
    "https://cdn.sanity.io/images/tbqxupiq/production/022bab212b9ab9488e8dde460d36e49ba277bf2d-1440x810.webp",
  heroScreenshot:
    "https://cdn.sanity.io/images/tbqxupiq/production/9943e1bec5545bcdc9754d048f631c3e4f3f2e53-3188x1903.webp",
  launchWebm:
    "https://cdn.sanity.io/files/tbqxupiq/production/dec63faad22cd1de3178243c65d3cc20a81d6594.webm",
  launchMp4:
    "https://cdn.sanity.io/files/tbqxupiq/production/583e1e5f5698a0740a7351b9aa0b1ea9993d754d.mp4",
  focusTimeWebm:
    "https://cdn.sanity.io/files/tbqxupiq/production/93798befa5df95f7f135e88db0d924ec78d69510.webm",
  focusTimeMp4:
    "https://cdn.sanity.io/files/tbqxupiq/production/a2fa767fd88d9caf859b61d92ba347141e19c154.mp4",
  quickAddWebm:
    "https://cdn.sanity.io/files/tbqxupiq/production/4a26a59584305cd6ecf7d5ed6cef91a9183da950.webm",
  quickAddMp4:
    "https://cdn.sanity.io/files/tbqxupiq/production/0a2833a56edf45f9c500f632405142a8f3774189.mp4",
  menuBarWebm:
    "https://cdn.sanity.io/files/tbqxupiq/production/d661e56b1b4db24a03846aac741f3eadf7e0e7e1.webm",
  menuBarMp4:
    "https://cdn.sanity.io/files/tbqxupiq/production/e1ec306aff2a1a3220a0d9360bbd7f336a955996.mp4",
  themesWebm:
    "https://cdn.sanity.io/files/tbqxupiq/production/49ac8a75ab331a5536562936850b007c48f2dc68.webm",
  themesMp4:
    "https://cdn.sanity.io/files/tbqxupiq/production/7c153d50dd85870e66abdb289d82c35f80779cf5.mp4",
  weekView:
    "https://cdn.sanity.io/images/tbqxupiq/production/ba63575aa7d2496a6dfb79e875ea9e3ba77d006b-3192x1902.webp",
  newEvent:
    "https://cdn.sanity.io/images/tbqxupiq/production/717a0a6b373d3495005c2194c740ffdb634f6f73-3186x1899.webp",
  accounts:
    "https://cdn.sanity.io/images/tbqxupiq/production/e4480485c50273c581210bd4dd954b45b855870a-3156x1887.webp",
  widgetMenuBar:
    "https://cdn.sanity.io/images/tbqxupiq/production/f2c4e16f5c69838cba79bd44d036e4a15f09c0f3-2820x1802.webp",
  themesScreenshot:
    "https://cdn.sanity.io/images/tbqxupiq/production/550a14450f56fb8ca2c1afe1eea56d789f761f8c-3188x1900.webp",
  ufindBadge:
    "https://cdn.sanity.io/files/tbqxupiq/production/81940c7437d2a9145c8622f5499cf94f92178c6c.svg",
} as const;

const sanitySiteAssetRedirects = [
  ["/assets/demo/hora-demo-poster.webp", sanitySiteAssetUrls.demoPoster],
  ["/assets/hero/product-preview.webp", sanitySiteAssetUrls.heroScreenshot],
  ["/assets/hero/launch.webm", sanitySiteAssetUrls.launchWebm],
  ["/assets/hero/launch.mp4", sanitySiteAssetUrls.launchMp4],
  ["/assets/features/card-videos/focus-time.webm", sanitySiteAssetUrls.focusTimeWebm],
  ["/assets/features/videos/focus-time.mp4", sanitySiteAssetUrls.focusTimeMp4],
  ["/assets/features/card-videos/hora-quick-add.webm", sanitySiteAssetUrls.quickAddWebm],
  ["/assets/features/videos/hora-quick-add.mp4", sanitySiteAssetUrls.quickAddMp4],
  ["/assets/features/card-videos/hora-menubar.webm", sanitySiteAssetUrls.menuBarWebm],
  ["/assets/features/videos/hora-menubar.mp4", sanitySiteAssetUrls.menuBarMp4],
  ["/assets/features/card-videos/hora-themes.webm", sanitySiteAssetUrls.themesWebm],
  ["/assets/features/videos/hora-themes.mp4", sanitySiteAssetUrls.themesMp4],
  ["/assets/features/images/hora-week-view.webp", sanitySiteAssetUrls.weekView],
  ["/assets/features/images/new-event.webp", sanitySiteAssetUrls.newEvent],
  ["/assets/features/images/hora-accounts.webp", sanitySiteAssetUrls.accounts],
  ["/assets/features/images/hora-widget-menubar.webp", sanitySiteAssetUrls.widgetMenuBar],
  ["/assets/features/images/hora-themes.webp", sanitySiteAssetUrls.themesScreenshot],
  ["/assets/social/ufind-badge.svg", sanitySiteAssetUrls.ufindBadge],
] as const;

const legacyAssetRedirects = [
  ["/assets/Download_on_the_Mac_App_Store_Badge_US-UK_RGB_blk_092917.svg", "/assets/brand/mac-app-store-badge.svg"],
  ["/assets/hora-apple-touch-180.png", "/assets/brand/apple-touch-icon-180.png"],
  ["/assets/hora-favicon-32.png", "/assets/brand/favicon-32.png"],
  ["/assets/hora-icon-512.png", "/assets/brand/hora-icon-512.png"],
  ["/assets/hora-icon.png", "/assets/brand/hora-icon.png"],
  ["/assets/hora-demo.gif", "/assets/demo/hora-demo.gif"],
  ["/assets/hora-demo.vtt", "/assets/demo/hora-demo.vtt"],
  ["/assets/redesign/hora_demo_poster.webp", sanitySiteAssetUrls.demoPoster],
  ["/assets/hero_image_poster.webp", "/assets/hero/launch-poster.webp"],
  ["/assets/hora_brand_new.mp4", sanitySiteAssetUrls.launchMp4],
  ["/assets/hora_brand_new.webm", sanitySiteAssetUrls.launchWebm],
  ["/assets/redesign/updated/hora_hero.webp", sanitySiteAssetUrls.heroScreenshot],
  ["/assets/hero_features/updated/hora_accounts.webp", sanitySiteAssetUrls.accounts],
  ["/assets/hero_features/updated/hora_themes.webp", sanitySiteAssetUrls.themesScreenshot],
  ["/assets/hero_features/updated/hora_week_view.webp", sanitySiteAssetUrls.weekView],
  ["/assets/hero_features/updated/hora_widget_menubar.webp", sanitySiteAssetUrls.widgetMenuBar],
  ["/assets/hero_features/updated/new_event.webp", sanitySiteAssetUrls.newEvent],
  ["/assets/redesign/updated/focus_time-card.webm", sanitySiteAssetUrls.focusTimeWebm],
  ["/assets/redesign/updated/hora_menubar-card.webm", sanitySiteAssetUrls.menuBarWebm],
  ["/assets/redesign/updated/hora_quickadd-card.webm", sanitySiteAssetUrls.quickAddWebm],
  ["/assets/redesign/updated/hora_themes-card.webm", sanitySiteAssetUrls.themesWebm],
  ["/assets/redesign/updated/focus_time.mp4", sanitySiteAssetUrls.focusTimeMp4],
  ["/assets/redesign/updated/hora_menubar.mp4", sanitySiteAssetUrls.menuBarMp4],
  ["/assets/redesign/updated/hora_quickadd.mp4", sanitySiteAssetUrls.quickAddMp4],
  ["/assets/redesign/updated/hora_themes.mp4", sanitySiteAssetUrls.themesMp4],
  ["/assets/redesign_raw/Apple_Intelligence.svg", "/assets/integrations/apple-intelligence.svg"],
  ["/assets/redesign_raw/google-calendar.svg", "/assets/integrations/google-calendar.svg"],
  ["/assets/redesign_raw/microsoft-teams-2018.svg", "/assets/integrations/microsoft-teams.svg"],
  ["/assets/redesign_raw/zoom.svg", "/assets/integrations/zoom.svg"],
  ["/assets/maciej_szamowski.jpg", "/assets/people/maciej-szamowski.jpg"],
  ["/assets/og-image.png", "/assets/seo/default-og-image.png"],
  ["/assets/ufind-badge.svg", sanitySiteAssetUrls.ufindBadge],
  ["/assets/keychain-access-2021-05-03.png.webp", "/assets/support/keychain-access.webp"],
] as const;

const seoBlogPostRedirects = [
  [
    "/blog/2026-03-26-building-hora",
    "/blog/2026-03-26-native-google-calendar-app-mac/",
  ],
  [
    "/blog/2026-04-10-fixing-the-appearance-bug",
    "/blog/2026-04-10-swiftui-appearance-switching-macos/",
  ],
  [
    "/blog/2026-04-13-v0.6-qa-grind",
    "/blog/2026-04-13-six-qa-groups-hora-reliability/",
  ],
  [
    "/blog/2026-04-13-v0-6-qa-grind",
    "/blog/2026-04-13-six-qa-groups-hora-reliability/",
  ],
  [
    "/blog/2026-05-08-fixing-yellow-on-yellow-calendar-tiles",
    "/blog/2026-05-08-swiftui-color-contrast-oklch-apca/",
  ],
  [
    "/blog/2026-06-05-types-of-calendar-layouts",
    "/blog/2026-06-05-google-calendar-views-day-week-month-schedule/",
  ],
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
      ...seoBlogPostRedirects.flatMap(([source, destination]) => [
        { source, destination, permanent: true },
        { source: `${source}/`, destination, permanent: true },
      ]),
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
      ...sanitySiteAssetRedirects.map(([source, destination]) => ({
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
