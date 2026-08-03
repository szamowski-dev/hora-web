import "server-only";

import { cache } from "react";
import { stegaClean } from "next-sanity";
import { defaultProductLanding } from "@/content/home-landing";
import type {
  HomePageContent,
  ProductLandingContent,
  ProductLandingFeature,
  ProductLandingIcon,
  ProductLandingTone,
  SiteImage,
  ThemedSiteImage,
} from "@/lib/home-model";
import {
  getSanityFetchContext,
  type SanityRepositoryOptions,
} from "@/sanity/lib/fetch-context";
import { sanityImageDimensions, sanityImageUrl } from "@/sanity/lib/image";
import {
  HOME_PAGE_QUERY,
  type SanityHomePageDocument,
  type SanityProductLandingFeatureValue,
  type SanitySiteImageValue,
  type SanityThemedProductImageValue,
} from "@/sanity/lib/home-queries";

const SITE_REVALIDATE_SECONDS = 600;

const productLandingIcons = new Set<ProductLandingIcon>([
  "label",
  "event",
  "video-call",
  "contacts",
  "accounts",
  "search",
  "invitation",
  "menu-bar",
  "timer",
  "auto-awesome",
  "tasks",
  "focus-time",
  "availability",
  "widgets",
  "offline",
  "sync",
  "key",
  "storage",
  "speed",
  "notifications",
  "dock",
  "keyboard",
  "windows",
  "dark-mode",
  "apple-silicon",
  "view",
  "drag",
  "quick-add",
  "time-zone",
  "repeat",
  "location",
  "out-of-office",
]);

const productLandingTones = new Set<ProductLandingTone>([
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "cyan",
]);

function invalidHome(message: string): never {
  throw new Error(`Invalid published Sanity homePage: ${message}`);
}

function requiredString(value: string | undefined, field: string): string {
  const normalized = value?.trim();
  if (!normalized) invalidHome(`${field} is missing`);
  return normalized;
}

function requiredMachineString(value: string | undefined, field: string): string {
  return stegaClean(requiredString(value, field));
}

function optionalString(value: string | undefined): string | undefined {
  return value?.trim() || undefined;
}

function requiredUrl(value: string | undefined, field: string): string {
  const url = requiredMachineString(value, field);
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      invalidHome(`${field} must use http or https`);
    }
  } catch {
    invalidHome(`${field} is not a valid URL`);
  }
  return url;
}

function requiredPositiveInteger(value: number | undefined, field: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    invalidHome(`${field} must be a positive integer`);
  }
  return value;
}

function optionalPositiveInteger(
  value: number | null | undefined,
  field: string,
): number | undefined {
  return value == null ? undefined : requiredPositiveInteger(value, field);
}

function requiredArray<T>(value: T[] | undefined, field: string): T[] {
  if (!value?.length) invalidHome(`${field} must contain at least one item`);
  return value;
}

function mapImage(
  value: SanitySiteImageValue | undefined,
  field: string,
  fallbackAlt?: string,
): SiteImage {
  if (!value) invalidHome(`${field} is missing`);
  const dimensions = sanityImageDimensions(value);
  if (!dimensions.width || !dimensions.height) {
    invalidHome(`${field}.asset dimensions are missing`);
  }
  const src = sanityImageUrl(value, {
    width: Math.min(dimensions.width, 1920),
    quality: 82,
  });
  if (!src) invalidHome(`${field}.asset is missing`);

  return {
    src,
    alt: requiredString(value.alt || fallbackAlt, `${field}.alt`),
    width: dimensions.width,
    height: dimensions.height,
    blurDataURL: value.asset?.metadata?.lqip,
  };
}

function hasImageAsset(
  value: SanitySiteImageValue | null | undefined,
): value is SanitySiteImageValue {
  return Boolean(value?.asset?._id || value?.asset?.url);
}

function landingString(value: string | undefined, fallback: string): string {
  return optionalString(value) ?? fallback;
}

