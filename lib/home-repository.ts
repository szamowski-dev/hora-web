import "server-only";

import { cache } from "react";
import { stegaClean } from "next-sanity";
import { defaultProductLanding } from "@/content/home-landing";
import type {
  HomeFeatureIcon,
  HomeIntegrationProvider,
  HomePageContent,
  HomeRoadmapStatus,
  HomeTestimonialPlatform,
  ProductLandingContent,
  ProductLandingFeature,
  ProductLandingIcon,
  ProductLandingTone,
  SiteImage,
  SiteVideo,
} from "@/lib/home-model";
import {
  getSanityFetchContext,
  type SanityRepositoryOptions,
} from "@/sanity/lib/fetch-context";
import {
  sanityImageDimensions,
  sanityImageUrl,
} from "@/sanity/lib/image";
import {
  HOME_PAGE_QUERY,
  type SanityHomePageDocument,
  type SanityProductLandingFeatureValue,
  type SanitySiteImageValue,
} from "@/sanity/lib/home-queries";

const SITE_REVALIDATE_SECONDS = 600;

const featureIcons = new Set<HomeFeatureIcon>([
  "app-window",
  "calendar",
  "bell",
  "sync",
  "check",
  "gauge",
  "shield",
]);

const integrationProviders = new Set<HomeIntegrationProvider>([
  "google-calendar",
  "zoom",
  "microsoft-teams",
  "apple-intelligence",
]);

const testimonialPlatforms = new Set<HomeTestimonialPlatform>([
  "x",
  "reddit",
  "discord",
]);

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

const roadmapStatuses: Record<string, HomeRoadmapStatus> = {
  Shipped: "Shipped",
  shipped: "Shipped",
  "Open Beta Tests": "Open Beta Tests",
  "open-beta-tests": "Open Beta Tests",
  "Up next": "Up next",
  "up-next": "Up next",
  Planned: "Planned",
  planned: "Planned",
  "On the horizon": "On the horizon",
  "on-the-horizon": "On the horizon",
};

function invalidHome(message: string): never {
  throw new Error(`Invalid published Sanity homePage: ${message}`);
}

function requiredString(value: string | undefined, field: string): string {
  const normalized = value?.trim();
  if (!normalized) invalidHome(`${field} is missing`);
  return normalized;
}

function requiredMachineString(
  value: string | undefined,
  field: string,
): string {
  return stegaClean(requiredString(value, field));
}

function optionalString(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
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

function requiredPositiveInteger(
  value: number | undefined,
  field: string,
): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    invalidHome(`${field} must be a positive integer`);
  }
  return value;
}

function optionalPositiveInteger(
  value: number | null | undefined,
  field: string,
): number | undefined {
  if (value == null) return undefined;
  return requiredPositiveInteger(value, field);
}

function requiredArray<T>(
  value: T[] | undefined,
  field: string,
  minimum = 1,
): T[] {
  if (!value || value.length < minimum) {
    invalidHome(`${field} must contain at least ${minimum} item(s)`);
  }
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

function mapVideo(
  value:
    | {
        webmUrl?: string;
        mp4Url?: string;
        poster?: SanitySiteImageValue;
        accessibilityLabel?: string;
      }
    | undefined,
  field: string,
  requirePoster: boolean,
): SiteVideo {
  if (!value) invalidHome(`${field} is missing`);
  const sources: SiteVideo["sources"] = [
    value.webmUrl
      ? {
          src: requiredUrl(value.webmUrl, `${field}.webm`),
          type: "video/webm" as const,
        }
      : undefined,
    value.mp4Url
      ? {
          src: requiredUrl(value.mp4Url, `${field}.mp4`),
          type: "video/mp4" as const,
        }
      : undefined,
  ].filter((source): source is SiteVideo["sources"][number] => Boolean(source));

  if (!sources.some((source) => source.type === "video/webm")) {
    invalidHome(`${field}.webm is missing`);
  }

  if (requirePoster && !value.poster) invalidHome(`${field}.poster is missing`);

  return {
    ariaLabel: requiredString(
      value.accessibilityLabel,
      `${field}.accessibilityLabel`,
    ),
    sources,
    poster: value.poster ? mapImage(value.poster, `${field}.poster`) : undefined,
  };
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
    const icon = requiredMachineString(
      feature.icon,
      `${field}[${index}].icon`,
    );
    const tone = requiredMachineString(
      feature.tone,
      `${field}[${index}].tone`,
    );

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
      description: requiredString(
        feature.description,
        `${field}[${index}].description`,
      ),
    };
  });
}

