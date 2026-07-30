import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getBlogCategories, getPostsByCategory } from "@/lib/blog";
import { getAllBlogPosts } from "@/lib/blog-repository";
import { getSitemapPageMetadata } from "@/sanity/lib/sitemap-page-dates";

function includeIndexedPage(
  noIndex: boolean,
  entry: MetadataRoute.Sitemap[number],
): MetadataRoute.Sitemap {
  return noIndex ? [] : [entry];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, pageMetadata] = await Promise.all([
    getAllBlogPosts({
      perspective: "published",
      stega: false,
    }),
    getSitemapPageMetadata(),
  ]);
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
    ...includeIndexedPage(pageMetadata.home.noIndex, {
      url: `${base}/`,
      lastModified: pageMetadata.home.lastModified,
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
    }),
    {
      url: `${base}/blog/`,
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...categoryEntries,
    ...postEntries,
    ...includeIndexedPage(pageMetadata.features.noIndex, {
      url: `${base}/features/`,
      lastModified: pageMetadata.features.lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
    {
      url: `${base}/pricing/`,
      lastModified: pageMetadata.home.lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...includeIndexedPage(pageMetadata.about.noIndex, {
      url: `${base}/about/`,
      lastModified: pageMetadata.about.lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    }),
    {
      url: `${base}/support/`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...includeIndexedPage(pageMetadata.privacy.noIndex, {
      url: `${base}/privacy/`,
      lastModified: pageMetadata.privacy.lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    }),
    ...includeIndexedPage(pageMetadata.terms.noIndex, {
      url: `${base}/terms/`,
      lastModified: pageMetadata.terms.lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    }),
    {
      url: `${base}/zoom-guide/`,
      lastModified: "2026-05-13",
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
