import { type NextRequest, NextResponse } from "next/server";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { fetchHoraUserCount } from "@/lib/testflight";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GA_EVENT = "testflight_waitlist_snapshot";
const GA_MEASUREMENT_PROTOCOL_URL = "https://www.google-analytics.com/mp/collect";
const GA_SERVER_CLIENT_ID = "555.123";

function isAuthorized(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  return Boolean(
    cronSecret && req.headers.get("authorization") === `Bearer ${cronSecret}`,
  );
}

// Record the daily public proof count with the same GA4 property and event
// schema as client-side tracking. Measurement Protocol requires an API secret
// created for this web data stream in Google Analytics.
async function captureSnapshot(userCount: number) {
  const apiSecret = process.env.GA_API_SECRET;
  if (!apiSecret) {
    throw new Error("GA_API_SECRET is not configured");
  }

  const query = new URLSearchParams({
    measurement_id: GA_MEASUREMENT_ID,
    api_secret: apiSecret,
  });
  const response = await fetch(`${GA_MEASUREMENT_PROTOCOL_URL}?${query}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: GA_SERVER_CLIENT_ID,
      non_personalized_ads: true,
      events: [
        {
          name: GA_EVENT,
          params: {
            kind: "synthetic_daily_user_count",
            source: "deterministic_daily_growth",
            user_count: userCount,
            page_location: "https://horacal.app/",
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(
      `GA4 Measurement Protocol event failed: ${response.status} ${response.statusText}`,
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
    event: GA_EVENT,
    userCount,
  });
}
