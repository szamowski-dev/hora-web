import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListingPage } from "@/components/templates/BlogListingPage";
import {
  getMonthlyArchives,
  getPostsByMonth,
  postToSummary,
} from "@/lib/blog";
import { breadcrumbList } from "@/lib/jsonld";
import { getAllPosts } from "@/lib/mdx";
import { defaultOg } from "@/lib/og";

type Params = { year: string; month: string };

export const revalidate = 600;

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllPosts();
  return getMonthlyArchives(posts).map((archive) => ({
    year: archive.year,
    month: archive.month,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { year, month } = await params;
  const posts = await getAllPosts();
  const archive = getMonthlyArchives(posts).find(
    (item) => item.year === year && item.month === month,
  );
  if (!archive) return {};

  const canonical = `/blog/archive/${year}/${month}/`;
  return {
    title: `${archive.label} Blog Archive`,
    description: `hora Calendar blog posts from ${archive.label}, covering Mac calendar product work, SwiftUI development, Google Calendar sync, beta fixes, and launch notes.`,
    alternates: { canonical },
    robots: { index: false, follow: true },
    openGraph: defaultOg({
      title: `${archive.label} - hora Calendar Blog Archive`,
      description: `hora Calendar blog posts from ${archive.label}, covering Mac calendar product work, SwiftUI development, Google Calendar sync, beta fixes, and launch notes.`,
      url: `https://horacal.app${canonical}`,
    }),
  };
}

export default async function BlogMonthlyArchivePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { year, month } = await params;
  const posts = await getAllPosts();
  const archives = getMonthlyArchives(posts);
  const archive = archives.find(
    (item) => item.year === year && item.month === month,
  );
  if (!archive) notFound();

  const archivePosts = getPostsByMonth(posts, year, month);
  const url = `https://horacal.app/blog/archive/${year}/${month}/`;
  const breadcrumbs = breadcrumbList([
    { name: "Home", url: "https://horacal.app/" },
    { name: "Blog", url: "https://horacal.app/blog/" },
    { name: "Archive", url: "https://horacal.app/blog/archive/" },
    { name: archive.label, url },
  ]);

  return (
    <>
      <BlogListingPage
        title={archive.label}
        subtitle={`hora Calendar blog posts from ${archive.label}: Mac calendar product updates, SwiftUI engineering notes, Google Calendar sync work, beta fixes, launch planning, and practical comparisons for people choosing a faster native calendar workflow.`}
        posts={archivePosts.map(postToSummary)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  );
}
