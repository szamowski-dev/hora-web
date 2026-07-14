import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostLayout } from "@/components/templates/BlogPostLayout";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const fm = post.frontmatter;
  const og = fm.ogImage || fm.cover || "/assets/seo/default-og-image.png";
  const canonical = `/blog/${slug}/`;
  return {
    title: fm.title,
    description: fm.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: fm.title,
      description: fm.description,
      url: `https://horacal.app${canonical}`,
      images: [{ url: og }],
      publishedTime: fm.date,
      authors: ["Maciej Szamowski"],
    },
    twitter: {
      card: "summary_large_image",
      title: fm.title,
      description: fm.description,
      images: [og],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getAllPosts(),
  ]);
  if (!post) notFound();

  const idx = allPosts.findIndex((p) => p.slug === slug);
  // allPosts is sorted newest → oldest, so the "previous" post (older) is
  // at idx+1, and the "next" post (newer) is at idx-1.
  const previous = allPosts[idx + 1]
    ? { slug: allPosts[idx + 1].slug, title: allPosts[idx + 1].frontmatter.title }
    : null;
  const next = allPosts[idx - 1]
    ? { slug: allPosts[idx - 1].slug, title: allPosts[idx - 1].frontmatter.title }
    : null;

  const fm = post.frontmatter;
  const og = fm.ogImage || fm.cover || "/assets/seo/default-og-image.png";
  const url = `https://horacal.app/blog/${slug}/`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: fm.title,
        description: fm.description,
        datePublished: fm.date,
        dateModified: fm.date,
        author: {
          "@type": "Person",
          name: "Maciej Szamowski",
          url: "https://szamowski.dev",
        },
        publisher: { "@id": "https://horacal.app/#organization" },
        url,
        image: og.startsWith("http") ? og : `https://horacal.app${og}`,
        mainEntityOfPage: url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://horacal.app/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: "https://horacal.app/blog/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: fm.title,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <>
      <BlogPostLayout frontmatter={fm} previous={previous} next={next}>
        {post.content}
      </BlogPostLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
