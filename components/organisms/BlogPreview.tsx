import Link from "next/link";
import type { PostCardData } from "@/components/molecules/PostCard";
import { home } from "@/content/home";

export function BlogPreview({ posts }: { posts: readonly PostCardData[] }) {
  if (posts.length === 0) return null;
  const b = home.blogPreview;

  return (
    <section
      id="blog"
      className="relative overflow-hidden border-y border-white/8 bg-[#0b0c0f] py-20 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 760px 420px at 88% 0%, rgba(255,56,60,0.09), transparent 66%)," +
            "radial-gradient(ellipse 760px 420px at 8% 100%, rgba(34,79,136,0.16), transparent 72%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(131,199,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(131,199,255,0.07) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-295 px-6">
        <div className="flex flex-col gap-5 border-b border-white/12 pb-8 md:flex-row md:items-end md:justify-between md:pb-10">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
            {b.heading.prefix}
            <span className="text-accent"> {b.heading.suffixGradient}</span>
          </h2>
          <p className="max-w-sm text-sm leading-6 text-muted md:text-right">
            Notes on building a faster, more native calendar for the Mac.
          </p>
        </div>

        <div className="shader-panel relative mt-10 overflow-hidden rounded-xl border border-white/[0.085] bg-[#080a0d]/72 md:mt-12 md:grid md:grid-cols-[1.35fr_1fr]">
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
                  ? "group relative border-b border-white/[0.08] px-6 py-10 transition-colors hover:bg-white/[0.025] md:row-span-2 md:border-r md:px-10 md:py-12"
                  : "group relative border-b border-white/[0.08] px-6 py-9 transition-colors last:border-b-0 hover:bg-white/[0.025] md:px-9 md:py-10"
              }
            >
              <span
                aria-hidden
                className="absolute right-5 top-4 font-mono text-[10px] tracking-[0.18em] text-white/15"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(255,56,60,0.12),rgba(34,79,136,0.07)_38%,transparent_70%)] opacity-0 blur-2xl transition-opacity group-hover:opacity-100"
              />
              <article className="flex h-full flex-col">
                <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.17em] text-muted">
                  <time dateTime={post.date}>{post.date}</time>
                  {post.tags?.[0] ? (
                    <>
                      <span className="h-px w-5 bg-white/18" />
                      <span>{post.tags[0]}</span>
                    </>
                  ) : null}
                </div>
                <h3
                  className={
                    index === 0
                      ? "mt-5 max-w-2xl text-3xl font-semibold leading-[1.08] tracking-tight text-text transition-colors group-hover:text-accent md:text-5xl"
                      : "mt-4 text-xl font-semibold leading-tight tracking-tight text-text transition-colors group-hover:text-accent md:text-2xl"
                  }
                >
                  {post.title}
                </h3>
                <p
                  className={
                    index === 0
                      ? "mt-5 max-w-xl text-base leading-7 text-muted md:text-lg md:leading-8"
                      : "mt-3 max-w-xl text-sm leading-6 text-muted"
                  }
                >
                  {post.description}
                </p>
                <span className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.17em] text-muted transition-colors group-hover:text-text">
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
            className="inline-flex items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-accent/30 hover:bg-white/[0.045] hover:text-text"
          >
            {b.allPostsLink.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
