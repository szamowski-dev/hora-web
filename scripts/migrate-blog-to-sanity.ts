import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { getCliClient } from "sanity/cli";
import { unified } from "unified";
import { calculateReadingMinutes } from "../sanity/lib/readingTime";

const API_VERSION = "2026-07-15";
const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const WRITE = process.argv.includes("--write");
const FORCE_OVERWRITE = process.argv.includes("--force-overwrite");
const CLEANUP_LEGACY_DOT_IDS = process.argv.includes(
  "--cleanup-legacy-dot-ids",
);

const AUTHOR_ID = "author-maciej-szamowski";
const LEGACY_AUTHOR_ID = "author.maciej-szamowski";

function postDocumentId(slug: string) {
  return `blog-post-${slug}`;
}

function categoryDocumentId(slug: string) {
  return `blog-category-${slug}`;
}

function tagDocumentId(slug: string) {
  return `blog-tag-${slug}`;
}

function legacyPostDocumentId(slug: string) {
  return `blogPost.${slug}`;
}

function legacyCategoryDocumentId(slug: string) {
  return `blogCategory.${slug}`;
}

function legacyTagDocumentId(slug: string) {
  return `blogTag.${slug}`;
}

type MdAttribute = {
  type: string;
  name: string;
  value?: string | null | Record<string, unknown>;
};

type MdNode = {
  type: string;
  value?: string;
  children?: MdNode[];
  depth?: number;
  ordered?: boolean;
  start?: number | null;
  url?: string;
  alt?: string | null;
  lang?: string | null;
  name?: string | null;
  attributes?: MdAttribute[];
  position?: {
    start?: { line?: number; column?: number; offset?: number };
    end?: { line?: number; column?: number; offset?: number };
  };
};

type PortableSpan = {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
};

type PortableMarkDef = Record<string, unknown> & {
  _type: string;
  _key: string;
};

type PortableBlock = {
  _type: "block";
  _key: string;
  style: "normal" | "h2" | "h3";
  children: PortableSpan[];
  markDefs: PortableMarkDef[];
  listItem?: "bullet" | "number";
  level?: number;
};

type SanityDocumentInput = Record<string, unknown> & {
  _id: string;
  _type: string;
};

type MigrationStats = {
  posts: number;
  categories: Map<string, number>;
  tags: Set<string>;
  bodyImages: number;
  videos: number;
  codeBlocks: number;
  tables: number;
  faqBlocks: number;
  faqItems: number;
  localMediaPaths: Set<string>;
};

type MigrationContext = {
  slug: string;
  title: string;
  knownSlugs: Set<string>;
  client: ReturnType<typeof getCliClient>;
  assetCache: Map<string, Promise<string>>;
  stats: MigrationStats;
};

const CATEGORY_SEEDS = [
  {
    slug: "guides",
    title: "Guides",
    order: 0,
    description:
      "Practical guides for using Google Calendar and choosing a better calendar workflow on the Mac.",
  },
  {
    slug: "build-notes",
    title: "Build notes",
    order: 1,
    description:
      "Honest notes from designing, testing, breaking, and shipping hora Calendar in public.",
  },
  {
    slug: "engineering",
    title: "Engineering",
    order: 2,
    description:
      "Technical stories about SwiftUI, calendar sync, APIs, performance, and native macOS development.",
  },
  {
    slug: "product-updates",
    title: "Product updates",
    order: 3,
    description:
      "New releases, beta milestones, and meaningful changes to hora Calendar.",
  },
] as const;

const SPECIAL_TAG_LABELS: Record<string, string> = {
  adhd: "ADHD",
  api: "API",
  apca: "APCA",
  apns: "APNs",
  app: "App",
  caldav: "CalDAV",
  macos: "macOS",
  oklch: "OKLCH",
  pwa: "PWA",
  qa: "QA",
  swiftui: "SwiftUI",
};

function stableKey(input: string) {
  return createHash("sha1").update(input).digest("hex").slice(0, 12);
}

function nodeSeed(node: MdNode, suffix = "") {
  const start = node.position?.start?.offset ?? node.position?.start?.line ?? 0;
  const end = node.position?.end?.offset ?? node.position?.end?.line ?? start;
  return `${node.type}:${start}:${end}:${suffix}`;
}

