import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListingPage } from "@/components/templates/BlogListingPage";
import {
  getBlogTags,
  getMonthlyArchives,
  getPostsByTag,
  postToCard,
  tagLabel,
} from "@/lib/blog";
import { breadcrumbList } from "@/lib/jsonld";
import { getAllPosts } from "@/lib/mdx";
import { defaultOg } from "@/lib/og";

type Params = { tag: string };

export const revalidate = 600;

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllPosts();
  return getBlogTags(posts).map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { tag } = await params;
  const posts = await getAllPosts();
  const taggedPosts = getPostsByTag(posts, tag);
  if (taggedPosts.length === 0) return {};

  const label = tagLabel(tag);
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
  const posts = await getAllPosts();
  const taggedPosts = getPostsByTag(posts, tag);
  if (taggedPosts.length === 0) notFound();

  const label = tagLabel(tag);
  const url = `https://horacal.app/blog/tag/${tag}/`;
  const breadcrumbs = breadcrumbList([
    { name: "Home", url: "https://horacal.app/" },
    { name: "Blog", url: "https://horacal.app/blog/" },
    { name: label, url },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <BlogListingPage
        eyebrow="Blog tag"
        title={label}
        subtitle={`Articles tagged ${label} from the hora Calendar dev blog.`}
        posts={taggedPosts.map(postToCard)}
        tags={getBlogTags(posts)}
        archives={getMonthlyArchives(posts)}
        activeTag={tag}
      />
    </>
  );
}
