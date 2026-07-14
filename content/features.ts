export const features = {
  seo: {
    title: "Mac Calendar Features",
    description:
      "Every feature in hora Calendar — a native macOS Google Calendar client. Week, month, day views, keyboard shortcuts, Pomodoro, availability sharing, and more.",
    ogTitle: "Features — hora Calendar",
    ogDescription:
      "Every feature in hora Calendar — native macOS Google Calendar client built with Swift and SwiftUI.",
  },

  hero: {
    title: { prefix: "Every feature in", suffixGradient: "hora Calendar" },
    subtitle:
      "The full feature set of the Mac app: calendar views, event editing, Google sync, meeting links, keyboard workflows, and native macOS details.",
  },

  sections: [
    {
      label: "Calendar Views",
      screenshot: {
        src: "/assets/features/images/hora-week-view.webp",
        alt: "hora Calendar — Week, Month, and Day views",
        width: 3192,
        height: 1902,
      },
      items: [
        {
          title: "Week View",
          description:
            "Full 7-day or 5-day work week with hourly grid. Color-coded events from multiple calendars, time indicators, and smooth scrolling. Click any empty slot to create an event instantly.",
          badges: ["5/7 day toggle", "Hourly grid"],
        },
        {
          title: "Month View",
          description:
            "Bird's eye view of your entire month with event density indicators. All-day events displayed as colored bars, timed events as compact rows. Click any day to drill down.",
          badges: ["Event density", "All-day events"],
        },
        {
          title: "Day View",
          description:
            "Focused single-day view with detailed time slots. See every event, meeting link, and attendee at a glance. Perfect for busy days with back-to-back meetings.",
          badges: ["Detailed view", "Attendee list"],
        },
        {
          title: "Mini Calendar",
          description:
            "Sidebar mini calendar for quick date navigation. Click any date to jump there instantly. Shows event density dots for each day.",
          badges: ["Quick navigation"],
        },
      ],
    },
    {
      label: "Event Management",
      screenshot: {
        src: "/assets/features/images/new-event.webp",
        alt: "hora Calendar — Event creation and drag & drop",
        width: 3186,
        height: 1899,
        size: "sm",
      },
      items: [
        {
          title: "Create Events",
          description:
            "Click an empty time slot or press ⌘N. Set title, time, calendar, location, description, and conference link. Optimistic UI — the event appears instantly before sync confirms.",
        },
        {
          title: "Edit & Delete",
          description:
            "Click any event to edit. Change time, title, attendees, recurrence — everything syncs back to Google Calendar in real time. Delete with confirmation or ⌘⌫.",
        },
        {
          title: "Drag & Drop",
          description:
            "Move events between days and time slots by dragging. Visual feedback shows the new position before you drop. Works across all calendar views.",
        },
        {
          title: "Resize Events",
          description:
            "Drag the bottom edge of any event to change its duration. The time updates live as you drag. Quick way to extend or shorten meetings.",
        },
        {
          title: "Recurring Events",
          description:
            "Full recurrence support — daily, weekly, monthly, yearly, custom patterns. Edit single occurrences or the entire series. Syncs with Google's recurrence rules.",
        },
        {
          title: "Invitation Management",
          description:
            "Accept, decline, or tentatively accept meeting invitations directly from hora. See pending invitations styled differently (dashed borders) so they stand out.",
          badges: ["Accept", "Decline", "Maybe"],
        },
      ],
    },
    {
      label: "Google Integration",
      screenshot: {
        src: "/assets/features/images/hora-accounts.webp",
        alt: "hora Calendar — Multi-account Google Calendar sync",
        width: 3156,
        height: 1887,
      },
      items: [
        {
          title: "Multi-Account",
          description:
            "Sign in with multiple Google accounts. Each account's calendars are color-coded and can be toggled independently. Work and personal calendars, one app.",
        },
        {
          title: "Direct API",
          description:
            "hora talks directly to Google Calendar REST API. No third-party servers, no middleware, no CalDAV translation layer. Your data goes straight between your Mac and Google.",
        },
        {
          title: "Incremental Sync",
          description:
            "Uses Google's sync tokens for efficient incremental updates. Only fetches what changed since the last sync. Configurable sync intervals — from 30 seconds to manual.",
        },
        {
          title: "Google Meet",
          description:
            "Add Google Meet conference links when creating events. One-click join button on events that have meeting links. No need to open a browser to find the link.",
        },
      ],
    },
    {
      label: "Productivity",
      screenshot: {
        src: "/assets/features/images/hora-widget-menubar.webp",
        alt: "hora Calendar — Menu bar widget with upcoming events",
        width: 2820,
        height: 1802,
        size: "sm",
      },
      wideShortcutsCard: {
        title: "Keyboard Shortcuts",
        description:
          "Full keyboard navigation inspired by Google Calendar. Navigate between views, create events, jump to today, and move between dates — all without touching the mouse.",
        shortcuts: [
          { keys: ["D", "W", "M"], label: "Switch views" },
          { keys: ["⌘", "N"], label: "New event" },
          { keys: ["⌘", "T"], label: "Jump to today" },
          { keys: ["←", "→"], label: "Navigate dates" },
          { keys: ["⌘", "⇧", "A"], label: "Share availability" },
        ],
      },
      items: [
        {
          title: "Pomodoro Timer",
          description:
            "Built-in Pomodoro timer in the day view. Start a focus session tied to your current task. Visual countdown in the sidebar — no need for a separate app.",
        },
        {
          title: "Availability Sharing",
          description:
            "Press ⌘⇧A to generate your free time slots using Google's FreeBusy API. Copies formatted availability to your clipboard. Paste into Slack, email, anywhere.",
        },
        {
          title: "Menu Bar Widget",
          description:
            "Always-visible menu bar widget shows your next upcoming event. Quick glance at what's next without switching to the calendar. Click to expand for more detail.",
        },
        {
          title: "Go to Date",
          description:
            "Jump to any date with the date picker or ⌘G. Navigate months and years without scrolling. Get to that meeting from 3 months ago in two clicks.",
        },
      ],
    },
    {
      label: "Appearance & Localization",
      screenshot: {
        src: "/assets/features/images/hora-themes.webp",
        alt: "hora Calendar — Appearance and language settings",
        width: 3188,
        height: 1900,
        size: "sm",
      },
      items: [
        {
          title: "Light & Dark Mode",
          description:
            "Full support for light mode, dark mode, and auto (follows system). Carefully tuned contrast and opacity values for readability in both modes.",
        },
        {
          title: "9 Languages",
          description:
            "English, Polish, German, Spanish, French, Italian, Japanese, Portuguese, and Simplified Chinese. Interface adapts to your system language automatically.",
        },
        {
          title: "Calendar Colors",
          description:
            "Each calendar gets its own color, matching your Google Calendar settings. Events are color-coded so you can instantly tell which account and calendar they belong to.",
        },
        {
          title: "Window State",
          description:
            "hora remembers your window size and position between launches. Open it up and it's exactly where you left it. Plays nice with Stage Manager and Spaces.",
        },
      ],
    },
    {
      label: "Privacy & Technical",
      items: [
        {
          title: "Privacy First",
          description:
            "No analytics on your calendar data. No third-party servers. No tracking. hora connects directly to Google — your events never touch any other server. Ever.",
        },
        {
          title: "Native macOS",
          description:
            "Built with Swift 6 and SwiftUI. No Electron, no web views, no browser engine. Uses a fraction of the memory and CPU compared to web-based alternatives.",
          badges: ["Swift 6", "SwiftUI", "SwiftData"],
        },
        {
          title: "Notifications",
          description:
            "Native macOS notifications for upcoming events. Uses the system notification center — supports Do Not Disturb, Focus modes, and notification grouping.",
        },
        {
          title: "Xcode Cloud CI/CD",
          description:
            "Every commit is tested, every build is reproducible. Automated builds via Xcode Cloud with TestFlight distribution for beta testers.",
        },
      ],
    },
  ],
} as const;

export type Features = typeof features;
