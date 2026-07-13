import type { PostCardData } from "@/components/molecules/PostCard";
import type { PostMeta } from "@/lib/mdx";

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

export function postToCard(post: PostMeta): PostCardData {
  return {
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    date: post.frontmatter.date,
    readingMinutes: post.readingMinutes,
    tags: post.frontmatter.tags,
    cover: post.frontmatter.cover,
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
