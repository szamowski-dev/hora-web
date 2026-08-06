import { cache } from "react";
import { stegaClean } from "next-sanity";
import {
  ABOUT_CONTACT_KINDS,
  type AboutContactKind,
  type AboutPageData,
  type FeaturesPageData,
  type FeatureShortcutsCard,
  type LegalPageData,
  type LegalPageKind,
  type PageSeo,
  type SiteImage,
  type SitePageAuthor,
  type SplitHeading,
} from "@/lib/site-page-model";
import {
  getSanityFetchContext,
  type SanityRepositoryOptions,
} from "@/sanity/lib/fetch-context";
import {
  sanityImageDimensions,
  sanityImageUrl,
} from "@/sanity/lib/image";
import {
  ABOUT_PAGE_QUERY,
  FEATURES_PAGE_QUERY,
  LEGAL_PAGE_QUERY,
  type SanityAboutPageDocument,
  type SanityFeaturesPageDocument,
  type SanityLegalPageDocument,
  type SanityPageSeoValue,
  type SanitySiteImageValue,
} from "@/sanity/lib/site-page-queries";

const SITE_PAGE_REVALIDATE_SECONDS = 600;

export type SitePageRepositoryOptions = SanityRepositoryOptions;

type DocumentKind = "features" | "about" | "privacy" | "terms" | "refunds";

function invalidPage(
  kind: DocumentKind,
  documentId: string | undefined,
  message: string,
): never {
  throw new Error(
    `Invalid Sanity ${kind} page ${documentId ?? "<missing document>"}: ${message}`,
  );
}

function requiredString(
  value: string | undefined,
  field: string,
  kind: DocumentKind,
  documentId?: string,
): string {
  const normalized = value?.trim();
  if (!normalized) invalidPage(kind, documentId, `${field} is missing`);
  return normalized;
}

function requiredMachineString(
  value: string | undefined,
  field: string,
  kind: DocumentKind,
  documentId?: string,
): string {
  return stegaClean(requiredString(value, field, kind, documentId));
}

