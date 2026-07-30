import type { ProductLandingContent } from "@/lib/home-model";

export const defaultProductLanding = {
  hero: {
    title: "Google Calendar, finally at home on your Mac.",
    description:
      "A fast, native calendar for people who live in Google Calendar. Plan, join, and protect focus time without opening another browser tab.",
    primaryCtaLabel: "Download free trial",
    watchVideoLabel: "Watch video",
    requirement: "Requires macOS 26 or newer.",
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
        title: "Fast search",
        description:
          "Find events, people, and details instantly across your calendars.",
      },
      {
        icon: "invitation",
        tone: "red",
        title: "Native invitations",
        description:
          "Create, edit, and respond to invitations without leaving hora.",
      },
    ],
  },
  hora: {
    title: "More than a calendar window.",
    description:
      "hora keeps the next action close, even when the calendar is not.",
    features: [
      {
        icon: "menu-bar",
        tone: "blue",
        title: "Menu bar",
        description:
          "See the next event, join a call, and start a timer from anywhere.",
      },
      {
        icon: "timer",
        tone: "red",
        title: "Pomodoro",
        description:
          "Turn calendar focus blocks into practical work sessions.",
      },
      {
        icon: "auto-awesome",
        tone: "purple",
        title: "Apple Intelligence",
        description:
          "Create events and summarize long notes with on-device intelligence.",
      },
      {
        icon: "video-call",
        tone: "blue",
        title: "Zoom and Microsoft Teams",
        description:
          "Create and join meetings without hunting for the right link.",
      },
      {
        icon: "tasks",
        tone: "red",
        title: "Todoist",
        description:
          "Keep tasks beside the calendar context that gives them meaning.",
      },
      {
        icon: "focus-time",
        tone: "yellow",
        title: "Focus-time scheduler",
        description:
          "Protect deep-work blocks and move them when the day changes.",
      },
      {
        icon: "availability",
        tone: "green",
        title: "Shared availability",
        description:
          "Share the times that work without exposing the rest of your calendar.",
      },
    ],
  },
  privacy: {
    title: "Built for Privacy",
    description:
      "Your schedule stays on your Mac. hora keeps credentials in macOS Keychain and connects directly to the Google Calendar API, without routing calendar data through an intermediary sync service.",
    features: [
      {
        icon: "sync",
        tone: "green",
        title: "Direct API connection",
        description: "Your Mac talks to Google Calendar directly.",
      },
      {
        icon: "key",
        tone: "yellow",
        title: "Credentials in Keychain",
        description: "Account tokens stay protected by macOS.",
      },
      {
        icon: "storage",
        tone: "blue",
        title: "No calendar data on our servers",
        description: "We do not store, index, or back up your calendar.",
      },
    ],
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
        icon: "keyboard",
        tone: "blue",
        title: "Keyboard shortcuts",
        description: "Navigate and create without reaching for the mouse.",
      },
      {
        icon: "dark-mode",
        tone: "purple",
        title: "Dark mode",
        description: "Matches your system appearance automatically.",
      },
      {
        icon: "notifications",
        tone: "blue",
        title: "System notifications",
        description: "Timely alerts with native macOS controls.",
      },
      {
        icon: "apple-silicon",
        tone: "green",
        title: "Built for Apple Silicon",
        description: "Designed for modern Mac hardware.",
      },
      {
        icon: "dock",
        tone: "green",
        title: "In your Dock",
        description: "A real app with a real place on your Mac.",
      },
      {
        icon: "windows",
        tone: "red",
        title: "Multiple windows",
        description: "Keep different dates and accounts open side by side.",
      },
      {
        icon: "menu-bar",
        tone: "cyan",
        title: "Menu bar extra",
        description: "Your next event is always one click away.",
      },
    ],
  },
  featureGrid: {
    title: "The details add up.",
    description:
      "The everyday calendar tools are here too, with room to tune this list as hora evolves.",
    features: [
      {
        icon: "view",
        tone: "blue",
        title: "Day, week, and month views",
        description: "Move between focused and long-range planning.",
      },
      {
        icon: "drag",
        tone: "red",
        title: "Drag and drop",
        description: "Reschedule events directly on the timeline.",
      },
      {
        icon: "quick-add",
        tone: "purple",
        title: "Natural Language Support",
        description: "Type the event the way you would say it.",
      },
      {
        icon: "time-zone",
        tone: "green",
        title: "Time zones",
        description: "Plan with teammates wherever they work.",
      },
      {
        icon: "repeat",
        tone: "blue",
        title: "Recurring events",
        description: "Edit one occurrence or the whole series.",
      },
      {
        icon: "location",
        tone: "green",
        title: "Working location",
        description: "Show where you will be working.",
      },
      {
        icon: "out-of-office",
        tone: "red",
        title: "Out of office",
        description: "Protect time away and decline meetings automatically.",
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
        title: "Meeting links",
        description: "Join Meet, Zoom, and Teams in one click.",
      },
      {
        icon: "availability",
        tone: "purple",
        title: "Shared availability",
        description: "Send useful openings without a scheduling thread.",
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
