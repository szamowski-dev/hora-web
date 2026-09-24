import { defineQuery } from "next-sanity";
import { defaultGoogleCalendarMacPage } from "@/content/google-calendar-mac";
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
    "googleCalendarMac": *[
      _id == "googleCalendarMacPage" &&
      _type == "googleCalendarMacPage"
    ][0]{
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
    },
    "trust": *[
      _id == "trustPage" &&
      _type == "legalPage" &&
      kind == "trust"
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
  googleCalendarMac?: SitemapPageMetadataValue;
  privacy?: SitemapPageMetadataValue;
  terms?: SitemapPageMetadataValue;
  refunds?: SitemapPageMetadataValue;
  trust?: SitemapPageMetadataValue;
};

export type SitemapPageMetadata = Record<
  keyof SitemapPageMetadataResult,
  { lastModified: string; noIndex: boolean }
>;

const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function todayIsoTimestamp() {
  return new Date().toISOString();
}

function todayDate() {
  return todayIsoTimestamp().slice(0, 10);
}

/**
 * Prefer the CMS date when it matches the expected shape; otherwise keep the
 * sitemap online with a deterministic fallback (never throw).
 */
function resolveDate(
  value: string | undefined,
  field: keyof SitemapPageMetadataResult,
  pattern: RegExp,
  fallback: string,
) {
  if (value && pattern.test(value)) return value;
  if (value) {
    console.error(
      `[sitemap] Published Sanity ${field} date is invalid (${value}); using fallback`,
    );
  }
  return fallback;
}

function resolvePageMetadata(
  value: SitemapPageMetadataValue | undefined,
  field: keyof SitemapPageMetadataResult,
  pattern: RegExp,
  fallbackDate: string,
) {
  return {
    lastModified: resolveDate(value?.lastModified, field, pattern, fallbackDate),
    noIndex: value?.noIndex === true,
  };
}

/**
 * Pure mapper used by the sitemap fetch and unit tests. Missing documents,
 * invalid dates, or a null fetch result all degrade to fallback lastmod values
 * so /sitemap.xml can still return 200.
 */
export function resolveSitemapPageMetadata(
  result: SitemapPageMetadataResult | null | undefined,
): SitemapPageMetadata {
  const isoFallback = todayIsoTimestamp();
  const dateFallback = todayDate();
  const source = result ?? {};

  return {
    home: resolvePageMetadata(source.home, "home", ISO_TIMESTAMP_PATTERN, isoFallback),
    features: resolvePageMetadata(
      source.features,
      "features",
      ISO_TIMESTAMP_PATTERN,
      isoFallback,
    ),
    about: resolvePageMetadata(
      source.about,
      "about",
      ISO_TIMESTAMP_PATTERN,
      isoFallback,
    ),
    googleCalendarMac: resolvePageMetadata(
      source.googleCalendarMac,
      "googleCalendarMac",
      ISO_TIMESTAMP_PATTERN,
      defaultGoogleCalendarMacPage.updatedAt,
    ),
    privacy: resolvePageMetadata(
      source.privacy,
      "privacy",
      DATE_PATTERN,
      dateFallback,
    ),
    terms: resolvePageMetadata(source.terms, "terms", DATE_PATTERN, dateFallback),
    refunds: resolvePageMetadata(
      source.refunds,
      "refunds",
      DATE_PATTERN,
      dateFallback,
    ),
    trust: resolvePageMetadata(source.trust, "trust", DATE_PATTERN, dateFallback),
  };
}

/**
 * Fetches the indexing state and editorial dates needed by sitemap.xml. The
 * shared Sanity client is pinned to the published perspective and public CDN,
 * while tags let the publish webhook invalidate an individual page immediately.
 *
 * Failures (CDN lag after revalidate, network errors, missing singletons) are
 * logged and degraded — the sitemap route must stay 200 for Search Console.
 */
export async function getSitemapPageMetadata(): Promise<SitemapPageMetadata> {
  try {
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
            "site-page:google-calendar-mac",
            "site-page:privacy",
            "site-page:terms",
            "site-page:refunds",
            "site-page:trust",
          ],
        },
      },
    );
    return resolveSitemapPageMetadata(result);
  } catch (error) {
    console.error(
      "[sitemap] Sanity page metadata fetch failed; using fallback dates",
      error,
    );
    return resolveSitemapPageMetadata(null);
  }
}
