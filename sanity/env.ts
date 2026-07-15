export const apiVersion = "2026-07-15";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "tbqxupiq";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";

export const studioBasePath = "/studio";

export const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL?.trim() || studioBasePath;

const defaultSiteUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://horacal.app";

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || defaultSiteUrl,
).origin;

export const previewOrigin = siteUrl;
export const previewUrl = "/blog/";
