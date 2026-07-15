import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { getCliClient } from "sanity/cli";
import { calculateReadingMinutes } from "../sanity/lib/readingTime";

const API_VERSION = "2026-07-15";
const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const AUTHOR_ID = "author-maciej-szamowski";

function postDocumentId(slug: string) {
  return `blog-post-${slug}`;
}

function categoryDocumentId(slug: string) {
  return `blog-category-${slug}`;
}

function tagDocumentId(slug: string) {
  return `blog-tag-${slug}`;
}

type Reference = { _type?: string; _ref?: string };

type SanityPost = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  description?: string;
  publishedAt?: string;
  contentUpdatedAt?: string;
  readingMinutes?: number;
  author?: Reference;
  category?: Reference;
  tags?: Reference[];
  heroImage?: { alt?: string; asset?: Reference };
  body?: Array<Record<string, unknown>>;
  seo?: { noIndex?: boolean };
  legacySourceFile?: string;
  legacyChecksum?: string;
};

type Snapshot = {
  posts: SanityPost[];
  categories: Array<{ _id: string; slug?: { current?: string } }>;
  tags: Array<{ _id: string; slug?: { current?: string } }>;
  authors: Array<{ _id: string }>;
  settings: { _id?: string; featuredPost?: Reference } | null;
};

function fail(message: string): never {
  throw new Error(`Sanity blog verification failed: ${message}`);
}

