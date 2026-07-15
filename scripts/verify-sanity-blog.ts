import { getCliClient } from "sanity/cli";
import { BLOG_CATEGORIES } from "../lib/blog-model";
import { projectId, dataset } from "../sanity/env";
import { calculateReadingMinutes } from "../sanity/lib/readingTime";

const API_VERSION = "2026-07-15";
const PUBLIC_ID_PATTERN = /^[^.]+$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type Reference = { _type?: string; _ref?: string };
type ImageValue = { alt?: string; asset?: Reference };

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
  heroImage?: ImageValue;
  body?: Array<Record<string, unknown>>;
  seo?: {
    metaTitle?: string;
  };
  legacySourceFile?: string;
  legacyChecksum?: string;
};

type SlugDocument = {
  _id: string;
  title?: string;
  slug?: { current?: string };
};

type Snapshot = {
  posts: SanityPost[];
  categories: Array<SlugDocument & { order?: number }>;
  tags: SlugDocument[];
  authors: Array<{ _id: string; name?: string; portrait?: ImageValue }>;
  settings: { _id?: string; featuredPost?: Reference } | null;
};

type PublicCounts = {
  posts: number;
  categories: number;
  tags: number;
  authors: number;
  settings: number;
};

function fail(message: string): never {
  throw new Error(`Sanity blog verification failed: ${message}`);
}

