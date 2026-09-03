import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type SanityWebhookBody = {
  _id?: string;
  _type?: string;
  kind?: "privacy" | "terms" | "refunds";
  slug?: string;
};

const publishedId = (id: string | undefined) => id?.replace(/^drafts\./, "");

function isPreviewOnlyDocument(id: string | undefined) {
  return id?.startsWith("drafts.") || id?.startsWith("versions.");
}

function getLegalKind(body: SanityWebhookBody) {
  if (
    body.kind === "privacy" ||
    body.kind === "terms" ||
    body.kind === "refunds"
  ) {
    return body.kind;
  }
  const id = publishedId(body._id);
  if (id === "privacyPage") return "privacy";
  if (id === "termsPage") return "terms";
  if (id === "refundsPage") return "refunds";
  return null;
}

function collectRevalidation(body: SanityWebhookBody) {
  const tags = new Set<string>();
  const paths = new Set<string>();
  const slug = body.slug?.trim();

  switch (body._type) {
    case "homePage":
      tags.add("site-page:home");
      paths.add("/");
      paths.add("/sitemap.xml");
      break;
    case "footerSettings":
      tags.add("footer-settings");
      paths.add("/");
      break;
    case "blogCtaSettings":
      tags.add("blog-cta-settings");
      paths.add("/blog/");
      break;
    case "pricingPage":
      tags.add("site-page:pricing");
      paths.add("/pricing/");
      paths.add("/sitemap.xml");
      break;
    case "featuresPage":
      tags.add("site-page:features");
      paths.add("/features/");
      paths.add("/sitemap.xml");
      break;
    case "aboutPage":
      tags.add("site-page:about");
      paths.add("/about/");
      paths.add("/sitemap.xml");
      break;
    case "legalPage": {
      const kind = getLegalKind(body);
      if (kind) {
        tags.add(`site-page:${kind}`);
        paths.add(`/${kind}/`);
        paths.add("/sitemap.xml");
      }
      break;
    }
    case "blogPost":
      tags.add("blog-posts");
      tags.add("site-page:home");
      if (slug) {
        tags.add(`blog-post:${slug}`);
        paths.add(`/blog/${slug}/`);
      }
      paths.add("/blog/");
      paths.add("/");
      paths.add("/blog/feed.xml");
      paths.add("/sitemap.xml");
      break;
    case "blogCategory":
    case "blogTag":
      tags.add("blog-posts");
      paths.add("/blog/");
      paths.add("/blog/feed.xml");
      paths.add("/sitemap.xml");
      break;
    case "author":
      tags.add("blog-posts");
      tags.add("site-page:home");
      tags.add("site-page:about");
      paths.add("/blog/");
      paths.add("/");
      paths.add("/about/");
      paths.add("/sitemap.xml");
      break;
  }

  return { tags, paths };
}

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "SANITY_REVALIDATE_SECRET is not configured" },
      { status: 500 },
    );
  }

  const { body, isValidSignature } = await parseBody<SanityWebhookBody>(
    request,
    secret,
  );
  if (!isValidSignature) {
    return NextResponse.json(
      { ok: false, error: "Invalid webhook signature" },
      { status: 401 },
    );
  }

  if (!body) {
    return NextResponse.json(
      { ok: false, error: "Webhook payload is empty" },
      { status: 400 },
    );
  }

  // Draft preview uses Sanity's live draft perspective. Draft mutations must not
  // evict public caches before an editor publishes them.
  if (isPreviewOnlyDocument(body._id)) {
    return NextResponse.json({
      ok: true,
      skipped: "preview-only document",
      documentId: body._id ?? null,
      documentType: body._type ?? null,
      revalidatedTags: [],
      revalidatedPaths: [],
    });
  }

  const { tags, paths } = collectRevalidation(body);

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }
  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    ok: true,
    documentId: body._id ?? null,
    documentType: body._type ?? null,
    revalidatedTags: Array.from(tags),
    revalidatedPaths: Array.from(paths),
  });
}
