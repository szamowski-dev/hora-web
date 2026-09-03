import { stegaClean } from "next-sanity";
import { defaultBlogCta } from "@/content/blog-cta";
import type { BlogCtaContent, BlogCtaSlot } from "@/lib/blog-cta-model";
import type {
  SanityBlogCtaSettingsDocument,
  SanityBlogCtaSlotValue,
} from "@/sanity/lib/blog-cta-query";

function text(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

/** Values the browser consumes verbatim must not carry stega markers. */
function machineText(value: string | undefined, fallback: string) {
  return stegaClean(text(value, fallback));
}

function slot(
  value: SanityBlogCtaSlotValue | undefined,
  fallback: BlogCtaSlot,
): BlogCtaSlot {
  return {
    enabled: value?.enabled ?? fallback.enabled,
    heading: text(value?.heading, fallback.heading),
    body: text(value?.body, fallback.body),
  };
}

export function mapBlogCtaSettings(
  document: SanityBlogCtaSettingsDocument | null,
): BlogCtaContent {
  const value = document ?? {};
  const fallback = defaultBlogCta;

  return {
    eyebrow: text(value.eyebrow, fallback.eyebrow),
    ctaLabel: text(value.ctaLabel, fallback.ctaLabel),
    macAppStoreLabel: text(value.macAppStoreLabel, fallback.macAppStoreLabel),
    trialNote: text(value.trialNote, fallback.trialNote),
    requirement: text(value.requirement, fallback.requirement),
    showHomebrew: value.showHomebrew ?? fallback.showHomebrew,
    homebrewCommand: machineText(
      value.homebrewCommand,
      fallback.homebrewCommand,
    ),
    copyLabel: text(value.copyLabel, fallback.copyLabel),
    copiedLabel: text(value.copiedLabel, fallback.copiedLabel),
    aside: slot(value.aside, fallback.aside),
    rail: slot(value.rail, fallback.rail),
    band: slot(value.band, fallback.band),
  };
}