function optionalString(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

function requiredArray<T>(
  value: T[] | undefined,
  field: string,
  kind: DocumentKind,
  documentId?: string,
): T[] {
  if (!value?.length) {
    invalidPage(kind, documentId, `${field} must not be empty`);
  }
  return value;
}

function canonicalDocumentId(value: string | undefined): string | undefined {
  return value ? stegaClean(value).replace(/^drafts\./, "") : undefined;
}

function assertDocumentId<const T extends string>(
  value: string | undefined,
  expected: T,
  kind: DocumentKind,
): T {
  const id = canonicalDocumentId(value);
  if (id !== expected) {
    invalidPage(kind, value, `expected fixed document ID ${expected}`);
  }
  return expected;
}

function mapImage(
  value: SanitySiteImageValue | undefined,
  field: string,
  kind: DocumentKind,
  documentId?: string,
  fallbackAlt?: string,
): SiteImage {
  if (!value) invalidPage(kind, documentId, `${field} is missing`);

  const src = sanityImageUrl(value);
  if (!src) invalidPage(kind, documentId, `${field}.asset is missing`);

  const { width, height } = sanityImageDimensions(value);

  if (typeof width !== "number" || !Number.isFinite(width) || width < 1) {
    invalidPage(kind, documentId, `${field}.asset width is missing`);
  }
  if (typeof height !== "number" || !Number.isFinite(height) || height < 1) {
    invalidPage(kind, documentId, `${field}.asset height is missing`);
  }

  const alt = stegaClean(
    value.alt?.trim() ||
      fallbackAlt ||
      requiredString(value.alt, `${field}.alt`, kind, documentId),
  );
  const caption = optionalString(value.caption);
  const blurDataUrl = value.asset?.metadata?.lqip
    ? stegaClean(value.asset.metadata.lqip)
    : undefined;

  return {
    src,
    alt,
    width,
    height,
    ...(caption ? { caption } : {}),
    ...(blurDataUrl ? { blurDataUrl } : {}),
  };
}

function mapSeo(
  value: SanityPageSeoValue | undefined,
  kind: DocumentKind,
  documentId?: string,
): PageSeo {
  if (!value) invalidPage(kind, documentId, "seo is missing");
  if (typeof value.noIndex !== "boolean") {
    invalidPage(kind, documentId, "seo.noIndex must be a boolean");
  }

  const ogTitle = optionalString(value.ogTitle);
  const ogDescription = optionalString(value.ogDescription);

  return {
    metaTitle: requiredString(
      value.metaTitle,
      "seo.metaTitle",
      kind,
      documentId,
    ),
    metaDescription: requiredString(
      value.metaDescription,
      "seo.metaDescription",
      kind,
      documentId,
    ),
    ...(ogTitle ? { ogTitle } : {}),
    ...(ogDescription ? { ogDescription } : {}),
    ...(value.ogImage
      ? {
          ogImage: mapImage(
            value.ogImage,
            "seo.ogImage",
            kind,
            documentId,
          ),
        }
      : {}),
    noIndex: value.noIndex,
  };
}

function mapHeading(
  value: { prefix?: string; accent?: string } | undefined,
  field: string,
  kind: DocumentKind,
  documentId?: string,
): SplitHeading {
  if (!value) invalidPage(kind, documentId, `${field} is missing`);
  return {
    prefix: requiredString(value.prefix, `${field}.prefix`, kind, documentId),
    accent: requiredString(value.accent, `${field}.accent`, kind, documentId),
  };
}

function mapFeaturesPage(
  document: SanityFeaturesPageDocument | null,
): FeaturesPageData {
  if (!document) invalidPage("features", undefined, "document is missing");
  const id = assertDocumentId(document._id, "featuresPage", "features");

  return {
    id,
    updatedAt: requiredMachineString(
      document._updatedAt,
      "_updatedAt",
      "features",
      document._id,
    ),
    seo: mapSeo(document.seo, "features", document._id),
    hero: {
      title: mapHeading(
        document.hero
          ? {
              prefix: document.hero.titlePrefix,
              accent: document.hero.titleAccent,
            }
          : undefined,
        "hero.title",
        "features",
        document._id,
      ),
      subtitle: requiredString(
        document.hero?.subtitle,
        "hero.subtitle",
        "features",
        document._id,
      ),
    },
    sections: requiredArray(
      document.sections,
      "sections",
      "features",
      document._id,
    ).map((section, sectionIndex) => {
      const field = `sections[${sectionIndex}]`;
      const wideShortcutsCard = section.wideShortcutsCard
        ? ({
            title: requiredString(
              section.wideShortcutsCard.title,
              `${field}.wideShortcutsCard.title`,
              "features",
              document._id,
            ),
            description: requiredString(
              section.wideShortcutsCard.description,
              `${field}.wideShortcutsCard.description`,
              "features",
              document._id,
            ),
            shortcuts: requiredArray(
              section.wideShortcutsCard.shortcuts,
              `${field}.wideShortcutsCard.shortcuts`,
              "features",
              document._id,
            ).map((shortcut, shortcutIndex) => ({
              keys: requiredArray(
                shortcut.keys,
                `${field}.wideShortcutsCard.shortcuts[${shortcutIndex}].keys`,
                "features",
                document._id,
              ).map((key, keyIndex) =>
                requiredString(
                  key,
                  `${field}.wideShortcutsCard.shortcuts[${shortcutIndex}].keys[${keyIndex}]`,
                  "features",
                  document._id,
                ),
              ),
              label: requiredString(
                shortcut.label,
                `${field}.wideShortcutsCard.shortcuts[${shortcutIndex}].label`,
                "features",
                document._id,
              ),
            })),
          } satisfies FeatureShortcutsCard)
        : undefined;

      return {
        label: requiredString(
          section.label,
          `${field}.label`,
          "features",
          document._id,
        ),
        items: requiredArray(
          section.items,
          `${field}.items`,
          "features",
          document._id,
        ).map((item, itemIndex) => ({
          title: requiredString(
            item.title,
            `${field}.items[${itemIndex}].title`,
            "features",
            document._id,
          ),
          description: requiredString(
            item.description,
            `${field}.items[${itemIndex}].description`,
            "features",
            document._id,
          ),
          badges: (item.badges ?? []).map((badge, badgeIndex) =>
            requiredString(
              badge,
              `${field}.items[${itemIndex}].badges[${badgeIndex}]`,
              "features",
              document._id,
            ),
          ),
        })),
        ...(section.screenshot
          ? {
              screenshot: mapImage(
                section.screenshot,
                `${field}.screenshot`,
                "features",
                document._id,
              ),
            }
          : {}),
        ...(wideShortcutsCard ? { wideShortcutsCard } : {}),
      };
    }),
  };
}

function isAboutContactKind(value: string): value is AboutContactKind {
  return ABOUT_CONTACT_KINDS.includes(value as AboutContactKind);
}

function mapAuthor(
  document: SanityAboutPageDocument,
  kind: DocumentKind,
): SitePageAuthor {
  const author = document.profile?.author;
  if (!author) {
    invalidPage(kind, document._id, "profile.author reference is unresolved");
  }
  const name = requiredString(
    author.name,
    "profile.author.name",
    kind,
    document._id,
  );

  return {
    name,
    role: requiredString(
      author.role,
      "profile.author.role",
      kind,
      document._id,
    ),
    bio: requiredString(
      author.bio,
      "profile.author.bio",
      kind,
      document._id,
    ),
    href: requiredMachineString(
      author.href,
      "profile.author.href",
      kind,
      document._id,
    ),
    portrait: mapImage(
      author.portrait,
      "profile.author.portrait",
      kind,
      document._id,
      name,
    ),
  };
}

function mapAboutPage(document: SanityAboutPageDocument | null): AboutPageData {
  if (!document) invalidPage("about", undefined, "document is missing");
  const id = assertDocumentId(document._id, "aboutPage", "about");
  const author = mapAuthor(document, "about");

  return {
    id,
    updatedAt: requiredMachineString(
      document._updatedAt,
      "_updatedAt",
      "about",
      document._id,
    ),
    seo: mapSeo(document.seo, "about", document._id),
    hero: {
      title: mapHeading(
        document.hero
          ? {
              prefix: document.hero.titlePrefix,
              accent: document.hero.titleAccent,
            }
          : undefined,
        "hero.title",
        "about",
        document._id,
      ),
      subtitle: requiredString(
        document.hero?.subtitle,
        "hero.subtitle",
        "about",
        document._id,
      ),
    },
    profile: {
      author,
      summary: requiredString(
        document.profile?.summary,
        "profile.summary",
        "about",
        document._id,
      ),
    },
    stats: requiredArray(
      document.stats,
      "stats",
      "about",
      document._id,
    ).map((stat, index) => ({
      value: requiredString(
        stat.value,
        `stats[${index}].value`,
        "about",
        document._id,
      ),
      label: requiredString(
        stat.label,
        `stats[${index}].label`,
        "about",
        document._id,
      ),
      detail: requiredString(
        stat.detail,
        `stats[${index}].detail`,
        "about",
        document._id,
      ),
    })),
    story: {
      eyebrow: requiredString(
        document.story?.eyebrow,
        "story.eyebrow",
        "about",
        document._id,
      ),
      quote: requiredString(
        document.story?.quote,
        "story.quote",
        "about",
        document._id,
      ),
      quoteDetail: requiredString(
        document.story?.quoteDetail,
        "story.quoteDetail",
        "about",
        document._id,
      ),
      body: requiredArray(
        document.story?.body,
        "story.body",
        "about",
        document._id,
      ),
    },
    contacts: requiredArray(
      document.contacts,
      "contacts",
      "about",
      document._id,
    ).map((contact, index) => {
      const kind = requiredMachineString(
        contact.kind,
        `contacts[${index}].kind`,
        "about",
        document._id,
      );
      if (!isAboutContactKind(kind)) {
        invalidPage(
          "about",
          document._id,
          `contacts[${index}].kind is unsupported: ${kind}`,
        );
      }
      return {
        label: requiredString(
          contact.label,
          `contacts[${index}].label`,
          "about",
          document._id,
        ),
        kind,
        href: requiredMachineString(
          contact.href,
          `contacts[${index}].href`,
          "about",
          document._id,
        ),
      };
    }),
    cta: {
      eyebrow: requiredString(
        document.cta?.eyebrow,
        "cta.eyebrow",
        "about",
        document._id,
      ),
      title: requiredString(
        document.cta?.title,
        "cta.title",
        "about",
        document._id,
      ),
      description: requiredString(
        document.cta?.description,
        "cta.description",
        "about",
        document._id,
      ),
      primaryLabel: requiredString(
        document.cta?.primaryLabel,
        "cta.primaryLabel",
        "about",
        document._id,
      ),
      secondaryLabel: requiredString(
        document.cta?.secondaryLabel,
        "cta.secondaryLabel",
        "about",
        document._id,
      ),
    },
  };
}

function mapLegalPage(
  document: SanityLegalPageDocument | null,
  expectedKind: LegalPageKind,
): LegalPageData {
  const documentId = `${expectedKind}Page` as const;
  if (!document) {
    invalidPage(expectedKind, documentId, "document is missing");
  }
  const id = assertDocumentId(document._id, documentId, expectedKind) as
    | "privacyPage"
    | "termsPage"
    | "refundsPage";
  const kind = requiredMachineString(
    document.kind,
    "kind",
    expectedKind,
    document._id,
  );
  if (kind !== expectedKind) {
    invalidPage(
      expectedKind,
      document._id,
      `kind must be ${expectedKind}, received ${kind}`,
    );
  }
  const lastUpdated = requiredMachineString(
    document.lastUpdated,
    "lastUpdated",
    expectedKind,
    document._id,
  );
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastUpdated)) {
    invalidPage(
      expectedKind,
      document._id,
      "lastUpdated must use the YYYY-MM-DD format",
    );
  }

  return {
    id,
    updatedAt: requiredMachineString(
      document._updatedAt,
      "_updatedAt",
      expectedKind,
      document._id,
    ),
    kind,
    title: mapHeading(
      document.title,
      "title",
      expectedKind,
      document._id,
    ),
    lastUpdated,
    seo: mapSeo(document.seo, expectedKind, document._id),
    body: requiredArray(
      document.body,
      "body",
      expectedKind,
      document._id,
    ),
  };
}

