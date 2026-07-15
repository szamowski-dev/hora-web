import type { SanityImageCrop, SanityImageHotspot } from "@sanity/image-url";
import { defineQuery } from "next-sanity";
import type { SanityImageAsset, SanityTextBlock } from "@/sanity/lib/queries";

export type SanitySiteImageValue = {
  _type?: "siteImage" | "image";
  alt?: string;
  caption?: string;
  crop?: SanityImageCrop;
  hotspot?: SanityImageHotspot;
  asset?: SanityImageAsset;
};

export type SanityPageSeoValue = {
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: SanitySiteImageValue;
  noIndex?: boolean;
};

type SanitySplitHeadingValue = {
  prefix?: string;
  accent?: string;
};

export type SanityFeaturesPageDocument = {
  _id?: string;
  _updatedAt?: string;
  seo?: SanityPageSeoValue;
  hero?: {
    titlePrefix?: string;
    titleAccent?: string;
    subtitle?: string;
  };
  sections?: Array<{
    _key?: string;
    label?: string;
    screenshot?: SanitySiteImageValue;
    wideShortcutsCard?: {
      title?: string;
      description?: string;
      shortcuts?: Array<{
        _key?: string;
        keys?: string[];
        label?: string;
      }>;
    };
    items?: Array<{
      _key?: string;
      title?: string;
      description?: string;
      badges?: string[];
    }>;
  }>;
};

export type SanityAboutPageDocument = {
  _id?: string;
  _updatedAt?: string;
  seo?: SanityPageSeoValue;
  hero?: {
    titlePrefix?: string;
    titleAccent?: string;
    subtitle?: string;
  };
  profile?: {
    author?: {
      name?: string;
      role?: string;
      bio?: string;
      href?: string;
      portrait?: SanitySiteImageValue;
    };
    summary?: string;
  };
  stats?: Array<{
    _key?: string;
    value?: string;
    label?: string;
    detail?: string;
  }>;
  story?: {
    eyebrow?: string;
    quote?: string;
    quoteDetail?: string;
    body?: SanityTextBlock[];
  };
  contacts?: Array<{
    _key?: string;
    label?: string;
    kind?: string;
    href?: string;
  }>;
  cta?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    primaryLabel?: string;
    secondaryLabel?: string;
  };
};

export type SanityLegalPageDocument = {
  _id?: string;
  _updatedAt?: string;
  kind?: string;
  title?: SanitySplitHeadingValue;
  lastUpdated?: string;
  seo?: SanityPageSeoValue;
  body?: SanityTextBlock[];
};

const SITE_IMAGE_PROJECTION = `
  _type,
  alt,
  caption,
  crop,
  hotspot,
  "asset": asset->{
    _id,
    url,
    metadata{dimensions, lqip}
  }
`;

const PAGE_SEO_PROJECTION = `
  metaTitle,
  metaDescription,
  ogTitle,
  ogDescription,
  noIndex,
  "ogImage": ogImage{
    ${SITE_IMAGE_PROJECTION}
  }
`;

export const FEATURES_PAGE_QUERY = defineQuery(`
  *[
    _type == "featuresPage" &&
    (_id == "featuresPage" || _id == "drafts.featuresPage")
  ] | order(_updatedAt desc)[0] {
    _id,
    _updatedAt,
    seo{
      ${PAGE_SEO_PROJECTION}
    },
    hero{
      titlePrefix,
      titleAccent,
      subtitle
    },
    sections[]{
      _key,
      label,
      "screenshot": screenshot{
        ${SITE_IMAGE_PROJECTION}
      },
      wideShortcutsCard{
        title,
        description,
        shortcuts[]{_key, keys, label}
      },
      items[]{_key, title, description, badges}
    }
  }
`);

export const ABOUT_PAGE_QUERY = defineQuery(`
  *[
    _type == "aboutPage" &&
    (_id == "aboutPage" || _id == "drafts.aboutPage")
  ] | order(_updatedAt desc)[0] {
    _id,
    _updatedAt,
    seo{
      ${PAGE_SEO_PROJECTION}
    },
    hero{
      titlePrefix,
      titleAccent,
      subtitle
    },
    profile{
      "author": author->{
        name,
        role,
        bio,
        href,
        "portrait": portrait{
          crop,
          hotspot,
          "asset": asset->{
            _id,
            url,
            metadata{dimensions, lqip}
          }
        }
      },
      summary
    },
    stats[]{_key, value, label, detail},
    story{
      eyebrow,
      quote,
      quoteDetail,
      body[]{
        ...,
        markDefs[]{
          ...,
          _type == "internalPathLink" => {path}
        }
      }
    },
    contacts[]{_key, label, kind, href},
    cta{eyebrow, title, description, primaryLabel, secondaryLabel}
  }
`);

export const LEGAL_PAGE_QUERY = defineQuery(`
  *[
    _type == "legalPage" &&
    (_id == $documentId || _id == "drafts." + $documentId)
  ] | order(_updatedAt desc)[0] {
    _id,
    _updatedAt,
    kind,
    title{prefix, accent},
    lastUpdated,
    seo{
      ${PAGE_SEO_PROJECTION}
    },
    body[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalPathLink" => {path}
      }
    }
  }
`);
