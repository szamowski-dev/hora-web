import type { BlogCtaContent } from "@/lib/blog-cta-model";

export const defaultBlogCta = {
  eyebrow: "Google Calendar for Mac",
  ctaLabel: "Download hora",
  macAppStoreLabel: "Download on the Mac App Store",
  trialNote: "7-day free trial · then $2.99/month or $29.99/year",
  requirement: "Requires macOS 26 or newer.",
  showHomebrew: true,
  homebrewCommand: "brew install --cask hora",
  copyLabel: "Copy",
  copiedLabel: "Copied",
  aside: {
    enabled: true,
    heading: "A native calendar for your Mac",
    body: "Plan, join, and protect focus time in Google Calendar without opening another browser tab.",
  },
  rail: {
    enabled: true,
    heading: "Try hora",
    body: "The fast, native Google Calendar app for macOS.",
  },
  band: {
    enabled: true,
    heading: "Read enough? Put it on your Mac.",
    body: "hora is a fast, native Google Calendar client built with SwiftUI. Start with a 7-day free trial.",
  },
} as const satisfies BlogCtaContent;
