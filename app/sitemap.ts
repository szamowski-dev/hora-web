import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getBlogCategories, getPostsByCategory } from "@/lib/blog";
import { getAllBlogPosts } from "@/lib/blog-repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllBlogPosts({
    perspective: "published",
    stega: false,
  });
  const base = site.url;
  const today = new Date().toISOString().split("T")[0];
  const latestPostDate =
    posts[0]?.updatedAt ?? posts[0]?.publishedAt ?? today;

  const postEntries: MetadataRoute.Sitemap = posts.flatMap((post) => {
    if (post.seo.noIndex) return [];

    const url = new URL(
      post.seo.canonicalUrl || `/blog/${post.slug}/`,
      base,
    );
    if (url.origin !== new URL(base).origin) return [];

    return [
      {
        url: url.toString(),
        lastModified: post.updatedAt ?? post.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
    ];
  });

  const categoryEntries: MetadataRoute.Sitemap = getBlogCategories(posts).map(
    (category) => ({
      url: `${base}/blog/category/${category.slug}/`,
      lastModified:
        getPostsByCategory(posts, category.slug)[0]?.updatedAt ??
        getPostsByCategory(posts, category.slug)[0]?.publishedAt ??
        latestPostDate,
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  return [
    {
      url: `${base}/`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 1.0,
      videos: [
        {
          title: "hora Calendar — a native macOS client for Google Calendar",
          thumbnail_loc: "https://i.ytimg.com/vi/ahVV5J25cYM/maxresdefault.jpg",
          description:
            "A video tour of hora Calendar on macOS: day, week, and month views, drag-and-drop rescheduling, and native Google Calendar sync. No Electron, no CalDAV — just fast SwiftUI.",
          player_loc: "https://www.youtube.com/embed/ahVV5J25cYM",
          content_loc: "https://www.youtube.com/watch?v=ahVV5J25cYM",
          publication_date: "2026-04-24T00:00:00+00:00",
          family_friendly: "yes",
          live: "no",
        },
      ],
    },
    {
      url: `${base}/blog/`,
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...categoryEntries,
    ...postEntries,
    {
      url: `${base}/features/`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/download/`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/about/`,
      lastModified: "2026-04-24",
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/support/`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/privacy/`,
      lastModified: "2026-05-13",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms/`,
      lastModified: "2026-05-13",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/zoom-guide/`,
      lastModified: "2026-05-13",
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
