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
    featured?: boolean;
  }>;
  features?: string[];
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
    showMacAppStore?: boolean;
    macAppStoreLabel?: string;
    showSetapp?: boolean;
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
    plans[]{_key, name, price, suffix, description, featured},
    features,
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
      showMacAppStore,
      macAppStoreLabel,
      showSetapp,
      setappLabel,
      setappHref
    },
    faq{title, description, items[]{_key, question, answer}},
    footer
  }
`);
