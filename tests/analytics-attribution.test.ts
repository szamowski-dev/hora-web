import assert from "node:assert/strict";
import test from "node:test";
import { captureFirstTouch, getAttribution } from "../lib/analytics";

test("captures fbclid with the consented first touch", () => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const storage = new Map<string, string>();

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: { href: "https://horacal.app/?fbclid=meta-click-id" },
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
      },
    },
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: { referrer: "" },
  });

  try {
    captureFirstTouch(true);
    assert.deepEqual(getAttribution(), {
      fbclid: "meta-click-id",
      first_touch_landing_page: "/?fbclid=meta-click-id",
      first_touch_at: storage.has("hora_first_touch_v1")
        ? JSON.parse(storage.get("hora_first_touch_v1")!).at
        : "",
    });
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
    else Reflect.deleteProperty(globalThis, "window");
    if (previousDocument) Object.defineProperty(globalThis, "document", previousDocument);
    else Reflect.deleteProperty(globalThis, "document");
  }
});
