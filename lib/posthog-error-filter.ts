import type { CaptureResult } from "posthog-js";

const NON_ACTIONABLE_EXCEPTION_MESSAGES = new Set([
  "ResizeObserver loop completed with undelivered notifications.",
  "Script error.",
]);

function exceptionMessages(event: CaptureResult): string[] {
  const list = event.properties.$exception_list;
  if (Array.isArray(list)) {
    return list.flatMap((exception) => {
      if (!exception || typeof exception !== "object") return [];
      const value = (exception as { value?: unknown }).value;
      return typeof value === "string" ? [value] : [];
    });
  }

  const values = event.properties.$exception_values;
  return Array.isArray(values)
    ? values.filter((value): value is string => typeof value === "string")
    : [];
}

function isStudioException(event: CaptureResult): boolean {
  const currentUrl = event.properties.$current_url;
  if (typeof currentUrl !== "string") return false;

  try {
    return /^\/studio(?:\/|$)/.test(new URL(currentUrl).pathname);
  } catch {
    return false;
  }
}

export function filterPostHogEvent(
  event: CaptureResult | null,
): CaptureResult | null {
  if (!event || event.event !== "$exception") return event;
  if (isStudioException(event)) return null;

  return exceptionMessages(event).some((message) =>
    NON_ACTIONABLE_EXCEPTION_MESSAGES.has(message),
  )
    ? null
    : event;
}
