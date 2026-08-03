import "server-only";

import { cache } from "react";
import { defaultPricingPage } from "@/content/pricing";
import type { PricingPageContent, PricingPlan } from "@/lib/pricing-model";
import {
  getSanityFetchContext,
  type SanityRepositoryOptions,
} from "@/sanity/lib/fetch-context";
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
      description: text(plan.description, fallbackPlan.description),
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
    features: features(value.features, fallback.features),
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
      showMacAppStore: value.distribution?.showMacAppStore ?? fallback.distribution.showMacAppStore,
      macAppStoreLabel: text(
        value.distribution?.macAppStoreLabel,
        fallback.distribution.macAppStoreLabel,
      ),
      showSetapp: value.distribution?.showSetapp ?? fallback.distribution.showSetapp,
      setappLabel: text(value.distribution?.setappLabel, fallback.distribution.setappLabel),
      setappHref: text(value.distribution?.setappHref, fallback.distribution.setappHref),
    },
    faq: {
      title: text(value.faq?.title, fallback.faq.title),
      description: text(value.faq?.description, fallback.faq.description),
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
