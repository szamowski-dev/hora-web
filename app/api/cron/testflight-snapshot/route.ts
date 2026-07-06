import { type NextRequest, NextResponse } from "next/server";
import { fetchTestFlightTesterCount } from "@/lib/testflight";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PLAUSIBLE_EVENT = "testflight_waitlist_snapshot";

function isAuthorized(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  return Boolean(
    cronSecret && req.headers.get("authorization") === `Bearer ${cronSecret}`,
  );
}

// Record the daily TestFlight tester count as a Plausible custom event so the
// waitlist growth stays visible on the same analytics stack as everything else.
// Plausible's server-side Events API is keyed by site domain (no token), and
// silently drops requests without a User-Agent, so we set one explicitly.
async function captureSnapshot(testerCount: number) {
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
        app_id: process.env.ASC_APP_ID,
        kind: "testflight_beta_testers",
        source: "app_store_connect",
        tester_count: testerCount,
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

  const testerCount = await fetchTestFlightTesterCount();
  if (testerCount === null) {
    return NextResponse.json(
      { ok: false, error: "Unable to fetch TestFlight tester count" },
      { status: 502 },
    );
  }

  await captureSnapshot(testerCount);

  return NextResponse.json({
    ok: true,
    event: PLAUSIBLE_EVENT,
    testerCount,
  });
}
