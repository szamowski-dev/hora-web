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
      button: "Subscribe to newsletter",
      eyebrow: "Newsletter",
      headline: "Get the iOS/iPadOS beta note.",
      subheadline:
        "Subscribe for short launch updates and a heads-up when the iOS/iPadOS beta is ready.",
      subheadlineMobile: "Get launch updates and the iOS/iPadOS beta note.",
      watchDemoCtaLabel: "Watch the demo",
      socialProof: {
        count: 434,
        label: "Mac users already use hora",
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
        { src: "/assets/hora_brand_new.webm", type: "video/webm" },
        { src: "/assets/hora_brand_new.mp4", type: "video/mp4" },
      ],
      posterSrc: "/assets/redesign/updated/hora_hero.webp",
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
        href: "https://www.producthunt.com/products/hora-calendar?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-hora-calendar",
        src: "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1123558&theme=dark&t=1780039566967",
        alt: "hora Calendar - The Mac calendar Google never built | Product Hunt",
        width: 250,
        height: 54,
        className:
          "h-11 w-[8.75rem] max-w-none object-fill md:h-16 md:w-[12.5rem]",
      },
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
      "Google Calendar Shortcuts",
      "Focus on what's next",
    ],
    unmuteLabel: "Unmute sound",
    muteLabel: "Mute sound",
    enlargeLabel: "Enlarge",
    minimizeLabel: "Exit fullscreen",
  },

  userProof: {
    eyebrow: "Already on hora",
    heading: { prefix: "Already in", suffixGradient: "real Mac calendars" },
    description:
      "Mac users are already running hora in their daily Google Calendar workflows.",
    stat: {
      count: 434,
      value: "434+",
      label: "Mac users already use hora",
    },
    quotes: [
      {
        text: "Finally an app that does not ship a whole browser alongside it.",
        author: "Ivor",
        handle: "@ivorisnoob",
        href: "https://x.com/ivorisnoob",
        avatarSrc: "https://unavatar.io/x/ivorisnoob",
      },
      {
        text: "Discovered this calendar by accident, on the #mimestream reddit. Great piece of software for those who use Google Calendar either through workspace or ordinary GMail account! Thanks!",
        author: "sparekontoX",
        handle: "@sparekontoX",
        href: "https://x.com/sparekontoX/status/2063127382555308147",
        avatarSrc: "https://unavatar.io/x/sparekontoX",
      },
    ],
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
    eyebrow: "Newsletter",
    heading: "Want launch updates?",
    subtitle: "Subscribe for beta notes and iOS/iPadOS availability.",
    note: "Short updates. No spam.",
    cardHeadline: "Get the iOS/iPadOS beta note.",
    cardSubheadline:
      "Subscribe for short launch updates and a heads-up when the iOS/iPadOS beta is ready.",
    footnote:
      "If you've ever felt like your calendar is either too simple or too complex, you'll probably understand why hora exists.",
  },

  pricing: {
    heading: { prefix: "Simple pricing", suffixGradient: "rules forever." },
    appStoreLabel: "Download on the Mac App Store",
    appStoreHref: "https://apps.apple.com/app/apple-store/id6761409895",
    betaNoteLabel: "Get the iOS/iPad beta note",
    betaNoteHref: "/#newsletter",
    oneTime: "$49.90 one-time",
    yearly: "$29.99 / year",
    body:
      "Pick a one-time purchase or a lower annual plan. Both include Family Sharing.",
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
        status: "Shipped" as const,
        title: "Mac App Store Launch",
        description:
          "hora is live on the Mac App Store. One-time purchase or subscription, both with Family Sharing.",
      },
      {
        n: 2,
        status: "Up next" as const,
        title: "iOS & iPadOS TestFlight",
        description:
          "A native companion app for iPhone and iPad. Same SwiftUI foundation, designed for touch — public beta on TestFlight coming soon.",
      },
      {
        n: 3,
        status: "On the horizon" as const,
        title: "macOS, iOS & iPadOS 27 App Store Launch",
        description:
          "One hora across every Apple platform — a unified release for macOS 27, iOS 27, and iPadOS 27.",
      },
    ],
  },

  faq: {
    eyebrow: "Good to know",
    heading: { prefix: "Frequently", suffixGradient: "Asked Questions" },
    subtitle:
      "Short answers to the things people ask before downloading hora.",
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
        a: "hora is a paid app. There's a limited-time one-time purchase for $49.90, or a $29.99/year subscription — both include Family Sharing.",
      },
      {
        q: "When does hora launch?",
        a: "hora is on the Mac App Store now. The iOS/iPad app is coming next — subscribe to the newsletter above for a heads-up when the iOS/iPadOS beta is ready.",
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
