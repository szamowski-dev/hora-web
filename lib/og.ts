import type { Metadata } from "next";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

export function defaultOg(overrides: OpenGraph): OpenGraph {
  return {
    type: "website",
    locale: "en_US",
    siteName: "hora Calendar",
    images: [{ url: "/assets/seo/default-og-image.png", width: 1200, height: 630 }],
    ...overrides,
  };
}
