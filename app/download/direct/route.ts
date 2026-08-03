import { NextResponse } from "next/server";
import { resolveLatestDirectDownload } from "@/lib/direct/download";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const responseHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "X-Robots-Tag": "noindex, nofollow",
};

export async function GET() {
  try {
    const downloadUrl = await resolveLatestDirectDownload();
    return NextResponse.redirect(downloadUrl, {
      status: 307,
      headers: responseHeaders,
    });
  } catch {
    return new NextResponse("The Direct download is temporarily unavailable.", {
      status: 503,
      headers: {
        ...responseHeaders,
        "Content-Type": "text/plain; charset=utf-8",
        "Retry-After": "300",
      },
    });
  }
}