function mapLandingFeatures(
  value: SanityProductLandingFeatureValue[] | undefined,
  fallback: ProductLandingFeature[],
  field: string,
): ProductLandingFeature[] {
  if (!value?.length) return fallback;

  return value.map((feature, index) => {
    const icon = requiredMachineString(feature.icon, `${field}[${index}].icon`);
    const tone = requiredMachineString(feature.tone, `${field}[${index}].tone`);
    if (!productLandingIcons.has(icon as ProductLandingIcon)) {
      invalidHome(`${field}[${index}].icon is unsupported: ${icon}`);
    }
    if (!productLandingTones.has(tone as ProductLandingTone)) {
      invalidHome(`${field}[${index}].tone is unsupported: ${tone}`);
    }
    return {
      icon: icon as ProductLandingIcon,
      tone: tone as ProductLandingTone,
      title: requiredString(feature.title, `${field}[${index}].title`),
      description: requiredString(feature.description, `${field}[${index}].description`),
    };
  });
}

function mapLandingThemedImage(
  value: SanityThemedProductImageValue | undefined,
  fallback: ThemedSiteImage,
  field: string,
): ThemedSiteImage {
  if (!hasImageAsset(value?.light) || !hasImageAsset(value?.dark)) {
    return fallback;
  }
  return {
    light: mapImage(value.light, `${field}.light`),
    dark: mapImage(value.dark, `${field}.dark`),
  };
}

function mapProductLanding(
  value: SanityHomePageDocument["productLanding"],
): ProductLandingContent {
  const fallback = defaultProductLanding;
  return {
    hero: {
      title: landingString(value?.hero?.title, fallback.hero.title),
      description: landingString(value?.hero?.description, fallback.hero.description),
      primaryCtaLabel: landingString(
        value?.hero?.primaryCtaLabel,
        fallback.hero.primaryCtaLabel,
      ),
      macAppStoreLabel: landingString(
        value?.hero?.macAppStoreLabel,
        fallback.hero.macAppStoreLabel,
      ),
      watchVideoLabel: landingString(
        value?.hero?.watchVideoLabel,
        fallback.hero.watchVideoLabel,
      ),
      showPrimaryCta: value?.hero?.showPrimaryCta ?? fallback.hero.showPrimaryCta,
      showTerminalPrompt:
        value?.hero?.showTerminalPrompt ?? fallback.hero.showTerminalPrompt,
      homebrewCommand: landingString(
        value?.hero?.homebrewCommand,
        fallback.hero.homebrewCommand,
      ),
      requirement: landingString(value?.hero?.requirement, fallback.hero.requirement),
      copyLabel: landingString(value?.hero?.copyLabel, fallback.hero.copyLabel),
      copiedLabel: landingString(value?.hero?.copiedLabel, fallback.hero.copiedLabel),
    },
    media: {
      hero: mapLandingThemedImage(value?.media?.hero, fallback.media.hero, "productLanding.media.hero"),
      workflow: mapLandingThemedImage(
        value?.media?.workflow,
        fallback.media.workflow,
        "productLanding.media.workflow",
      ),
      googleCalendarCards: fallback.media.googleCalendarCards.map((image, index) =>
        mapLandingThemedImage(
          value?.media?.googleCalendarCards?.[index],
          image,
          `productLanding.media.googleCalendarCards[${index}]`,
        ),
      ),
    },
    api: {
      title: landingString(value?.api?.title, fallback.api.title),
      description: landingString(value?.api?.description, fallback.api.description),
    },
    googleCalendar: {
      title: landingString(value?.googleCalendar?.title, fallback.googleCalendar.title),
      description: landingString(
        value?.googleCalendar?.description,
        fallback.googleCalendar.description,
      ),
      primaryFeatures: mapLandingFeatures(
        value?.googleCalendar?.primaryFeatures,
        fallback.googleCalendar.primaryFeatures,
        "productLanding.googleCalendar.primaryFeatures",
      ),
      secondaryFeatures: mapLandingFeatures(
        value?.googleCalendar?.secondaryFeatures,
        fallback.googleCalendar.secondaryFeatures,
        "productLanding.googleCalendar.secondaryFeatures",
      ),
    },
    hora: {
      title: landingString(value?.hora?.title, fallback.hora.title),
      description: landingString(value?.hora?.description, fallback.hora.description),
      features: mapLandingFeatures(value?.hora?.features, fallback.hora.features, "productLanding.hora.features"),
    },
    privacy: {
      title: landingString(value?.privacy?.title, fallback.privacy.title),
      description: landingString(value?.privacy?.description, fallback.privacy.description),
    },
    macos: {
      title: landingString(value?.macos?.title, fallback.macos.title),
      description: landingString(value?.macos?.description, fallback.macos.description),
      features: mapLandingFeatures(value?.macos?.features, fallback.macos.features, "productLanding.macos.features"),
    },
    featureGrid: {
      features: mapLandingFeatures(
        value?.featureGrid?.features,
        fallback.featureGrid.features,
        "productLanding.featureGrid.features",
      ),
    },
    newsletter: {
      title: landingString(value?.newsletter?.title, fallback.newsletter.title),
      description: landingString(value?.newsletter?.description, fallback.newsletter.description),
      placeholder: landingString(value?.newsletter?.placeholder, fallback.newsletter.placeholder),
      buttonLabel: landingString(value?.newsletter?.buttonLabel, fallback.newsletter.buttonLabel),
    },
  };
}

