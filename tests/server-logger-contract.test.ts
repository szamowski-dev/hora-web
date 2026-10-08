import assert from "node:assert/strict";
import test from "node:test";
import { serverErrorLogAttributes } from "@/lib/server-logger";

test("server error logs contain only bounded operational metadata", () => {
  assert.deepEqual(
    serverErrorLogAttributes({
      route: "/api/support",
      operation: "support_intake_send",
      statusCode: 502,
    }),
    {
      "http.route": "/api/support",
      "error.operation": "support_intake_send",
      "http.response.status_code": 502,
    },
  );
});