function keyFor(context: MigrationContext, seed: string) {
  return stableKey(`${context.slug}:${seed}`);
}

function sourceLocation(node: MdNode) {
  const line = node.position?.start?.line;
  return line ? ` at line ${line}` : "";
}

function unsupported(context: MigrationContext, node: MdNode, detail = ""): never {
  throw new Error(
    `[${context.slug}] Unsupported ${node.type}${detail ? ` (${detail})` : ""}${sourceLocation(node)}`,
  );
}

function requiredString(
  record: Record<string, unknown>,
  field: string,
  source: string,
) {
  const value = record[field];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`[${source}] Missing required frontmatter field: ${field}`);
  }
  return value.trim();
}

function dateOnly(value: unknown, field: string, source: string) {
  const normalized =
    value instanceof Date
      ? value.toISOString().slice(0, 10)
      : typeof value === "string"
        ? value.slice(0, 10)
        : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    throw new Error(`[${source}] Invalid ${field}: ${String(value)}`);
  }
  return normalized;
}

function parseTags(value: unknown, source: string) {
  const tags = Array.isArray(value)
    ? value.map(String)
    : typeof value === "string"
      ? value.split(",")
      : [];
  const normalized = tags.map((tag) => tag.trim()).filter(Boolean);
  if (normalized.length === 0) {
    throw new Error(`[${source}] At least one tag is required`);
  }
  return normalized;
}

function tagLabel(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => {
      const special = SPECIAL_TAG_LABELS[part.toLowerCase()];
      if (special) return special;
      if (part.length <= 3) return part.toUpperCase();
      return part[0].toUpperCase() + part.slice(1);
    })
    .join(" ");
}

function attribute(node: MdNode, name: string, required = false) {
  const item = node.attributes?.find(
    (candidate) => candidate.type === "mdxJsxAttribute" && candidate.name === name,
  );
  if (!item) {
    if (required) {
      throw new Error(`Missing ${name}${sourceLocation(node)}`);
    }
    return undefined;
  }
  if (typeof item.value === "string") return item.value;
  if (item.value == null) return "";
  throw new Error(`Expression attributes are not supported: ${name}${sourceLocation(node)}`);
}

function localAssetPath(publicPath: string, context: MigrationContext) {
  if (!publicPath.startsWith("/")) {
    throw new Error(`[${context.slug}] Expected a local public path, got ${publicPath}`);
  }
  const absolutePath = path.join(PUBLIC_DIR, publicPath.replace(/^\/+/, ""));
  if (!absolutePath.startsWith(`${PUBLIC_DIR}${path.sep}`)) {
    throw new Error(`[${context.slug}] Asset escaped public directory: ${publicPath}`);
  }
  context.stats.localMediaPaths.add(publicPath);
  return absolutePath;
}

async function uploadAsset(
  kind: "image" | "file",
  publicPath: string,
  context: MigrationContext,
) {
  const absolutePath = localAssetPath(publicPath, context);
  const cacheKey = `${kind}:${absolutePath}`;
  const cached = context.assetCache.get(cacheKey);
  if (cached) return cached;

  const pending = (async () => {
    const file = await stat(absolutePath).catch(() => null);
    if (!file?.isFile()) {
      throw new Error(`[${context.slug}] Missing asset: ${publicPath}`);
    }
    if (!WRITE) {
      return `${kind}-dry-${stableKey(publicPath)}`;
    }
    const asset = await context.client.assets.upload(
      kind,
      createReadStream(absolutePath),
      { filename: path.basename(absolutePath) },
    );
    return asset._id;
  })();

  context.assetCache.set(cacheKey, pending);
  return pending;
}

