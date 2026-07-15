import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import type { PluggableList } from "unified";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { ContentLink } from "@/components/atoms/ContentLink";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type PageFrontmatter = {
  title: string;
  description: string;
  lastUpdated: string;
};

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
    components: { a: ContentLink },
  });
  return { content, frontmatter };
});
