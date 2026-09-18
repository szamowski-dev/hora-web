import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("performance budgets cover conversion pages and the highest-risk blog routes", async () => {
  const budget = JSON.parse(
    await readFile(new URL("../performance-budgets.json", import.meta.url), "utf8"),
  );

  assert.deepEqual(budget.field.budgets, { lcpMs: 2500, inpMs: 200, cls: 0.1 });
  assert.deepEqual(budget.lab.budgets, { lcpMs: 2500, fcpMs: 1800, tbtMs: 200, cls: 0.1 });
  assert.deepEqual(budget.routes.slice(0, 2), ["/", "/pricing/"]);
  assert.equal(budget.routes.length, 7);
});
