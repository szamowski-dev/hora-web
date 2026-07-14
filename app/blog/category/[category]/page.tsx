import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListingPage } from "@/components/templates/BlogListingPage";
import { getPostsByCategory, postToSummary } from "@/lib/blog";
import { BLOG_CATEGORIES } from "@/lib/blog-model";
import { getAllPosts } from "@/lib/mdx";
import { defaultOg } from "@/lib/og";

type Params = { category: string };

export const revalidate = 600;

export function generateStaticParams(): Params[] {
  return BLOG_CATEGORIES.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = BLOG_CATEGORIES.find(
    (item) => item.slug === categorySlug,
  );
  if (!category) return {};

  const canonical = `/blog/category/${category.slug}/`;
  return {
    title: `${category.label} Articles`,
    description: category.description,
    alternates: { canonical },
    openGraph: defaultOg({
      title: `${category.label} - hora Calendar Blog`,
      description: category.description,
      url: `https://horacal.app${canonical}`,
    }),
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category: categorySlug } = await params;
  const category = BLOG_CATEGORIES.find(
    (item) => item.slug === categorySlug,
  );
  if (!category) notFound();

  const posts = await getAllPosts();
  const categoryPosts = getPostsByCategory(posts, category.slug);

  return (
    <BlogListingPage
      title={category.label}
      subtitle={category.description}
      activeCategory={category.slug}
      posts={categoryPosts.map(postToSummary)}
    />
  );
}
