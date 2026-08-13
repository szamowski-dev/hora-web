export type DirectPushDeviceCommand = {
  action: "register" | "unregister";
  app_user_id: string;
  apns_token: string;
  apns_environment: "sandbox" | "production";
};

type DirectPushWorkerEnvironment = {
  DIRECT_PUSH_WORKER_URL?: string;
  DIRECT_PUSH_WORKER_SECRET?: string;
};

type DirectPushWorkerDependencies = {
  fetch: typeof fetch;
};

const WORKER_TIMEOUT_MS = 8_000;

function workerEndpoint(environment: DirectPushWorkerEnvironment): URL {
  const configuredUrl = environment.DIRECT_PUSH_WORKER_URL?.trim();
  const secret = environment.DIRECT_PUSH_WORKER_SECRET?.trim();
  if (!configuredUrl || !secret) {
    throw new Error("Direct push worker is not configured");
  }

  const baseUrl = new URL(configuredUrl);
  if (baseUrl.protocol !== "https:") {
    throw new Error("Direct push worker URL must use HTTPS");
  }
  baseUrl.pathname = `${baseUrl.pathname.replace(/\/$/, "")}/v1/direct/devices`;
  baseUrl.search = "";
  baseUrl.hash = "";
  return baseUrl;
}

export async function sendDirectPushDeviceCommand(
  command: DirectPushDeviceCommand,
  environment: DirectPushWorkerEnvironment =
    process.env as DirectPushWorkerEnvironment,
  dependencies: DirectPushWorkerDependencies = { fetch },
): Promise<void> {
  const endpoint = workerEndpoint(environment);
  const secret = environment.DIRECT_PUSH_WORKER_SECRET!.trim();
  const response = await dependencies.fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
    signal: AbortSignal.timeout(WORKER_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Direct push worker returned ${response.status}`);
  }
}
