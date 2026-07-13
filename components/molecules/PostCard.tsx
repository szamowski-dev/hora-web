import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export type PostCardData = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingMinutes: number;
  tags?: readonly string[];
  cover?: string;
};

export type PostCardVariant = "hero" | "standard" | "list";

export function PostCard({
  post,
  variant = "standard",
  className,
}: {
  post: PostCardData;
  variant?: PostCardVariant;
  className?: string;
}) {
  const isHero = variant === "hero";
  const isList = variant === "list";

  return (
    <Link
      href={`/blog/${post.slug}/`}
      className={cn(
        "ui-interactive ui-panel-soft group relative flex h-full flex-col overflow-hidden rounded-xl shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.1),0_24px_48px_-28px_oklch(0_0_0/0.72)]",
        isList && "rounded-lg",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-5 top-0 z-20 h-px bg-linear-to-r from-transparent via-line-strong to-transparent"
      />

      {post.cover && !isList ? (
        <div
          className={cn(
            "relative w-full overflow-hidden border-b border-line bg-bg",
            isHero ? "aspect-2/1" : "aspect-21/10",
          )}
        >
          <Image
            src={post.cover}
            alt={post.title}
            fill
            sizes={
              isHero
                ? "(min-width: 768px) 720px, 100vw"
                : "(min-width: 768px) 480px, 100vw"
            }
            className="object-cover transition-[filter] duration-300 group-hover:brightness-105 group-hover:saturate-110"
            priority={isHero}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-panel-deep/95 via-panel-deep/5 to-transparent"
          />
          {isHero ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(ellipse 65% 85% at 8% 35%, var(--ui-glow-accent-soft), transparent 72%), radial-gradient(ellipse 58% 72% at 92% 18%, var(--ui-glow-cool-soft), transparent 72%)",
              }}
            />
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          "relative flex flex-1 flex-col",
          isHero ? "p-7 md:p-8" : "p-5 md:p-6",
        )}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          {post.date}
        </p>
        <h3
          className={cn(
            "mt-2 font-semibold leading-tight tracking-tight text-text transition-colors group-hover:text-accent",
            isHero ? "text-2xl md:text-3xl" : "text-lg",
          )}
        >
          {post.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {post.description}
        </p>
        {post.tags && post.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice(0, isHero ? 6 : 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line bg-overlay px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted transition-colors group-hover:border-line-strong"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <div
          className={cn(
            "mt-auto flex items-center gap-1.5 pt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted transition-colors group-hover:text-accent",
          )}
        >
          Read article
          <svg
            aria-hidden
            className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
