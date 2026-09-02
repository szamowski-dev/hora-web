import type { CaptureLogOptions } from "posthog-js";

/**
 * A single failing WebGL/WebGPU frame can re-throw the same console error on
 * every subsequent frame — one session produced ~2800 identical records in four
 * minutes. Repeats past this many carry no extra diagnostic value, so they are
 * dropped before they reach PostHog's buffer.
 */
const MAX_RECORDS_PER_SIGNATURE = 5;

/** Bounds the tracker so a page with endlessly varying messages cannot grow it forever. */
const MAX_TRACKED_SIGNATURES = 200;

const VOLATILE_PATTERNS: readonly RegExp[] = [
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
  /https?:\/\/\S+/gi,
  /\d+/g,
];

const seen = new Map<string, number>();

/**
 * Collapses the parts of a message that change between otherwise identical
 * repeats, so `renderContext_0` and `renderContext_1` share one budget.
 */
function signature(body: string): string {
  return VOLATILE_PATTERNS.reduce(
    (result, pattern) => result.replace(pattern, "*"),
    body.slice(0, 300),
  );
}

function track(key: string): number {
  const count = (seen.get(key) ?? 0) + 1;

  // Re-inserting keeps insertion order aligned with recency, so the entry
  // evicted below is genuinely the least recently seen one.
  seen.delete(key);
  seen.set(key, count);

  if (seen.size > MAX_TRACKED_SIGNATURES) {
    const oldest = seen.keys().next();
    if (!oldest.done) seen.delete(oldest.value);
  }

  return count;
}

/**
 * Caps how many times one repeated log body reaches PostHog. The record that
 * hits the cap is rewritten to say suppression started, so a truncated burst is
 * never mistaken for a burst that stopped on its own.
 */
export function limitRepeatedLogs(
  record: CaptureLogOptions,
): CaptureLogOptions | null {
  if (typeof record.body !== "string" || record.body === "") return record;

  const count = track(`${record.level ?? "info"}:${signature(record.body)}`);

  if (count < MAX_RECORDS_PER_SIGNATURE) return record;

  if (count === MAX_RECORDS_PER_SIGNATURE) {
    return {
      ...record,
      body: `${record.body}\n[posthog] Further identical records in this session are dropped after ${MAX_RECORDS_PER_SIGNATURE}.`,
      attributes: { ...record.attributes, repeats_suppressed_from: count },
    };
  }

  return null;
}

/** Test seam: the tracker is module-level state that outlives a single case. */
export function resetRepeatedLogTracking(): void {
  seen.clear();
}
