import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PricingPlans } from "../components/organisms/PricingPlans";
import { defaultProductLanding } from "../content/home-landing";
import { defaultPricingPage } from "../content/pricing";
import {
  DIRECT_DOWNLOAD_HREF,
  DIRECT_DOWNLOAD_LABEL,
  DIRECT_CHECKOUT_PRICE_NOTE,
  DIRECT_PRICING_FAQ_ITEMS,
  DIRECT_PRICING_HERO,
  DIRECT_PRICING_PLANS,
  DIRECT_TRIAL_PRICING_NOTE,
} from "../lib/direct/commerce-contract";
import { defaultBlogCta } from "../content/blog-cta";
import { defaultGoogleCalendarMacPage } from "../content/google-calendar-mac";
import { HORA_INSTALLATION_FAQ } from "../lib/direct/support-content";
import { site } from "../content/site";

test("keeps Direct new-sale pricing in code while Sanity controls download visibility", () => {
  assert.equal(DIRECT_DOWNLOAD_HREF, "/download/direct/");
  assert.equal(site.cta.direct.href, DIRECT_DOWNLOAD_HREF);
  assert.equal(
    site.footer.productLinks.find((link) => link.label === "Download")?.href,
    DIRECT_DOWNLOAD_HREF,
  );
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
      ["Lifetime", "$59.99", "one-time"],
    ],
  );
  assert.equal(DIRECT_PRICING_PLANS[2].directOnly, true);
  assert.match(DIRECT_PRICING_HERO.description, /7 days/i);
  const publicCopy = JSON.stringify(DIRECT_PRICING_FAQ_ITEMS).toLowerCase();
  assert.match(publicCopy, /7-day cardless trial/);
  assert.match(publicCopy, /one-time purchase, available only with the direct download/);
  assert.match(publicCopy, /permanent access/);
  assert.match(publicCopy, /all current and future direct features and updates/);
  assert.doesNotMatch(publicCopy, /no new lifetime plan/);
  assert.match(publicCopy, /within 14 days of any direct payment/);
  assert.match(publicCopy, /reviewed case by case/);
  assert.doesNotMatch(publicCopy, /24-hour|24 hour/);
  assert.equal(
    DIRECT_CHECKOUT_PRICE_NOTE,
    "Choose a plan in the app. Final currency and applicable taxes are confirmed in checkout.",
  );
  assert.equal(defaultPricingPage.direct.showDownload, false);
});

test("shows Lifetime only when Direct download is available", () => {
  const render = (showDirectDownload: boolean) => renderToStaticMarkup(
    createElement(PricingPlans, { plans: DIRECT_PRICING_PLANS, showDirectDownload }),
  );
  const direct = render(true);
  assert.equal((direct.match(/<article/g) ?? []).length, 3);
  assert.match(direct, /Lifetime/);
  assert.match(direct, /\$59\.99/);
  assert.match(direct, /Direct only/);
  assert.match(direct, /One-time purchase/);
  assert.doesNotMatch(direct, /href=/);
  const appStore = render(false);
  assert.equal((appStore.match(/<article/g) ?? []).length, 2);
  assert.doesNotMatch(appStore, /Lifetime|Direct only/);
});

test("hides empty plan labels even when Sanity preview metadata is present", () => {
  const previewMetadata = "\u200b\u200c\u200d\ufeff";
  for (const empty of ["", "   ", previewMetadata]) {
    const markup = renderToStaticMarkup(createElement(PricingPlans, {
      plans: [{ ...DIRECT_PRICING_PLANS[0], savingsLabel: empty, priceDetail: empty, suffix: empty }],
      showDirectDownload: true,
    }));
    assert.doesNotMatch(markup, /rounded-full|mt-2 text-lg|text-base font-medium/);
  }
  const markup = renderToStaticMarkup(createElement(PricingPlans, {
    plans: [{ ...DIRECT_PRICING_PLANS[1], savingsLabel: `SAVE 16%${previewMetadata}` }],
    showDirectDownload: true,
  }));
  assert.match(markup, /rounded-full/);
  assert.match(markup, /SAVE 16%/);
});

test("keeps the homepage copy and installation FAQ aligned across distributions", () => {
  assert.equal(
    defaultProductLanding.hero.primaryCtaLabel,
    DIRECT_DOWNLOAD_LABEL,
  );
  assert.equal(defaultProductLanding.hero.showTerminalPrompt, false);
  assert.deepEqual(
    defaultProductLanding.hero.distributionOptions.map((option) => option.kind),
    ["mac_app_store", "homebrew", "setapp"],
  );
  assert.equal(
    defaultProductLanding.hero.distributionOptions.every(
      (option) => option.title && option.description && option.href.startsWith("https://"),
    ),
    true,
  );
  assert.equal(
    defaultProductLanding.hero.requirement,
    "Choose a plan in the app. Requires macOS 26 or newer.",
  );

  assert.match(HORA_INSTALLATION_FAQ, /Direct edition/);
  assert.match(HORA_INSTALLATION_FAQ, /Mac App Store/);
  assert.match(HORA_INSTALLATION_FAQ, /Setapp/);
  assert.match(HORA_INSTALLATION_FAQ, /7-day cardless trial/);
  assert.match(HORA_INSTALLATION_FAQ, /Monthly, Annual, or Lifetime/);
  assert.match(HORA_INSTALLATION_FAQ, /not available on the Mac App Store or through Setapp/);
  assert.match(DIRECT_TRIAL_PRICING_NOTE, /\$59\.99 Lifetime \(Direct only\)/);
  for (const note of [
    defaultProductLanding.hero.trialNote,
    defaultBlogCta.trialNote,
    defaultGoogleCalendarMacPage.hero.trialNote,
  ]) assert.equal(note, DIRECT_TRIAL_PRICING_NOTE);
});
