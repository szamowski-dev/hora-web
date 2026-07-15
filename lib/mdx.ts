import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import type { PluggableList } from "unified";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "@/components/mdx";
import {
  isBlogCategorySlug,
  type BlogCategorySlug,
} from "@/lib/blog-model";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type PageFrontmatter = {
  title: string;
  description: string;
  lastUpdated: string;
};

type PostFrontmatterRaw = {
  title: string;
  date: string;
  updated?: string;
  description: string;
  category: string;
  tags?: string;
  cover?: string;
  ogImage?: string;
  featured?: boolean;
  heroImage?: string;
  heroAlt?: string;
};

export type PostFrontmatter = Omit<PostFrontmatterRaw, "tags" | "category"> & {
  category: BlogCategorySlug;
  tags: string[];
};

export type PostMeta = {
  slug: string;
  frontmatter: PostFrontmatter;
  readingMinutes: number;
};

export type Post = PostMeta & {
  content: React.ReactNode;
};

function parseTags(tags: string | undefined): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function formatDate(date: string): string {
  return date.length > 10 ? date : date;
}

function normalizeFrontmatter(frontmatter: PostFrontmatterRaw): PostFrontmatter {
  if (!isBlogCategorySlug(frontmatter.category)) {
    throw new Error(`Invalid blog category: ${frontmatter.category}`);
  }

  return {
    ...frontmatter,
    category: frontmatter.category,
    date: formatDate(frontmatter.date),
    updated: frontmatter.updated
      ? formatDate(frontmatter.updated)
      : undefined,
    tags: parseTags(frontmatter.tags),
  };
}

function estimateReadingMinutes(source: string): number {
  const content = source
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, " ");
  const words = content.match(/[\p{L}\p{N}’'-]+/gu)?.length ?? 0;

  return Math.max(1, Math.ceil(words / 220));
}

const remarkPlugins: PluggableList = [remarkGfm];

const rehypePlugins: PluggableList = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: "append",
      properties: {
        className: ["heading-anchor"],
        ariaLabel: "Link to section",
      },
    },
  ],
  [
    rehypePrettyCode,
    {
      theme: "github-dark-dimmed",
      keepBackground: true,
      defaultLang: "plaintext",
    },
  ],
];

const mdxOptions = { remarkPlugins, rehypePlugins };

export const getPageMdx = cache(async (slug: string) => {
  const filePath = path.join(CONTENT_DIR, "pages", `${slug}.mdx`);
  const raw = await readFile(filePath, "utf-8");
  const { content, frontmatter } = await compileMDX<PageFrontmatter>({
    source: raw,
    options: { parseFrontmatter: true, mdxOptions },
    components: mdxComponents,
  });
  return { content, frontmatter };
});

export const getAllPosts = cache(async (): Promise<PostMeta[]> => {
  const dir = path.join(CONTENT_DIR, "posts");
  const files = await readdir(dir);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = await readFile(path.join(dir, file), "utf-8");
      const { frontmatter } = await compileMDX<PostFrontmatterRaw>({
        source: raw,
        options: { parseFrontmatter: true },
      });
      return {
        slug,
        readingMinutes: estimateReadingMinutes(raw),
        frontmatter: normalizeFrontmatter(frontmatter),
      } satisfies PostMeta;
    }),
  );
  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  );
});

export const getPostBySlug = cache(
  async (slug: string): Promise<Post | null> => {
    const filePath = path.join(CONTENT_DIR, "posts", `${slug}.mdx`);
    try {
      const raw = await readFile(filePath, "utf-8");
      const { content, frontmatter } = await compileMDX<PostFrontmatterRaw>({
        source: raw,
        options: { parseFrontmatter: true, mdxOptions },
        components: mdxComponents,
      });
      return {
        slug,
        readingMinutes: estimateReadingMinutes(raw),
        frontmatter: normalizeFrontmatter(frontmatter),
        content,
      };
    } catch {
      return null;
    }
  },
);
