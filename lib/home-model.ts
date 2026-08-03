export type SiteImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
};

export type SiteVideoSource = {
  src: string;
  type: "video/webm" | "video/mp4";
};

export type SiteVideo = {
  ariaLabel: string;
  sources: SiteVideoSource[];
  poster?: SiteImage;
};

export type ThemedSiteImage = {
  light: SiteImage;
  dark: SiteImage;
};

export type HomeFeatureIcon =
  | "app-window"
  | "calendar"
  | "bell"
  | "sync"
  | "check"
  | "gauge"
  | "shield";

export type HomeIntegrationProvider =
  | "google-calendar"
  | "zoom"
  | "microsoft-teams"
  | "apple-intelligence";

export type HomeTestimonialPlatform = "x" | "reddit" | "discord";

export type HomeRoadmapStatus =
  | "Shipped"
  | "Open Beta Tests"
  | "Up next"
  | "Planned"
  | "On the horizon";

export type ProductLandingIcon =
  | "label"
  | "event"
  | "video-call"
  | "contacts"
  | "accounts"
  | "search"
  | "invitation"
  | "menu-bar"
  | "timer"
  | "auto-awesome"
  | "tasks"
  | "focus-time"
  | "availability"
  | "widgets"
  | "offline"
  | "sync"
  | "key"
  | "storage"
  | "speed"
  | "notifications"
  | "dock"
  | "keyboard"
  | "windows"
  | "dark-mode"
  | "apple-silicon"
  | "view"
  | "drag"
  | "quick-add"
  | "time-zone"
  | "repeat"
  | "location"
  | "out-of-office";

export type ProductLandingTone =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "cyan";

export type ProductLandingFeature = {
  icon: ProductLandingIcon;
  tone: ProductLandingTone;
  title: string;
  description: string;
};

export type ProductLandingContent = {
  hero: {
    title: string;
    description: string;
    primaryCtaLabel: string;
    macAppStoreLabel: string;
    watchVideoLabel: string;
    showPrimaryCta: boolean;
    showTerminalPrompt: boolean;
    homebrewCommand: string;
    requirement: string;
    copyLabel: string;
    copiedLabel: string;
  };
  media: {
    hero: ThemedSiteImage;
    workflow: ThemedSiteImage;
    googleCalendarCards: ThemedSiteImage[];
  };
  api: {
    title: string;
    description: string;
  };
  googleCalendar: {
    title: string;
    description: string;
    primaryFeatures: ProductLandingFeature[];
    secondaryFeatures: ProductLandingFeature[];
  };
  hora: {
    title: string;
    description: string;
    features: ProductLandingFeature[];
  };
  privacy: {
    title: string;
    description: string;
    features: ProductLandingFeature[];
  };
  macos: {
    title: string;
    description: string;
    features: ProductLandingFeature[];
  };
  featureGrid: {
    title: string;
    description: string;
    features: ProductLandingFeature[];
  };
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    buttonLabel: string;
  };
};

export type HomePageContent = {
  updatedAt: string;
  seo: {
    title: string;
    description: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: SiteImage;
    noIndex: boolean;
  };
  hero: {
    titlePrefix: string;
    titleAccent: string;
    description: string;
    screenshot: SiteImage;
    watchDemoLabel: string;
    socialProof: {
      label: string;
      fallbackCount: number;
      avatars: Array<{ src: string; alt: string }>;
    };
  };
  featuredOn: {
    label: string;
    badges: Array<{
      name: string;
      href: string;
      src: string;
      alt: string;
      width: number;
      height: number;
      displayWidth?: number;
      displayHeight?: number;
      variant: "productHunt" | "standard";
    }>;
  };
  showcase: {
    eyebrow: string;
    headingPrefix: string;
    headingAccent: string;
    description: string;
    mainVideo: SiteVideo;
    firstSlideTitle: string;
    firstSlideDescription: string;
    actions: Array<{
      number: number;
      title: string;
      description: string;
      video: SiteVideo;
    }>;
  };
  featureOverview: {
    eyebrow: string;
    titlePrefix: string;
    titleAccent: string;
    allFeaturesLabel: string;
    items: Array<{
      icon: HomeFeatureIcon;
      title: string;
      description: string;
    }>;
  };
  integrations: {
    eyebrow: string;
    titlePrefix: string;
    titleAccent: string;
    items: Array<{
      provider: HomeIntegrationProvider;
      name: string;
      description: string;
    }>;
    founderNote: {
      lines: string[];
      author: {
        name: string;
        role: string;
        portrait: SiteImage;
      };
    };
  };
  socialProof: {
    eyebrow: string;
    titlePrefix: string;
    titleAccent: string;
    description: string;
    testimonials: Array<{
      id: string;
      quote: string;
      author: string;
      handle: string;
      href: string;
      avatarUrl: string;
      platform: HomeTestimonialPlatform;
    }>;
  };
  roadmap: {
    eyebrow: string;
    titlePrefix: string;
    titleAccent: string;
    subtitle: string;
    items: Array<{
      number: number;
      status: HomeRoadmapStatus;
      title: string;
      description: string;
    }>;
  };
  faq: {
    eyebrow: string;
    titlePrefix: string;
    titleAccent: string;
    subtitle: string;
    items: Array<{ question: string; answer: string }>;
    footerTitle: string;
    footerDescription: string;
    footerLinkLabel: string;
  };
  productLanding: ProductLandingContent;
};
