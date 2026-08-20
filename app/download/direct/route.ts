import { NextResponse } from "next/server";
import {
  isValidDirectDownloadId,
  resolveLatestDirectDownload,
} from "@/lib/direct/download";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const responseHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "X-Robots-Tag": "noindex, nofollow",
};

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const rawDownloadId = requestUrl.searchParams.get("download_id");
    const downloadId = isValidDirectDownloadId(rawDownloadId)
      ? rawDownloadId
      : undefined;
    const downloadUrl = await resolveLatestDirectDownload({ downloadId });
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
