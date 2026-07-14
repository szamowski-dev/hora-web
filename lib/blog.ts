import {
  BLOG_AUTHOR,
  BLOG_CATEGORIES,
  getBlogCategory,
  type BlogCategory,
  type BlogCategorySlug,
  type BlogPostDetail,
  type BlogPostSummary,
} from "@/lib/blog-model";
import type { Post, PostMeta } from "@/lib/mdx";

export const BLOG_PAGE_SIZE = 6;

export type BlogArchive = {
  slug: string;
  year: string;
  month: string;
  label: string;
  href: string;
  count: number;
  lastModified: string;
};

export type BlogTag = {
  slug: string;
  label: string;
  href: string;
  count: number;
  lastModified: string;
};

const SPECIAL_TAG_LABELS: Record<string, string> = {
  adhd: "ADHD",
  api: "API",
  apca: "APCA",
  apns: "APNs",
  app: "App",
  caldav: "CalDAV",
  macos: "macOS",
  oklch: "OKLCH",
  pwa: "PWA",
  qa: "QA",
  swiftui: "SwiftUI",
};

export function postToSummary(post: PostMeta): BlogPostSummary {
  const listingImage =
    post.frontmatter.featured && post.frontmatter.heroImage
      ? {
          src: post.frontmatter.heroImage,
          alt: post.frontmatter.heroAlt || post.frontmatter.title,
        }
      : post.frontmatter.cover
        ? {
            src: post.frontmatter.cover,
            alt: post.frontmatter.title,
          }
        : undefined;

  return {
    slug: post.slug,
    title: post.frontmatter.title,
    excerpt: post.frontmatter.description,
    publishedAt: post.frontmatter.date,
    readingMinutes: post.readingMinutes,
    tags: post.frontmatter.tags,
    category: getBlogCategory(post.frontmatter.category),
    cover: listingImage,
    featured: post.frontmatter.featured ?? false,
    author: BLOG_AUTHOR,
  };
}

export function postToDetail(post: Post): BlogPostDetail {
  return {
    ...postToSummary(post),
    heroImage: post.frontmatter.heroImage
      ? {
          src: post.frontmatter.heroImage,
          alt: post.frontmatter.heroAlt || post.frontmatter.title,
          width: 1600,
          height: 900,
        }
      : undefined,
    body: post.content,
  };
}