function mapProductLanding(
  value: SanityHomePageDocument["productLanding"],
): ProductLandingContent {
  const fallback = defaultProductLanding;

  return {
    hero: {
      title: landingString(value?.hero?.title, fallback.hero.title),
      description: landingString(
        value?.hero?.description,
        fallback.hero.description,
      ),
      primaryCtaLabel: landingString(
        value?.hero?.primaryCtaLabel,
        fallback.hero.primaryCtaLabel,
      ),
      watchVideoLabel: landingString(
        value?.hero?.watchVideoLabel,
        fallback.hero.watchVideoLabel,
      ),
      requirement: landingString(
        value?.hero?.requirement,
        fallback.hero.requirement,
      ),
    },
    api: {
      title: landingString(value?.api?.title, fallback.api.title),
      description: landingString(
        value?.api?.description,
        fallback.api.description,
      ),
    },
    googleCalendar: {
      title: landingString(
        value?.googleCalendar?.title,
        fallback.googleCalendar.title,
      ),
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
      description: landingString(
        value?.hora?.description,
        fallback.hora.description,
      ),
      features: mapLandingFeatures(
        value?.hora?.features,
        fallback.hora.features,
        "productLanding.hora.features",
      ),
    },
    privacy: {
      title: landingString(value?.privacy?.title, fallback.privacy.title),
      description: landingString(
        value?.privacy?.description,
        fallback.privacy.description,
      ),
      features: mapLandingFeatures(
        value?.privacy?.features,
        fallback.privacy.features,
        "productLanding.privacy.features",
      ),
    },
    macos: {
      title: landingString(value?.macos?.title, fallback.macos.title),
      description: landingString(
        value?.macos?.description,
        fallback.macos.description,
      ),
      features: mapLandingFeatures(
        value?.macos?.features,
        fallback.macos.features,
        "productLanding.macos.features",
      ),
    },
    featureGrid: {
      title: landingString(
        value?.featureGrid?.title,
        fallback.featureGrid.title,
      ),
      description: landingString(
        value?.featureGrid?.description,
        fallback.featureGrid.description,
      ),
      features: mapLandingFeatures(
        value?.featureGrid?.features,
        fallback.featureGrid.features,
        "productLanding.featureGrid.features",
      ),
    },
    newsletter: {
      title: landingString(
        value?.newsletter?.title,
        fallback.newsletter.title,
      ),
      description: landingString(
        value?.newsletter?.description,
        fallback.newsletter.description,
      ),
      placeholder: landingString(
        value?.newsletter?.placeholder,
        fallback.newsletter.placeholder,
      ),
      buttonLabel: landingString(
        value?.newsletter?.buttonLabel,
        fallback.newsletter.buttonLabel,
      ),
    },
  };
}

