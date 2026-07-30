import Image from "next/image";
import Link from "next/link";
import { Prose } from "@/components/atoms/Prose";
import { CopyLinkButton } from "@/components/molecules/CopyLinkButton";
import { PostCard } from "@/components/molecules/PostCard";
import { ShareButton } from "@/components/molecules/ShareButton";
import { BetaCta } from "@/components/organisms/BetaCta";
import { Separator } from "@/components/ui/separator";
import { site } from "@/content/site";
import { formatBlogDate } from "@/lib/blog";
import { ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";
import type {
  BlogPostDetail,
  BlogPostSummary,
} from "@/lib/blog-model";

export function BlogPostLayout({
  post,
  relatedPosts,
}: {
  post: BlogPostDetail;
  relatedPosts: readonly BlogPostSummary[];
}) {
  return (
    <>
      <article data-nav-underlay="cover" className="pb-20 md:pb-28">
        <section className="relative bg-bg px-5 pb-16 pt-32 sm:px-10 sm:pb-20 sm:pt-44">
          <header className="mx-auto max-w-landing">
            <div>
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-2 text-xs text-muted"
              >
                <Link
                  href="/blog/"
                  className="inline-flex min-h-11 items-center rounded-sm text-accent transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-section"
                >
                  Blog
                </Link>
                <span aria-hidden>/</span>
                <Link
                  href={post.category.href}
                  className="inline-flex min-h-11 items-center rounded-sm transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-section"
                >
                  {post.category.label}
                </Link>
              </nav>

              <h1 className="mt-5 max-w-5xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-text sm:text-7xl">
                {post.title}
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-muted sm:text-xl">
                {post.excerpt}
              </p>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted">
                  <Link
                    href={post.author.href}
                    rel="author"
                    className="inline-flex min-h-11 items-center gap-2.5 rounded-sm font-medium text-text transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-section"
                  >
                    <Image
                      src={post.author.portrait}
                      alt=""
                      width={28}
                      height={28}
                      className="rounded-full border border-line"
                    />
                    {post.author.name}
                  </Link>
                  <span aria-hidden className="text-dim">
                    ·
                  </span>
                  <time dateTime={post.publishedAt}>
                    {formatBlogDate(post.publishedAt)}
                  </time>
                  <span aria-hidden className="text-dim">
                    ·
                  </span>
                  <span>{post.readingMinutes} min read</span>
                </div>

                <div className="flex items-center gap-5">
                  <CopyLinkButton />
                  <ShareButton
                    title={post.title}
                    text={post.excerpt}
                    url={`${site.url}/blog/${post.slug}/`}
                  />
                </div>
              </div>
            </div>
          </header>
        </section>
        <Separator aria-hidden className="mx-auto max-w-24 bg-text/15" />

        <div className="px-5 sm:px-10">
          {post.heroImage ? (
            <Image
              src={post.heroImage.src}
              alt={post.heroImage.alt}
              width={post.heroImage.width ?? 1600}
              height={post.heroImage.height ?? 900}
              priority
              sizes="(min-width: 1200px) 1120px, calc(100vw - 3rem)"
              className="mx-auto mt-16 h-auto w-full max-w-[var(--container-blog-media)] rounded-[28px] [corner-shape:superellipse(1.35)] bg-panel-deep md:mt-20"
            />
          ) : null}

          <Prose className="mx-auto mt-12 md:mt-16">{post.body}</Prose>

          <footer className="mx-auto mt-14 max-w-[var(--container-blog-media)] border-t border-line pt-7">
            {post.tags.length > 0 ? (
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 text-sm">
                <span className="font-semibold text-text">Topics</span>
                {post.tags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/blog/tag/${tag.slug}/`}
                    className="inline-flex min-h-11 items-center rounded-sm text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            ) : null}

            <aside className="mt-8 flex gap-4 border-t border-line pt-8 sm:items-center sm:gap-5">
              <Image
                src={post.author.portrait}
                alt=""
                width={60}
                height={60}
                className="h-14 w-14 shrink-0 rounded-full border border-line sm:h-[60px] sm:w-[60px]"
              />
              <div>
                <p className="text-sm font-semibold text-text">
                  {post.author.name}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {post.author.bio}
                </p>
              </div>
            </aside>
          </footer>
        </div>
      </article>

      {relatedPosts.length > 0 ? (
        <section className="mx-auto max-w-[960px] px-6 pb-16 md:pb-20">
          <div className="border-t border-line pt-8">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-text md:text-3xl">
              Related stories
            </h2>
            <div className="mt-3">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <BetaCta placement={ANALYTICS_PLACEMENTS.blog} />
    </>
  );
}