export function formatBlogDate(iso: string): string {
  const value = iso.length > 10 ? iso : `${iso}T00:00:00Z`;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function getBlogCategories(): BlogCategory[] {
  return BLOG_CATEGORIES.map((category) => getBlogCategory(category.slug));
}

export function getPostsByCategory(
  posts: readonly PostMeta[],
  category: BlogCategorySlug,
) {
  return posts.filter((post) => post.frontmatter.category === category);
}

export function searchPosts(posts: readonly PostMeta[], query: string) {
  const normalized = query.trim().toLocaleLowerCase("en");
  if (!normalized) return [];

  return posts.filter((post) => {
    const category = getBlogCategory(post.frontmatter.category);
    const haystack = [
      post.frontmatter.title,
      post.frontmatter.description,
      category.label,
      ...post.frontmatter.tags,
    ]
      .join(" ")
      .toLocaleLowerCase("en");

    return haystack.includes(normalized);
  });
}

export function getRelatedPosts(
  posts: readonly PostMeta[],
  currentSlug: string,
  limit = 3,
): BlogPostSummary[] {
  const current = posts.find((post) => post.slug === currentSlug);
  if (!current) return [];

  const currentTags = new Set(current.frontmatter.tags);
  return posts
    .filter(
      (post) =>
        post.slug !== currentSlug &&
        post.frontmatter.category === current.frontmatter.category,
    )
    .map((post) => ({
      post,
      score: post.frontmatter.tags.filter((tag) => currentTags.has(tag)).length,
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.post.frontmatter.date.localeCompare(a.post.frontmatter.date),
    )
    .slice(0, limit)
    .map(({ post }) => postToSummary(post));
}

export function paginateEditorialPosts(
  posts: readonly PostMeta[],
  page: number,
  pageSize = BLOG_PAGE_SIZE,
) {
  const featured =
    posts.find((post) => post.frontmatter.featured) ?? posts[0] ?? null;
  const regularPosts = featured
    ? posts.filter((post) => post.slug !== featured.slug)
    : [...posts];
  const firstPageSize = Math.max(0, pageSize - (featured ? 1 : 0));
  const remainingAfterFirstPage = Math.max(
    0,
    regularPosts.length - firstPageSize,
  );
  const totalPages = Math.max(
    1,
    1 + Math.ceil(remainingAfterFirstPage / pageSize),
  );
  const safePage = Number.isFinite(page) ? page : 1;

  if (safePage === 1) {
    return {
      page: safePage,
      pageSize,
      totalPages,
      featured,
      posts: regularPosts.slice(0, firstPageSize),
      hasPrevious: false,
      hasNext: totalPages > 1,
    };
  }

  const start = firstPageSize + (safePage - 2) * pageSize;
  return {
    page: safePage,
    pageSize,
    totalPages,
    featured: null,
    posts: regularPosts.slice(start, start + pageSize),
    hasPrevious: true,
    hasNext: safePage < totalPages,
  };
}

export function paginatePosts<T>(
  posts: readonly T[],
  page: number,
  pageSize = BLOG_PAGE_SIZE,
) {
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const safePage = Number.isFinite(page) ? page : 1;
  const start = (safePage - 1) * pageSize;

  return {
    page: safePage,
    pageSize,
    totalPages,
    posts: posts.slice(start, start + pageSize),
    hasPrevious: safePage > 1,
    hasNext: safePage < totalPages,
  };
}

export function tagLabel(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => {
      const special = SPECIAL_TAG_LABELS[part.toLowerCase()];
      if (special) return special;
      if (part.length <= 3) return part.toUpperCase();
      return part[0].toUpperCase() + part.slice(1);
    })
    .join(" ");
}

export function getBlogTags(posts: readonly PostMeta[]): BlogTag[] {
  const tagMap = new Map<string, { count: number; lastModified: string }>();

  for (const post of posts) {
    for (const tag of post.frontmatter.tags) {
      const current = tagMap.get(tag);
      if (!current) {
        tagMap.set(tag, { count: 1, lastModified: post.frontmatter.date });
        continue;
      }
      tagMap.set(tag, {
        count: current.count + 1,
        lastModified:
          post.frontmatter.date > current.lastModified
            ? post.frontmatter.date
            : current.lastModified,
      });
    }
  }

  return Array.from(tagMap.entries())
    .map(([slug, meta]) => ({
      slug,
      label: tagLabel(slug),
      href: `/blog/tag/${slug}/`,
      count: meta.count,
      lastModified: meta.lastModified,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function getMonthlyArchives(posts: readonly PostMeta[]): BlogArchive[] {
  const archiveMap = new Map<string, { count: number; lastModified: string }>();

  for (const post of posts) {
    const [year, month] = post.frontmatter.date.split("-");
    if (!year || !month) continue;

    const slug = `${year}/${month}`;
    const current = archiveMap.get(slug);
    if (!current) {
      archiveMap.set(slug, { count: 1, lastModified: post.frontmatter.date });
      continue;
    }
    archiveMap.set(slug, {
      count: current.count + 1,
      lastModified:
        post.frontmatter.date > current.lastModified
          ? post.frontmatter.date
          : current.lastModified,
    });
  }

  return Array.from(archiveMap.entries())
    .map(([slug, meta]) => {
      const [year, month] = slug.split("/");
      const date = new Date(`${year}-${month}-01T00:00:00.000Z`);
      return {
        slug,
        year,
        month,
        label: new Intl.DateTimeFormat("en", {
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }).format(date),
        href: `/blog/archive/${year}/${month}/`,
        count: meta.count,
        lastModified: meta.lastModified,
      };
    })
    .sort((a, b) => b.slug.localeCompare(a.slug));
}

export function getPostsByTag(posts: readonly PostMeta[], tag: string) {
  return posts.filter((post) => post.frontmatter.tags.includes(tag));
}

export function getPostsByMonth(
  posts: readonly PostMeta[],
  year: string,
  month: string,
) {
  const prefix = `${year}-${month}`;
  return posts.filter((post) => post.frontmatter.date.startsWith(prefix));
}