function expect(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function expectText(value: string | undefined, field: string, documentId: string) {
  expect(Boolean(value?.trim()), `${documentId} is missing ${field}`);
  expect(value === value?.trim(), `${documentId} ${field} has outer whitespace`);
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

function uniqueSlugs(documents: SlugDocument[], type: string) {
  const slugs = documents.map((document) => document.slug?.current ?? "");
  expect(slugs.every((slug) => SLUG_PATTERN.test(slug)), `${type} slugs are missing or invalid`);
  expect(new Set(slugs).size === slugs.length, `${type} slugs are duplicated`);
  return slugs;
}

function bodyCounts(posts: SanityPost[]) {
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

async function publicCounts() {
  const query = `{
    "posts": count(*[_type == "blogPost"]),
    "categories": count(*[_type == "blogCategory"]),
    "tags": count(*[_type == "blogTag"]),
    "authors": count(*[_type == "author"]),
    "settings": count(*[_type == "blogSettings"])
  }`;
  const url = new URL(
    `https://${projectId}.api.sanity.io/v${API_VERSION}/data/query/${dataset}`,
  );
  url.searchParams.set("query", query);

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  expect(response.ok, `anonymous Content Lake query returned ${response.status}`);
  const payload = (await response.json()) as { result?: PublicCounts };
  expect(payload.result, "anonymous Content Lake query returned no result");
  return payload.result;
}

async function main() {
  const client = getCliClient({ apiVersion: API_VERSION }).withConfig({
    perspective: "raw",
    useCdn: false,
  });
  const publishedFilter =
    '!(_id in path("drafts.**")) && !(_id in path("versions.**"))';

  const [snapshot, publicDocumentCounts] = await Promise.all([
    client.fetch<Snapshot>(`{
      "posts": *[_type == "blogPost" && ${publishedFilter}] | order(publishedAt asc) {
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
        seo{metaTitle},
        legacySourceFile,
        legacyChecksum
      },
      "categories": *[_type == "blogCategory" && ${publishedFilter}] {_id, title, slug, order},
      "tags": *[_type == "blogTag" && ${publishedFilter}] {_id, title, slug},
      "authors": *[_type == "author" && ${publishedFilter}] {_id, name, portrait},
      "settings": *[_id == "blogSettings"][0] {_id, featuredPost}
    }`),
    publicCounts(),
  ]);

  expect(snapshot.posts.length > 0, "no published posts found");
  expect(
    snapshot.categories.length === BLOG_CATEGORIES.length,
    `found ${snapshot.categories.length} categories, expected ${BLOG_CATEGORIES.length}`,
  );
  expect(snapshot.tags.length > 0, "no published tags found");
  expect(snapshot.authors.length > 0, "no published authors found");
  expect(snapshot.settings?._id === "blogSettings", "blogSettings singleton is missing");

  expect(publicDocumentCounts.posts === snapshot.posts.length, "anonymous post count differs from the published dataset");
  expect(publicDocumentCounts.categories === snapshot.categories.length, "anonymous category count differs from the published dataset");
  expect(publicDocumentCounts.tags === snapshot.tags.length, "anonymous tag count differs from the published dataset");
  expect(publicDocumentCounts.authors === snapshot.authors.length, "anonymous author count differs from the published dataset");
  expect(publicDocumentCounts.settings === 1, "blogSettings is not publicly readable");

  const publicIds = [
    ...snapshot.posts.map((post) => post._id),
    ...snapshot.categories.map((category) => category._id),
    ...snapshot.tags.map((tag) => tag._id),
    ...snapshot.authors.map((author) => author._id),
    snapshot.settings._id,
  ];
  expect(
    publicIds.every((id) => PUBLIC_ID_PATTERN.test(id)),
    "public blog document IDs must not contain dots",
  );

  const postSlugs = uniqueSlugs(snapshot.posts, "post");
  const categorySlugs = uniqueSlugs(snapshot.categories, "category");
  uniqueSlugs(snapshot.tags, "tag");

  const expectedCategorySlugs = BLOG_CATEGORIES.map((category) => category.slug).sort();
  expect(
    JSON.stringify([...categorySlugs].sort()) === JSON.stringify(expectedCategorySlugs),
    "published categories differ from the supported blog navigation",
  );

  const postIds = new Set(snapshot.posts.map((post) => post._id));
  expect(
    Boolean(snapshot.settings.featuredPost?._ref),
    "blogSettings has no featured post",
  );
  expect(
    postIds.has(snapshot.settings.featuredPost?._ref ?? ""),
    "featured post reference does not resolve to a published post",
  );

  for (const post of snapshot.posts) {
    const slug = post.slug?.current ?? post._id;
    expectText(post.title, "title", slug);
    expectText(post.description, "description", slug);
    if (post.seo?.metaTitle) {
      expectText(post.seo.metaTitle, "seo.metaTitle", slug);
    }
    const renderedTitle = `${post.seo?.metaTitle || post.title} — hora Calendar`;
    expect(
      renderedTitle.length <= 65,
      `${slug} renders a ${renderedTitle.length}-character HTML title`,
    );
    expect(DATE_PATTERN.test(post.publishedAt ?? ""), `${slug} has an invalid published date`);
    expect(DATE_PATTERN.test(post.contentUpdatedAt ?? ""), `${slug} has an invalid updated date`);
    expect(
      (post.contentUpdatedAt ?? "") >= (post.publishedAt ?? ""),
      `${slug} has an updated date before its published date`,
    );
    expect(
      post.readingMinutes === calculateReadingMinutes(post.body),
      `${slug} reading time differs from its Portable Text body`,
    );
    expect(Boolean(post.author?._ref), `${slug} has no author reference`);
    expect(Boolean(post.category?._ref), `${slug} has no category reference`);
    expect((post.tags?.length ?? 0) > 0, `${slug} has no tags`);
    const tagRefs = (post.tags ?? []).map((tag) => tag._ref ?? "");
    expect(tagRefs.every(Boolean), `${slug} has an invalid tag reference`);
    expect(new Set(tagRefs).size === tagRefs.length, `${slug} repeats a tag`);
    expect(Boolean(post.heroImage?.asset?._ref), `${slug} has no hero asset`);
    expectText(post.heroImage?.alt, "hero alt", slug);
    expect((post.body?.length ?? 0) > 0, `${slug} body is empty`);
    expect(!post.legacySourceFile && !post.legacyChecksum, `${slug} still contains legacy MDX metadata`);
  }

  for (const category of snapshot.categories) {
    expectText(category.title, "title", category._id);
    expect(Number.isInteger(category.order), `${category._id} has no valid order`);
  }
  for (const tag of snapshot.tags) expectText(tag.title, "title", tag._id);
  for (const author of snapshot.authors) {
    expectText(author.name, "name", author._id);
    expect(Boolean(author.portrait?.asset?._ref), `${author._id} has no portrait asset`);
  }

  const references = Array.from(collectReferences(snapshot));
  expect(
    references.every((id) => PUBLIC_ID_PATTERN.test(id)),
    "blog references contain private dot IDs",
  );
  const resolved = new Set(
    await client.fetch<string[]>(`*[_id in $ids]._id`, { ids: references }),
  );
  const missingReferences = references.filter((id) => !resolved.has(id));
  expect(missingReferences.length === 0, `unresolved references: ${missingReferences.join(", ")}`);

  const { counts, faqItems } = bodyCounts(snapshot.posts);
  console.log("\nSANITY BLOG VERIFIED");
  console.log(
    `${postSlugs.length} posts, ${categorySlugs.length} categories, ${snapshot.tags.length} tags, ${snapshot.authors.length} ${snapshot.authors.length === 1 ? "author" : "authors"}`,
  );
  console.log(
    `${counts.get("blogImage") ?? 0} body images, ${counts.get("blogVideo") ?? 0} videos, ${counts.get("codeBlock") ?? 0} code blocks, ${counts.get("blogTable") ?? 0} tables, ${counts.get("blogFaq") ?? 0} FAQ blocks / ${faqItems} questions`,
  );
  console.log(`Resolved references: ${references.length}; missing: 0`);
  console.log(`Featured: ${snapshot.settings.featuredPost?._ref}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
