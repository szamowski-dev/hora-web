import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";

import type { CaptureLogOptions } from "posthog-js";

import {
  limitRepeatedLogs,
  resetRepeatedLogTracking,
} from "../lib/posthog-log-limit";

function logRecord(body: string): CaptureLogOptions {
  return { body, level: "error" };
}

function bodiesKept(records: CaptureLogOptions[]): string[] {
  return records
    .map((record) => limitRepeatedLogs(record))
    .filter((record): record is CaptureLogOptions => record !== null)
    .map((record) => record.body);
}

beforeEach(() => {
  resetRepeatedLogTracking();
});

test("keeps a burst of distinct messages", () => {
  const kept = bodiesKept(
    ["first failure", "second failure", "third failure"].map(logRecord),
  );

  assert.deepEqual(kept, ["first failure", "second failure", "third failure"]);
});

test("caps one repeated message and marks where suppression began", () => {
  const kept = bodiesKept(
    Array.from({ length: 2800 }, () => logRecord("WebGPU validation error")),
  );

  assert.equal(kept.length, 5);
  assert.equal(kept.at(-1)?.includes("Further identical records"), true);
  assert.deepEqual(new Set(kept.slice(0, 4)), new Set(["WebGPU validation error"]));
});

test("shares one budget across repeats that differ only in volatile values", () => {
  const kept = bodiesKept(
    Array.from({ length: 40 }, (_unused, index) =>
      logRecord(
        `Invalid CommandBuffer from CommandEncoder "renderContext_${index}"`,
      ),
    ),
  );

  assert.equal(kept.length, 5);
});

test("budgets each severity separately", () => {
  const errors = Array.from({ length: 10 }, () => logRecord("same body"));
  const warns = Array.from({ length: 10 }, () => ({
    ...logRecord("same body"),
    level: "warn" as const,
  }));

  assert.equal(bodiesKept(errors).length, 5);
  assert.equal(bodiesKept(warns).length, 5);
});

test("passes records through untouched when there is no body to compare", () => {
  const record = { body: "", level: "error" } as CaptureLogOptions;

  assert.equal(limitRepeatedLogs(record), record);
});

test("keeps a rare message alive after many unrelated signatures", () => {
  for (let index = 0; index < 500; index += 1) {
    limitRepeatedLogs(logRecord(`unrelated failure ${"x".repeat(index)}`));
  }

  assert.notEqual(limitRepeatedLogs(logRecord("brand new failure")), null);
});
