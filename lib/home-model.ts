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
    trialNote: string;
    watchVideoLabel: string;
    watchVideoUrl: string;
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
  };
  macos: {
    title: string;
    description: string;
    features: ProductLandingFeature[];
  };
  featureGrid: {
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
  productLanding: ProductLandingContent;
};