function expect(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function normalizeDate(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === "string" ? value.slice(0, 10) : "";
}

function parseTags(value: unknown) {
  return (Array.isArray(value)
    ? value.map(String)
    : typeof value === "string"
      ? value.split(",")
      : []
  )
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function collectReferences(value: unknown, output = new Set<string>()) {
  if (!value || typeof value !== "object") return output;
  if (Array.isArray(value)) {
    for (const item of value) collectReferences(item, output);
    return output;
  }
  const record = value as Record<string, unknown>;
  if (typeof record._ref === "string") output.add(record._ref);
  for (const child of Object.values(record)) collectReferences(child, output);
  return output;
}

function countBodyTypes(posts: SanityPost[]) {
  const counts = new Map<string, number>();
  let faqItems = 0;
  for (const post of posts) {
    for (const block of post.body ?? []) {
      const type = typeof block._type === "string" ? block._type : "missing";
      counts.set(type, (counts.get(type) ?? 0) + 1);
      if (type === "blogFaq" && Array.isArray(block.items)) {
        faqItems += block.items.length;
      }
    }
  }
  return { counts, faqItems };
}

async function localSources() {
  const files = (await readdir(POSTS_DIR))
    .filter((file) => file.endsWith(".mdx"))
    .sort();
  return Promise.all(
    files.map(async (file) => {
      const raw = await readFile(path.join(POSTS_DIR, file), "utf8");
      const parsed = matter(raw);
      const data = parsed.data as Record<string, unknown>;
      return {
        file,
        slug: file.replace(/\.mdx$/, ""),
        title: String(data.title ?? ""),
        description: String(data.description ?? ""),
        publishedAt: normalizeDate(data.date),
        contentUpdatedAt: normalizeDate(data.updated ?? data.date),
        category: String(data.category ?? ""),
        tags: parseTags(data.tags).sort(),
        heroAlt: String(data.heroAlt ?? ""),
        checksum: createHash("sha256").update(raw).digest("hex"),
        featured: data.featured === true,
      };
    }),
  );
}

async function main() {
  const client = getCliClient({ apiVersion: API_VERSION });
  const [sources, snapshot] = await Promise.all([
    localSources(),
    client.fetch<Snapshot>(`{
      "posts": *[_type == "blogPost"] | order(publishedAt asc) {
        _id,
        title,
        slug,
        description,
        publishedAt,
        contentUpdatedAt,
        readingMinutes,
        author,
        category,
        tags,
        heroImage,
        body,
        seo,
        legacySourceFile,
        legacyChecksum
      },
      "categories": *[_type == "blogCategory"] {_id, slug},
      "tags": *[_type == "blogTag"] {_id, slug},
      "authors": *[_type == "author"] {_id},
      "settings": *[_id == "blogSettings"][0] {_id, featuredPost}
    }`),
  ]);

  expect(snapshot.posts.length === 20, `found ${snapshot.posts.length} posts, expected 20`);
  expect(snapshot.categories.length === 4, `found ${snapshot.categories.length} categories, expected 4`);
  expect(snapshot.tags.length === 68, `found ${snapshot.tags.length} tags, expected 68`);
  expect(snapshot.authors.length === 1, `found ${snapshot.authors.length} authors, expected 1`);
  expect(snapshot.authors[0]?._id === AUTHOR_ID, "author document is missing or has an unexpected ID");
  expect(snapshot.settings?._id === "blogSettings", "blogSettings singleton is missing");

  const publicDocumentIds = [
    ...snapshot.posts.map((post) => post._id),
    ...snapshot.categories.map((category) => category._id),
    ...snapshot.tags.map((tag) => tag._id),
    ...snapshot.authors.map((author) => author._id),
    ...(snapshot.settings?._id ? [snapshot.settings._id] : []),
  ];
  const dotIds = publicDocumentIds.filter((id) => id.includes("."));
  expect(
    dotIds.length === 0,
    `public blog document IDs contain dots: ${dotIds.join(", ")}`,
  );

  const postsBySlug = new Map(
    snapshot.posts.map((post) => [post.slug?.current ?? "", post]),
  );
  expect(postsBySlug.size === snapshot.posts.length, "post slugs are missing or duplicated");

  for (const source of sources) {
    const post = postsBySlug.get(source.slug);
    expect(post, `missing post ${source.slug}`);
    expect(post._id === postDocumentId(source.slug), `${source.slug} has an unexpected document ID`);
    expect(post.title === source.title, `${source.slug} title differs from MDX`);
    expect(post.description === source.description, `${source.slug} description differs from MDX`);
    expect(post.publishedAt === source.publishedAt, `${source.slug} published date differs from MDX`);
    expect(post.contentUpdatedAt === source.contentUpdatedAt, `${source.slug} updated date differs from MDX`);
    expect(
      post.readingMinutes === calculateReadingMinutes(post.body),
      `${source.slug} reading time differs from its Portable Text body`,
    );
    expect(post.author?._ref === AUTHOR_ID, `${source.slug} author reference is wrong`);
    expect(post.category?._ref === categoryDocumentId(source.category), `${source.slug} category differs from MDX`);
    const tagSlugs = (post.tags ?? [])
      .map((tag) => tag._ref?.replace(/^blog-tag-/, "") ?? "")
      .sort();
    expect(JSON.stringify(tagSlugs) === JSON.stringify(source.tags), `${source.slug} tags differ from MDX`);
    expect(Boolean(post.heroImage?.asset?._ref), `${source.slug} hero asset is missing`);
    expect(post.heroImage?.alt === source.heroAlt, `${source.slug} hero alt differs from MDX`);
    expect(Array.isArray(post.body) && post.body.length > 0, `${source.slug} body is empty`);
    expect(post.seo?.noIndex === false, `${source.slug} was unexpectedly marked noindex`);
    expect(post.legacySourceFile === source.file, `${source.slug} legacy source filename differs`);
    expect(post.legacyChecksum === source.checksum, `${source.slug} legacy checksum differs`);
  }

  const expectedCategorySlugs = Array.from(
    new Set(sources.map((source) => source.category)),
  ).sort();
  const categoriesBySlug = new Map(
    snapshot.categories.map((category) => [category.slug?.current ?? "", category]),
  );
  expect(
    categoriesBySlug.size === snapshot.categories.length,
    "category slugs are missing or duplicated",
  );
  for (const slug of expectedCategorySlugs) {
    const category = categoriesBySlug.get(slug);
    expect(category, `missing category ${slug}`);
    expect(
      category._id === categoryDocumentId(slug),
      `${slug} category has an unexpected document ID`,
    );
  }

  const expectedTagSlugs = Array.from(
    new Set(sources.flatMap((source) => source.tags)),
  ).sort();
  const tagsBySlug = new Map(
    snapshot.tags.map((tag) => [tag.slug?.current ?? "", tag]),
  );
  expect(tagsBySlug.size === snapshot.tags.length, "tag slugs are missing or duplicated");
  for (const slug of expectedTagSlugs) {
    const tag = tagsBySlug.get(slug);
    expect(tag, `missing tag ${slug}`);
    expect(
      tag._id === tagDocumentId(slug),
      `${slug} tag has an unexpected document ID`,
    );
  }

  const localSlugs = new Set(sources.map((source) => source.slug));
  for (const slug of postsBySlug.keys()) {
    expect(localSlugs.has(slug), `Sanity contains an unexpected migrated post: ${slug}`);
  }

  const featured = sources.filter((source) => source.featured);
  expect(featured.length === 1, `local source contains ${featured.length} featured posts`);
  expect(
    snapshot.settings?.featuredPost?._ref === postDocumentId(featured[0].slug),
    "blogSettings featuredPost differs from MDX",
  );

  const { counts, faqItems } = countBodyTypes(snapshot.posts);
  const expectedBodyCounts: Record<string, number> = {
    blogImage: 28,
    blogVideo: 5,
    codeBlock: 30,
    blogTable: 13,
    blogFaq: 14,
  };
  for (const [type, expected] of Object.entries(expectedBodyCounts)) {
    expect((counts.get(type) ?? 0) === expected, `${type} count is ${counts.get(type) ?? 0}, expected ${expected}`);
  }
  expect(faqItems === 75, `FAQ item count is ${faqItems}, expected 75`);

  const references = collectReferences(snapshot);
  const referenceIds = Array.from(references);
  const dotReferences = referenceIds.filter((id) => id.includes("."));
  expect(
    dotReferences.length === 0,
    `blog references contain legacy dot IDs: ${dotReferences.join(", ")}`,
  );
  const resolved = new Set(
    await client.fetch<string[]>(`*[_id in $ids]._id`, { ids: referenceIds }),
  );
  const missingReferences = referenceIds.filter((id) => !resolved.has(id));
  expect(
    missingReferences.length === 0,
    `unresolved references: ${missingReferences.join(", ")}`,
  );

  console.log("\nSANITY BLOG VERIFIED");
  console.log(
    `20 posts, 4 categories, 68 tags, ${counts.get("blogImage")} body images, ${counts.get("blogVideo")} videos, ${counts.get("codeBlock")} code blocks, ${counts.get("blogTable")} tables, ${counts.get("blogFaq")} FAQ blocks / ${faqItems} questions`,
  );
  console.log(`Resolved references: ${referenceIds.length}; missing: 0`);
  console.log(`Featured: ${featured[0].slug}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
