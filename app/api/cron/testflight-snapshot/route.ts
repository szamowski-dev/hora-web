import { type NextRequest, NextResponse } from "next/server";
import { fetchHoraUserCount } from "@/lib/testflight";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GA_EVENT = "testflight_waitlist_snapshot";

function isAuthorized(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  return Boolean(
    cronSecret && req.headers.get("authorization") === `Bearer ${cronSecret}`,
  );
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userCount = await fetchHoraUserCount();

  return NextResponse.json({
    ok: true,
    event: GA_EVENT,
    userCount,
  });
}
