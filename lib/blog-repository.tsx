import { cache } from "react";
import { stegaClean } from "next-sanity";
import { BlogPortableText } from "@/components/sanity/BlogPortableText";
import {
  getBlogCategory,
  isBlogCategorySlug,
  type BlogAuthor,
  type BlogImage,
  type BlogPostDetail,
  type BlogPostSummary,
} from "@/lib/blog-model";
import {
  getSanityFetchContext,
  type SanityRepositoryOptions,
} from "@/sanity/lib/fetch-context";
import { sanityImageUrl } from "@/sanity/lib/image";
import {
  BLOG_POST_QUERY,
  BLOG_POSTS_QUERY,
  type BlogPostQueryResult,
  type BlogPostsQueryResult,
  type SanityBlogImageValue,
  type SanityBlogPostDocument,
  type SanityBlogPostSummaryDocument,
  type SanityImageAsset,
} from "@/sanity/lib/queries";

const BLOG_REVALIDATE_SECONDS = 600;

export type BlogRepositoryOptions = SanityRepositoryOptions;

function publishedDocumentId(value: string | undefined): string | undefined {
  return value ? stegaClean(value).replace(/^drafts\./, "") : undefined;
}

function invalidPost(documentId: string | undefined, message: string): never {
  throw new Error(
    `Invalid published Sanity blog post ${documentId ?? "<unknown>"}: ${message}`,
  );
}

function requiredString(
  value: string | undefined,
  field: string,
  documentId?: string,
): string {
  const normalized = value?.trim();
  if (!normalized) invalidPost(documentId, `${field} is missing`);
  return normalized;
}

function requiredAssetUrl(
  asset: SanityImageAsset | undefined,
  field: string,
  documentId?: string,
): string {
  return stegaClean(
    requiredString(asset?.url, `${field}.asset.url`, documentId),
  );
}

function requiredMachineString(
  value: string | undefined,
  field: string,
  documentId?: string,
): string {
  return stegaClean(requiredString(value, field, documentId));
}

function mapImage(
  value: SanityBlogImageValue | undefined,
  alt: string,
  field: string,
  documentId?: string,
): BlogImage {
  if (!value) invalidPost(documentId, `${field} is missing`);

  const src = sanityImageUrl(value, { width: 1920, height: 1080 });
  if (!src) invalidPost(documentId, `${field}.asset is missing`);

  return {
    src,
    alt,
    width: 1920,
    height: 1080,
  };
}

function mapOptionalImage(
  value: SanityBlogImageValue | undefined,
  fallbackAlt: string,
  field: string,
  documentId?: string,
): BlogImage | undefined {
  if (!value) return undefined;
  return mapImage(
    value,
    value.alt?.trim() || fallbackAlt,
    field,
    documentId,
  );
}

function mapAuthor(
  document: SanityBlogPostSummaryDocument,
  documentId?: string,
): BlogAuthor {
  const author = document.author;
  if (!author) invalidPost(documentId, "author reference is unresolved");

  return {
    name: requiredString(author.name, "author.name", documentId),
    role: requiredString(author.role, "author.role", documentId),
    bio: requiredString(author.bio, "author.bio", documentId),
    href: requiredMachineString(author.href, "author.href", documentId),
    portrait: requiredAssetUrl(author.portrait, "author.portrait", documentId),
  };
}

