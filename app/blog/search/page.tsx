import type { Metadata } from "next";
import { BlogListingPage } from "@/components/templates/BlogListingPage";
import { postToSummary, searchPosts } from "@/lib/blog";
import { getAllPosts } from "@/lib/mdx";

type SearchParams = { q?: string | string[] };

export const metadata: Metadata = {
  title: "Search the blog",
  description: "Search the hora Calendar blog.",
  alternates: { canonical: "/blog/search/" },
  robots: { index: false, follow: true },
};

export default async function BlogSearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  const allPosts = await getAllPosts();
  const posts = query ? searchPosts(allPosts, query).map(postToSummary) : [];
  const title = query
    ? `Search results for “${query}”`
    : "Search the blog";
  const subtitle = query
    ? `${posts.length === 1 ? "1 story" : `${posts.length} stories`} matching your search.`
    : "Search guides, build notes, engineering stories, and product updates.";
  const emptyMessage = query
    ? `No stories matched “${query}”. Try another search.`
    : "Enter a search term to find stories.";

  return (
    <BlogListingPage
      title={title}
      subtitle={subtitle}
      posts={posts}
      emptyMessage={emptyMessage}
      searchQuery={query}
    />
  );
}
