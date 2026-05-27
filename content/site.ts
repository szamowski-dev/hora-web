export const site = {
  brand: {
    name: "hora Calendar",
    shortName: "Calendar",
    tagline: "The Google Calendar client that macOS deserves.",
    logoSrc: "/assets/hora-icon.png",
  },
  url: "https://horacal.app",
  author: {
    name: "Maciej Szamowski",
    url: "https://szamowski.dev",
    twitter: "@moto_szama",
    github: "https://github.com/szamski",
  },
  nav: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Roadmap", href: "/#roadmap" },
    { label: "FAQ", href: "/#faq" },
    { label: "Support", href: "/support/" },
    { label: "Blog", href: "/blog/" },
    { label: "About", href: "/about/" },
  ],
  cta: {
    primary: { label: "Join Waitlist", href: "/#newsletter" },
  },
  community: {
    discord: {
      label: "Join Discord",
      href: "https://discord.gg/8JFz4FfBGQ",
    },
  },
  footer: {
    copyright: "© 2026 hora Calendar",
    developedBy: { label: "szamowski.dev", href: "https://szamowski.dev" },
    links: [
      { label: "About", href: "/about/" },
      { label: "Support", href: "/support/" },
      { label: "Privacy", href: "/privacy/" },
      { label: "Terms", href: "/terms/" },
    ],
    socials: [
      { label: "Email", href: "mailto:hello@horacal.app", icon: "mail" },
      { label: "Discord", href: "https://discord.gg/8JFz4FfBGQ", icon: "discord" },
      { label: "GitHub", href: "https://github.com/szamowski-dev/hora-web", icon: "github" },
      { label: "X / Twitter", href: "https://x.com/moto_szama", icon: "x" },
      { label: "Bluesky", href: "https://bsky.app/profile/szamski.bsky.social", icon: "bluesky" },
    ],
  },
  defaultOg: "/assets/og-image.png",
  contactEmail: "hello@horacal.app",
  newsletter: {
    endpoint: "/api/subscribe",
    afterSignup: {
      title: "You're in.",
      message:
        "I'll send the TestFlight invite by email. If you want the useful part between builds, join Discord for beta notes and quick feedback.",
      discordLabel: "Join Discord",
      shareLabel: "Share with one Mac friend",
      shareUrl:
        "https://horacal.app/testflight/?utm_source=post_signup&utm_medium=share&utm_campaign=beta_loop",
      shareText:
        "I joined the hora Calendar beta. If you use Google Calendar on Mac, this might be worth trying:",
      copiedLabel: "Link copied",
    },
  },
} as const;

export type Site = typeof site;
