import Link from "next/link";
import { PostCard, type PostCardData } from "@/components/molecules/PostCard";
import { home } from "@/content/home";

export function BlogPreview({ posts }: { posts: readonly PostCardData[] }) {
  if (posts.length === 0) return null;
  const b = home.blogPreview;

  return (
    <section
      id="blog"
      className="relative overflow-hidden border-y border-white/8 bg-[#0b0c0f] py-20 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 700px 400px at 80% 0%, rgba(255,56,60,0.10), transparent 64%)," +
            "radial-gradient(ellipse 780px 460px at 20% 92%, rgba(131,199,255,0.08), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 20%, black 82%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-295 px-6">
        <div className="flex max-w-5xl flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
            {b.heading.prefix}
            <span className="text-accent"> {b.heading.suffixGradient}</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:mt-14 md:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              post={post}
              className="rounded-lg border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]"
            />
          ))}
        </div>

        <div className="mt-12 text-center md:mt-14">
          <Link
            href={b.allPostsLink.href}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 bg-white/4 px-4 text-sm text-muted transition-colors hover:border-accent/40 hover:bg-white/[0.07] hover:text-text"
          >
            {b.allPostsLink.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
