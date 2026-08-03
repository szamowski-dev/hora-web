export type PricingPlan = {
  name: string;
  price: string;
  suffix: string;
  description: string;
  features: string[];
  ctaLabel: string;
  featured: boolean;
};

export type PricingPageContent = {
  seo: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    description: string;
  };
  plans: PricingPlan[];
  direct: {
    showDownload: boolean;
    downloadLabel: string;
    showTerminalPrompt: boolean;
    terminalCommand: string;
    terminalRequirement: string;
    copyLabel: string;
    copiedLabel: string;
  };
  distribution: {
    title: string;
    description: string;
    showMacAppStore: boolean;
    macAppStoreTitle: string;
    macAppStoreDescription: string;
    macAppStoreLabel: string;
    macAppStoreBadge: SiteImage;
    showSetapp: boolean;
    setappTitle: string;
    setappDescription: string;
    setappLabel: string;
    setappHref: string;
  };
  faq: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
  footer: string;
};
import type { SiteImage } from "@/lib/home-model";