function mapHomePage(document: SanityHomePageDocument | null): HomePageContent {
  if (!document) invalidHome("document is missing");
  if (requiredMachineString(document._id, "_id").replace(/^drafts\./, "") !== "homePage") {
    invalidHome("document has an unexpected ID");
  }
  const featuredOn = document.featuredOn;
  if (!featuredOn) invalidHome("featuredOn is missing");
  const seoTitle = requiredString(document.seo?.metaTitle, "seo.metaTitle");

  return {
    updatedAt: requiredMachineString(document._updatedAt, "_updatedAt"),
    seo: {
      title: seoTitle,
      description: requiredString(document.seo?.metaDescription, "seo.metaDescription"),
      ogTitle: optionalString(document.seo?.ogTitle),
      ogDescription: optionalString(document.seo?.ogDescription),
      ogImage: hasImageAsset(document.seo?.ogImage)
        ? mapImage(document.seo?.ogImage, "seo.ogImage", seoTitle)
        : undefined,
      noIndex: document.seo?.noIndex ?? false,
    },
    featuredOn: {
      label: requiredString(featuredOn.label, "featuredOn.label"),
      badges: requiredArray(featuredOn.badges, "featuredOn.badges").map((badge, index) => {
        const field = `featuredOn.badges[${index}]`;
        const alt = requiredString(badge.alt, `${field}.alt`);
        const uploadedImage = hasImageAsset(badge.image)
          ? mapImage(badge.image, `${field}.image`, alt)
          : undefined;
        const source = uploadedImage
          ? undefined
          : badge.src?.startsWith("/")
            ? requiredMachineString(badge.src, `${field}.src`)
            : requiredUrl(badge.src, `${field}.src`);
        return {
          name: requiredString(badge.name, `${field}.name`),
          href: requiredUrl(badge.href, `${field}.href`),
          src: uploadedImage?.src ?? source!,
          alt,
          width: uploadedImage?.width ?? requiredPositiveInteger(badge.width, `${field}.width`),
          height: uploadedImage?.height ?? requiredPositiveInteger(badge.height, `${field}.height`),
          displayWidth: optionalPositiveInteger(badge.displayWidth, `${field}.displayWidth`),
          displayHeight: optionalPositiveInteger(badge.displayHeight, `${field}.displayHeight`),
          variant:
            requiredMachineString(badge.variant, `${field}.variant`) === "productHunt"
              ? "productHunt"
              : "standard",
        };
      }),
    },
    productLanding: mapProductLanding(document.productLanding),
  };
}

const getHomePageCached = cache(
  async (
    perspective: NonNullable<SanityRepositoryOptions["perspective"]>,
    stega: boolean,
  ): Promise<HomePageContent> => {
    const context = await getSanityFetchContext({ perspective, stega });
    const document = await context.client.fetch<SanityHomePageDocument | null>(
      HOME_PAGE_QUERY,
      {},
      context.draft
        ? { cache: "no-store" }
        : { next: { revalidate: SITE_REVALIDATE_SECONDS, tags: ["site-page:home"] } },
    );
    return mapHomePage(document);
  },
);

export function getHomePage(
  options: SanityRepositoryOptions = {},
): Promise<HomePageContent> {
  return getHomePageCached(
    options.perspective ?? "auto",
    options.stega ?? true,
  );
}
