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
  intro?: readonly string[];
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
  intro,
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
      <section className="relative overflow-hidden border-b border-line pt-16 md:pt-24">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_10%_0%,var(--ui-glow-accent-soft),transparent_68%),radial-gradient(ellipse_62%_80%_at_92%_10%,var(--ui-glow-cool-soft),transparent_72%)]"
        />
        <div className="relative mx-auto max-w-295 px-6 pb-10 md:pb-14">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
            {title ?? (
              <>
                {heading.prefix}
                <span className="text-accent"> {heading.suffixGradient}</span>
              </>
            )}
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-muted md:text-lg md:leading-8">
            {subtitle}
          </p>
        </div>
      </section>

      {intro?.length ? (
        <section className="mx-auto max-w-295 px-6 pt-8 md:pt-10">
          <div className="shader-panel-soft ui-panel-soft relative overflow-hidden rounded-xl p-6 md:p-8">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-accent/60 to-accent-cool/45"
            />
            <div className="relative z-10 grid gap-x-10 gap-y-6 text-base leading-7 text-muted md:grid-cols-2">
              {intro.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={
                    index === intro.length - 1
                      ? "border-t border-line pt-6 md:col-span-2"
                      : undefined
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <span
              aria-hidden
              className="home-grid pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-10 [mask-image:linear-gradient(to_left,black,transparent)]"
              style={{ backgroundSize: "36px 36px" }}
            />
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-295 px-6 py-12 md:py-16">
        <div className="shader-panel ui-panel-deep relative overflow-hidden rounded-xl p-4 md:p-5">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-accent-cool/45"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-[radial-gradient(circle,var(--ui-glow-accent-soft),transparent_70%)] blur-3xl"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-40 top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,var(--ui-glow-cool-soft),transparent_72%)] blur-3xl"
          />

          <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              {posts.length === 0 ? (
                <p className="text-center text-muted">{emptyMessage}</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {hero ? <PostCard post={hero} variant="hero" /> : null}
                  {rest.map((post) => (
                    <PostCard key={post.slug} post={post} variant="list" />
                  ))}
                </div>
              )}
            </div>

            <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
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
                          : "border-line bg-overlay text-muted hover:border-line-strong hover:bg-overlay-strong hover:text-text",
                      )}
                    >
                      <span>{archive.label}</span>
                      <span className="text-xs text-muted">
                        {archive.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </BlogTaxonomyCard>
            </aside>
          </div>
        </div>

        {pagination ? (
          <BlogPagination pagination={pagination} />
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
    <section className="ui-panel-soft rounded-lg p-5 shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.09)]">
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
      className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6"
      aria-label="Blog pagination"
    >
      {currentPage > 1 ? (
        <Link
          href={previousHref}
          className="ui-interactive rounded-md border border-line bg-overlay px-4 py-2 text-sm font-medium text-muted hover:text-text"
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
          className="ui-interactive rounded-md border border-line bg-overlay px-4 py-2 text-sm font-medium text-muted hover:text-text"
        >
          Older posts
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
