import type { ReactNode } from "react";

export const BLOG_CATEGORIES = [
  {
    slug: "guides",
    label: "Guides",
    description:
      "Practical guides for using Google Calendar and choosing a better calendar workflow on the Mac.",
  },
  {
    slug: "build-notes",
    label: "Build notes",
    description:
      "Honest notes from designing, testing, breaking, and shipping hora Calendar in public.",
  },
  {
    slug: "engineering",
    label: "Engineering",
    description:
      "Technical stories about SwiftUI, calendar sync, APIs, performance, and native macOS development.",
  },
  {
    slug: "product-updates",
    label: "Product updates",
    description:
      "New releases, beta milestones, and meaningful changes to hora Calendar.",
  },
] as const;

export type BlogCategorySlug = (typeof BLOG_CATEGORIES)[number]["slug"];

export type BlogCategory = {
  slug: BlogCategorySlug;
  label: string;
  description: string;
  href: string;
};

export type BlogImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type BlogAuthor = {
  name: string;
  role: string;
  bio: string;
  href: string;
  portrait: string;
};

export type BlogPostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingMinutes: number;
  category: BlogCategory;
  tags: readonly string[];
  cover?: BlogImage;
  featured: boolean;
  author: BlogAuthor;
};

export type BlogPostDetail = BlogPostSummary & {
  heroImage?: BlogImage;
  body: ReactNode;
};

export type BlogFaqItem = {
  id: string;
  question: string;
  answer: string;
  answerLink?: {
    href: string;
    label: string;
    trailingText?: string;
  };
};

export type BlogFaqBlock = {
  id: string;
  heading?: string;
  intro?: string;
  items: readonly BlogFaqItem[];
};

export const BLOG_AUTHOR: BlogAuthor = {
  name: "Maciej Szamowski",
  role: "Founder and developer",
  bio: "Marketer of 16 years turned solo macOS developer. Building hora Calendar in public from Poland.",
  href: "/about/",
  portrait: "/assets/people/maciej-szamowski.jpg",
};

export function isBlogCategorySlug(value: string): value is BlogCategorySlug {
  return BLOG_CATEGORIES.some((category) => category.slug === value);
}

export function getBlogCategory(slug: BlogCategorySlug): BlogCategory {
  const category = BLOG_CATEGORIES.find((item) => item.slug === slug);
  if (!category) {
    throw new Error(`Unknown blog category: ${slug}`);
  }

  return {
    ...category,
    href: `/blog/category/${category.slug}/`,
  };
}
