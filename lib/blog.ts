import {
  type BlogCategory,
  type BlogCategorySlug,
  type BlogPostSummary,
} from "@/lib/blog-model";

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

export function formatBlogDate(iso: string): string {
  const value = iso.length > 10 ? iso : `${iso}T00:00:00Z`;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function getBlogCategories(
  posts: readonly BlogPostSummary[],
): BlogCategory[] {
  const categories = new Map<BlogCategorySlug, BlogCategory>();

  for (const post of posts) {
    categories.set(post.category.slug, post.category);
  }

  return Array.from(categories.values()).sort(
    (a, b) => a.order - b.order || a.label.localeCompare(b.label),
  );
}

export function getPostsByCategory(
  posts: readonly BlogPostSummary[],
  category: BlogCategorySlug,
) {
  return posts.filter((post) => post.category.slug === category);
}

export function searchPosts(
  posts: readonly BlogPostSummary[],
  query: string,
) {
  const normalized = query.trim().toLocaleLowerCase("en");
  if (!normalized) return [];

  return posts.filter((post) => {
    const haystack = [
      post.title,
      post.excerpt,
      post.category.label,
      ...post.tags.flatMap((tag) => [tag.slug, tag.label]),
    ]
      .join(" ")
      .toLocaleLowerCase("en");

    return haystack.includes(normalized);
  });
}

export function getRelatedPosts(
  posts: readonly BlogPostSummary[],
  currentSlug: string,
  limit = 3,
): BlogPostSummary[] {
  const current = posts.find((post) => post.slug === currentSlug);
  if (!current) return [];

  const currentTags = new Set(current.tags.map((tag) => tag.slug));
  return posts
    .filter(
      (post) =>
        post.slug !== currentSlug &&
        post.category.slug === current.category.slug,
    )
    .map((post) => ({
      post,
      score: post.tags.filter((tag) => currentTags.has(tag.slug)).length,
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.post.publishedAt.localeCompare(a.post.publishedAt),
    )
    .slice(0, limit)
    .map(({ post }) => post);
}

export function paginateEditorialPosts(
  posts: readonly BlogPostSummary[],
  page: number,
  pageSize = BLOG_PAGE_SIZE,
) {
  const featured =
    posts.find((post) => post.featured) ?? posts[0] ?? null;
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

export function getBlogTags(posts: readonly BlogPostSummary[]): BlogTag[] {
  const tagMap = new Map<
    string,
    { label: string; count: number; lastModified: string }
  >();

  for (const post of posts) {
    for (const tag of post.tags) {
      const current = tagMap.get(tag.slug);
      if (!current) {
        tagMap.set(tag.slug, {
          label: tag.label,
          count: 1,
          lastModified: post.publishedAt,
        });
        continue;
      }
      tagMap.set(tag.slug, {
        label: tag.label,
        count: current.count + 1,
        lastModified:
          post.publishedAt > current.lastModified
            ? post.publishedAt
            : current.lastModified,
      });
    }
  }

  return Array.from(tagMap.entries())
    .map(([slug, meta]) => ({
      slug,
      label: meta.label || tagLabel(slug),
      href: `/blog/tag/${slug}/`,
      count: meta.count,
      lastModified: meta.lastModified,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function getMonthlyArchives(
  posts: readonly BlogPostSummary[],
): BlogArchive[] {
  const archiveMap = new Map<string, { count: number; lastModified: string }>();

  for (const post of posts) {
    const [year, month] = post.publishedAt.split("-");
    if (!year || !month) continue;

    const slug = `${year}/${month}`;
    const current = archiveMap.get(slug);
    if (!current) {
      archiveMap.set(slug, { count: 1, lastModified: post.publishedAt });
      continue;
    }
    archiveMap.set(slug, {
      count: current.count + 1,
      lastModified:
        post.publishedAt > current.lastModified
          ? post.publishedAt
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

export function getPostsByTag(
  posts: readonly BlogPostSummary[],
  tag: string,
) {
  return posts.filter((post) =>
    post.tags.some((postTag) => postTag.slug === tag),
  );
}

export function getPostsByMonth(
  posts: readonly BlogPostSummary[],
  year: string,
  month: string,
) {
  const prefix = `${year}-${month}`;
  return posts.filter((post) => post.publishedAt.startsWith(prefix));
}
