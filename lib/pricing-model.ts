export type PricingPlan = {
  name: string;
  price: string;
  suffix: string;
  description: string;
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
  features: string[];
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
    showMacAppStore: boolean;
    macAppStoreLabel: string;
    showSetapp: boolean;
    setappLabel: string;
    setappHref: string;
  };
  faq: {
    title: string;
    description: string;
    items: Array<{ question: string; answer: string }>;
  };
  footer: string;
};
