export const blog = {
  seo: {
    title: "Blog",
    description:
      "Updates, dev logs, and announcements from building hora Calendar — a native macOS Google Calendar client.",
    ogTitle: "hora Calendar Blog — Building a native macOS calendar in public",
    ogDescription:
      "Updates, dev logs, and announcements from building hora.",
  },
  eyebrow: "Building in public",
  heading: { prefix: "hora", suffixGradient: "Blog" },
  subtitle:
    "Updates, dev logs, and announcements from shipping a native macOS calendar.",
  rss: { label: "RSS feed", href: "/blog/feed.xml" },
  footerCta: {
    eyebrow: "Newsletter",
    heading: "Get launch and beta updates.",
    subtitle:
      "Short notes about the Mac launch, beta changes, and iOS/iPadOS availability. No spam.",
    cardHeadline: "Get the iOS/iPadOS beta note.",
    cardSubheadline:
      "Subscribe for short launch updates and a heads-up when the iOS/iPadOS beta is ready.",
  },
} as const;

export type Blog = typeof blog;
