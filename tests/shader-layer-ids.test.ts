import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

/**
 * The `shaders` runtime names every GLSL uniform `${prop}_${instanceId}`, and
 * falls back to React's `useId()` when a layer has no `id` prop. React 19 emits
 * ids shaped like `_r_2_`, so the fallback produces `seed__r_2_` — and GLSL ES
 * reserves consecutive underscores, so Safari refuses to compile the program and
 * the layer silently disappears. An explicit `id` keeps the name well-formed.
 */
const CANVASES = [
  "components/organisms/HeroShaderCanvas.tsx",
  "components/organisms/ProductHeroShaderCanvas.tsx",
] as const;

/** The container renders no uniforms of its own, so it needs no id. */
const LAYERLESS_COMPONENTS = new Set(["Shader"]);

/** Mirrors the sanitization the runtime applies to `id` before naming uniforms. */
function toInstanceId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_]/g, "_");
}

function importedComponents(source: string): string[] {
  const importBlock = /import\s+\{([^}]+)\}\s+from\s+"shaders\/react";/.exec(
    source,
  );
  assert.ok(importBlock, "expected an import from shaders/react");

  return importBlock[1]
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name !== "" && !LAYERLESS_COMPONENTS.has(name));
}

function openingTags(source: string, component: string): string[] {
  const tags: string[] = [];
  const pattern = new RegExp(`<${component}[\\s/>]`, "g");

  for (const match of source.matchAll(pattern)) {
    const end = source.indexOf(">", match.index);
    assert.notEqual(end, -1, `unterminated <${component}> tag`);
    tags.push(source.slice(match.index, end));
  }

  return tags;
}

for (const path of CANVASES) {
  const source = readFileSync(path, "utf8");
  const components = importedComponents(source);

  test(`${path} gives every shader layer an explicit id`, () => {
    assert.notEqual(components.length, 0);

    for (const component of components) {
      const tags = openingTags(source, component);
      assert.notEqual(tags.length, 0, `<${component}> is imported but unused`);

      for (const tag of tags) {
        assert.match(
          tag,
          /\sid="[^"]+"/,
          `<${component}> needs an explicit id, otherwise its uniforms are named from React's useId()`,
        );
      }
    }
  });

  test(`${path} uses ids that produce valid GLSL identifiers`, () => {
    const ids = [...source.matchAll(/\sid="([^"]+)"/g)].map(
      (match) => match[1],
    );
    assert.notEqual(ids.length, 0);

    for (const id of ids) {
      const instanceId = toInstanceId(id);

      assert.doesNotMatch(
        `seed_${instanceId}`,
        /__/,
        `id "${id}" yields a uniform name with consecutive underscores`,
      );
      assert.doesNotMatch(
        instanceId,
        /^[0-9]/,
        `id "${id}" yields a uniform name segment starting with a digit`,
      );
    }

    assert.equal(new Set(ids).size, ids.length, "shader ids must be unique");
  });
}
