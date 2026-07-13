import Link from "next/link";
import type { PostCardData } from "@/components/molecules/PostCard";
import { SectionBackdrop } from "@/components/atoms/SectionBackdrop";
import { home } from "@/content/home";

export function BlogPreview({ posts }: { posts: readonly PostCardData[] }) {
  if (posts.length === 0) return null;
  const b = home.blogPreview;

  return (
    <section
      id="blog"
      className="home-section relative overflow-hidden border-y py-20 md:py-24"
    >
      <SectionBackdrop direction="right" />

      <div className="relative mx-auto max-w-295 px-6">
        <div className="flex flex-col gap-5 border-b border-line-strong pb-8 md:flex-row md:items-end md:justify-between md:pb-10">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
            {b.heading.prefix}
            <span className="text-accent"> {b.heading.suffixGradient}</span>
          </h2>
          <p className="max-w-sm text-sm leading-6 text-muted md:text-right">
            Notes on building a faster, more native calendar for the Mac.
          </p>
        </div>

        <div className="relative mt-8 grid gap-3 md:mt-12 md:grid-cols-[1.35fr_1fr] md:gap-0 md:overflow-hidden md:rounded-xl md:border md:border-line md:bg-panel-deep">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent"
          />
          {posts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}/`}
              className={
                index === 0
                  ? "ui-interactive ui-panel-soft group relative overflow-hidden rounded-xl px-5 py-7 md:row-span-2 md:rounded-none md:border-0 md:border-r md:border-line md:bg-transparent md:px-10 md:py-12"
                  : "ui-interactive ui-panel-soft group relative overflow-hidden rounded-xl px-5 py-6 md:rounded-none md:border-0 md:border-b md:border-line md:bg-transparent md:px-9 md:py-10 md:last:border-b-0"
              }
            >
              <span
                aria-hidden
                className="absolute right-5 top-4 font-mono text-[10px] tracking-[0.18em] text-dim"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[radial-gradient(circle,var(--ui-glow-accent-soft),var(--ui-glow-cool-faint)_38%,transparent_70%)] opacity-0 blur-2xl transition-opacity group-hover:opacity-100"
              />
              {index === 0 ? (
                <>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-64 opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(ellipse 72% 92% at 10% 110%, var(--ui-glow-accent-medium) 0%, transparent 68%), radial-gradient(ellipse 68% 82% at 88% 112%, var(--ui-glow-cool-medium) 0%, transparent 72%), linear-gradient(160deg, transparent 28%, var(--ui-glow-accent-faint) 72%, var(--ui-glow-cool-faint) 100%)",
                    }}
                  />
                  <span
                    aria-hidden
                    className="home-grid pointer-events-none absolute inset-x-0 bottom-0 h-52 opacity-15 [mask-image:linear-gradient(to_bottom,transparent,black)]"
                    style={{ backgroundSize: "36px 36px" }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-10 bottom-0 h-px bg-linear-to-r from-transparent via-accent/45 to-accent-cool/35"
                  />
                </>
              ) : null}
              <article className="relative z-10 flex h-full flex-col">
                <div className="flex min-w-0 items-center gap-3 pr-8 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted sm:text-[11px] sm:tracking-[0.17em]">
                  <time dateTime={post.date}>{post.date}</time>
                  <span className="h-px w-5 bg-white/18" />
                  <span className="shrink-0">{post.readingMinutes} min read</span>
                </div>
                <h3
                  className={
                    index === 0
                      ? "mt-4 max-w-2xl text-2xl font-semibold leading-[1.1] tracking-tight text-text transition-colors group-hover:text-accent sm:text-3xl md:mt-5 md:text-5xl"
                      : "mt-3 text-xl font-semibold leading-tight tracking-tight text-text transition-colors group-hover:text-accent md:mt-4 md:text-2xl"
                  }
                >
                  {post.title}
                </h3>
                <p
                  className={
                    index === 0
                      ? "mt-4 line-clamp-3 max-w-xl text-sm leading-6 text-muted sm:text-base md:mt-5 md:line-clamp-none md:text-lg md:leading-8"
                      : "mt-3 line-clamp-2 max-w-xl text-sm leading-6 text-muted md:line-clamp-none"
                  }
                >
                  {post.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted transition-colors group-hover:text-text md:mt-7 md:text-xs md:tracking-[0.17em]">
                  Read article
                  <span
                    aria-hidden
                    className="text-accent transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </article>
            </Link>
          ))}
        </div>

        <div className="pt-7 text-right md:pt-8">
          <Link
            href={b.allPostsLink.href}
            className="ui-interactive inline-flex items-center gap-2 rounded-md border border-line bg-overlay px-4 py-2.5 text-sm font-medium text-muted hover:text-text"
          >
            {b.allPostsLink.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
