import { defineQuery } from "next-sanity";

export type SanityFooterSettingsDocument = {
  _id?: string;
  copyright?: string;
};

export const FOOTER_SETTINGS_QUERY = defineQuery(`
  *[
    _type == "footerSettings" &&
    (_id == "footerSettings" || _id == "drafts.footerSettings")
  ] | order(_updatedAt desc)[0] {
    _id,
    copyright
  }
`);