function mapHomePage(document: SanityHomePageDocument | null): HomePageContent {
  if (!document) invalidHome("document is missing");
  if (
    requiredMachineString(document._id, "_id").replace(/^drafts\./, "") !==
    "homePage"
  ) {
    invalidHome("document has an unexpected ID");
  }

  const hero = document.hero;
  if (!hero) invalidHome("hero is missing");
  const socialProof = hero.socialProof;
  if (!socialProof) invalidHome("hero.socialProof is missing");

  const featuredOn = document.featuredOn;
  if (!featuredOn) invalidHome("featuredOn is missing");
  const showcase = document.showcase;
  if (!showcase) invalidHome("showcase is missing");
  const featureOverview = document.featureOverview;
  if (!featureOverview) invalidHome("featureOverview is missing");
  const integrations = document.integrations;
  if (!integrations) invalidHome("integrations is missing");
  const founderNote = integrations.founderNote;
  if (!founderNote?.author) invalidHome("integrations.founderNote.author is missing");
  const social = document.socialProof;
  if (!social) invalidHome("socialProof is missing");
  const pricing = document.pricing;
  if (!pricing) invalidHome("pricing is missing");
  const roadmap = document.roadmap;
  if (!roadmap) invalidHome("roadmap is missing");
  const faq = document.faq;
  if (!faq) invalidHome("faq is missing");

  const featureItems = requiredArray(
    featureOverview.items,
    "featureOverview.items",
  ).map((item, index) => {
    const icon = requiredMachineString(
      item.icon,
      `featureOverview.items[${index}].icon`,
    );
    if (!featureIcons.has(icon as HomeFeatureIcon)) {
      invalidHome(`featureOverview.items[${index}].icon is unsupported: ${icon}`);
    }
    return {
      icon: icon as HomeFeatureIcon,
      title: requiredString(
        item.title,
        `featureOverview.items[${index}].title`,
      ),
      description: requiredString(
        item.description,
        `featureOverview.items[${index}].description`,
      ),
    };
  });

  const integrationItems = requiredArray(
    integrations.items,
    "integrations.items",
  ).map((item, index) => {
    const provider = requiredMachineString(
      item.provider,
      `integrations.items[${index}].provider`,
    );
    if (!integrationProviders.has(provider as HomeIntegrationProvider)) {
      invalidHome(`integrations.items[${index}].provider is unsupported: ${provider}`);
    }
    return {
      provider: provider as HomeIntegrationProvider,
      name: requiredString(item.name, `integrations.items[${index}].name`),
      description: requiredString(
        item.description,
        `integrations.items[${index}].description`,
      ),
    };
  });

  const seoTitle = requiredString(document.seo?.metaTitle, "seo.metaTitle");
  const seoDescription = requiredString(
    document.seo?.metaDescription,
    "seo.metaDescription",
  );

  return {
    updatedAt: requiredMachineString(document._updatedAt, "_updatedAt"),
    seo: {
      title: seoTitle,
      description: seoDescription,
      ogTitle: optionalString(document.seo?.ogTitle),
      ogDescription: optionalString(document.seo?.ogDescription),
      ogImage: document.seo?.ogImage
        ? mapImage(document.seo.ogImage, "seo.ogImage", seoTitle)
        : undefined,
      noIndex: document.seo?.noIndex ?? false,
    },
    hero: {
      titlePrefix: requiredString(hero.titlePrefix, "hero.titlePrefix"),
      titleAccent: requiredString(hero.titleAccent, "hero.titleAccent"),
      description: requiredString(hero.description, "hero.description"),
      screenshot: mapImage(hero.screenshot, "hero.screenshot"),
      watchDemoLabel: requiredString(
        hero.watchDemoLabel,
        "hero.watchDemoLabel",
      ),
      socialProof: {
        label: requiredString(socialProof.label, "hero.socialProof.label"),
        fallbackCount: requiredPositiveInteger(
          socialProof.fallbackCount,
          "hero.socialProof.fallbackCount",
        ),
        avatars: requiredArray(
          socialProof.avatars,
          "hero.socialProof.avatars",
        ).map((avatar, index) => ({
          src: requiredUrl(
            avatar.src,
            `hero.socialProof.avatars[${index}].src`,
          ),
          alt: requiredString(
            avatar.alt,
            `hero.socialProof.avatars[${index}].alt`,
          ),
        })),
      },
    },
    featuredOn: {
      label: requiredString(featuredOn.label, "featuredOn.label"),
      badges: requiredArray(featuredOn.badges, "featuredOn.badges").map(
        (badge, index) => {
          const field = `featuredOn.badges[${index}]`;
          const alt = requiredString(badge.alt, `${field}.alt`);
          const uploadedImage = badge.image
            ? mapImage(badge.image, `${field}.image`, alt)
            : undefined;

          return {
            name: requiredString(badge.name, `${field}.name`),
            href: requiredUrl(badge.href, `${field}.href`),
            src:
              uploadedImage?.src ??
              (badge.src?.startsWith("/")
                ? requiredMachineString(badge.src, `${field}.src`)
                : requiredUrl(badge.src, `${field}.src`)),
            alt,
            width:
              uploadedImage?.width ??
              requiredPositiveInteger(badge.width, `${field}.width`),
            height:
              uploadedImage?.height ??
              requiredPositiveInteger(badge.height, `${field}.height`),
            displayWidth: optionalPositiveInteger(
              badge.displayWidth,
              `${field}.displayWidth`,
            ),
            displayHeight: optionalPositiveInteger(
              badge.displayHeight,
              `${field}.displayHeight`,
            ),
            variant:
              requiredMachineString(badge.variant, `${field}.variant`) ===
              "productHunt"
                ? "productHunt"
                : "standard",
          };
        },
      ),
    },
    showcase: {
      eyebrow: requiredString(showcase.eyebrow, "showcase.eyebrow"),
      headingPrefix: requiredString(
        showcase.headingPrefix,
        "showcase.headingPrefix",
      ),
      headingAccent: requiredString(
        showcase.headingAccent,
        "showcase.headingAccent",
      ),
      description: requiredString(showcase.description, "showcase.description"),
      mainVideo: mapVideo(showcase.mainVideo, "showcase.mainVideo", true),
      firstSlideTitle: requiredString(
        showcase.firstSlideTitle,
        "showcase.firstSlideTitle",
      ),
      firstSlideDescription: requiredString(
        showcase.firstSlideDescription,
        "showcase.firstSlideDescription",
      ),
      actions: requiredArray(showcase.actions, "showcase.actions").map(
        (action, index) => ({
          number: requiredPositiveInteger(
            action.number,
            `showcase.actions[${index}].number`,
          ),
          title: requiredString(action.title, `showcase.actions[${index}].title`),
          description: requiredString(
            action.description,
            `showcase.actions[${index}].description`,
          ),
          video: mapVideo(
            action.video,
            `showcase.actions[${index}].video`,
            false,
          ),
        }),
      ),
    },
    featureOverview: {
      eyebrow: requiredString(
        featureOverview.eyebrow,
        "featureOverview.eyebrow",
      ),
      titlePrefix: requiredString(
        featureOverview.titlePrefix,
        "featureOverview.titlePrefix",
      ),
      titleAccent: requiredString(
        featureOverview.titleAccent,
        "featureOverview.titleAccent",
      ),
      allFeaturesLabel: requiredString(
        featureOverview.allFeaturesLabel,
        "featureOverview.allFeaturesLabel",
      ),
      items: featureItems,
    },
    integrations: {
      eyebrow: requiredString(integrations.eyebrow, "integrations.eyebrow"),
      titlePrefix: requiredString(
        integrations.titlePrefix,
        "integrations.titlePrefix",
      ),
      titleAccent: requiredString(
        integrations.titleAccent,
        "integrations.titleAccent",
      ),
      items: integrationItems,
      founderNote: {
        lines: requiredArray(
          founderNote.lines,
          "integrations.founderNote.lines",
        ).map((line, index) =>
          requiredString(line, `integrations.founderNote.lines[${index}]`),
        ),
        author: {
          name: requiredString(
            founderNote.author.name,
            "integrations.founderNote.author.name",
          ),
          role: requiredString(
            founderNote.author.role,
            "integrations.founderNote.author.role",
          ),
          portrait: mapImage(
            founderNote.author.portrait,
            "integrations.founderNote.author.portrait",
            founderNote.author.name,
          ),
        },
      },
    },
    socialProof: {
      eyebrow: requiredString(social.eyebrow, "socialProof.eyebrow"),
      titlePrefix: requiredString(social.titlePrefix, "socialProof.titlePrefix"),
      titleAccent: requiredString(social.titleAccent, "socialProof.titleAccent"),
      description: requiredString(social.description, "socialProof.description"),
      testimonials: requiredArray(
        social.testimonials,
        "socialProof.testimonials",
      ).map((testimonial, index) => {
        const platform = requiredMachineString(
          testimonial.platform,
          `socialProof.testimonials[${index}].platform`,
        );
        if (!testimonialPlatforms.has(platform as HomeTestimonialPlatform)) {
          invalidHome(
            `socialProof.testimonials[${index}].platform is unsupported: ${platform}`,
          );
        }
        return {
          id: requiredMachineString(
            testimonial.id,
            `socialProof.testimonials[${index}].id`,
          ),
          quote: requiredString(
            testimonial.quote,
            `socialProof.testimonials[${index}].quote`,
          ),
          author: requiredString(
            testimonial.author,
            `socialProof.testimonials[${index}].author`,
          ),
          handle: requiredString(
            testimonial.handle,
            `socialProof.testimonials[${index}].handle`,
          ),
          href: requiredUrl(
            testimonial.href,
            `socialProof.testimonials[${index}].href`,
          ),
          avatarUrl: requiredUrl(
            testimonial.avatarUrl,
            `socialProof.testimonials[${index}].avatarUrl`,
          ),
          platform: platform as HomeTestimonialPlatform,
        };
      }),
    },
    pricing: {
      titlePrefix: requiredString(pricing.titlePrefix, "pricing.titlePrefix"),
      titleAccent: requiredString(pricing.titleAccent, "pricing.titleAccent"),
      description: requiredString(pricing.description, "pricing.description"),
      familySharing: requiredString(
        pricing.familySharing,
        "pricing.familySharing",
      ),
      crossPlatform: requiredString(pricing.crossPlatform, "pricing.crossPlatform"),
      oneTime: {
        label: requiredString(pricing.oneTime?.label, "pricing.oneTime.label"),
        badge: requiredString(pricing.oneTime?.badge, "pricing.oneTime.badge"),
        price: requiredString(pricing.oneTime?.price, "pricing.oneTime.price"),
      },
      subscription: {
        label: requiredString(
          pricing.subscription?.label,
          "pricing.subscription.label",
        ),
        price: requiredString(
          pricing.subscription?.price,
          "pricing.subscription.price",
        ),
      },
      comparisonLabel: requiredString(
        pricing.comparisonLabel,
        "pricing.comparisonLabel",
      ),
      comparisonDescription: requiredString(
        pricing.comparisonDescription,
        "pricing.comparisonDescription",
      ),
      comparisonNameLabel: requiredString(
        pricing.comparisonNameLabel,
        "pricing.comparisonNameLabel",
      ),
      comparisonPriceLabel: requiredString(
        pricing.comparisonPriceLabel,
        "pricing.comparisonPriceLabel",
      ),
      comparisonItems: requiredArray(
        pricing.comparisonItems,
        "pricing.comparisonItems",
      ).map((item, index) => ({
        name: requiredString(item.name, `pricing.comparisonItems[${index}].name`),
        price: requiredString(
          item.price,
          `pricing.comparisonItems[${index}].price`,
        ),
        description: requiredString(
          item.description,
          `pricing.comparisonItems[${index}].description`,
        ),
        recommendedLabel: optionalString(item.recommendedLabel),
      })),
      comparisonCtaLabel: requiredString(
        pricing.comparisonCtaLabel,
        "pricing.comparisonCtaLabel",
      ),
      comparisonCtaHref: `/blog/${requiredMachineString(
        pricing.comparisonCtaSlug,
        "pricing.comparisonCtaPost.slug",
      )}/`,
      appStoreLabel: requiredString(
        pricing.appStoreLabel,
        "pricing.appStoreLabel",
      ),
      showSetappBadge: pricing.showSetappBadge === true,
    },
    roadmap: {
      eyebrow: requiredString(roadmap.eyebrow, "roadmap.eyebrow"),
      titlePrefix: requiredString(roadmap.titlePrefix, "roadmap.titlePrefix"),
      titleAccent: requiredString(roadmap.titleAccent, "roadmap.titleAccent"),
      subtitle: requiredString(roadmap.subtitle, "roadmap.subtitle"),
      items: requiredArray(roadmap.items, "roadmap.items", 3).map(
        (item, index) => {
          const rawStatus = requiredMachineString(
            item.status,
            `roadmap.items[${index}].status`,
          );
          const status = roadmapStatuses[rawStatus];
          if (!status) {
            invalidHome(`roadmap.items[${index}].status is unsupported: ${rawStatus}`);
          }
          return {
            number: requiredPositiveInteger(
              item.number,
              `roadmap.items[${index}].number`,
            ),
            status,
            title: requiredString(item.title, `roadmap.items[${index}].title`),
            description: requiredString(
              item.description,
              `roadmap.items[${index}].description`,
            ),
          };
        },
      ),
    },
    faq: {
      eyebrow: requiredString(faq.eyebrow, "faq.eyebrow"),
      titlePrefix: requiredString(faq.titlePrefix, "faq.titlePrefix"),
      titleAccent: requiredString(faq.titleAccent, "faq.titleAccent"),
      subtitle: requiredString(faq.subtitle, "faq.subtitle"),
      items: requiredArray(faq.items, "faq.items").map((item, index) => ({
        question: requiredString(item.question, `faq.items[${index}].question`),
        answer: requiredString(item.answer, `faq.items[${index}].answer`),
      })),
      footerTitle: requiredString(faq.footerTitle, "faq.footerTitle"),
      footerDescription: requiredString(
        faq.footerDescription,
        "faq.footerDescription",
      ),
      footerLinkLabel: requiredString(
        faq.footerLinkLabel,
        "faq.footerLinkLabel",
      ),
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
    const document = context.draft
      ? await context.client.fetch<SanityHomePageDocument | null>(
          HOME_PAGE_QUERY,
          {},
          { cache: "no-store" },
        )
      : await context.client.fetch<SanityHomePageDocument | null>(
          HOME_PAGE_QUERY,
          {},
          {
            next: {
              revalidate: SITE_REVALIDATE_SECONDS,
              tags: ["site-page:home"],
            },
          },
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
