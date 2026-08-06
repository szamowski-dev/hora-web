import { defineQuery } from "next-sanity";
import { client } from "@/sanity/lib/client";

const SITEMAP_PAGE_METADATA_QUERY = defineQuery(`
  {
    "home": *[_id == "homePage" && _type == "homePage"][0]{
      "lastModified": _updatedAt,
      "noIndex": coalesce(seo.noIndex, false)
    },
    "features": *[_id == "featuresPage" && _type == "featuresPage"][0]{
      "lastModified": _updatedAt,
      "noIndex": coalesce(seo.noIndex, false)
    },
    "about": *[_id == "aboutPage" && _type == "aboutPage"][0]{
      "lastModified": _updatedAt,
      "noIndex": coalesce(seo.noIndex, false)
    },
    "privacy": *[
      _id == "privacyPage" &&
      _type == "legalPage" &&
      kind == "privacy"
    ][0]{
      "lastModified": lastUpdated,
      "noIndex": coalesce(seo.noIndex, false)
    },
    "terms": *[
      _id == "termsPage" &&
      _type == "legalPage" &&
      kind == "terms"
    ][0]{
      "lastModified": lastUpdated,
      "noIndex": coalesce(seo.noIndex, false)
    },
    "refunds": *[
      _id == "refundsPage" &&
      _type == "legalPage" &&
      kind == "refunds"
    ][0]{
      "lastModified": lastUpdated,
      "noIndex": coalesce(seo.noIndex, false)
    }
  }
`);

type SitemapPageMetadataValue = {
  lastModified?: string;
  noIndex?: boolean;
};

type SitemapPageMetadataResult = {
  home?: SitemapPageMetadataValue;
  features?: SitemapPageMetadataValue;
  about?: SitemapPageMetadataValue;
  privacy?: SitemapPageMetadataValue;
  terms?: SitemapPageMetadataValue;
  refunds?: SitemapPageMetadataValue;
};

export type SitemapPageMetadata = Record<
  keyof SitemapPageMetadataResult,
  { lastModified: string; noIndex: boolean }
>;

const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function requireDate(
  value: string | undefined,
  field: keyof SitemapPageMetadataResult,
  pattern: RegExp,
) {
  if (!value || !pattern.test(value)) {
    throw new Error(`Published Sanity ${field} sitemap date is missing or invalid`);
  }
  return value;
}

function requirePageMetadata(
  value: SitemapPageMetadataValue | undefined,
  field: keyof SitemapPageMetadataResult,
  pattern: RegExp,
) {
  return {
    lastModified: requireDate(value?.lastModified, field, pattern),
    noIndex: value?.noIndex === true,
  };
}

/**
 * Fetches the indexing state and editorial dates needed by sitemap.xml. The
 * shared Sanity client is pinned to the published perspective and public CDN,
 * while tags let the publish webhook invalidate an individual page immediately.
 */
export async function getSitemapPageMetadata(): Promise<SitemapPageMetadata> {
  const result = await client.fetch<SitemapPageMetadataResult>(
    SITEMAP_PAGE_METADATA_QUERY,
    {},
    {
      next: {
        revalidate: 3600,
        tags: [
          "site-page:home",
          "site-page:features",
          "site-page:about",
          "site-page:privacy",
          "site-page:terms",
          "site-page:refunds",
        ],
      },
    },
  );

  return {
    home: requirePageMetadata(result.home, "home", ISO_TIMESTAMP_PATTERN),
    features: requirePageMetadata(
      result.features,
      "features",
      ISO_TIMESTAMP_PATTERN,
    ),
    about: requirePageMetadata(result.about, "about", ISO_TIMESTAMP_PATTERN),
    privacy: requirePageMetadata(result.privacy, "privacy", DATE_PATTERN),
    terms: requirePageMetadata(result.terms, "terms", DATE_PATTERN),
    refunds: requirePageMetadata(result.refunds, "refunds", DATE_PATTERN),
  };
}
