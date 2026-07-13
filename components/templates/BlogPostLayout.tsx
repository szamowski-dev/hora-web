import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import { Prose } from "@/components/atoms/Prose";
import { Tag } from "@/components/atoms/Tag";
import { BetaCta } from "@/components/organisms/BetaCta";
import type { PostFrontmatter, PostMeta } from "@/lib/mdx";

type Adjacent = Pick<PostMeta, "slug"> & { title: string };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogPostLayout({
  frontmatter,
  previous,
  next,
  children,
}: {
  frontmatter: PostFrontmatter;
  previous?: Adjacent | null;
  next?: Adjacent | null;
  children: React.ReactNode;
}) {
  const dateIso = frontmatter.date.length > 10
    ? frontmatter.date
    : `${frontmatter.date}T00:00:00Z`;

  return (
    <>
      <article className="mx-auto max-w-295 px-6 py-12 md:py-16">
        <Link
          href="/blog/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
        >
          ← All posts
        </Link>

        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
          {frontmatter.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href="/about/"
            className="group inline-flex items-center gap-2.5"
            rel="author"
          >
            <Image
              src="/assets/maciej_szamowski.jpg"
              alt="Maciej Szamowski"
              width={32}
              height={32}
              className="rounded-full border border-white/10"
            />
            <span className="text-sm font-medium text-text transition-colors group-hover:text-accent">
              Maciej Szamowski
            </span>
          </Link>
          <span aria-hidden className="text-muted">
            ·
          </span>
          <time dateTime={dateIso} className="text-sm font-medium text-muted">
            {formatDate(frontmatter.date)}
          </time>
        </div>

        {frontmatter.tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {frontmatter.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        ) : null}

        <Prose className="mt-10">{children}</Prose>

        <aside className="mt-16 border-t border-border pt-8">
          <Link
            href="/about/"
            className="ui-interactive group flex flex-col gap-5 rounded-lg border border-line bg-overlay p-5 shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.08)] sm:flex-row sm:items-center sm:gap-6"
          >
            <Image
              src="/assets/maciej_szamowski.jpg"
              alt="Maciej Szamowski"
              width={64}
              height={64}
              className="shrink-0 rounded-full border border-white/10"
            />
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Written by
              </p>
              <p className="mt-1 text-lg font-semibold text-text transition-colors group-hover:text-accent">
                Maciej Szamowski
              </p>
              <p className="mt-1 text-sm text-muted">
                Marketer of 16 years turned solo macOS developer. Building hora
                Calendar in public from Poland.
              </p>
            </div>
            <Icon
              name="arrow-right"
              size={20}
              className="shrink-0 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
            />
          </Link>
        </aside>

        {previous || next ? (
          <nav
            aria-label="More posts"
            className="mt-10 grid gap-4 sm:grid-cols-2"
          >
            {previous ? (
              <Link
                href={`/blog/${previous.slug}/`}
                className="ui-interactive group rounded-md border border-line bg-overlay p-5"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  ← Previous
                </span>
                <span className="mt-2 block text-base font-semibold text-text group-hover:text-accent">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/blog/${next.slug}/`}
                className="ui-interactive group rounded-md border border-line bg-overlay p-5 text-right sm:text-right"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Next →
                </span>
                <span className="mt-2 block text-base font-semibold text-text group-hover:text-accent">
                  {next.title}
                </span>
              </Link>
            ) : null}
          </nav>
        ) : null}
      </article>

      <BetaCta placement="stay_in_loop" />
    </>
  );
}
