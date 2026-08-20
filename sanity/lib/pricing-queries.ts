import { defineQuery } from "next-sanity";
import {
  siteImageProjection,
  type SanitySiteImageValue,
} from "@/sanity/lib/home-queries";

export type SanityPricingPageDocument = {
  seo?: { title?: string; description?: string };
  hero?: { title?: string; description?: string };
  plans?: Array<{
    _key?: string;
    name?: string;
    price?: string;
    suffix?: string;
    priceDetail?: string;
    billingLabel?: string;
    savingsLabel?: string;
    featuredLabel?: string;
    description?: string;
    features?: string[];
    ctaLabel?: string;
    ctaHelper?: string;
    featured?: boolean;
  }>;
  includedNote?: string;
  accountNote?: string;
  currencyNote?: string;
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
    macAppStoreBadge?: SanitySiteImageValue;
    showSetapp?: boolean;
    setappTitle?: string;
    setappDescription?: string;
    setappLabel?: string;
    setappHref?: string;
  };
  faq?: {
    title?: string;
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
    plans[]{_key, name, price, suffix, priceDetail, billingLabel, savingsLabel, featuredLabel, description, features, ctaLabel, ctaHelper, featured},
    includedNote,
    accountNote,
    currencyNote,
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
      "macAppStoreBadge": macAppStoreBadge${siteImageProjection},
      showSetapp,
      setappTitle,
      setappDescription,
      setappLabel,
      setappHref
    },
    faq{title, items[]{_key, question, answer}},
    footer
  }
`);