async function fetchFeaturesPage(
  perspective: NonNullable<SitePageRepositoryOptions["perspective"]>,
  stega: boolean,
): Promise<FeaturesPageData> {
  const context = await getSanityFetchContext({ perspective, stega });
  const document = context.draft
    ? await context.client.fetch<SanityFeaturesPageDocument | null>(
        FEATURES_PAGE_QUERY,
        {},
        { cache: "no-store" },
      )
    : await context.client.fetch<SanityFeaturesPageDocument | null>(
        FEATURES_PAGE_QUERY,
        {},
        {
          next: {
            revalidate: SITE_PAGE_REVALIDATE_SECONDS,
            tags: ["site-page:features"],
          },
        },
      );
  return mapFeaturesPage(document);
}

async function fetchAboutPage(
  perspective: NonNullable<SitePageRepositoryOptions["perspective"]>,
  stega: boolean,
): Promise<AboutPageData> {
  const context = await getSanityFetchContext({ perspective, stega });
  const document = context.draft
    ? await context.client.fetch<SanityAboutPageDocument | null>(
        ABOUT_PAGE_QUERY,
        {},
        { cache: "no-store" },
      )
    : await context.client.fetch<SanityAboutPageDocument | null>(
        ABOUT_PAGE_QUERY,
        {},
        {
          next: {
            revalidate: SITE_PAGE_REVALIDATE_SECONDS,
            tags: ["site-page:about"],
          },
        },
      );
  return mapAboutPage(document);
}

