import type { Metadata } from "next";
import { BlogListingPage } from "@/components/templates/BlogListingPage";
import { blog } from "@/content/blog";
import {
  BLOG_PAGE_SIZE,
  paginateEditorialPosts,
  postToSummary,
} from "@/lib/blog";
import { getAllPosts } from "@/lib/mdx";
import { defaultOg } from "@/lib/og";
import { breadcrumbList } from "@/lib/jsonld";

export const revalidate = 600;

export const metadata: Metadata = {
  title: blog.seo.title,
  description: blog.seo.description,
  alternates: {
    canonical: "/blog/",
    types: {
      "application/rss+xml": [
        { url: "/blog/feed.xml", title: "hora Calendar Blog" },
      ],
    },
  },
  openGraph: defaultOg({
    title: blog.seo.ogTitle,
    description: blog.seo.ogDescription,
    url: "https://horacal.app/blog/",
  }),
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const page = paginateEditorialPosts(posts, 1, BLOG_PAGE_SIZE);
  const breadcrumbs = breadcrumbList([
    { name: "Home", url: "https://horacal.app/" },
    { name: "Blog", url: "https://horacal.app/blog/" },
  ]);

  return (
    <>
      <BlogListingPage
        featured={page.featured ? postToSummary(page.featured) : null}
        posts={page.posts.map(postToSummary)}
        pagination={{
          currentPage: page.page,
          totalPages: page.totalPages,
          basePath: "/blog/page",
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  );
}
