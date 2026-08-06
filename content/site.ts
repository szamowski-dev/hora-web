export const site = {
  brand: {
    name: "hora Calendar",
    shortName: "Calendar",
    logoSrc: "/assets/brand/hora-icon.png",
  },
  url: "https://horacal.app",
  nav: [
    { label: "Features", href: "/#features" },
    { label: "Privacy", href: "/#privacy" },
    { label: "macOS", href: "/#macos" },
    { label: "Pricing", href: "/pricing/" },
    { label: "Blog", href: "/blog/" },
  ],
  cta: {
    trial: {
      label: "Download",
      href: "/pricing/",
    },
    primary: {
      label: "Download on the Mac App Store",
      href: "https://apps.apple.com/app/apple-store/id6761409895?pt=128724444&ct=hora_website&mt=8",
    },
    direct: {
      label: "Download Direct",
      href: "/download/direct/",
    },
  },
  macAppStoreBadgeSrc:
    "/assets/brand/mac-app-store-badge.svg",
  community: {
    discord: {
      label: "Join Discord",
      href: "https://discord.gg/8JFz4FfBGQ",
    },
  },
  footer: {
    description:
      "A fast, native Google Calendar app\nbuilt for the Mac.",
    copyright: "© 2026 hora Calendar",
    productLinks: [
      { label: "Features", href: "/#features" },
      { label: "Privacy", href: "/#privacy" },
      { label: "macOS integration", href: "/#macos" },
      { label: "Pricing", href: "/pricing/" },
      { label: "Download", href: "/pricing/" },
    ],
    popularGuides: [
      {
        label: "Google Calendar for Mac",
        href: "/blog/2026-07-09-google-calendar-desktop-app-mac/",
      },
      {
        label: "Time blocking apps for Mac",
        href: "/blog/2026-05-13-time-blocking-app-mac-2026/",
      },
      {
        label: "Notion Calendar alternatives",
        href: "/blog/notion-calendar-alternative/",
      },
      {
        label: "Fantastical alternatives",
        href: "/blog/2026-05-06-fantastical-alternative-google-calendar/",
      },
    ],
    links: [
      { label: "About", href: "/about/" },
      { label: "Support", href: "/support/" },
      { label: "Privacy", href: "/privacy/" },
      { label: "Terms", href: "/terms/" },
      { label: "Refunds", href: "/refunds/" },
    ],
    socials: [
      { label: "Discord", href: "https://discord.gg/8JFz4FfBGQ", icon: "discord" },
      { label: "X / Twitter", href: "https://x.com/moto_szama", icon: "x" },
      { label: "Bluesky", href: "https://bsky.app/profile/szamski.bsky.social", icon: "bluesky" },
    ],
  },
  contactEmail: "hello@horacal.app",
  newsletter: {
    endpoint: "/api/subscribe",
    afterSignup: {
      title: "You're subscribed.",
      message:
        "I'll send short launch updates and a heads-up when the iOS/iPadOS beta is ready. Join Discord for beta notes and quick feedback between emails.",
      discordLabel: "Join Discord",
      shareLabel: "Share with one friend",
      shareUrl:
        "https://horacal.app/?utm_source=post_signup&utm_medium=share&utm_campaign=launch_loop",
      shareText:
        "I subscribed to hora Calendar updates. It's now on the Mac App Store — if you use Google Calendar on Mac, this might be worth trying:",
      copiedLabel: "Link copied",
    },
  },
} as const;
