import assert from "node:assert/strict";
import test from "node:test";

import type { CaptureResult } from "posthog-js";

import { filterPostHogEvent } from "../lib/posthog-error-filter";

function exceptionEvent(
  value: string,
  currentUrl = "https://horacal.app/",
): CaptureResult {
  return {
    uuid: "00000000-0000-4000-8000-000000000000",
    event: "$exception",
    properties: {
      $current_url: currentUrl,
      $exception_list: [{ type: "Error", value }],
    },
  };
}

test("drops exceptions captured inside Sanity Studio", () => {
  const event = exceptionEvent(
    "AbortError: signal is aborted without reason",
    "https://horacal.app/studio/structure/recentlyEdited",
  );

  assert.equal(filterPostHogEvent(event), null);
});

test("drops only exact non-actionable browser exception messages", () => {
  assert.equal(
    filterPostHogEvent(
      exceptionEvent(
        "ResizeObserver loop completed with undelivered notifications.",
      ),
    ),
    null,
  );
  assert.equal(filterPostHogEvent(exceptionEvent("Script error.")), null);
  const actionableScriptError = exceptionEvent(
    "Script error. Loading checkout failed.",
  );
  assert.equal(
    filterPostHogEvent(actionableScriptError),
    actionableScriptError,
  );
});

test("keeps actionable public-site exceptions", () => {
  const hydrationError = exceptionEvent(
    "Minified React error #418; visit https://react.dev/errors/418",
  );
  const networkError = exceptionEvent("Failed to fetch");

  assert.equal(filterPostHogEvent(hydrationError), hydrationError);
  assert.equal(filterPostHogEvent(networkError), networkError);
});

test("keeps non-exception events and null input unchanged", () => {
  const pageview: CaptureResult = {
    uuid: "00000000-0000-4000-8000-000000000001",
    event: "$pageview",
    properties: {},
  };

  assert.equal(filterPostHogEvent(pageview), pageview);
  assert.equal(filterPostHogEvent(null), null);
});
