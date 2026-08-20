import type { ProductLandingContent } from "@/lib/home-model";
import { DIRECT_DOWNLOAD_LABEL } from "@/lib/direct/commerce-contract";

export const defaultProductLanding = {
  hero: {
    title: "The Mac Calendar Google never built.",
    description:
      "A fast, native calendar for people who live in Google Calendar.\nPlan, join, and protect focus time without opening another browser tab.",
    primaryCtaLabel: DIRECT_DOWNLOAD_LABEL,
    macAppStoreLabel: "Download on the Mac App Store",
    trialNote: "7-day free trial · then $2.99/month or $29.99/year",
    watchVideoLabel: "Watch video",
    watchVideoUrl: "https://www.youtube.com/watch?v=ahVV5J25cYM",
    showPrimaryCta: true,
    showTerminalPrompt: false,
    homebrewCommand: "brew install --cask hora",
    directDownloadNote: "Choose a plan in the app. Requires macOS 26 or newer.",
    requirement: "Requires macOS 26 or newer.",
    copyLabel: "Copy",
    copiedLabel: "Copied",
  },
  media: {
    hero: {
      light: {
        src: "/assets/product/hero-light.png",
        alt: "hora Calendar week view with event details, Google Meet, and focus timer",
        width: 3234,
        height: 2028,
      },
      dark: {
        src: "/assets/product/hero.png",
        alt: "hora Calendar week view with event details, Google Meet, and focus timer",
        width: 3234,
        height: 2028,
      },
    },
    workflow: {
      light: {
        src: "/assets/product/fast-native-light.png",
        alt: "hora event editor with natural-language event creation",
        width: 3234,
        height: 2028,
      },
      dark: {
        src: "/assets/product/fast-native.png",
        alt: "hora event editor with natural-language event creation",
        width: 3234,
        height: 2028,
      },
    },
    googleCalendarCards: [
      {
        light: {
          src: "/assets/product/label-colors-light-card.png",
          alt: "Google Calendar color labels",
          width: 1334,
          height: 597,
        },
        dark: {
          src: "/assets/product/label-colors-dark-card.png",
          alt: "Google Calendar color labels",
          width: 1334,
          height: 597,
        },
      },
      {
        light: {
          src: "/assets/product/event-types-light-card.png",
          alt: "hora Calendar showing every Google Calendar event type",
          width: 592,
          height: 549,
        },
        dark: {
          src: "/assets/product/event-types-dark-card.png",
          alt: "hora Calendar showing every Google Calendar event type",
          width: 592,
          height: 549,
        },
      },
      {
        light: {
          src: "/assets/product/meet-and-contacts-light-card.png",
          alt: "Google Meet and Local Contacts",
          width: 592,
          height: 549,
        },
        dark: {
          src: "/assets/product/meet-and-contacts-dark-card.png",
          alt: "Google Meet and Local Contacts",
          width: 592,
          height: 549,
        },
      },
      {
        light: {
          src: "/assets/product/accounts-multiple-light-card.png",
          alt: "hora Google Accounts settings with multiple connected accounts",
          width: 1334,
          height: 597,
        },
        dark: {
          src: "/assets/product/accounts-multiple-dark-card.png",
          alt: "hora Google Accounts settings with multiple connected accounts",
          width: 1334,
          height: 597,
        },
      },
    ],
  },
  api: {
    title: "Powered by the Google Calendar API",
    description:
      "hora talks directly to Google Calendar for fast sync, complete event support, and the details your workday depends on.",
  },
  googleCalendar: {
    title: "Everything Google Calendar can do. Now native.",
    description:
      "Keep the event details, people, and meeting links your day depends on.",
    primaryFeatures: [
      {
        icon: "label",
        tone: "red",
        title: "Event color labels",
        description:
          "Keep Google's event colors intact across every calendar and account.",
      },
      {
        icon: "event",
        tone: "blue",
        title: "Every event type",
        description:
          "Timed, all-day, recurring, focus time, working location, out of office, and appointment schedules.",
      },
      {
        icon: "video-call",
        tone: "green",
        title: "Meet and Contacts",
        description:
          "Add Google Meet links and find guests through Google Contacts without leaving the event.",
      },
    ],
    secondaryFeatures: [
      {
        icon: "accounts",
        tone: "yellow",
        title: "Multiple accounts",
        description:
          "See and manage every Google account in one native experience.",
      },
      {
        icon: "search",
        tone: "purple",
        title: "Google Calendar search",
        description:
          "Search events, people, and details directly in Google Calendar, not only in hora's local database.",
      },
    ],
  },
  hora: {
    title: "Fast and natural event creation.",
    description:
      "Create events the way you think, create online meetings, and keep the next action close.",
    features: [
      {
        icon: "video-call",
        tone: "blue",
        title: "Zoom and Microsoft Teams",
        description: "Create and join meetings without separate apps.",
      },
      {
        icon: "focus-time",
        tone: "yellow",
        title: "Focus-time scheduler",
        description:
          "Easily create multiple Focus Time blocks across a busy week.",
      },
      {
        icon: "menu-bar",
        tone: "cyan",
        title: "Menu bar",
        description: "Your next event is always one click away.",
      },
      {
        icon: "availability",
        tone: "purple",
        title: "Shared availability",
        description:
          "Share useful openings while protecting the privacy of your calendar.",
      },
      {
        icon: "timer",
        tone: "red",
        title: "Pomodoro",
        description:
          "Track your focus sessions and breaks within your calendar.",
      },
      {
        icon: "keyboard",
        tone: "green",
        title: "Keyboard shortcuts",
        description: "Create and edit events without reaching for the mouse.",
      },
    ],
  },
  privacy: {
    title: "Built for Privacy",
    description:
      "Your schedule stays on your Mac. hora keeps credentials in macOS Keychain and connects directly to the Google Calendar API, without routing calendar data through an intermediary sync service.",
  },
  macos: {
    title: "Deeply integrated with macOS.",
    description:
      "Get out of the browser and use the parts of your Mac that make a busy day easier.",
    features: [
      {
        icon: "speed",
        tone: "red",
        title: "Lightweight and fast",
        description: "Native SwiftUI, with no bundled browser.",
      },
      {
        icon: "apple-silicon",
        tone: "green",
        title: "Built for Apple Silicon",
        description: "Designed for modern Mac hardware.",
      },
      {
        icon: "widgets",
        tone: "green",
        title: "Widgets & Themes",
        description: "Keep your schedule visible across macOS.",
      },
      {
        icon: "notifications",
        tone: "blue",
        title: "System notifications",
        description: "Timely alerts with native macOS controls.",
      },
      {
        icon: "dark-mode",
        tone: "purple",
        title: "Dark/Light mode",
        description: "Matches your system appearance automatically.",
      },
      {
        icon: "auto-awesome",
        tone: "purple",
        title: "Apple Intelligence",
        description:
          "Create events and summarize long notes with on-device intelligence.",
      },
    ],
  },
  featureGrid: {
    features: [
      {
        icon: "view",
        tone: "blue",
        title: "Multiple views",
        description: "Switch between 1-day, 5-day, 7-day, and month views.",
      },
      {
        icon: "quick-add",
        tone: "purple",
        title: "NLP event creation",
        description: "Create events naturally in many supported languages.",
      },
      {
        icon: "time-zone",
        tone: "green",
        title: "Time zones",
        description: "Plan with teammates wherever they work.",
      },
      {
        icon: "location",
        tone: "green",
        title: "Working location",
        description:
          "Show where you will be working through Google Workspace integration.",
      },
      {
        icon: "out-of-office",
        tone: "red",
        title: "Out of office",
        description:
          "Protect time away and decline meetings automatically, just like in Google Calendar on the web.",
      },
      {
        icon: "focus-time",
        tone: "yellow",
        title: "Focus time",
        description: "Reserve deep-work blocks in Google Calendar.",
      },
      {
        icon: "video-call",
        tone: "blue",
        title: "Online Meetings",
        description: "Join Meet, Zoom, and Teams in one click.",
      },
      {
        icon: "offline",
        tone: "purple",
        title: "Works offline",
        description:
          "View and manage your calendar without an internet connection.",
      },
    ],
  },
  newsletter: {
    title: "Join the hora mailing list",
    description:
      "Stay on top of product news, feature updates, and the iPhone and iPad beta.",
    placeholder: "Enter email address",
    buttonLabel: "Join mailing list",
  },
} satisfies ProductLandingContent;
