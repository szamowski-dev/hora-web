import type { Metadata } from "next";
import Link from "next/link";
import { BetaCta } from "@/components/organisms/BetaCta";
import { SitePageHero } from "@/components/templates/SitePageHero";
import { ChevronRightIcon } from "@/components/ui/blog-icons";
import { ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";
import { getMonthlyArchives } from "@/lib/blog";
import { getAllBlogPosts } from "@/lib/blog-repository";
import { breadcrumbList } from "@/lib/jsonld";
import { defaultOg } from "@/lib/og";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Mac Calendar Blog Archive",
  description:
    "Browse hora Calendar blog posts by month, including Mac calendar product updates, SwiftUI engineering notes, Google Calendar sync work, and launch reports.",
  alternates: { canonical: "/blog/archive/" },
  robots: { index: false, follow: true },
  openGraph: defaultOg({
    title: "hora Calendar Blog Archive",
    description:
      "Browse hora Calendar blog posts by month, including Mac calendar product updates, SwiftUI engineering notes, Google Calendar sync work, and launch reports.",
    url: "https://horacal.app/blog/archive/",
  }),
};

export default async function BlogArchiveIndexPage() {
  const posts = await getAllBlogPosts();
  const archives = getMonthlyArchives(posts);
  const breadcrumbs = breadcrumbList([
    { name: "Home", url: "https://horacal.app/" },
    { name: "Blog", url: "https://horacal.app/blog/" },
    { name: "Archive", url: "https://horacal.app/blog/archive/" },
  ]);

  return (
    <>
      <SitePageHero
        title="Archive"
        description="Every story from building hora Calendar, organized by month."
        meta={
          <Link href="/blog/" className="text-muted hover:text-text">
            Back to Blog
          </Link>
        }
      />

      <section className="mx-auto max-w-landing px-5 pb-20 pt-14 sm:px-10 sm:pb-28 sm:pt-20">
        <div className="border-t border-line">
          {archives.map((archive) => (
            <Link
              key={archive.slug}
              href={archive.href}
              className="group flex min-h-16 items-center justify-between gap-4 border-b border-line py-4 text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:text-accent"
            >
              <span className="font-medium">{archive.label}</span>
              <span className="flex items-center gap-4 text-sm">
                {archive.count} {archive.count === 1 ? "post" : "posts"}
                <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <BetaCta placement={ANALYTICS_PLACEMENTS.blog} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  );
}
