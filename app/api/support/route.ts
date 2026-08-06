import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const bodySchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  category: z.enum(["bug", "account", "sync", "billing", "refund", "feature", "other"]),
  summary: z.string().trim().min(8).max(120),
  details: z.string().trim().min(20).max(4000),
  appVersion: z.string().trim().max(40).optional(),
  osVersion: z.string().trim().max(80).optional(),
  steps: z.string().trim().max(2000).optional(),
  paddleTransactionId: z.string().trim().max(100).optional(),
  honey: z.string().max(0).optional(),
});

const categoryLabels: Record<z.infer<typeof bodySchema>["category"], string> = {
  bug: "Bug report",
  account: "Account or login",
  sync: "Calendar sync",
  billing: "Billing",
  refund: "Paddle refund (direct purchase)",
  feature: "Feature request",
  other: "Other",
};

const categoryIssueTypes: Record<z.infer<typeof bodySchema>["category"], "Bug" | "Feature"> = {
  bug: "Bug",
  account: "Bug",
  sync: "Bug",
  billing: "Bug",
  refund: "Bug",
  feature: "Feature",
  other: "Bug",
};

const ALLOWED_ORIGINS = new Set([
  "https://horacal.app",
  "http://localhost:3000",
]);

function corsHeaders(origin: string | null): HeadersInit {
  const allow =
    origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://horacal.app";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function jsonHeaders(origin: string | null): HeadersInit {
  return { ...corsHeaders(origin), "Content-Type": "application/json" };
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function getSupportRepo(): { owner: string; repo: string } | null {
  const value = process.env.GITHUB_SUPPORT_REPO ?? "szamowski-dev/hora-calendar";

  const [owner, repo] = value.split("/");
  if (!owner || !repo) return null;
  return { owner, repo };
}

function getIssueLabels(): string[] {
  return (process.env.GITHUB_SUPPORT_LABELS?.split(",") ?? [])
    .map((label) => label.trim())
    .filter((label, index, labels) => label && labels.indexOf(label) === index);
}

function issueBody(input: z.infer<typeof bodySchema>): string {
  const optionalRows = [
    input.appVersion ? `| App version | ${input.appVersion} |` : null,
    input.osVersion ? `| OS version | ${input.osVersion} |` : null,
    input.paddleTransactionId
      ? `| Paddle transaction ID | ${input.paddleTransactionId} |`
      : null,
  ].filter(Boolean);

  return [
    "## Support request",
    "",
    `**Category:** ${categoryLabels[input.category]}`,
    `**From:** ${input.name} <${input.email}>`,
    "",
    "## Environment",
    "",
    "| Field | Value |",
    "| --- | --- |",
    ...optionalRows,
    optionalRows.length === 0 ? "| Provided | No environment details |" : null,
    "",
    "## Details",
    "",
    input.details,
    "",
    "## Steps tried / reproduction",
    "",
    input.steps?.trim() || "Not provided.",
    "",
    "---",
    "Created from the hora Calendar support form.",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { headers: corsHeaders(req.headers.get("origin")) });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const headers = jsonHeaders(origin);

  const ip = getClientIp(req);
  if (!checkRateLimit(`support:${ip}`, 5)) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429, headers },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400, headers },
    );
  }

  const repo = getSupportRepo();
  const token = process.env.GITHUB_SUPPORT_TOKEN;
  if (!repo || !token) {
    console.error("GitHub support env vars missing");
    return NextResponse.json(
      { error: "Support form is not configured yet." },
      { status: 500, headers },
    );
  }

  const input = parsed.data;
  const res = await fetch(
    `https://api.github.com/repos/${repo.owner}/${repo.repo}/issues`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "hora-calendar-support-form",
        "X-GitHub-Api-Version": "2026-03-10",
      },
      body: JSON.stringify({
        title: `[${categoryLabels[input.category]}] ${input.summary}`,
        body: issueBody(input),
        labels: getIssueLabels(),
        type: categoryIssueTypes[input.category],
      }),
    },
  );

  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    console.error("GitHub issue creation failed", {
      status: res.status,
      message: payload?.message,
    });
    return NextResponse.json(
      { error: "Could not send your support request. Please try again later." },
      { status: 502, headers },
    );
  }

  return NextResponse.json(
    {
      success: true,
      issueUrl: typeof payload?.html_url === "string" ? payload.html_url : null,
    },
    { status: 201, headers },
  );
}
