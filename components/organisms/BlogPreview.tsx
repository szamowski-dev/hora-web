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
            "radial-gradient(ellipse 760px 420px at 88% 0%, rgba(255,56,60,0.08), transparent 66%)," +
            "radial-gradient(ellipse 760px 420px at 8% 100%, rgba(131,199,255,0.05), transparent 72%)",
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

        <div className="grid md:grid-cols-[1.35fr_1fr]">
          {posts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}/`}
              className={
                index === 0
                  ? "group border-b border-white/12 py-10 md:row-span-2 md:border-r md:py-12 md:pr-14"
                  : "group border-b border-white/12 py-9 md:py-10 md:pl-12"
              }
            >
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

        <div className="pt-8 text-right md:pt-10">
          <Link
            href={b.allPostsLink.href}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-text"
          >
            {b.allPostsLink.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
