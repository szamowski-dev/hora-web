import assert from "node:assert/strict";
import test from "node:test";
import { defaultProductLanding } from "../content/home-landing";
import { defaultPricingPage } from "../content/pricing";
import {
  DIRECT_DOWNLOAD_HREF,
  DIRECT_DOWNLOAD_LABEL,
  DIRECT_CHECKOUT_PRICE_NOTE,
  DIRECT_PRICING_FAQ_ITEMS,
  DIRECT_PRICING_HERO,
  DIRECT_PRICING_PLANS,
} from "../lib/direct/commerce-contract";
import { HORA_INSTALLATION_FAQ } from "../lib/direct/support-content";

test("keeps Direct new-sale pricing in code while Sanity controls download visibility", () => {
  assert.equal(DIRECT_DOWNLOAD_HREF, "/download/direct/");
  assert.equal(
    DIRECT_DOWNLOAD_LABEL,
    "Download",
  );
  assert.deepEqual(
    DIRECT_PRICING_PLANS.map((plan) => [
      plan.name,
      plan.price,
      plan.suffix,
    ]),
    [
      ["Monthly", "$2.99", "/month"],
      ["Annual", "$29.99", "/year"],
    ],
  );
  assert.equal(
    DIRECT_PRICING_PLANS.some((plan) =>
      plan.name.toLowerCase().includes("lifetime"),
    ),
    false,
  );
  assert.match(DIRECT_PRICING_HERO.description, /7 days/i);
  const publicCopy = JSON.stringify(DIRECT_PRICING_FAQ_ITEMS).toLowerCase();
  assert.match(publicCopy, /7-day cardless trial/);
  assert.match(publicCopy, /no new lifetime plan/);
  assert.doesNotMatch(publicCopy, /14-day|14 day|24-hour|24 hour/);
  assert.equal(
    DIRECT_CHECKOUT_PRICE_NOTE,
    "Choose a plan in the app. Final currency and applicable taxes are confirmed in checkout.",
  );
  assert.equal(defaultPricingPage.direct.showDownload, false);
});

test("keeps the homepage copy and installation FAQ aligned across distributions", () => {
  assert.equal(
    defaultProductLanding.hero.primaryCtaLabel,
    DIRECT_DOWNLOAD_LABEL,
  );
  assert.equal(defaultProductLanding.hero.showTerminalPrompt, false);
  assert.equal(
    defaultProductLanding.hero.directDownloadNote,
    "Choose a plan in the app. Requires macOS 26 or newer.",
  );

  assert.match(HORA_INSTALLATION_FAQ, /Direct edition/);
  assert.match(HORA_INSTALLATION_FAQ, /Mac App Store/);
  assert.match(HORA_INSTALLATION_FAQ, /Setapp/);
  assert.match(HORA_INSTALLATION_FAQ, /7-day cardless trial/);
});
