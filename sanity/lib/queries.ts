import type {
  PortableTextBlock,
  PortableTextMarkDefinition,
  TypedObject,
} from "@portabletext/types";
import type {
  SanityImageCrop,
  SanityImageHotspot,
} from "@sanity/image-url";
import { defineQuery } from "next-sanity";

export type SanityImageAsset = {
  _id?: string;
  url?: string;
  metadata?: {
    dimensions?: {
      width?: number;
      height?: number;
      aspectRatio?: number;
    };
    lqip?: string;
  };
};

export type SanityBlogImageValue = TypedObject & {
  _type: "blogImage";
  alt?: string;
  listingAlt?: string;
  caption?: string;
  presentation?: "wide" | "content";
  crop?: SanityImageCrop;
  hotspot?: SanityImageHotspot;
  asset?: SanityImageAsset;
};

export type SanityExternalLink = PortableTextMarkDefinition & {
  _type: "externalLink";
  href?: string;
  openInNewTab?: boolean;
};

export type SanityInternalPostLink = PortableTextMarkDefinition & {
  _type: "internalPostLink";
  post?: { slug?: string };
  anchor?: string;
};

export type SanityInternalPathLink = PortableTextMarkDefinition & {
  _type: "internalPathLink";
  path?: string;
};

export type SanityLinkMark =
  | SanityExternalLink
  | SanityInternalPostLink
  | SanityInternalPathLink;

export type SanityTextBlock = PortableTextBlock<SanityLinkMark>;

export type SanityBlogVideoValue = TypedObject & {
  _type: "blogVideo";
  webmUrl?: string;
  mp4Url?: string;
  poster?: {
    asset?: SanityImageAsset;
  };
  accessibilityLabel?: string;
  caption?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  presentation?: "wide" | "glow";
};

export type SanityCodeBlockValue = TypedObject & {
  _type: "codeBlock";
  language?: "swift" | "json" | "text";
  code?: string;
  filename?: string;
  highlightLines?: number[];
};

export type SanityBlogFaqValue = TypedObject & {
  _type: "blogFaq";
  anchorId?: string;
  heading?: string;
  intro?: string;
  items?: Array<{
    _key?: string;
    anchorId?: string;
    question?: string;
    answer?: SanityTextBlock[];
  }>;
};

export type SanityBlogTableValue = TypedObject & {
  _type: "blogTable";
  caption?: string;
  rows?: Array<{
    _key?: string;
    header?: boolean;
    cells?: Array<{
      _key?: string;
      content?: SanityTextBlock[];
    }>;
  }>;
};

export type SanityBlogBodyValue = Array<
  | SanityTextBlock
  | SanityBlogImageValue
  | SanityBlogVideoValue
  | SanityCodeBlockValue
  | SanityBlogFaqValue
  | SanityBlogTableValue
>;

export type SanityBlogPostSummaryDocument = {
  _id?: string;
  slug?: string;
  title?: string;
  description?: string;
  publishedAt?: string;
  contentUpdatedAt?: string;
  readingMinutes?: number;
  author?: {
    name?: string;
    role?: string;
    bio?: string;
    href?: string;
    portrait?: SanityImageAsset;
  };
  category?: {
    slug?: string;
    label?: string;
    description?: string;
    order?: number;
  };
  tags?: Array<{
    slug?: string;
    label?: string;
  } | null>;
  heroImage?: SanityBlogImageValue;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
    ogImageOverride?: SanityBlogImageValue;
  };
};

export type SanityBlogPostDocument = SanityBlogPostSummaryDocument & {
  body?: SanityBlogBodyValue;
};

export type BlogPostsQueryResult = {
  featuredPostId?: string;
  posts?: SanityBlogPostSummaryDocument[];
};

export type BlogPostQueryResult = {
  featuredPostId?: string;
  post?: SanityBlogPostDocument | null;
};

