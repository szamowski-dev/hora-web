import "server-only";
import { createSign } from "node:crypto";
import { gunzipSync } from "node:zlib";

const API_BASE_URL = "https://api.appstoreconnect.apple.com/v1";
const COUNT_TTL_MS = 60 * 60 * 1000;
const FAILURE_COOLDOWN_MS = 60 * 1000;
const JWT_TTL_SECONDS = 19 * 60;

let countCache: { value: number; expires: number } | null = null;
let jwtCache: { value: string; expires: number } | null = null;
let lastKnown: number | null = null;
let lastFailureAt = 0;
let inflight: Promise<number | null> | null = null;

function base64Url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function normalizePrivateKey(value: string) {
  return value
    .trim()
    .replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n");
}

function createAppStoreConnectJwt() {
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (jwtCache && jwtCache.expires > nowSeconds + 30) return jwtCache.value;

  const keyId = getRequiredEnv("ASC_KEY_ID");
  const issuerId = getRequiredEnv("ASC_ISSUER_ID");
  const privateKey = normalizePrivateKey(getRequiredEnv("ASC_PRIVATE_KEY"));

  const header = {
    alg: "ES256",
    kid: keyId,
    typ: "JWT",
  };
  const payload = {
    aud: "appstoreconnect-v1",
    exp: nowSeconds + JWT_TTL_SECONDS,
    iat: nowSeconds,
    iss: issuerId,
  };

  const unsignedToken = `${base64Url(JSON.stringify(header))}.${base64Url(
    JSON.stringify(payload),
  )}`;
  const signature = createSign("SHA256")
    .update(unsignedToken)
    .end()
    .sign({ key: privateKey, dsaEncoding: "ieee-p1363" });
  const token = `${unsignedToken}.${base64Url(signature)}`;

  jwtCache = {
    value: token,
    expires: payload.exp,
  };

  return token;
}

type TestFlightCountResponse = {
  meta?: {
    paging?: {
      total?: number;
    };
  };
};

type JsonApiResource = {
  id: string;
  type?: string;
  attributes?: Record<string, unknown>;
};

type JsonApiCollectionResponse = {
  data?: JsonApiResource[];
};

type AnalyticsReportSegmentResponse = {
  data?: JsonApiResource & {
    attributes?: {
      url?: string;
    };
  };
};

function getOptionalEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

