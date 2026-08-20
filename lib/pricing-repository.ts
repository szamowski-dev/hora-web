import "server-only";

import { cache } from "react";
import { defaultPricingPage } from "@/content/pricing";
import type { SiteImage } from "@/lib/home-model";
import type { PricingPageContent, PricingPlan } from "@/lib/pricing-model";
import {
  getSanityFetchContext,
  type SanityRepositoryOptions,
} from "@/sanity/lib/fetch-context";
import { sanityImageDimensions, sanityImageUrl } from "@/sanity/lib/image";
import type { SanitySiteImageValue } from "@/sanity/lib/home-queries";
import {
  PRICING_PAGE_QUERY,
  type SanityPricingPageDocument,
} from "@/sanity/lib/pricing-queries";

const SITE_REVALIDATE_SECONDS = 600;

function optionalString(value: string | undefined) {
  return value?.trim() || undefined;
}

function text(value: string | undefined, fallback: string) {
  return optionalString(value) ?? fallback;
}

function hasImageAsset(
  value: SanitySiteImageValue | undefined,
): value is SanitySiteImageValue {
  return Boolean(value?.asset?._id || value?.asset?.url);
}

function image(
  value: SanitySiteImageValue | undefined,
  fallback: SiteImage,
): SiteImage {
  if (!hasImageAsset(value)) return fallback;
  const dimensions = sanityImageDimensions(value);
  if (!dimensions.width || !dimensions.height) return fallback;
  const src = sanityImageUrl(value, {
    width: Math.min(dimensions.width, 512),
    quality: 90,
  });
  if (!src) return fallback;
  return {
    src,
    alt: text(value.alt, fallback.alt),
    width: dimensions.width,
    height: dimensions.height,
    blurDataURL: value.asset?.metadata?.lqip,
  };
}

function plans(
  value: SanityPricingPageDocument["plans"],
  fallback: PricingPlan[],
) {
  if (!value?.length) return fallback;

  return value.map((plan, index) => {
    const fallbackPlan = fallback[index] ?? fallback[0];
    return {
      name: text(plan.name, fallbackPlan.name),
      price: text(plan.price, fallbackPlan.price),
      suffix: text(plan.suffix, fallbackPlan.suffix),
      priceDetail: text(plan.priceDetail, fallbackPlan.priceDetail),
      billingLabel: text(plan.billingLabel, plan.description ?? fallbackPlan.billingLabel),
      savingsLabel: text(plan.savingsLabel, fallbackPlan.savingsLabel),
      featuredLabel: text(plan.featuredLabel, fallbackPlan.featuredLabel),
      description: text(plan.description, fallbackPlan.description),
      features: features(plan.features, fallbackPlan.features),
      ctaLabel: text(plan.ctaLabel, fallbackPlan.ctaLabel),
      ctaHelper: text(plan.ctaHelper, fallbackPlan.ctaHelper),
      featured: plan.featured ?? fallbackPlan.featured,
    };
  });
}

function features(value: string[] | undefined, fallback: string[]) {
  const result = value
    ?.map((item) => optionalString(item))
    .filter((item): item is string => Boolean(item));
  return result?.length ? result : fallback;
}

function faq(
  value: NonNullable<SanityPricingPageDocument["faq"]>["items"],
  fallback: PricingPageContent["faq"]["items"],
) {
  const result = value
    ?.map((item, index) => {
      const fallbackItem = fallback[index];
      const question = optionalString(item.question) ?? fallbackItem?.question;
      const answer = optionalString(item.answer) ?? fallbackItem?.answer;
      if (!question || !answer) return undefined;
      return {
        question,
        answer,
      };
    })
    .filter(
      (item): item is PricingPageContent["faq"]["items"][number] =>
        Boolean(item),
    );
  return result?.length ? result : fallback;
}

function mapPricingPage(
  document: SanityPricingPageDocument | null,
): PricingPageContent {
  const value = document ?? {};
  const fallback = defaultPricingPage;

  return {
    seo: {
      title: text(value.seo?.title, fallback.seo.title),
      description: text(value.seo?.description, fallback.seo.description),
    },
    hero: {
      title: text(value.hero?.title, fallback.hero.title),
      description: text(value.hero?.description, fallback.hero.description),
    },
    plans: plans(value.plans, fallback.plans),
    includedNote: text(value.includedNote, fallback.includedNote),
    accountNote: text(value.accountNote, fallback.accountNote),
    currencyNote: text(value.currencyNote, fallback.currencyNote),
    direct: {
      showDownload: value.direct?.showDownload === true,
      downloadLabel: text(value.direct?.downloadLabel, fallback.direct.downloadLabel),
      showTerminalPrompt: value.direct?.showTerminalPrompt === true,
      terminalCommand: text(value.direct?.terminalCommand, fallback.direct.terminalCommand),
      terminalRequirement: text(
        value.direct?.terminalRequirement,
        fallback.direct.terminalRequirement,
      ),
      copyLabel: text(value.direct?.copyLabel, fallback.direct.copyLabel),
      copiedLabel: text(value.direct?.copiedLabel, fallback.direct.copiedLabel),
    },
    distribution: {
      title: text(value.distribution?.title, fallback.distribution.title),
      description: text(
        value.distribution?.description,
        fallback.distribution.description,
      ),
      showMacAppStore: value.distribution?.showMacAppStore ?? fallback.distribution.showMacAppStore,
      macAppStoreTitle: text(
        value.distribution?.macAppStoreTitle,
        fallback.distribution.macAppStoreTitle,
      ),
      macAppStoreDescription: text(
        value.distribution?.macAppStoreDescription,
        fallback.distribution.macAppStoreDescription,
      ),
      macAppStoreLabel: text(
        value.distribution?.macAppStoreLabel,
        fallback.distribution.macAppStoreLabel,
      ),
      macAppStoreBadge: image(
        value.distribution?.macAppStoreBadge,
        fallback.distribution.macAppStoreBadge,
      ),
      showSetapp: value.distribution?.showSetapp ?? fallback.distribution.showSetapp,
      setappTitle: text(
        value.distribution?.setappTitle,
        fallback.distribution.setappTitle,
      ),
      setappDescription: text(
        value.distribution?.setappDescription,
        fallback.distribution.setappDescription,
      ),
      setappLabel: text(value.distribution?.setappLabel, fallback.distribution.setappLabel),
      setappHref: text(value.distribution?.setappHref, fallback.distribution.setappHref),
    },
    faq: {
      title: text(value.faq?.title, fallback.faq.title),
      items: faq(value.faq?.items, fallback.faq.items),
    },
    footer: text(value.footer, fallback.footer),
  };
}

const getPricingPageCached = cache(
  async (
    perspective: NonNullable<SanityRepositoryOptions["perspective"]>,
    stega: boolean,
  ): Promise<PricingPageContent> => {
    const context = await getSanityFetchContext({ perspective, stega });
    const document = context.draft
      ? await context.client.fetch<SanityPricingPageDocument | null>(
          PRICING_PAGE_QUERY,
          {},
          { cache: "no-store" },
        )
      : await context.client.fetch<SanityPricingPageDocument | null>(
          PRICING_PAGE_QUERY,
          {},
          {
            next: {
              revalidate: SITE_REVALIDATE_SECONDS,
              tags: ["site-page:pricing"],
            },
          },
        );

    return mapPricingPage(document);
  },
);

export function getPricingPage(
  options: SanityRepositoryOptions = {},
): Promise<PricingPageContent> {
  return getPricingPageCached(
    options.perspective ?? "auto",
    options.stega ?? true,
  );
}
