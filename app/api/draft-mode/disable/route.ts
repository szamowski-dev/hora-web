import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

function safeReturnTo(value: string | null, requestUrl: URL) {
  if (!value) return null;
  try {
    const target = new URL(value, requestUrl.origin);
    if (target.origin !== requestUrl.origin) return null;
    if (target.pathname.startsWith("/api/draft-mode/")) return null;
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const returnTo =
    safeReturnTo(requestUrl.searchParams.get("returnTo"), requestUrl) ??
    safeReturnTo(request.headers.get("referer"), requestUrl) ??
    "/";

  (await draftMode()).disable();

  return NextResponse.redirect(new URL(returnTo, requestUrl.origin));
}
