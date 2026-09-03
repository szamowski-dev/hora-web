import "server-only";

import { cache } from "react";
import { mapBlogCtaSettings } from "@/lib/blog-cta-content";
import {
  getSanityFetchContext,
  type SanityRepositoryOptions,
} from "@/sanity/lib/fetch-context";
import {
  BLOG_CTA_SETTINGS_QUERY,
  type SanityBlogCtaSettingsDocument,
} from "@/sanity/lib/blog-cta-query";

const BLOG_CTA_REVALIDATE_SECONDS = 600;

const getBlogCtaCached = cache(
  async (
    perspective: NonNullable<SanityRepositoryOptions["perspective"]>,
    stega: boolean,
  ) => {
    const context = await getSanityFetchContext({ perspective, stega });
    const document = context.draft
      ? await context.client.fetch<SanityBlogCtaSettingsDocument | null>(
          BLOG_CTA_SETTINGS_QUERY,
          {},
          { cache: "no-store" },
        )
      : await context.client.fetch<SanityBlogCtaSettingsDocument | null>(
          BLOG_CTA_SETTINGS_QUERY,
          {},
          {
            next: {
              revalidate: BLOG_CTA_REVALIDATE_SECONDS,
              tags: ["blog-cta-settings"],
            },
          },
        );

    return mapBlogCtaSettings(document);
  },
);

export function getBlogCta(options: SanityRepositoryOptions = {}) {
  return getBlogCtaCached(
    options.perspective ?? "auto",
    options.stega ?? true,
  );
}
