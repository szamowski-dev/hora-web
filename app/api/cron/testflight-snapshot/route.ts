import { type NextRequest, NextResponse } from "next/server";
import { fetchHoraUserCount } from "@/lib/testflight";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PLAUSIBLE_EVENT = "testflight_waitlist_snapshot";

function isAuthorized(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  return Boolean(
    cronSecret && req.headers.get("authorization") === `Bearer ${cronSecret}`,
  );
}

// Record the daily public proof count as a Plausible custom event so growth
// stays visible on the same analytics stack as everything else.
// Plausible's server-side Events API is keyed by site domain (no token), and
// silently drops requests without a User-Agent, so we set one explicitly.
async function captureSnapshot(userCount: number) {
  const host = (process.env.PLAUSIBLE_HOST ?? "https://plausible.io").replace(
    /\/$/,
    "",
  );
  const domain = process.env.PLAUSIBLE_DOMAIN ?? "horacal.app";

  const response = await fetch(`${host}/api/event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "hora-web-cron/testflight-snapshot",
    },
    body: JSON.stringify({
      name: PLAUSIBLE_EVENT,
      domain,
      url: `https://${domain}/`,
      props: {
        kind: "synthetic_daily_user_count",
        source: "deterministic_daily_growth",
        user_count: userCount,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Plausible event failed: ${response.status} ${response.statusText}`,
    );
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userCount = await fetchHoraUserCount();
  await captureSnapshot(userCount);

  return NextResponse.json({
    ok: true,
    event: PLAUSIBLE_EVENT,
    userCount,
  });
}
