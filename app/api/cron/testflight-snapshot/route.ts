import { type NextRequest, NextResponse } from "next/server";
import { fetchTestFlightTesterCount } from "@/lib/testflight";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const POSTHOG_EVENT = "testflight_waitlist_snapshot";
const POSTHOG_DISTINCT_ID = "app_store_connect";

function isAuthorized(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  return Boolean(
    cronSecret && req.headers.get("authorization") === `Bearer ${cronSecret}`,
  );
}

async function capturePostHogSnapshot(testerCount: number) {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

  if (!apiKey) throw new Error("Missing NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN");

  const response = await fetch(`${host.replace(/\/$/, "")}/i/v0/e/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      event: POSTHOG_EVENT,
      distinct_id: POSTHOG_DISTINCT_ID,
      properties: {
        app_id: process.env.ASC_APP_ID,
        kind: "testflight_beta_testers",
        source: "app_store_connect",
        tester_count: testerCount,
      },
      timestamp: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(
      `PostHog capture failed: ${response.status} ${response.statusText}`,
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

  await capturePostHogSnapshot(testerCount);

  return NextResponse.json({
    ok: true,
    event: POSTHOG_EVENT,
    testerCount,
  });
}
