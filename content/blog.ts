export const blog = {
  seo: {
    title: "Mac Calendar Blog",
    description:
      "Updates, dev logs, and announcements from building hora Calendar — a native macOS Google Calendar client.",
    ogTitle: "hora Calendar Blog — Building a native macOS calendar in public",
    ogDescription:
      "Updates, dev logs, and announcements from building hora.",
  },
  eyebrow: "Building in public",
  heading: { prefix: "hora", suffixGradient: "Blog" },
  subtitle:
    "Updates, dev logs, launch notes, and technical write-ups from building hora Calendar: a native Mac app for Google Calendar, real-time sync, keyboard workflows, SwiftUI performance, and the product decisions behind each release.",
  intro: [
    "This blog is where I document the product and engineering work behind hora Calendar: why a native Mac calendar still matters, how Google Calendar sync behaves in the real world, and what I learn while shipping a focused calendar app as a solo developer.",
    "If you are choosing a Mac calendar, start with the practical guides on Google Calendar desktop apps, Fantastical alternatives, time blocking, calendar layouts, and Google Calendar API tradeoffs. If you are building software, the dev logs go deeper into SwiftUI, push sync, TestFlight feedback, performance fixes, UI polish, and the small decisions that make a calendar feel fast instead of noisy.",
    "The goal is simple: useful notes for people who live in Google Calendar on macOS, plus an honest record of how hora gets built, broken, fixed, and launched.",
  ],
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
