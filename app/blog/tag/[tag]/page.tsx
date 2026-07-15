import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListingPage } from "@/components/templates/BlogListingPage";
import {
  getBlogTags,
  getBlogCategories,
  getPostsByTag,
} from "@/lib/blog";
import { getAllBlogPosts } from "@/lib/blog-repository";
import { breadcrumbList } from "@/lib/jsonld";
import { defaultOg } from "@/lib/og";

type Params = { tag: string };

export const revalidate = 600;

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllBlogPosts({
    perspective: "published",
    stega: false,
  });
  return getBlogTags(posts).map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { tag } = await params;
  const posts = await getAllBlogPosts({
    perspective: "published",
    stega: false,
  });
  const taggedPosts = getPostsByTag(posts, tag);
  if (taggedPosts.length === 0) return {};

  const label = getBlogTags(posts).find((item) => item.slug === tag)?.label;
  if (!label) return {};
  const canonical = `/blog/tag/${tag}/`;
  return {
    title: `${label} Articles`,
    description: `Articles about ${label} from the hora Calendar dev blog.`,
    alternates: { canonical },
    robots: { index: false, follow: true },
    openGraph: defaultOg({
      title: `${label} Articles - hora Calendar Blog`,
      description: `Articles about ${label} from the hora Calendar dev blog.`,
      url: `https://horacal.app${canonical}`,
    }),
  };
}

export default async function BlogTagPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { tag } = await params;
  const posts = await getAllBlogPosts();
  const taggedPosts = getPostsByTag(posts, tag);
  if (taggedPosts.length === 0) notFound();

  const label = getBlogTags(posts).find((item) => item.slug === tag)?.label;
  if (!label) notFound();
  const url = `https://horacal.app/blog/tag/${tag}/`;
  const breadcrumbs = breadcrumbList([
    { name: "Home", url: "https://horacal.app/" },
    { name: "Blog", url: "https://horacal.app/blog/" },
    { name: label, url },
  ]);
  const serializedBreadcrumbs = JSON.stringify(breadcrumbs).replace(
    /</g,
    "\\u003c",
  );

  return (
    <>
      <BlogListingPage
        title={label}
        subtitle={`Articles tagged ${label} from the hora Calendar dev blog.`}
        categories={getBlogCategories(posts)}
        posts={taggedPosts}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializedBreadcrumbs }}
      />
    </>
  );
}
