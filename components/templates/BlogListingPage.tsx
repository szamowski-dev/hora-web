import Link from "next/link";
import { BlogTagSearch } from "@/components/molecules/BlogTagSearch";
import { PostCard, type PostCardData } from "@/components/molecules/PostCard";
import { StayInLoopCta } from "@/components/organisms/StayInLoopCta";
import { blog } from "@/content/blog";
import type { BlogArchive, BlogTag } from "@/lib/blog";
import { cn } from "@/lib/cn";

type Pagination = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

type Props = {
  eyebrow?: string;
  heading?: typeof blog.heading;
  title?: string;
  subtitle?: string;
  posts: readonly PostCardData[];
  tags: readonly BlogTag[];
  archives: readonly BlogArchive[];
  pagination?: Pagination;
  activeTag?: string;
  activeArchive?: string;
  emptyMessage?: string;
};

export function BlogListingPage({
  heading = blog.heading,
  title,
  subtitle = blog.subtitle,
  posts,
  tags,
  archives,
  pagination,
  activeTag,
  activeArchive,
  emptyMessage = "No posts yet.",
}: Props) {
  const [hero, ...rest] = posts;

  return (
    <>
      <section className="mx-auto max-w-295 px-6 pt-16 md:pt-24">
        <div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
            {title ?? (
              <>
                {heading.prefix}
                <span className="text-accent"> {heading.suffixGradient}</span>
              </>
            )}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
            {subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-295 gap-8 px-6 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          {posts.length === 0 ? (
            <p className="text-center text-muted">{emptyMessage}</p>
          ) : (
            <div className="flex flex-col gap-5">
              {hero ? <PostCard post={hero} variant="hero" /> : null}
              {rest.map((post) => (
                <PostCard key={post.slug} post={post} variant="list" />
              ))}
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-5">
          <BlogTaxonomyCard title="Tags">
            <BlogTagSearch tags={tags} activeTag={activeTag} />
          </BlogTaxonomyCard>

          <BlogTaxonomyCard title="Archive">
            <div className="flex flex-col gap-2">
              <Link
                href="/blog/archive/"
                className="text-sm font-medium text-muted transition-colors hover:text-text"
              >
                All months
              </Link>
              {archives.map((archive) => (
                <Link
                  key={archive.slug}
                  href={archive.href}
                  className={cn(
                    "flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors",
                    activeArchive === archive.slug
                      ? "border-accent/45 bg-accent/12 text-text"
                      : "border-white/8 bg-white/4 text-muted hover:border-white/16 hover:text-text",
                  )}
                >
                  <span>{archive.label}</span>
                  <span className="text-xs text-muted">{archive.count}</span>
                </Link>
              ))}
            </div>
          </BlogTaxonomyCard>
        </aside>

        {pagination ? (
          <div className="lg:col-span-2">
            <BlogPagination pagination={pagination} />
          </div>
        ) : null}
      </section>

      <StayInLoopCta />
    </>
  );
}

function BlogTaxonomyCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
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
      className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-6"
      aria-label="Blog pagination"
    >
      {currentPage > 1 ? (
        <Link
          href={previousHref}
          className="rounded-md border border-white/12 px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-accent/35 hover:text-text"
        >
          Newer posts
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-muted">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link
          href={nextHref}
          className="rounded-md border border-white/12 px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-accent/35 hover:text-text"
        >
          Older posts
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
