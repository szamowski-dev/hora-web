import type { ProductLandingFeature } from "@/lib/home-model";
import type { SanityTextBlock } from "@/sanity/lib/queries";

export type SiteImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataUrl?: string;
  caption?: string;
};

export type PageSeo = {
  metaTitle: string;
  metaDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: SiteImage;
  noIndex: boolean;
};

export type SplitHeading = {
  prefix: string;
  accent: string;
};

export type FeaturePageItem = {
  title: string;
  description: string;
  badges: string[];
};

export type FeatureShortcut = {
  keys: string[];
  label: string;
};

export type FeatureShortcutsCard = {
  title: string;
  description: string;
  shortcuts: FeatureShortcut[];
};

export type FeaturesPageSection = {
  label: string;
  items: FeaturePageItem[];
  screenshot?: SiteImage;
  wideShortcutsCard?: FeatureShortcutsCard;
};

export type FeaturesPageData = {
  id: "featuresPage";
  updatedAt: string;
  seo: PageSeo;
  hero: {
    title: SplitHeading;
    subtitle: string;
  };
  sections: FeaturesPageSection[];
};

export type SitePageAuthor = {
  name: string;
  role: string;
  bio: string;
  href: string;
  portrait: SiteImage;
};

export const ABOUT_CONTACT_KINDS = [
  "email",
  "website",
  "x",
  "bluesky",
  "mastodon",
  "github",
] as const;

export type AboutContactKind = (typeof ABOUT_CONTACT_KINDS)[number];

export type AboutPageContact = {
  label: string;
  kind: AboutContactKind;
  href: string;
};

export type AboutPageData = {
  id: "aboutPage";
  updatedAt: string;
  seo: PageSeo;
  hero: {
    title: SplitHeading;
    subtitle: string;
  };
  profile: {
    author: SitePageAuthor;
    summary: string;
  };
  stats: Array<{
    value: string;
    label: string;
    detail: string;
  }>;
  story: {
    eyebrow: string;
    quote: string;
    quoteDetail: string;
    body: SanityTextBlock[];
  };
  contacts: AboutPageContact[];
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
};

export const LEGAL_PAGE_KINDS = [
  "privacy",
  "terms",
  "refunds",
  "trust",
] as const;

export type LegalPageKind = (typeof LEGAL_PAGE_KINDS)[number];

export type LegalPageData = {
  id: "privacyPage" | "termsPage" | "refundsPage" | "trustPage";
  updatedAt: string;
  kind: LegalPageKind;
  title: SplitHeading;
  lastUpdated: string;
  seo: PageSeo;
  body: SanityTextBlock[];
};

export type GoogleCalendarMacPageData = {
  id: "googleCalendarMacPage";
  updatedAt: string;
  seo: PageSeo;
  hero: {
    title: string;
    description: string;
    primaryCtaLabel: string;
    macAppStoreLabel: string;
    trialNote: string;
    requirement: string;
  };
  answer: {
    heading: string;
    items: Array<{ eyebrow: string; body: string }>;
  };
  features: {
    title: string;
    description: string;
    items: ProductLandingFeature[];
  };
  trust: {
    title: string;
    description: string;
    linkLabel: string;
  };
  pricing: {
    title: string;
    description: string;
    linkLabel: string;
  };
  faq: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
  closing: {
    title: string;
    description: string;
    ctaLabel: string;
    guideLabel: string;
    guideHref: string;
  };
};
