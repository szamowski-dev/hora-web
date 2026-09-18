import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const [budgetPath, ...reportPaths] = process.argv.slice(2);
if (!budgetPath || reportPaths.length === 0) {
  console.error("Usage: node scripts/check-lighthouse-budgets.mjs performance-budgets.json report.json [...report.json]");
  process.exit(2);
}

const budget = JSON.parse(await readFile(resolve(budgetPath), "utf8"));
const configuredRoutes = new Set(budget.routes);
const auditBudgets = {
  "largest-contentful-paint": budget.lab.budgets.lcpMs,
  "first-contentful-paint": budget.lab.budgets.fcpMs,
  "total-blocking-time": budget.lab.budgets.tbtMs,
  "cumulative-layout-shift": budget.lab.budgets.cls,
};
let failed = false;

for (const reportPath of reportPaths) {
  const report = JSON.parse(await readFile(resolve(reportPath), "utf8"));
  const pathname = new URL(report.finalUrl).pathname;
  if (!configuredRoutes.has(pathname)) {
    console.error(`${reportPath}: ${pathname} is not in performance-budgets.json`);
    failed = true;
    continue;
  }

  for (const [auditName, limit] of Object.entries(auditBudgets)) {
    const value = report.audits?.[auditName]?.numericValue;
    if (typeof value !== "number") {
      console.error(`${reportPath}: missing Lighthouse audit ${auditName}`);
      failed = true;
      continue;
    }
    if (value > limit) {
      console.error(`${reportPath}: ${auditName} ${value} exceeds ${limit}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log(`Performance budgets passed for ${reportPaths.length} Lighthouse report(s).`);
