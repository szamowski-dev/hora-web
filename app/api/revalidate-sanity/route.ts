import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type SanityWebhookBody = {
  _id?: string;
  _type?: string;
  slug?: string;
};

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

  const tags = new Set(["blog-posts", "blog-settings"]);
  const slug = body?.slug?.trim();
  if (body?._type === "blogPost" && slug) {
    tags.add(`blog-post:${slug}`);
  }

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }
  revalidatePath("/sitemap.xml");
  revalidatePath("/blog/feed.xml");

  return NextResponse.json({
    ok: true,
    documentId: body?._id ?? null,
    documentType: body?._type ?? null,
    revalidatedTags: Array.from(tags),
  });
}