async function fetchLegalPage(
  kind: LegalPageKind,
  perspective: NonNullable<SitePageRepositoryOptions["perspective"]>,
  stega: boolean,
): Promise<LegalPageData> {
  const context = await getSanityFetchContext({ perspective, stega });
  const documentId = `${kind}Page`;
  const document = context.draft
    ? await context.client.fetch<SanityLegalPageDocument | null>(
        LEGAL_PAGE_QUERY,
        { documentId },
        { cache: "no-store" },
      )
    : await context.client.fetch<SanityLegalPageDocument | null>(
        LEGAL_PAGE_QUERY,
        { documentId },
        {
          next: {
            revalidate: SITE_PAGE_REVALIDATE_SECONDS,
            tags: [`site-page:${kind}`],
          },
        },
      );
  return mapLegalPage(document, kind);
}

const getFeaturesPageCached = cache(fetchFeaturesPage);
const getAboutPageCached = cache(fetchAboutPage);
const getLegalPageCached = cache(fetchLegalPage);

export function getFeaturesPage(
  options: SitePageRepositoryOptions = {},
): Promise<FeaturesPageData> {
  return getFeaturesPageCached(
    options.perspective ?? "auto",
    options.stega ?? true,
  );
}

export function getAboutPage(
  options: SitePageRepositoryOptions = {},
): Promise<AboutPageData> {
  return getAboutPageCached(
    options.perspective ?? "auto",
    options.stega ?? true,
  );
}

export function getLegalPage(
  kind: LegalPageKind,
  options: SitePageRepositoryOptions = {},
): Promise<LegalPageData> {
  return getLegalPageCached(
    kind,
    options.perspective ?? "auto",
    options.stega ?? true,
  );
}