function mapSummary(
  document: SanityBlogPostSummaryDocument,
  featuredPostId?: string,
): BlogPostSummary {
  const documentId = document._id;
  const slug = requiredMachineString(document.slug, "slug", documentId);
  const title = requiredString(document.title, "title", documentId);
  const excerpt = requiredString(
    document.description,
    "description",
    documentId,
  );
  const publishedAt = requiredMachineString(
    document.publishedAt,
    "publishedAt",
    documentId,
  );
  const updatedAt = requiredMachineString(
    document.contentUpdatedAt,
    "contentUpdatedAt",
    documentId,
  );

  if (
    typeof document.readingMinutes !== "number" ||
    !Number.isInteger(document.readingMinutes) ||
    document.readingMinutes < 1
  ) {
    invalidPost(documentId, "readingMinutes must be a positive integer");
  }

  const categorySlug = requiredMachineString(
    document.category?.slug,
    "category.slug",
    documentId,
  );
  if (!isBlogCategorySlug(categorySlug)) {
    invalidPost(documentId, `category.slug is unsupported: ${categorySlug}`);
  }

  const categoryFallback = getBlogCategory(categorySlug);
  const tags = (document.tags ?? []).map((tag, index) => ({
    slug: requiredMachineString(
      tag?.slug,
      `tags[${index}].slug`,
      documentId,
    ),
    label: requiredString(tag?.label, `tags[${index}].label`, documentId),
  }));
  if (tags.length === 0) invalidPost(documentId, "tags must not be empty");
  const uniqueTags = Array.from(
    new Map(tags.map((tag) => [tag.slug, tag])).values(),
  );

  const heroImage = document.heroImage;
  const cover = mapImage(
    heroImage,
    heroImage?.listingAlt?.trim() || title,
    "heroImage",
    documentId,
  );

  return {
    slug,
    title,
    excerpt,
    publishedAt,
    updatedAt,
    readingMinutes: document.readingMinutes,
    category: {
      slug: categorySlug,
      label: document.category?.label?.trim() || categoryFallback.label,
      description:
        document.category?.description?.trim() || categoryFallback.description,
      order:
        typeof document.category?.order === "number" &&
        Number.isInteger(document.category.order)
          ? document.category.order
          : categoryFallback.order,
      href: categoryFallback.href,
    },
    tags: uniqueTags,
    cover,
    featured: Boolean(
      publishedDocumentId(documentId) &&
        publishedDocumentId(documentId) === publishedDocumentId(featuredPostId),
    ),
    author: mapAuthor(document, documentId),
    seo: {
      title: document.seo?.metaTitle?.trim() || title,
      description: document.seo?.metaDescription?.trim() || excerpt,
      canonicalUrl: document.seo?.canonicalUrl
        ? stegaClean(document.seo.canonicalUrl).trim() || undefined
        : undefined,
      noIndex: document.seo?.noIndex ?? false,
    },
  };
}

function mapDetail(
  document: SanityBlogPostDocument,
  featuredPostId?: string,
): BlogPostDetail {
  const summary = mapSummary(document, featuredPostId);
  const documentId = document._id;

  if (!document.body?.length) {
    invalidPost(documentId, "body must not be empty");
  }

  const heroImage = mapImage(
    document.heroImage,
    document.heroImage?.alt?.trim() || summary.title,
    "heroImage",
    documentId,
  );
  const ogImage = mapOptionalImage(
    document.seo?.ogImageOverride,
    summary.title,
    "seo.ogImageOverride",
    documentId,
  );

  return {
    ...summary,
    heroImage,
    ogImage: ogImage ?? heroImage,
    body: <BlogPortableText value={document.body} />,
  };
}

const getAllBlogPostsCached = cache(
  async (
    perspective: NonNullable<BlogRepositoryOptions["perspective"]>,
    stega: boolean,
  ): Promise<BlogPostSummary[]> => {
    const context = await getSanityFetchContext({ perspective, stega });
    const result = context.draft
      ? await context.client.fetch<BlogPostsQueryResult>(
          BLOG_POSTS_QUERY,
          {},
          { cache: "no-store" },
        )
      : await context.client.fetch<BlogPostsQueryResult>(
          BLOG_POSTS_QUERY,
          {},
          {
            next: {
              revalidate: BLOG_REVALIDATE_SECONDS,
              tags: ["blog-posts", "blog-settings"],
            },
          },
        );

    return (result.posts ?? []).map((post) =>
      mapSummary(post, result.featuredPostId),
    );
  },
);

const getBlogPostBySlugCached = cache(
  async (
    slug: string,
    perspective: NonNullable<BlogRepositoryOptions["perspective"]>,
    stega: boolean,
  ): Promise<BlogPostDetail | null> => {
    const normalizedSlug = slug.trim();
    if (!normalizedSlug) return null;

    const context = await getSanityFetchContext({ perspective, stega });
    const result = context.draft
      ? await context.client.fetch<BlogPostQueryResult>(
          BLOG_POST_QUERY,
          { slug: normalizedSlug },
          { cache: "no-store" },
        )
      : await context.client.fetch<BlogPostQueryResult>(
          BLOG_POST_QUERY,
          { slug: normalizedSlug },
          {
            next: {
              revalidate: BLOG_REVALIDATE_SECONDS,
              tags: [
                "blog-posts",
                "blog-settings",
                `blog-post:${normalizedSlug}`,
              ],
            },
          },
        );

    return result.post
      ? mapDetail(result.post, result.featuredPostId)
      : null;
  },
);

export function getAllBlogPosts(
  options: BlogRepositoryOptions = {},
): Promise<BlogPostSummary[]> {
  return getAllBlogPostsCached(
    options.perspective ?? "auto",
    options.stega ?? true,
  );
}

export function getBlogPostBySlug(
  slug: string,
  options: BlogRepositoryOptions = {},
): Promise<BlogPostDetail | null> {
  return getBlogPostBySlugCached(
    slug,
    options.perspective ?? "auto",
    options.stega ?? true,
  );
}