async function fetchAppStoreConnectJson<T>(path: string, urlSearchParams?: URLSearchParams) {
  const token = createAppStoreConnectJwt();
  const url = new URL(`${API_BASE_URL}${path}`);
  if (urlSearchParams) {
    for (const [key, value] of urlSearchParams) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: COUNT_TTL_MS / 1000 },
  });

  if (!response.ok) {
    throw new Error(`${path} failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export async function fetchTestFlightTesterCount() {
  const appId = getOptionalEnv("ASC_APP_ID");
  if (!appId) return null;

  const params = new URLSearchParams({
    "filter[apps]": appId,
    limit: "1",
  });

  try {
    const json = await fetchAppStoreConnectJson<TestFlightCountResponse>(
      "/betaTesters",
      params,
    );
    const count = json.meta?.paging?.total;
    return typeof count === "number" ? count : null;
  } catch (err) {
    console.error("[testflight] App Store Connect count failed:", {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

function normalizeHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[-_]/g, " ");
}

function parseDelimitedRows(input: string) {
  const delimiter = input.includes("\t") ? "\t" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const nextChar = input[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === delimiter) {
      row.push(cell);
      cell = "";
      continue;
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && nextChar === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell);
  if (row.some((value) => value.trim() !== "")) rows.push(row);

  return rows;
}

function parseNumber(value: string | undefined) {
  if (!value) return null;
  const normalized = value.replace(/,/g, "").trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function sumFirstTimeDownloads(reportText: string) {
  const rows = parseDelimitedRows(reportText);
  const [headers, ...dataRows] = rows;
  if (!headers) return null;

  const configuredColumns = getOptionalEnv("ASC_FIRST_TIME_DOWNLOADS_COLUMN")
    ?.split(",")
    .map(normalizeHeader)
    .filter(Boolean);
  const targetColumns =
    configuredColumns && configuredColumns.length > 0
      ? configuredColumns
      : [
          "first time downloads",
          "first-time downloads",
          "first time download",
          "first-time download",
        ].map(normalizeHeader);

  const columnIndex = headers.findIndex((header) =>
    targetColumns.includes(normalizeHeader(header)),
  );
  if (columnIndex === -1) {
    console.error("[testflight] First-time downloads column not found:", {
      headers,
    });
    return null;
  }

  return dataRows.reduce((total, row) => {
    const value = parseNumber(row[columnIndex]);
    return value === null ? total : total + value;
  }, 0);
}

function chooseReport(reports: JsonApiResource[]) {
  const configuredReportName = getOptionalEnv("ASC_ANALYTICS_DOWNLOADS_REPORT_NAME");
  const normalizedName = configuredReportName
    ? normalizeHeader(configuredReportName)
    : null;

  if (normalizedName) {
    return reports.find((report) => {
      const name = String(report.attributes?.name ?? "");
      return normalizeHeader(name).includes(normalizedName);
    });
  }

  return reports.find((report) => {
    const name = normalizeHeader(String(report.attributes?.name ?? ""));
    return name.includes("download") || name.includes("install");
  });
}

async function fetchAnalyticsReportRequestId(appId: string) {
  const configuredRequestId = getOptionalEnv("ASC_ANALYTICS_REPORT_REQUEST_ID");
  if (configuredRequestId) return configuredRequestId;

  const params = new URLSearchParams({
    "filter[accessType]": "ONGOING",
    "fields[analyticsReportRequests]": "accessType,stoppedDueToInactivity",
    limit: "10",
  });
  const json = await fetchAppStoreConnectJson<JsonApiCollectionResponse>(
    `/apps/${appId}/analyticsReportRequests`,
    params,
  );

  return json.data?.find((request) => !request.attributes?.stoppedDueToInactivity)
    ?.id;
}

async function fetchDownloadsReportId(requestId: string) {
  const configuredReportId = getOptionalEnv("ASC_ANALYTICS_DOWNLOADS_REPORT_ID");
  if (configuredReportId) return configuredReportId;

  const configuredReportName = getOptionalEnv("ASC_ANALYTICS_DOWNLOADS_REPORT_NAME");
  const params = new URLSearchParams({
    "fields[analyticsReports]": "name,category",
    limit: "200",
  });
  if (configuredReportName) params.set("filter[name]", configuredReportName);

  const json = await fetchAppStoreConnectJson<JsonApiCollectionResponse>(
    `/analyticsReportRequests/${requestId}/reports`,
    params,
  );
  const report = chooseReport(json.data ?? []);

  if (!report) {
    console.error("[testflight] Downloads analytics report not found:", {
      availableReports: json.data?.map((item) => item.attributes?.name),
    });
  }

  return report?.id;
}

async function fetchLatestAnalyticsInstanceId(reportId: string) {
  const configuredInstanceId = getOptionalEnv("ASC_ANALYTICS_DOWNLOADS_INSTANCE_ID");
  if (configuredInstanceId) return configuredInstanceId;

  const processingDate = getOptionalEnv("ASC_ANALYTICS_DOWNLOADS_PROCESSING_DATE");
  const params = new URLSearchParams({
    "filter[granularity]": "DAILY",
    "fields[analyticsReportInstances]": "granularity,processingDate",
    limit: "200",
  });
  if (processingDate) params.set("filter[processingDate]", processingDate);

  const json = await fetchAppStoreConnectJson<JsonApiCollectionResponse>(
    `/analyticsReports/${reportId}/instances`,
    params,
  );
  const instances = [...(json.data ?? [])].sort((a, b) =>
    String(b.attributes?.processingDate ?? "").localeCompare(
      String(a.attributes?.processingDate ?? ""),
    ),
  );

  return instances[0]?.id;
}

async function fetchAnalyticsSegmentUrl(instanceId: string) {
  const configuredSegmentId = getOptionalEnv("ASC_ANALYTICS_DOWNLOADS_SEGMENT_ID");
  let segmentId = configuredSegmentId;

  if (!segmentId) {
    const params = new URLSearchParams({
      "fields[analyticsReportSegments]": "url,sizeInBytes",
      limit: "10",
    });
    const json = await fetchAppStoreConnectJson<JsonApiCollectionResponse>(
      `/analyticsReportInstances/${instanceId}/segments`,
      params,
    );
    segmentId = json.data?.[0]?.id ?? null;
  }

  if (!segmentId) return null;

  const json = await fetchAppStoreConnectJson<AnalyticsReportSegmentResponse>(
    `/analyticsReportSegments/${segmentId}`,
    new URLSearchParams({
      "fields[analyticsReportSegments]": "url",
    }),
  );

  return json.data?.attributes?.url ?? null;
}

async function fetchSegmentText(url: string) {
  const response = await fetch(url, {
    next: { revalidate: COUNT_TTL_MS / 1000 },
  });
  if (!response.ok) {
    throw new Error(`analytics segment failed: ${response.status} ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const bytes =
    buffer[0] === 0x1f && buffer[1] === 0x8b ? gunzipSync(buffer) : buffer;
  return bytes.toString("utf8");
}

export async function fetchAppStoreFirstTimeDownloads() {
  try {
    const appId = getOptionalEnv("ASC_APP_ID");
    if (!appId) return null;

    const requestId = await fetchAnalyticsReportRequestId(appId);
    if (!requestId) return null;

    const reportId = await fetchDownloadsReportId(requestId);
    if (!reportId) return null;

    const instanceId = await fetchLatestAnalyticsInstanceId(reportId);
    if (!instanceId) return null;

    const segmentUrl = await fetchAnalyticsSegmentUrl(instanceId);
    if (!segmentUrl) return null;

    const segmentText = await fetchSegmentText(segmentUrl);
    return sumFirstTimeDownloads(segmentText);
  } catch (err) {
    console.error("[testflight] App Store downloads count failed:", {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

export async function fetchHoraUserCount() {
  const [testFlightCount, appStoreDownloads] = await Promise.all([
    fetchTestFlightTesterCount(),
    fetchAppStoreFirstTimeDownloads(),
  ]);

  if (testFlightCount === null && appStoreDownloads === null) return null;
  return (testFlightCount ?? 0) + (appStoreDownloads ?? 0);
}

export async function getTestFlightTesterCount(fallback: number): Promise<number> {
  const now = Date.now();
  if (countCache && countCache.expires > now) return countCache.value;
  if (now - lastFailureAt < FAILURE_COOLDOWN_MS) {
    return lastKnown ?? fallback;
  }

  if (!inflight) {
    inflight = (async () => {
      try {
        const count = await fetchHoraUserCount();
        if (count === null) {
          lastFailureAt = Date.now();
        } else {
          countCache = { value: count, expires: Date.now() + COUNT_TTL_MS };
          lastKnown = count;
        }
        return count;
      } catch (err) {
        console.error("[testflight] Unexpected count error:", err);
        lastFailureAt = Date.now();
        return null;
      } finally {
        inflight = null;
      }
    })();
  }

  const count = await inflight;
  return count ?? lastKnown ?? fallback;
}
