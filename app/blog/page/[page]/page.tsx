import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListingPage } from "@/components/templates/BlogListingPage";
import { blog } from "@/content/blog";
import {
  BLOG_PAGE_SIZE,
  getBlogCategories,
  paginateEditorialPosts,
} from "@/lib/blog";
import { getAllBlogPosts } from "@/lib/blog-repository";
import { breadcrumbList } from "@/lib/jsonld";
import { defaultOg } from "@/lib/og";

type Params = { page: string };

export const revalidate = 600;

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllBlogPosts({
    perspective: "published",
    stega: false,
  });
  const totalPages = paginateEditorialPosts(
    posts,
    1,
    BLOG_PAGE_SIZE,
  ).totalPages;

  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { page } = await params;
  const pageNumber = Number(page);
  const posts = await getAllBlogPosts({
    perspective: "published",
    stega: false,
  });
  const pagination = paginateEditorialPosts(posts, pageNumber, BLOG_PAGE_SIZE);

  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 2 ||
    pageNumber > pagination.totalPages
  ) {
    return {};
  }

  const canonical = `/blog/page/${pageNumber}/`;
  return {
    title: `Blog - Page ${pageNumber}`,
    description: `${blog.seo.description} Page ${pageNumber} of ${pagination.totalPages}.`,
    alternates: { canonical },
    robots: { index: false, follow: true },
    openGraph: defaultOg({
      title: `${blog.seo.ogTitle} - Page ${pageNumber}`,
      description: blog.seo.ogDescription,
      url: `https://horacal.app${canonical}`,
    }),
  };
}

export default async function BlogPaginatedPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { page } = await params;
  const pageNumber = Number(page);
  const posts = await getAllBlogPosts();
  const pagination = paginateEditorialPosts(posts, pageNumber, BLOG_PAGE_SIZE);

  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 2 ||
    pageNumber > pagination.totalPages
  ) {
    notFound();
  }

  const url = `https://horacal.app/blog/page/${pageNumber}/`;
  const breadcrumbs = breadcrumbList([
    { name: "Home", url: "https://horacal.app/" },
    { name: "Blog", url: "https://horacal.app/blog/" },
    { name: `Page ${pageNumber}`, url },
  ]);

  return (
    <>
      <BlogListingPage
        title="Blog"
        subtitle={`Older updates from building hora Calendar. Page ${pageNumber} of ${pagination.totalPages}.`}
        categories={getBlogCategories(posts)}
        posts={pagination.posts}
        pagination={{
          currentPage: pagination.page,
          totalPages: pagination.totalPages,
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
