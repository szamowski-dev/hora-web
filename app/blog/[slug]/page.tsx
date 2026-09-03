import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostLayout } from "@/components/templates/BlogPostLayout";
import { site } from "@/content/site";
import { getRelatedPosts } from "@/lib/blog";
import { getBlogCta } from "@/lib/blog-cta-repository";
import { getPricingPage } from "@/lib/pricing-repository";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
} from "@/lib/blog-repository";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllBlogPosts({
    perspective: "published",
    stega: false,
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, {
    perspective: "published",
    stega: false,
  });
  if (!post) return {};

  const image = post.ogImage ?? post.heroImage;
  const imageUrl = image?.src ?? "/assets/seo/default-og-image.png";
  const canonical = post.seo.canonicalUrl || `/blog/${slug}/`;
  const canonicalUrl = absoluteUrl(canonical);

  return {
    title: post.seo.title,
    description: post.seo.description,
    alternates: { canonical },
    robots: { index: !post.seo.noIndex, follow: true },
    openGraph: {
      type: "article",
      title: post.seo.title,
      description: post.seo.description,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          ...(image?.width ? { width: image.width } : {}),
          ...(image?.height ? { height: image.height } : {}),
          alt: image?.alt || post.title,
        },
      ],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.title,
      description: post.seo.description,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [post, allPosts, cta, pricing] = await Promise.all([
    getBlogPostBySlug(slug),
    getAllBlogPosts(),
    getBlogCta(),
    getPricingPage(),
  ]);
  if (!post) notFound();

  const image = post.ogImage ?? post.heroImage;
  const imageUrl = absoluteUrl(
    image?.src ?? "/assets/seo/default-og-image.png",
  );
  const url = absoluteUrl(post.seo.canonicalUrl || `/blog/${slug}/`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: {
          "@type": "Person",
          name: post.author.name,
          url: absoluteUrl(post.author.href),
        },
        publisher: { "@id": "https://horacal.app/#organization" },
        url,
        image: imageUrl,
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
            name: post.title,
            item: url,
          },
        ],
      },
    ],
  };
  const serializedJsonLd = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <>
      <BlogPostLayout
        post={post}
        relatedPosts={getRelatedPosts(allPosts, slug)}
        cta={cta}
        showDirectDownload={pricing.direct.showDownload}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializedJsonLd }}
      />
    </>
  );
}

function absoluteUrl(value: string): string {
  return new URL(value, site.url).toString();
}
