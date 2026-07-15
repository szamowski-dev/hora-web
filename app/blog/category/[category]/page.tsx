import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListingPage } from "@/components/templates/BlogListingPage";
import { getBlogCategories, getPostsByCategory } from "@/lib/blog";
import { getAllBlogPosts } from "@/lib/blog-repository";
import { defaultOg } from "@/lib/og";

type Params = { category: string };

export const revalidate = 600;

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllBlogPosts({
    perspective: "published",
    stega: false,
  });
  return getBlogCategories(posts).map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const posts = await getAllBlogPosts({
    perspective: "published",
    stega: false,
  });
  const category = getBlogCategories(posts).find(
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
  const posts = await getAllBlogPosts();
  const categories = getBlogCategories(posts);
  const category = categories.find(
    (item) => item.slug === categorySlug,
  );
  if (!category) notFound();

  const categoryPosts = getPostsByCategory(posts, category.slug);

  return (
    <BlogListingPage
      title={category.label}
      subtitle={category.description}
      categories={categories}
      activeCategory={category.slug}
      posts={categoryPosts}
    />
  );
}
