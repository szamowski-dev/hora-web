import Image from "next/image";
import Link from "next/link";
import { Prose } from "@/components/atoms/Prose";
import { CopyLinkButton } from "@/components/molecules/CopyLinkButton";
import { HideWhenInView } from "@/components/molecules/HideWhenInView";
import { PostCard } from "@/components/molecules/PostCard";
import { ShareButton } from "@/components/molecules/ShareButton";
import { BetaCta } from "@/components/organisms/BetaCta";
import { BlogDownloadCta } from "@/components/organisms/BlogDownloadCta";
import { Separator } from "@/components/ui/separator";
import { defaultBlogCta } from "@/content/blog-cta";
import { site } from "@/content/site";
import { formatBlogDate } from "@/lib/blog";
import { ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";
import type { BlogCtaContent } from "@/lib/blog-cta-model";
import type {
  BlogPostDetail,
  BlogPostSummary,
} from "@/lib/blog-model";

/** The rail watches this element and steps aside once it reaches the viewport. */
const BLOG_CTA_BAND_ID = "blog-post-download";

export function BlogPostLayout({
  post,
  relatedPosts,
  cta = defaultBlogCta,
  showDirectDownload = false,
}: {
  post: BlogPostDetail;
  relatedPosts: readonly BlogPostSummary[];
  cta?: BlogCtaContent;
  showDirectDownload?: boolean;
}) {
  return (
    <>
      <article data-nav-underlay="cover" className="pb-20 md:pb-28">
        <section className="relative bg-bg px-5 pb-16 pt-32 sm:px-10 sm:pb-20 sm:pt-44">
          <header className="mx-auto max-w-landing lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-x-12">
            {/* The breadcrumb spans both columns, so the banner starts on the
                grid row the title starts on and their top edges line up. */}
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-xs text-muted lg:col-span-2"
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

            <div>
              <h1 className="mt-5 max-w-5xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-text sm:text-7xl lg:text-5xl xl:text-6xl">
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

            <BlogDownloadCta
              variant="aside"
              content={cta}
              showDirectDownload={showDirectDownload}
              className="mt-10 lg:mt-5"
            />
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

          {/* The rail hangs off the right edge of the article column, outside
              the content canvas, and only once the viewport has room for it.
              `inset-y-0` bounds the sticky travel to the article body, so it
              scrolls in below the hero image and stops before the Topics
              footer without any scroll JS. */}
          <div className="relative mx-auto mt-12 max-w-[var(--container-article)] md:mt-16">
            <Prose>{post.body}</Prose>

            <HideWhenInView
              watchId={BLOG_CTA_BAND_ID}
              className="absolute inset-y-0 left-full ml-6 hidden w-52 transition-opacity duration-300 data-[out-of-view]:pointer-events-none data-[out-of-view]:opacity-0 min-[1400px]:block"
            >
              <BlogDownloadCta
                variant="rail"
                content={cta}
                showDirectDownload={showDirectDownload}
                className="sticky top-28"
              />
            </HideWhenInView>
          </div>

          <BlogDownloadCta
            id={BLOG_CTA_BAND_ID}
            variant="band"
            content={cta}
            showDirectDownload={showDirectDownload}
            className="mt-14 max-w-[var(--container-blog-media)]"
          />

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
