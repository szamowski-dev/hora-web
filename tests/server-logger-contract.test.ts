import assert from "node:assert/strict";
import test from "node:test";
import { serverErrorLogAttributes } from "@/lib/server-logger";

test("server error logs contain only bounded operational metadata", () => {
  assert.deepEqual(
    serverErrorLogAttributes({
      route: "/api/support",
      operation: "posthog_support_metadata_rejected",
      statusCode: 502,
    }),
    {
      "http.route": "/api/support",
      "error.operation": "posthog_support_metadata_rejected",
      "http.response.status_code": 502,
    },
  );
});
