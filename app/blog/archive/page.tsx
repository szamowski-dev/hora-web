import type { Metadata } from "next";
import Link from "next/link";
import { StayInLoopCta } from "@/components/organisms/StayInLoopCta";
import { getMonthlyArchives } from "@/lib/blog";
import { breadcrumbList } from "@/lib/jsonld";
import { getAllPosts } from "@/lib/mdx";
import { defaultOg } from "@/lib/og";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Mac Calendar Blog Archive",
  description:
    "Browse hora Calendar blog posts by month, including Mac calendar product updates, SwiftUI engineering notes, Google Calendar sync work, and launch reports.",
  alternates: { canonical: "/blog/archive/" },
  openGraph: defaultOg({
    title: "hora Calendar Blog Archive",
    description:
      "Browse hora Calendar blog posts by month, including Mac calendar product updates, SwiftUI engineering notes, Google Calendar sync work, and launch reports.",
    url: "https://horacal.app/blog/archive/",
  }),
};

export default async function BlogArchiveIndexPage() {
  const posts = await getAllPosts();
  const archives = getMonthlyArchives(posts);
  const breadcrumbs = breadcrumbList([
    { name: "Home", url: "https://horacal.app/" },
    { name: "Blog", url: "https://horacal.app/blog/" },
    { name: "Archive", url: "https://horacal.app/blog/archive/" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <section className="mx-auto max-w-[1180px] px-6 pt-16 md:pt-24">
        <div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
            Monthly <span className="text-accent">Archive</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
            Browse every hora Calendar update by month, from early SwiftUI prototypes
            and Google Calendar sync notes to public beta fixes, launch planning, and
            product comparisons for Mac users who live in Google Calendar.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-12 md:py-16">
        <div className="flex flex-col gap-3">
          {archives.map((archive) => (
            <Link
              key={archive.slug}
              href={archive.href}
              className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.035] px-5 py-4 text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors hover:border-accent/35 hover:text-text"
            >
              <span className="font-medium">{archive.label}</span>
              <span className="text-sm">{archive.count} posts</span>
            </Link>
          ))}
        </div>
      </section>

      <StayInLoopCta />
    </>
  );
}
