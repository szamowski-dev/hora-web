import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/blog-icons";
import { formatBlogDate } from "@/lib/blog";
import type { BlogPostSummary } from "@/lib/blog-model";
import { cn } from "@/lib/cn";

export type PostCardVariant = "featured" | "row";

export function PostCard({
  post,
  variant = "row",
  className,
  priority = false,
}: {
  post: BlogPostSummary;
  variant?: PostCardVariant;
  className?: string;
  priority?: boolean;
}) {
  if (variant === "featured") {
    return (
      <article
        className={cn(
          "grid gap-7 border-b border-line pb-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] lg:items-center lg:gap-10",
          className,
        )}
      >
        {post.cover ? (
          <Link
            href={`/blog/${post.slug}/`}
            className="group relative aspect-[16/9] overflow-hidden rounded-lg border border-line bg-panel-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
            aria-label={`Read ${post.title}`}
          >
            <Image
              src={post.cover.src}
              alt={post.cover.alt}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.015] motion-reduce:transition-none"
            />
          </Link>
        ) : null}

        <div className="min-w-0 py-1 lg:py-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
            {post.category.label}
          </span>
          <h2 className="mt-3 text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-text sm:text-4xl lg:text-[2.65rem]">
            <Link
              href={`/blog/${post.slug}/`}
              className="rounded-sm transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {post.title}
            </Link>
          </h2>
          <p className="mt-4 max-w-xl font-editorial text-[17px] leading-7 text-muted md:text-lg md:leading-8">
            {post.excerpt}
          </p>
          <PostMeta post={post} className="mt-6" showAuthorPortrait />
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group grid gap-5 border-b border-line py-7 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center lg:grid-cols-[9rem_minmax(0,1fr)_12.5rem] lg:gap-7",
        className,
      )}
    >
      {post.cover ? (
        <Link
          href={`/blog/${post.slug}/`}
          className="relative aspect-[16/9] overflow-hidden rounded-md border border-line bg-panel-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
          aria-label={`Read ${post.title}`}
        >
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            sizes="(min-width: 640px) 144px, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
          />
        </Link>
      ) : null}

      <div className="min-w-0">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
          {post.category.label}
        </span>
        <h3 className="mt-2 text-xl font-semibold leading-tight tracking-[-0.025em] text-text md:text-2xl">
          <Link
            href={`/blog/${post.slug}/`}
            className="rounded-sm transition-colors group-hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 max-w-2xl font-editorial text-[15px] leading-6 text-muted md:text-base">
          {post.excerpt}
        </p>
        <PostMeta post={post} className="mt-4 lg:hidden" />
      </div>

      <div className="hidden grid-cols-[minmax(0,1fr)_2.75rem] items-center gap-2 lg:grid">
        <PostMeta post={post} showAuthorPortrait layout="stacked" />
        <Link
          href={`/blog/${post.slug}/`}
          aria-label={`Read ${post.title}`}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-overlay hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function PostMeta({
  post,
  className,
  showAuthorPortrait = false,
  layout = "inline",
}: {
  post: BlogPostSummary;
  className?: string;
  showAuthorPortrait?: boolean;
  layout?: "inline" | "stacked";
}) {
  if (layout === "stacked") {
    return (
      <div className={cn("flex min-w-0 items-start gap-3 text-xs", className)}>
        {showAuthorPortrait ? (
          <Image
            src={post.author.portrait}
            alt=""
            width={28}
            height={28}
            className="mt-0.5 shrink-0 rounded-full border border-line"
          />
        ) : null}
        <div className="flex min-w-0 flex-col gap-1 text-muted">
          <span className="whitespace-nowrap font-medium leading-4 text-text">
            {post.author.name}
          </span>
          <time className="whitespace-nowrap leading-4" dateTime={post.publishedAt}>
            {formatBlogDate(post.publishedAt)}
          </time>
          <span className="whitespace-nowrap leading-4">
            {post.readingMinutes} min read
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2.5 gap-y-2 text-xs text-muted",
        className,
      )}
    >
      {showAuthorPortrait ? (
        <Image
          src={post.author.portrait}
          alt=""
          width={28}
          height={28}
          className="rounded-full border border-line"
        />
      ) : null}
      <span className="font-medium text-text">{post.author.name}</span>
      <span aria-hidden className="text-dim">
        ·
      </span>
      <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
      <span aria-hidden className="text-dim">
        ·
      </span>
      <span>{post.readingMinutes} min read</span>
    </div>
  );
}
