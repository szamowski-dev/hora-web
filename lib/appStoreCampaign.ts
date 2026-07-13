export type UtmAttribution = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
};

const APPLE_CAMPAIGN_TOKEN_MAX_LENGTH = 30;

export function utmAttributionFromSearchParams(
  searchParams: Pick<URLSearchParams, "get">,
): UtmAttribution {
  const read = (name: string) => searchParams.get(name)?.trim() || undefined;

  return {
    source: read("utm_source"),
    medium: read("utm_medium"),
    campaign: read("utm_campaign"),
    content: read("utm_content"),
    term: read("utm_term"),
  };
}

export function hasUtmAttribution(attribution: UtmAttribution) {
  return Object.values(attribution).some(Boolean);
}

function normalizeTokenPart(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function shortHash(value: string) {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(36).padStart(6, "0").slice(0, 6);
}

export function buildAppStoreCampaignToken(attribution: UtmAttribution) {
  const parts = [
    attribution.campaign,
    attribution.source,
    attribution.medium,
    attribution.content,
    attribution.term,
  ]
    .filter((value): value is string => Boolean(value))
    .map(normalizeTokenPart)
    .filter(Boolean);

  if (parts.length === 0) return null;

  const readableToken = ["web", ...parts].join("_");
  if (readableToken.length <= APPLE_CAMPAIGN_TOKEN_MAX_LENGTH) {
    return readableToken;
  }

  const hash = shortHash(readableToken);
  const readableLength = APPLE_CAMPAIGN_TOKEN_MAX_LENGTH - hash.length - 1;

  return `${readableToken.slice(0, readableLength).replace(/_+$/g, "")}_${hash}`;
}

export function buildAttributedAppStoreHref(
  baseHref: string,
  attribution: UtmAttribution,
) {
  const campaignToken = buildAppStoreCampaignToken(attribution);
  if (!campaignToken) return baseHref;

  try {
    const url = new URL(baseHref);
    if (url.hostname !== "apps.apple.com") return baseHref;

    url.searchParams.set("ct", campaignToken);
    return url.toString();
  } catch {
    return baseHref;
  }
}
