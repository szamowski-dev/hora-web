import { defineQuery } from "next-sanity";

export type SanityBlogCtaSlotValue = {
  enabled?: boolean;
  heading?: string;
  body?: string;
};

export type SanityBlogCtaSettingsDocument = {
  _id?: string;
  eyebrow?: string;
  ctaLabel?: string;
  macAppStoreLabel?: string;
  trialNote?: string;
  requirement?: string;
  showHomebrew?: boolean;
  homebrewCommand?: string;
  copyLabel?: string;
  copiedLabel?: string;
  aside?: SanityBlogCtaSlotValue;
  rail?: SanityBlogCtaSlotValue;
  band?: SanityBlogCtaSlotValue;
};

export const BLOG_CTA_SETTINGS_QUERY = defineQuery(`
  *[
    _type == "blogCtaSettings" &&
    (_id == "blogCtaSettings" || _id == "drafts.blogCtaSettings")
  ] | order(_updatedAt desc)[0] {
    _id,
    eyebrow,
    ctaLabel,
    macAppStoreLabel,
    trialNote,
    requirement,
    showHomebrew,
    homebrewCommand,
    copyLabel,
    copiedLabel,
    aside { enabled, heading, body },
    rail { enabled, heading, body },
    band { enabled, heading, body }
  }
`);
