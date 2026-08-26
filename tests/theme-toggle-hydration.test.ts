import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";

test("keeps theme-toggle label text static across hydration", () => {
  const markup = renderToStaticMarkup(createElement(ThemeToggle));

  assert.match(markup, /Switch to dark mode/);
  assert.match(markup, /Switch to light mode/);
  assert.doesNotMatch(markup, /aria-label=|title=/);
});

test("theme bootstrap does not mutate React-owned toggle labels", () => {
  const layout = readFileSync(join(process.cwd(), "app/layout.tsx"), "utf8");

  assert.doesNotMatch(layout, /syncToggleLabels|theme-toggle-label|textContent/);
});
