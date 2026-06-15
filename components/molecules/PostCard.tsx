import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export type PostCardData = {
  slug: string;
  title: string;
  description: string;
  date: string;
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
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_24px_48px_-28px_rgba(0,0,0,0.55)] transition-all duration-300 hover:border-accent/35 hover:bg-white/6 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_32px_60px_-24px_rgba(255,56,60,0.28)]",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-5 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent"
      />

      {post.cover && !isList ? (
        <div
          className={cn(
            "relative w-full overflow-hidden border-b border-white/8 bg-bg",
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
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            priority={isHero}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-bg/50 via-transparent to-transparent"
          />
        </div>
      ) : null}

      <div
        className={cn(
          "relative flex flex-1 flex-col",
          isHero ? "p-7 md:p-8" : "p-6",
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
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted"
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
          Read
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
