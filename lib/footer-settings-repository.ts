import { cache } from "react";
import { stegaClean } from "next-sanity";
import {
  FOOTER_SETTINGS_QUERY,
  type SanityFooterSettingsDocument,
} from "@/sanity/lib/footer-settings-query";
import {
  getSanityFetchContext,
  type SanityRepositoryOptions,
} from "@/sanity/lib/fetch-context";

const FOOTER_REVALIDATE_SECONDS = 600;
export const DEFAULT_FOOTER_COPYRIGHT = "© 2026 NA SERIO Maciej Szamowski";

function mapFooterSettings(document: SanityFooterSettingsDocument | null) {
  const copyright = document?.copyright?.trim();
  return { copyright: copyright ? stegaClean(copyright) : DEFAULT_FOOTER_COPYRIGHT };
}

const getFooterSettingsCached = cache(
  async (
    perspective: NonNullable<SanityRepositoryOptions["perspective"]>,
    stega: boolean,
  ) => {
    const context = await getSanityFetchContext({ perspective, stega });
    const document = context.draft
      ? await context.client.fetch<SanityFooterSettingsDocument | null>(
          FOOTER_SETTINGS_QUERY,
          {},
          { cache: "no-store" },
        )
      : await context.client.fetch<SanityFooterSettingsDocument | null>(
          FOOTER_SETTINGS_QUERY,
          {},
          {
            next: {
              revalidate: FOOTER_REVALIDATE_SECONDS,
              tags: ["footer-settings"],
            },
          },
        );

    return mapFooterSettings(document);
  },
);

export function getFooterSettings(
  options: SanityRepositoryOptions = {},
) {
  return getFooterSettingsCached(
    options.perspective ?? "auto",
    options.stega ?? true,
  );
}
