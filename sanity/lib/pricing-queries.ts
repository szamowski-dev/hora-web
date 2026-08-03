import { defineQuery } from "next-sanity";

export type SanityPricingPageDocument = {
  seo?: { title?: string; description?: string };
  hero?: { title?: string; description?: string };
  plans?: Array<{
    _key?: string;
    name?: string;
    price?: string;
    suffix?: string;
    description?: string;
    features?: string[];
    ctaLabel?: string;
    featured?: boolean;
  }>;
  direct?: {
    showDownload?: boolean;
    downloadLabel?: string;
    showTerminalPrompt?: boolean;
    terminalCommand?: string;
    terminalRequirement?: string;
    copyLabel?: string;
    copiedLabel?: string;
  };
  distribution?: {
    title?: string;
    description?: string;
    showMacAppStore?: boolean;
    macAppStoreTitle?: string;
    macAppStoreDescription?: string;
    macAppStoreLabel?: string;
    showSetapp?: boolean;
    setappTitle?: string;
    setappDescription?: string;
    setappLabel?: string;
    setappHref?: string;
  };
  faq?: {
    title?: string;
    description?: string;
    items?: Array<{ _key?: string; question?: string; answer?: string }>;
  };
  footer?: string;
};

export const PRICING_PAGE_QUERY = defineQuery(`
  *[
    _type == "pricingPage" &&
    (_id == "pricingPage" || _id == "drafts.pricingPage")
  ] | order(_updatedAt desc)[0]{
    seo{title, description},
    hero{title, description},
    plans[]{_key, name, price, suffix, description, features, ctaLabel, featured},
    direct{
      showDownload,
      downloadLabel,
      showTerminalPrompt,
      terminalCommand,
      terminalRequirement,
      copyLabel,
      copiedLabel
    },
    distribution{
      title,
      description,
      showMacAppStore,
      macAppStoreTitle,
      macAppStoreDescription,
      macAppStoreLabel,
      showSetapp,
      setappTitle,
      setappDescription,
      setappLabel,
      setappHref
    },
    faq{title, description, items[]{_key, question, answer}},
    footer
  }
`);
