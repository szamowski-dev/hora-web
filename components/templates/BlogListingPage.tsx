import Link from "next/link";
import { SectionBackdrop } from "@/components/atoms/SectionBackdrop";
import { PostCard } from "@/components/molecules/PostCard";
import { BetaCta } from "@/components/organisms/BetaCta";
import {
  ChevronRightIcon,
  RssIcon,
  SearchIcon,
} from "@/components/ui/blog-icons";
import { getBlogCategories } from "@/lib/blog";
import { ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";
import type {
  BlogCategorySlug,
  BlogPostSummary,
} from "@/lib/blog-model";
import { cn } from "@/lib/cn";

type Pagination = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  featured?: BlogPostSummary | null;
  posts: readonly BlogPostSummary[];
  pagination?: Pagination;
  activeCategory?: BlogCategorySlug;
  emptyMessage?: string;
  listHeading?: string;
  searchQuery?: string;
  allCategoryActive?: boolean;
};

const DEFAULT_SUBTITLE =
  "Notes from building a faster Google Calendar app for Mac.";

export function BlogListingPage({
  title = "Blog",
  subtitle = DEFAULT_SUBTITLE,
  featured,
  posts,
  pagination,
  activeCategory,
  emptyMessage = "No stories found.",
  listHeading,
  searchQuery,
  allCategoryActive,
}: Props) {
  const categories = getBlogCategories();
  const heading = listHeading ?? (featured ? "Latest stories" : "Stories");
  const isAllCategoryActive =
    allCategoryActive ?? (!activeCategory && title === "Blog");

  return (
    <>
      <section className="home-section relative overflow-hidden border-y pb-10 pt-16 md:pb-8 md:pt-24">
        <SectionBackdrop direction="left" />

        <div className="relative mx-auto max-w-295 px-6">
          <header className="flex flex-col gap-6 border-b border-line-strong pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-5xl font-semibold leading-[1.04] tracking-tight text-text md:text-[64px]">
                {title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-muted md:text-lg md:leading-8">
                {subtitle}
              </p>
            </div>
            <Link
              href="/blog/feed.xml"
              className="inline-flex min-h-11 items-center gap-2 rounded-sm font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-section"
            >
              <RssIcon className="h-3.5 w-3.5" />
              RSS
            </Link>
          </header>

          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <nav
              aria-label="Blog categories"
              className="flex flex-wrap items-center gap-x-1 gap-y-1"
            >
              <CategoryLink href="/blog/" active={isAllCategoryActive}>
                All
              </CategoryLink>
              {categories.map((category) => (
                <CategoryLink
                  key={category.slug}
                  href={category.href}
                  active={activeCategory === category.slug}
                >
                  {category.label}
                </CategoryLink>
              ))}
            </nav>

            <form
              action="/blog/search/"
              role="search"
              className="relative w-full lg:w-60"
            >
              <label htmlFor="blog-search" className="sr-only">
                Search blog posts
              </label>
              <input
                id="blog-search"
                name="q"
                type="search"
                defaultValue={searchQuery}
                placeholder="Search posts..."
                className="h-11 w-full rounded-md border border-line bg-bg/35 pl-3.5 pr-11 text-sm text-text outline-none transition-colors placeholder:text-dim focus:border-line-strong focus:ring-2 focus:ring-accent/25"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center rounded-r-md text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/70"
              >
                <SearchIcon className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-295 px-6 pb-16 pt-8 md:pb-20 md:pt-10">
        <div className="pt-4">
          {featured ? (
            <PostCard post={featured} variant="featured" priority />
          ) : null}

          {posts.length > 0 ? (
            <section className={cn(featured ? "pt-7" : "pt-4")}>
              <h2 className="text-xl font-semibold tracking-[-0.025em] text-text md:text-2xl">
                {heading}
              </h2>
              <div className="mt-2">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          ) : featured ? null : (
            <p className="border-b border-line py-16 text-center font-editorial text-lg text-muted">
              {emptyMessage}
            </p>
          )}

          {pagination ? <BlogPagination pagination={pagination} /> : null}
        </div>
      </div>

      <BetaCta placement={ANALYTICS_PLACEMENTS.blog} />
    </>
  );
}

function CategoryLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative inline-flex min-h-11 items-center rounded-sm px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        active ? "text-text" : "text-muted hover:text-text",
      )}
    >
      {children}
      {active ? (
        <span
          aria-hidden
          className="absolute inset-x-3 bottom-0 h-px bg-accent"
        />
      ) : null}
    </Link>
  );
}

function BlogPagination({ pagination }: { pagination: Pagination }) {
  const { currentPage, totalPages, basePath } = pagination;
  if (totalPages <= 1) return null;

  const previousHref =
    currentPage === 2 ? "/blog/" : `${basePath}/${currentPage - 1}/`;
  const nextHref = `${basePath}/${currentPage + 1}/`;

  return (
    <nav
      className="mt-6 flex items-center justify-between gap-3"
      aria-label="Blog pagination"
    >
      {currentPage > 1 ? (
        <Link
          href={previousHref}
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <ChevronRightIcon className="h-4 w-4 rotate-180" />
          Newer posts
        </Link>
      ) : (
        <span />
      )}
      <span className="text-xs text-muted">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link
          href={nextHref}
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Older posts
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