function linkMarkDef(
  href: string,
  key: string,
  context: MigrationContext,
): PortableMarkDef {
  const parsed = href.match(/^\/blog\/([^/#?]+)\/?(?:#([^?]+))?(?:\?.*)?$/);
  if (parsed && context.knownSlugs.has(parsed[1])) {
    return {
      _key: key,
      _type: "internalPostLink",
      post: { _type: "reference", _ref: postDocumentId(parsed[1]) },
      ...(parsed[2] ? { anchor: parsed[2] } : {}),
    };
  }
  if (href.startsWith("/")) {
    return { _key: key, _type: "internalPathLink", path: href };
  }
  if (/^https?:\/\//.test(href)) {
    return {
      _key: key,
      _type: "externalLink",
      href,
      openInNewTab: true,
    };
  }
  throw new Error(`[${context.slug}] Unsupported link: ${href}`);
}

function portableInline(
  nodes: readonly MdNode[],
  context: MigrationContext,
  seed: string,
) {
  const children: PortableSpan[] = [];
  const markDefs: PortableMarkDef[] = [];
  let spanIndex = 0;
  let markIndex = 0;

  const append = (text: string, marks: string[]) => {
    if (!text) return;
    children.push({
      _type: "span",
      _key: keyFor(context, `${seed}:span:${spanIndex++}`),
      text,
      marks,
    });
  };

  const walk = (node: MdNode, marks: string[]) => {
    switch (node.type) {
      case "text":
        append(node.value ?? "", marks);
        return;
      case "break":
        append("\n", marks);
        return;
      case "strong":
        for (const child of node.children ?? []) walk(child, [...marks, "strong"]);
        return;
      case "emphasis":
        for (const child of node.children ?? []) walk(child, [...marks, "em"]);
        return;
      case "inlineCode":
        append(node.value ?? "", [...marks, "code"]);
        return;
      case "link": {
        if (!node.url) unsupported(context, node, "missing URL");
        const markKey = keyFor(
          context,
          `${seed}:mark:${markIndex++}:${node.url}`,
        );
        markDefs.push(linkMarkDef(node.url, markKey, context));
        for (const child of node.children ?? []) walk(child, [...marks, markKey]);
        return;
      }
      default:
        unsupported(context, node, "inline content");
    }
  };

  for (const node of nodes) walk(node, []);
  if (children.length === 0) {
    append("", []);
  }
  return { children, markDefs };
}

function textBlock(
  node: MdNode,
  style: PortableBlock["style"],
  context: MigrationContext,
  options?: { listItem?: "bullet" | "number"; seed?: string },
): PortableBlock {
  const seed = options?.seed ?? nodeSeed(node, style);
  const inline = portableInline(node.children ?? [], context, seed);
  return {
    _type: "block",
    _key: keyFor(context, seed),
    style,
    ...inline,
    ...(options?.listItem
      ? { listItem: options.listItem, level: 1 }
      : {}),
  };
}

async function imageBlock(node: MdNode, context: MigrationContext) {
  if (!node.url) unsupported(context, node, "missing image URL");
  const alt = node.alt?.trim();
  if (!alt) unsupported(context, node, "missing alternative text");
  const assetRef = await uploadAsset("image", node.url, context);
  context.stats.bodyImages += 1;
  return {
    _type: "blogImage",
    _key: keyFor(context, nodeSeed(node, node.url)),
    asset: { _type: "reference", _ref: assetRef },
    alt,
    presentation: "wide",
  };
}

async function videoBlock(node: MdNode, context: MigrationContext) {
  const src = attribute(node, "src", true)!;
  const mp4Src = attribute(node, "mp4Src");
  const poster = attribute(node, "poster");
  const webmRef = await uploadAsset("file", src, context);
  const mp4Ref = mp4Src ? await uploadAsset("file", mp4Src, context) : undefined;
  const posterRef = poster
    ? await uploadAsset("image", poster, context)
    : undefined;
  context.stats.videos += 1;
  return {
    _type: "blogVideo",
    _key: keyFor(context, nodeSeed(node, src)),
    webm: { _type: "file", asset: { _type: "reference", _ref: webmRef } },
    ...(mp4Ref
      ? { mp4: { _type: "file", asset: { _type: "reference", _ref: mp4Ref } } }
      : {}),
    ...(posterRef
      ? { poster: { _type: "image", asset: { _type: "reference", _ref: posterRef } } }
      : {}),
    accessibilityLabel: "Looping demonstration of hora Calendar",
    autoplay: true,
    loop: true,
    muted: true,
    presentation: "glow",
  };
}

function faqAnswer(
  node: MdNode,
  answer: string,
  context: MigrationContext,
  answerLinkHref?: string,
  answerLinkLabel?: string,
  answerAfterLink?: string,
) {
  const seed = nodeSeed(node, "answer");
  const children: PortableSpan[] = [];
  const markDefs: PortableMarkDef[] = [];
  const append = (text: string, marks: string[], suffix: string) => {
    children.push({
      _type: "span",
      _key: keyFor(context, `${seed}:${suffix}`),
      text,
      marks,
    });
  };

  append(answer, [], "answer");
  if (answerLinkHref || answerLinkLabel || answerAfterLink) {
    if (!answerLinkHref || !answerLinkLabel) {
      throw new Error(
        `[${context.slug}] FAQ answer link requires href and label${sourceLocation(node)}`,
      );
    }
    const markKey = keyFor(context, `${seed}:link:${answerLinkHref}`);
    markDefs.push(linkMarkDef(answerLinkHref, markKey, context));
    append(` ${answerLinkLabel}`, [markKey], "link");
    if (answerAfterLink) append(` ${answerAfterLink}`, [], "after-link");
  }

  return [
    {
      _type: "block",
      _key: keyFor(context, seed),
      style: "normal",
      children,
      markDefs,
    },
  ];
}

function faqBlock(node: MdNode, context: MigrationContext) {
  const anchorId = attribute(node, "id", true)!;
  const heading = attribute(node, "heading") || "Frequently asked questions";
  const intro = attribute(node, "intro");
  const items = (node.children ?? []).map((child, index) => {
    if (child.type !== "mdxJsxFlowElement" || child.name !== "BlogFaqItem") {
      unsupported(context, child, "inside BlogFaq");
    }
    const itemId = attribute(child, "id", true)!;
    const question = attribute(child, "question", true)!;
    const answer = attribute(child, "answer", true)!;
    const answerLinkHref = attribute(child, "answerLinkHref");
    const answerLinkLabel = attribute(child, "answerLinkLabel");
    const answerAfterLink = attribute(child, "answerAfterLink");
    return {
      _type: "blogFaqItem",
      _key: keyFor(context, `${nodeSeed(child, itemId)}:${index}`),
      anchorId: itemId,
      question,
      answer: faqAnswer(
        child,
        answer,
        context,
        answerLinkHref,
        answerLinkLabel,
        answerAfterLink,
      ),
    };
  });
  if (items.length === 0) {
    throw new Error(`[${context.slug}] FAQ has no questions${sourceLocation(node)}`);
  }
  context.stats.faqBlocks += 1;
  context.stats.faqItems += items.length;
  return {
    _type: "blogFaq",
    _key: keyFor(context, nodeSeed(node, anchorId)),
    anchorId,
    heading,
    ...(intro ? { intro } : {}),
    items,
  };
}

function tableBlock(node: MdNode, context: MigrationContext) {
  const rows = (node.children ?? []).map((row, rowIndex) => {
    if (row.type !== "tableRow") unsupported(context, row, "inside table");
    const cells = (row.children ?? []).map((cell, cellIndex) => {
      if (cell.type !== "tableCell") unsupported(context, cell, "inside table row");
      return {
        _type: "blogTableCell",
        _key: keyFor(context, `${nodeSeed(cell)}:${rowIndex}:${cellIndex}`),
        content: [
          textBlock(cell, "normal", context, {
            seed: `${nodeSeed(cell, "table-cell")}:${rowIndex}:${cellIndex}`,
          }),
        ],
      };
    });
    return {
      _type: "blogTableRow",
      _key: keyFor(context, `${nodeSeed(row)}:${rowIndex}`),
      header: rowIndex === 0,
      cells,
    };
  });
  if (rows.length < 2) {
    throw new Error(`[${context.slug}] Table needs at least two rows${sourceLocation(node)}`);
  }
  const width = rows[0].cells.length;
  if (rows.some((row) => row.cells.length !== width)) {
    throw new Error(`[${context.slug}] Table rows have different widths${sourceLocation(node)}`);
  }
  context.stats.tables += 1;
  return {
    _type: "blogTable",
    _key: keyFor(context, nodeSeed(node, "table")),
    rows,
  };
}

async function convertRootNode(node: MdNode, context: MigrationContext) {
  switch (node.type) {
    case "paragraph": {
      if (node.children?.length === 1 && node.children[0].type === "image") {
        return [await imageBlock(node.children[0], context)];
      }
      return [textBlock(node, "normal", context)];
    }
    case "heading": {
      if (node.depth !== 2 && node.depth !== 3) {
        unsupported(context, node, `heading depth ${node.depth}`);
      }
      return [textBlock(node, node.depth === 2 ? "h2" : "h3", context)];
    }
    case "list": {
      const listItem = node.ordered ? "number" : "bullet";
      const blocks: PortableBlock[] = [];
      for (const [itemIndex, item] of (node.children ?? []).entries()) {
        if (item.type !== "listItem") unsupported(context, item, "inside list");
        const itemChildren = item.children ?? [];
        if (itemChildren.some((child) => child.type === "list")) {
          unsupported(context, item, "nested list");
        }
        for (const [blockIndex, child] of itemChildren.entries()) {
          if (child.type !== "paragraph") {
            unsupported(context, child, "inside list item");
          }
          blocks.push(
            textBlock(child, "normal", context, {
              listItem,
              seed: `${nodeSeed(child, "list")}:${itemIndex}:${blockIndex}`,
            }),
          );
        }
      }
      return blocks;
    }
    case "code":
      context.stats.codeBlocks += 1;
      return [
        {
          _type: "codeBlock",
          _key: keyFor(context, nodeSeed(node, node.lang ?? "text")),
          language: node.lang === "swift" || node.lang === "json" ? node.lang : "text",
          code: node.value ?? "",
        },
      ];
    case "table":
      return [tableBlock(node, context)];
    case "mdxJsxFlowElement":
      if (node.name === "AutoVideo") return [await videoBlock(node, context)];
      if (node.name === "BlogFaq") return [faqBlock(node, context)];
      unsupported(context, node, node.name ?? "anonymous JSX");
    default:
      unsupported(context, node, "root content");
  }
}

async function convertBody(root: MdNode, context: MigrationContext) {
  if (root.type !== "root") unsupported(context, root, "document root");
  const body: Record<string, unknown>[] = [];
  for (const node of root.children ?? []) {
    body.push(...(await convertRootNode(node, context)));
  }
  if (body.length === 0) throw new Error(`[${context.slug}] Empty article body`);
  return body;
}

async function buildPost(
  filename: string,
  knownSlugs: Set<string>,
  client: ReturnType<typeof getCliClient>,
  assetCache: Map<string, Promise<string>>,
  stats: MigrationStats,
) {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = await readFile(path.join(POSTS_DIR, filename), "utf8");
  const parsed = matter(raw);
  const frontmatter = parsed.data as Record<string, unknown>;
  const context: MigrationContext = {
    slug,
    title: requiredString(frontmatter, "title", filename),
    knownSlugs,
    client,
    assetCache,
    stats,
  };
  const category = requiredString(frontmatter, "category", filename);
  if (!CATEGORY_SEEDS.some((item) => item.slug === category)) {
    throw new Error(`[${filename}] Unknown category: ${category}`);
  }
  const tags = parseTags(frontmatter.tags, filename);
  tags.forEach((tag) => stats.tags.add(tag));
  stats.categories.set(category, (stats.categories.get(category) ?? 0) + 1);

  const heroImage = requiredString(frontmatter, "heroImage", filename);
  const cover = requiredString(frontmatter, "cover", filename);
  const ogImage = requiredString(frontmatter, "ogImage", filename);
  if (heroImage !== cover || heroImage !== ogImage) {
    throw new Error(
      `[${filename}] heroImage, cover, and ogImage differ; add an explicit migration rule`,
    );
  }
  const heroRef = await uploadAsset("image", heroImage, context);
  const tree = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkGfm)
    .parse(parsed.content) as MdNode;
  const body = await convertBody(tree, context);
  const publishedAt = dateOnly(frontmatter.date, "date", filename);
  const contentUpdatedAt = frontmatter.updated
    ? dateOnly(frontmatter.updated, "updated", filename)
    : publishedAt;
  const featured = frontmatter.featured === true;

  const document: SanityDocumentInput = {
    _id: postDocumentId(slug),
    _type: "blogPost",
    title: context.title,
    slug: { _type: "slug", current: slug },
    description: requiredString(frontmatter, "description", filename),
    publishedAt,
    contentUpdatedAt,
    readingMinutes: calculateReadingMinutes(body),
    author: { _type: "reference", _ref: AUTHOR_ID },
    category: { _type: "reference", _ref: categoryDocumentId(category) },
    tags: tags.map((tag) => ({
      _type: "reference",
      _key: stableKey(`${slug}:tag:${tag}`),
      _ref: tagDocumentId(tag),
    })),
    heroImage: {
      _type: "blogImage",
      asset: { _type: "reference", _ref: heroRef },
      alt: requiredString(frontmatter, "heroAlt", filename),
      listingAlt: context.title,
      presentation: "wide",
    },
    body,
    seo: { _type: "seo", noIndex: false },
    legacySourceFile: filename,
    legacyChecksum: createHash("sha256").update(raw).digest("hex"),
  };
  return { document, featured, slug };
}

async function writeDocuments(
  client: ReturnType<typeof getCliClient>,
  documents: SanityDocumentInput[],
  batchSize = 5,
) {
  for (let index = 0; index < documents.length; index += batchSize) {
    const batch = documents.slice(index, index + batchSize);
    let transaction = client.transaction();
    for (const document of batch) {
      transaction = transaction.createOrReplace(document);
    }
    await transaction.commit({ visibility: "sync" });
  }
}

async function ensurePostStubs(
  client: ReturnType<typeof getCliClient>,
  documents: SanityDocumentInput[],
) {
  let transaction = client.transaction();
  for (const document of documents) {
    transaction = transaction.createIfNotExists({
      _id: document._id,
      _type: document._type,
      title: document.title,
      slug: document.slug,
    });
  }
  await transaction.commit({ visibility: "sync" });
}

async function cleanupLegacyDotDocuments(
  client: ReturnType<typeof getCliClient>,
  ids: string[],
) {
  const uniqueIds = Array.from(new Set(ids));
  if (uniqueIds.length !== ids.length) {
    throw new Error("Legacy cleanup allowlist contains duplicate document IDs");
  }

  let transaction = client.transaction();
  for (const id of uniqueIds) {
    transaction = transaction.delete(id);
  }
  await transaction.commit({ visibility: "sync" });
}

function validateStats(stats: MigrationStats, featured: string[]) {
  const expectedCategories = new Map([
    ["guides", 5],
    ["build-notes", 6],
    ["engineering", 7],
    ["product-updates", 2],
  ]);
  const checks: Array<[string, number, number]> = [
    ["posts", stats.posts, 20],
    ["tags", stats.tags.size, 68],
    ["body images", stats.bodyImages, 28],
    ["videos", stats.videos, 5],
    ["code blocks", stats.codeBlocks, 30],
    ["tables", stats.tables, 13],
    ["FAQ blocks", stats.faqBlocks, 14],
    ["FAQ items", stats.faqItems, 75],
    ["local media paths", stats.localMediaPaths.size, 56],
    ["featured posts", featured.length, 1],
  ];
  for (const [label, actual, expected] of checks) {
    if (actual !== expected) {
      throw new Error(`Migration audit failed for ${label}: ${actual}, expected ${expected}`);
    }
  }
  for (const [category, expected] of expectedCategories) {
    const actual = stats.categories.get(category) ?? 0;
    if (actual !== expected) {
      throw new Error(
        `Migration audit failed for category ${category}: ${actual}, expected ${expected}`,
      );
    }
  }
}

async function main() {
  if (FORCE_OVERWRITE && !WRITE) {
    throw new Error("--force-overwrite requires --write");
  }
  if (CLEANUP_LEGACY_DOT_IDS && !WRITE) {
    throw new Error(
      "--cleanup-legacy-dot-ids requires --write so cleanup can only follow a successful migration",
    );
  }

  const client = getCliClient({ apiVersion: API_VERSION });
  const filenames = (await readdir(POSTS_DIR))
    .filter((file) => file.endsWith(".mdx"))
    .sort();
  const knownSlugs = new Set(filenames.map((file) => file.replace(/\.mdx$/, "")));
  const assetCache = new Map<string, Promise<string>>();
  const stats: MigrationStats = {
    posts: filenames.length,
    categories: new Map(),
    tags: new Set(),
    bodyImages: 0,
    videos: 0,
    codeBlocks: 0,
    tables: 0,
    faqBlocks: 0,
    faqItems: 0,
    localMediaPaths: new Set(),
  };

  const results = [];
  for (const filename of filenames) {
    results.push(
      await buildPost(filename, knownSlugs, client, assetCache, stats),
    );
  }
  const featured = results
    .filter((result) => result.featured)
    .map((result) => result.slug);
  validateStats(stats, featured);
  const blogMediaCount = stats.localMediaPaths.size;

  const tagDocuments: SanityDocumentInput[] = Array.from(stats.tags)
    .sort()
    .map((slug) => ({
      _id: tagDocumentId(slug),
      _type: "blogTag",
      title: tagLabel(slug),
      slug: { _type: "slug", current: slug },
    }));
  const categoryDocuments: SanityDocumentInput[] = CATEGORY_SEEDS.map(
    (category) => ({
      _id: categoryDocumentId(category.slug),
      _type: "blogCategory",
      title: category.title,
      slug: { _type: "slug", current: category.slug },
      description: category.description,
      order: category.order,
    }),
  );
  const authorPortrait = await uploadAsset(
    "image",
    "/assets/people/maciej-szamowski.jpg",
    {
      slug: AUTHOR_ID,
      title: "Maciej Szamowski",
      knownSlugs,
      client,
      assetCache,
      stats,
    },
  );
  const authorDocument: SanityDocumentInput = {
    _id: AUTHOR_ID,
    _type: "author",
    name: "Maciej Szamowski",
    slug: { _type: "slug", current: "maciej-szamowski" },
    role: "Founder and developer",
    bio: "Marketer of 16 years turned solo macOS developer. Building hora Calendar in public from Poland.",
    href: "/about/",
    portrait: {
      _type: "image",
      asset: { _type: "reference", _ref: authorPortrait },
    },
  };

  if (WRITE) {
    const managedDocumentIds = [
      authorDocument._id,
      ...categoryDocuments.map((document) => document._id),
      ...tagDocuments.map((document) => document._id),
      ...results.map((result) => result.document._id),
      "blogSettings",
    ];
    const existingDocumentIds = await client.fetch<string[]>(
      `*[_id in $ids]._id`,
      { ids: managedDocumentIds },
    );
    if (existingDocumentIds.length > 0 && !FORCE_OVERWRITE) {
      throw new Error(
        `Refusing to overwrite ${existingDocumentIds.length} existing Sanity blog documents. This migration is write-once after editors start using Studio. Use --force-overwrite only for an intentional MDX restore.`,
      );
    }

    await writeDocuments(client, [authorDocument, ...categoryDocuments, ...tagDocuments], 20);
    await ensurePostStubs(
      client,
      results.map((result) => result.document),
    );
    await writeDocuments(
      client,
      results.map((result) => result.document),
    );
    await writeDocuments(client, [
      {
        _id: "blogSettings",
        _type: "blogSettings",
        featuredPost: {
          _type: "reference",
          _ref: postDocumentId(featured[0]),
        },
      },
    ]);

    if (CLEANUP_LEGACY_DOT_IDS) {
      const legacyDotIds = [
        LEGACY_AUTHOR_ID,
        ...CATEGORY_SEEDS.map((category) =>
          legacyCategoryDocumentId(category.slug),
        ),
        ...Array.from(stats.tags).sort().map(legacyTagDocumentId),
        ...Array.from(knownSlugs).sort().map(legacyPostDocumentId),
      ];
      await cleanupLegacyDotDocuments(client, legacyDotIds);
      console.log(
        `Deleted ${legacyDotIds.length} explicitly allowlisted legacy dot-ID documents.`,
      );
    }
  }

  const mode = WRITE ? "MIGRATED" : "DRY RUN";
  console.log(`\n${mode}: ${stats.posts} posts`);
  console.log(
    `Categories: ${Array.from(stats.categories.entries())
      .map(([category, count]) => `${category}=${count}`)
      .join(", ")}`,
  );
  console.log(
    `Tags: ${stats.tags.size}; body images: ${stats.bodyImages}; videos: ${stats.videos}; code: ${stats.codeBlocks}; tables: ${stats.tables}; FAQ: ${stats.faqBlocks}/${stats.faqItems}`,
  );
  console.log(
    `Media: ${blogMediaCount} blog files + author portrait; featured: ${featured[0]}`,
  );
  if (!WRITE) {
    console.log("No remote writes were made. Re-run with --write to migrate.");
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
