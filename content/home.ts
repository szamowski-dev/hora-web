export const home = {
  seo: {
    title: "hora Calendar — Native macOS Google Calendar Client",
    description:
      "The Mac calendar Google never built. Fast, native, private — designed for people who find Apple Calendar too limited and everything else too much.",
    ogTitle: "hora Calendar — The Mac calendar Google never built",
    ogDescription:
      "Fast. Native. Private. A native macOS calendar designed to feel right — not overloaded, not limited.",
  },

  hero: {
    iconSrc: "/assets/hora-icon.png",
    title: { prefix: "hora", suffixGradient: "Calendar" },
    tagline: "The Mac calendar Google never built.",
    newsletter: {
      placeholder: "you@email.com",
      button: "Sign up for TestFlight",
      eyebrow: "Beta access",
      headline: "Join the Mac beta.",
      subheadline:
        "Get TestFlight access, try early builds, and help shape the beta before launch.",
      subheadlineMobile: "Try early builds. Shape the beta.",
      watchDemoCtaLabel: "Watch the demo",
      socialProof: {
        count: 240,
        label: "Mac users are already testing hora on TestFlight",
        avatars: [
          {
            src: "https://randomuser.me/api/portraits/thumb/men/32.jpg",
            alt: "Waitlist member avatar",
          },
          {
            src: "https://randomuser.me/api/portraits/thumb/women/44.jpg",
            alt: "Waitlist member avatar",
          },
          {
            src: "https://randomuser.me/api/portraits/thumb/men/86.jpg",
            alt: "Waitlist member avatar",
          },
          {
            src: "https://randomuser.me/api/portraits/thumb/women/12.jpg",
            alt: "Waitlist member avatar",
          },
          {
            src: "https://randomuser.me/api/portraits/thumb/men/67.jpg",
            alt: "Waitlist member avatar",
          },
        ],
      },
    },
    demo: {
      videoSources: [
        { src: "/assets/redesign/hora_demo.webm", type: "video/webm" },
        { src: "/assets/redesign/hora_demo.mp4", type: "video/mp4" },
      ],
      posterSrc: "/assets/redesign/hora_hero_screenshot.webp",
      demoPosterSrc: "/assets/redesign/hora_demo_poster.webp",
      videoPosterSrc: "/assets/hero_image_poster.webp",
      captionsSrc: "/assets/hora-demo.vtt",
      ariaLabel:
        "hora Calendar demo showing week view, event creation, and calendar navigation",
    },
  },

  featuredOn: {
    label: "Featured on",
    badges: [
      {
        href: "https://tinylaunch.com",
        src: "https://tinylaunch.com/tinylaunch_badge_3.svg",
        alt: "hora Calendar — Featured on TinyLaunch",
        width: 202,
        height: 54,
      },
      {
        href: "https://ufind.best",
        src: "/assets/ufind-badge.svg",
        alt: "hora Calendar — Featured on ufind.best",
        width: 140.8,
        height: 40,
      },
      {
        href: "https://microlaunch.net/p/horacalendar?utm_source=badge-winner-microlaunch&utm_medium=badge",
        src: "https://wild-dust-0517.microlaunch.workers.dev/badges/potd/ml_potd_badge_v4.svg",
        alt: "MicroLaunch Product of the Day badge",
        width: 306,
        height: 96,
      },
      {
        href: "https://peerlist.io/szamski/project/hora-calendar--native-macos-google-calendar",
        src: "https://peerlist.io/api/v1/projects/embed/PRJH8OEN79LEKDP7BFRBOA6BR6R6GQ?showUpvote=false&theme=dark",
        alt: "hora Calendar — Native macOS Google Calendar",
        width: 288,
        height: 72,
      },
    ],
  },

  videoShowcase: {
    eyebrow: "See it in action",
    heading: { prefix: "Watch", suffixGradient: "hora" },
    description: "A video tour of how hora Calendar feels on macOS.",
    highlights: [
      "Day, week, and month views",
      "Drag & drop",
      "Create, Edit, Reschedule",
      "Focus on what's next",
    ],
    unmuteLabel: "Unmute sound",
    muteLabel: "Mute sound",
    enlargeLabel: "Enlarge",
    minimizeLabel: "Exit fullscreen",
  },

  userProof: {
    eyebrow: "Already testing",
    heading: { prefix: "Already in", suffixGradient: "real Mac calendars" },
    description:
      "Mac users are already trying hora in their daily Google Calendar workflows.",
    stat: {
      count: 200,
      value: "200+",
      label: "Mac users are already testing hora on TestFlight",
    },
    quote: {
      text: "Finally an app that does not ship a whole browser alongside it.",
      author: "Ivor",
      handle: "@ivorisnoob",
      href: "https://x.com/ivorisnoob",
      avatarSrc: "https://unavatar.io/x/ivorisnoob",
    },
  },

  features: {
    eyebrow: "Built for Mac",
    heading: { prefix: "Built for how you work", suffixGradient: "on Mac." },
    description:
      "hora brings Google Calendar to macOS the way it should have always been.",
    items: [
      {
        icon: "app-window" as const,
        title: "Feels like a real Mac app",
        body: "Opens instantly. Scrolls smoothly. No Electron, no web views — just native SwiftUI.",
      },
      {
        icon: "calendar" as const,
        title: "Plan without friction",
        body: "Week and month views with drag-and-drop, timeline resize, and fast search across all calendars.",
      },
      {
        icon: "bell" as const,
        title: "Next meeting. Always visible.",
        body: "See what's coming up from the menu bar and join it in one click. No app switching.",
      },
      {
        icon: "check" as const,
        title: "Google Calendar, done right",
        body: "Multiple accounts, color-coded calendars, and native Meet, Zoom, and Teams links.",
      },
      {
        icon: "gauge" as const,
        title: "Built for speed",
        body: "Familiar Google Calendar-style shortcuts. Stay in flow without reaching for the mouse.",
      },
      {
        icon: "shield" as const,
        title: "Your data stays yours",
        body: "A direct connection between your Mac and Google. No servers, no tracking, no middleware.",
      },
    ],
    allFeaturesLink: {
      label: "See all features in detail →",
      href: "/features/",
    },
  },

  whyHora: {
    eyebrow: "Just right",
    heading: { prefix: "Why", suffixGradient: "hora?" },
    descriptor:
      "Built for people who find Apple Calendar too limited — and everything else too much.",
    comparison: [
      { name: "Apple Calendar", tag: "Too limited", tone: "muted" as const },
      { name: "Fantastical", tag: "Too much", tone: "muted" as const },
      { name: "hora Calendar", tag: "Just right", tone: "accent" as const },
    ],
    climax: {
      prefix: "hora Calendar aims for the",
      highlight: "balance",
      suffix: ".",
    },
    personalNote: [
      "I've been using calendar apps for years, and they always felt off.",
      "Too simple. Too complex. Too slow.",
      "So I started building my own.",
      "hora is a native macOS calendar designed to feel right.",
    ],
    personalNoteAuthor: {
      name: "Maciej",
      role: "Founder & Developer",
      twitterHref: "https://x.com/moto_szama",
      twitterLabel: "Follow @moto_szama",
      blueskyHref: "https://bsky.app/profile/szamski.bsky.social",
      blueskyLabel: "Follow @szamski.bsky.social",
    },
  },

  betaCta: {
    eyebrow: "Beta access",
    heading: "Want to try it early?",
    subtitle: "Join the beta and help shape the product.",
    note: "Early access via TestFlight.",
    cardHeadline: "Join the Mac beta.",
    cardSubheadline:
      "Get TestFlight access, try early builds, and help shape the beta before launch.",
    footnote:
      "If you've ever felt like your calendar is either too simple or too complex, you'll probably understand why hora exists.",
  },

  pricing: {
    heading: { prefix: "Simple pricing", suffixGradient: "rules forever." },
    appStoreLabel: "Download on the App Store (Soon)",
    oneTime: "$49.90 one-time",
    yearly: "$29.99 / year",
    body:
      "Pick a one-time purchase or a lower annual plan. Both include Family Sharing. TestFlight access stays free during beta.",
    crossPlatform:
      "Shared across macOS and iOS/iPad apps (coming soon).",
    comparison: [
      {
        name: "hora Calendar",
        price: "$49.90 lifetime or $29.99/year",
        detail: "Native, Google-focused, Family Sharing included.",
      },
      {
        name: "Fantastical",
        price: "$57–$84/year",
        detail: "Broader suite, higher annual cost for Google-only use.",
      },
      {
        name: "Notion Calendar",
        price: "Free",
        detail: "Good free option, but web-tech based and less native.",
      },
    ],
    comparisonCta: {
      label: "Compare against Fantastical in detail →",
      href: "/blog/2026-05-06-fantastical-alternative-google-calendar/",
    },
  },

  roadmap: {
    eyebrow: "The roadmap",
    heading: { prefix: "What's", suffixGradient: "Next" },
    subtitle:
      "Where hora is going. Shipped when it's ready, not when it's scheduled.",
    items: [
      {
        n: 1,
        status: "Open Beta Tests" as const,
        title: "TestFlight Launch",
        description:
          "Final QA sprint, performance tuning, stability checks.",
      },
      {
        n: 2,
        status: "Up next" as const,
        title: "Apple Intelligence",
        description:
          "Quick-add with Natural Language, Focus Time Planning, quality of life improvements powered by on-device ML.",
      },
      {
        n: 3,
        status: "Planned" as const,
        title: "iOS & iPadOS App",
        description:
          "A native companion app for iPhone and iPad. Same SwiftUI foundation, designed for touch.",
      },
      {
        n: 4,
        status: "On the horizon" as const,
        title: "Google Workspace",
        description:
          "Gmail context for meetings, contact enrichment, and deeper Google ecosystem integration.",
      },
    ],
  },

  faq: {
    eyebrow: "Good to know",
    heading: { prefix: "Frequently", suffixGradient: "Asked Questions" },
    subtitle:
      "Short answers to the things people ask before joining the beta.",
    items: [
      {
        q: "What is hora Calendar?",
        a: "hora is a native macOS desktop app for Google Calendar. It connects directly to the Google Calendar API — no CalDAV, no web views, no Electron. Built entirely in SwiftUI for speed and a native feel.",
      },
      {
        q: "Who is hora for?",
        a: "Anyone on macOS who uses Google Calendar and wants a faster, keyboard-friendly experience. It's especially useful if you manage multiple Google accounts or prefer native apps over browser tabs.",
      },
      {
        q: "How is hora different from Fantastical or Notion Calendar?",
        a: "hora focuses exclusively on Google Calendar and uses the official API for direct access. There's no CalDAV translation layer, which means faster sync and full feature support like Google Meet link creation. It's also built purely in SwiftUI with no Electron or web technologies.",
      },
      {
        q: "Is hora free?",
        a: "hora will be a paid app. At launch there's a limited-time one-time purchase for $49.90, or a $29.99/year subscription — both include Family Sharing. The TestFlight beta is free to join.",
      },
      {
        q: "When does hora launch?",
        a: "hora is currently in pre-launch development. A public beta is planned — sign up for the newsletter above to get notified when it's available.",
      },
      {
        q: "Does hora work with Outlook or iCloud calendars?",
        a: "Not at the moment. hora is built specifically for Google Calendar. Support for other providers may come in the future, but the focus right now is on making the best possible Google Calendar experience on macOS.",
      },
    ],
  },

  blogPreview: {
    eyebrow: "From the build log",
    heading: { prefix: "From the", suffixGradient: "Blog" },
    subtitle:
      "Building hora in public. Updates, dev logs, and honest progress reports.",
    allPostsLink: { label: "View all posts →", href: "/blog/" },
  },
} as const;

export type Home = typeof home;