export const BLOG_POSTS_QUERY = defineQuery(`
  {
    "featuredPostId": *[_type == "blogSettings"][0].featuredPost._ref,
    "posts": *[
      _type == "blogPost" &&
      defined(slug.current) &&
      defined(title) &&
      defined(description) &&
      defined(publishedAt) &&
      defined(readingMinutes) &&
      defined(author) &&
      defined(category) &&
      count(tags) > 0 &&
      defined(heroImage.asset) &&
      count(body) > 0
    ]
      | order(publishedAt desc) {
        _id,
        "slug": slug.current,
        title,
        description,
        publishedAt,
        "contentUpdatedAt": coalesce(contentUpdatedAt, publishedAt),
        readingMinutes,
        "author": author->{
          name,
          role,
          bio,
          href,
          "portrait": portrait.asset->{
            _id,
            url,
            metadata{dimensions, lqip}
          }
        },
        "category": category->{
          "slug": slug.current,
          "label": title,
          description,
          order
        },
        "tags": tags[]->{
          "slug": slug.current,
          "label": title
        },
        "heroImage": heroImage{
          _type,
          alt,
          listingAlt,
          caption,
          presentation,
          crop,
          hotspot,
          "asset": asset->{
            _id,
            url,
            metadata{dimensions, lqip}
          }
        },
        seo{
          metaTitle,
          metaDescription,
          canonicalUrl,
          noIndex
        }
      }
  }
`);

export const BLOG_POST_QUERY = defineQuery(`
  {
    "featuredPostId": *[_type == "blogSettings"][0].featuredPost._ref,
    "post": *[
      _type == "blogPost" &&
      slug.current == $slug &&
      defined(title) &&
      defined(description) &&
      defined(publishedAt) &&
      defined(readingMinutes) &&
      defined(author) &&
      defined(category) &&
      count(tags) > 0 &&
      defined(heroImage.asset) &&
      count(body) > 0
    ][0] {
      _id,
      "slug": slug.current,
      title,
      description,
      publishedAt,
      "contentUpdatedAt": coalesce(contentUpdatedAt, publishedAt),
      readingMinutes,
      "author": author->{
        name,
        role,
        bio,
        href,
        "portrait": portrait.asset->{
          _id,
          url,
          metadata{dimensions, lqip}
        }
      },
      "category": category->{
        "slug": slug.current,
        "label": title,
        description,
        order
      },
      "tags": tags[]->{
        "slug": slug.current,
        "label": title
      },
      "heroImage": heroImage{
        _type,
        alt,
        listingAlt,
        caption,
        presentation,
        crop,
        hotspot,
        "asset": asset->{
          _id,
          url,
          metadata{dimensions, lqip}
        }
      },
      seo{
        metaTitle,
        metaDescription,
        canonicalUrl,
        noIndex,
        "ogImageOverride": ogImageOverride{
          _type,
          alt,
          listingAlt,
          caption,
          presentation,
          crop,
          hotspot,
          "asset": asset->{
            _id,
            url,
            metadata{dimensions, lqip}
          }
        }
      },
      body[]{
        ...,
        _type == "block" => {
          markDefs[]{
            ...,
            _type == "internalPostLink" => {
              ...,
              "post": post->{"slug": slug.current}
            }
          }
        },
        _type == "blogImage" => {
          "asset": asset->{
            _id,
            url,
            metadata{dimensions, lqip}
          }
        },
        _type == "blogVideo" => {
          "webmUrl": webm.asset->url,
          "mp4Url": mp4.asset->url,
          "poster": poster{
            "asset": asset->{
              _id,
              url,
              metadata{dimensions, lqip}
            }
          }
        },
        _type == "blogFaq" => {
          items[]{
            ...,
            answer[]{
              ...,
              markDefs[]{
                ...,
                _type == "internalPostLink" => {
                  ...,
                  "post": post->{"slug": slug.current}
                }
              }
            }
          }
        },
        _type == "blogTable" => {
          rows[]{
            ...,
            cells[]{
              ...,
              content[]{
                ...,
                markDefs[]{
                  ...,
                  _type == "internalPostLink" => {
                    ...,
                    "post": post->{"slug": slug.current}
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`);
