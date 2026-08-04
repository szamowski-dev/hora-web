import { getCliClient } from "sanity/cli";
import { apiVersion, dataset, projectId } from "../sanity/env";

const EXPECTED_SINGLETONS = {
  homePage: "homePage",
  pricingPage: "pricingPage",
  featuresPage: "featuresPage",
  aboutPage: "aboutPage",
  privacyPage: "legalPage",
  termsPage: "legalPage",
} as const;

const TITLE_SUFFIX = " — hora Calendar";
const MAX_RENDERED_TITLE_LENGTH = 65;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const PUBLIC_ID_PATTERN = /^[^.]+$/;

const HOME_FEATURE_ICONS = new Set([
  "app-window",
  "calendar",
  "bell",
  "sync",
  "check",
  "gauge",
  "shield",
]);
const HOME_INTEGRATION_PROVIDERS = new Set([
  "google-calendar",
  "zoom",
  "microsoft-teams",
  "apple-intelligence",
]);
const TESTIMONIAL_PLATFORMS = new Set(["x", "reddit", "discord"]);
const ROADMAP_STATUSES = new Set([
  "Shipped",
  "Open Beta Tests",
  "Up next",
  "Planned",
  "On the horizon",
]);
const BADGE_VARIANTS = new Set(["standard", "productHunt"]);
const ABOUT_CONTACT_KINDS = new Set([
  "email",
  "website",
  "x",
  "bluesky",
  "github",
]);

type UnknownRecord = Record<string, unknown>;
type SiteDocument = UnknownRecord & {
  _id: string;
  _type: string;
  _updatedAt?: string;
};
type Reference = { _ref?: string; _type?: string };
type ResolvedDocument = { _id: string; _type: string; slug?: { current?: string } };

type Snapshot = {
  siteDocuments: SiteDocument[];
  fixedIdDocuments: Array<{ _id: string; _type: string }>;
  drafts: Array<{ _id: string; _type: string }>;
};

function fail(message: string): never {
  throw new Error(`Sanity site verification failed: ${message}`);
}

function expect(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function requiredObject(value: unknown, path: string): UnknownRecord {
  expect(isRecord(value), `${path} must be an object`);
  return value;
}

function requiredText(value: unknown, path: string): string {
  expect(typeof value === "string" && value.trim().length > 0, `${path} is missing`);
  expect(value === value.trim(), `${path} has outer whitespace`);
  return value;
}

function optionalText(value: unknown, path: string): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  return requiredText(value, path);
}

function requiredInteger(value: unknown, path: string, minimum = 1): number {
  expect(
    typeof value === "number" && Number.isInteger(value) && value >= minimum,
    `${path} must be an integer greater than or equal to ${minimum}`,
  );
  return value;
}

function requiredArray(
  value: unknown,
  path: string,
  minimum = 1,
  maximum = Number.POSITIVE_INFINITY,
): unknown[] {
  expect(Array.isArray(value), `${path} must be an array`);
  expect(value.length >= minimum, `${path} must contain at least ${minimum} item(s)`);
  expect(value.length <= maximum, `${path} must contain at most ${maximum} item(s)`);
  return value;
}

function keyedObjects(
  value: unknown,
  path: string,
  minimum = 1,
  maximum = Number.POSITIVE_INFINITY,
): UnknownRecord[] {
  const items = requiredArray(value, path, minimum, maximum).map((item, index) =>
    requiredObject(item, `${path}[${index}]`),
  );
  const keys = items.map((item, index) => requiredText(item._key, `${path}[${index}]._key`));
  expect(new Set(keys).size === keys.length, `${path} contains duplicate _key values`);
  return items;
}

function expectUnique<T>(values: T[], path: string) {
  expect(new Set(values).size === values.length, `${path} contains duplicate values`);
}

function enumValue(value: unknown, allowed: Set<string>, path: string): string {
  const text = requiredText(value, path);
  expect(allowed.has(text), `${path} has unsupported value ${text}`);
  return text;
}

function reference(value: unknown, path: string): Reference {
  const result = requiredObject(value, path) as Reference;
  expect(result._type === "reference", `${path} is not a reference`);
  expect(Boolean(result._ref), `${path} has no _ref`);
  expect(PUBLIC_ID_PATTERN.test(result._ref ?? ""), `${path} points to a private dot ID`);
  return result;
}

function validateHttpsUrl(value: unknown, path: string) {
  const text = requiredText(value, path);
  let parsed: URL;
  try {
    parsed = new URL(text);
  } catch {
    fail(`${path} is not a complete URL`);
  }
  expect(parsed.protocol === "https:", `${path} must use https`);
}

function validateImage(value: unknown, path: string) {
  const image = requiredObject(value, path);
  reference(requiredObject(image.asset, `${path}.asset`), `${path}.asset`);
  requiredText(image.alt, `${path}.alt`);
  optionalText(image.caption, `${path}.caption`);
}

function validateFile(value: unknown, path: string, required: boolean) {
  if (!value && !required) return;
  const file = requiredObject(value, path);
  reference(requiredObject(file.asset, `${path}.asset`), `${path}.asset`);
}

function validateVideo(value: unknown, path: string, requirePoster: boolean) {
  const video = requiredObject(value, path);
  validateFile(video.webm, `${path}.webm`, true);
  validateFile(video.mp4, `${path}.mp4`, false);
  if (video.poster || requirePoster) validateImage(video.poster, `${path}.poster`);
  requiredText(video.accessibilityLabel, `${path}.accessibilityLabel`);
  for (const flag of ["autoplay", "loop", "muted"] as const) {
    expect(typeof video[flag] === "boolean", `${path}.${flag} must be a boolean`);
  }
  expect(!(video.autoplay === true && video.muted === false), `${path} cannot autoplay with sound`);
}

function validateSeo(value: unknown, path: string, absoluteTitle: boolean) {
  const seo = requiredObject(value, path);
  const metaTitle = requiredText(seo.metaTitle, `${path}.metaTitle`);
  const metaDescription = requiredText(seo.metaDescription, `${path}.metaDescription`);
  const renderedTitle = absoluteTitle ? metaTitle : `${metaTitle}${TITLE_SUFFIX}`;
  expect(
    renderedTitle.length <= MAX_RENDERED_TITLE_LENGTH,
    `${path}.metaTitle renders a ${renderedTitle.length}-character HTML title: ${renderedTitle}`,
  );
  expect(
    metaDescription.length <= 160,
    `${path}.metaDescription is ${metaDescription.length} characters (maximum 160)`,
  );
  const ogTitle = optionalText(seo.ogTitle, `${path}.ogTitle`);
  const ogDescription = optionalText(seo.ogDescription, `${path}.ogDescription`);
  if (ogTitle) expect(ogTitle.length <= 100, `${path}.ogTitle is longer than 100 characters`);
  if (ogDescription) {
    expect(ogDescription.length <= 220, `${path}.ogDescription is longer than 220 characters`);
  }
  expect(typeof seo.noIndex === "boolean", `${path}.noIndex must be a boolean`);
  if (seo.ogImage) validateImage(seo.ogImage, `${path}.ogImage`);
}

function validateStringArray(value: unknown, path: string, minimum = 1) {
  const items = requiredArray(value, path, minimum).map((item, index) =>
    requiredText(item, `${path}[${index}]`),
  );
  return items;
}

function validateLandingFeatures(value: unknown, path: string, minimum = 1) {
  const items = keyedObjects(value, path, minimum, 20);
  const titles: string[] = [];
  for (const [index, item] of items.entries()) {
    requiredText(item.icon, `${path}[${index}].icon`);
    requiredText(item.tone, `${path}[${index}].tone`);
    titles.push(requiredText(item.title, `${path}[${index}].title`));
    requiredText(item.description, `${path}[${index}].description`);
  }
  expectUnique(titles, `${path}.title`);
}

function validateThemedImage(value: unknown, path: string) {
  const image = requiredObject(value, path);
  validateImage(image.light, `${path}.light`);
  validateImage(image.dark, `${path}.dark`);
}

function validateActiveHome(document: SiteDocument) {
  validateSeo(document.seo, "homePage.seo", true);
  const landing = requiredObject(document.productLanding, "homePage.productLanding");
  const hero = requiredObject(landing.hero, "homePage.productLanding.hero");
  for (const field of [
    "title", "description", "primaryCtaLabel", "macAppStoreLabel", "watchVideoLabel", "watchVideoUrl",
    "homebrewCommand", "requirement", "copyLabel", "copiedLabel",
  ]) requiredText(hero[field], `homePage.productLanding.hero.${field}`);
  expect(typeof hero.showPrimaryCta === "boolean", "homePage.productLanding.hero.showPrimaryCta must be boolean");
  expect(typeof hero.showTerminalPrompt === "boolean", "homePage.productLanding.hero.showTerminalPrompt must be boolean");

  const media = requiredObject(landing.media, "homePage.productLanding.media");
  validateThemedImage(media.hero, "homePage.productLanding.media.hero");
  validateThemedImage(media.workflow, "homePage.productLanding.media.workflow");
  const cards = requiredArray(media.googleCalendarCards, "homePage.productLanding.media.googleCalendarCards", 4, 4);
  cards.forEach((card, index) => validateThemedImage(card, `homePage.productLanding.media.googleCalendarCards[${index}]`));

  const api = requiredObject(landing.api, "homePage.productLanding.api");
  requiredText(api.title, "homePage.productLanding.api.title");
  requiredText(api.description, "homePage.productLanding.api.description");
  const googleCalendar = requiredObject(landing.googleCalendar, "homePage.productLanding.googleCalendar");
  requiredText(googleCalendar.title, "homePage.productLanding.googleCalendar.title");
  requiredText(googleCalendar.description, "homePage.productLanding.googleCalendar.description");
  validateLandingFeatures(googleCalendar.primaryFeatures, "homePage.productLanding.googleCalendar.primaryFeatures", 3);
  validateLandingFeatures(googleCalendar.secondaryFeatures, "homePage.productLanding.googleCalendar.secondaryFeatures");

  for (const sectionName of ["hora", "macos"] as const) {
    const section = requiredObject(landing[sectionName], `homePage.productLanding.${sectionName}`);
    requiredText(section.title, `homePage.productLanding.${sectionName}.title`);
    requiredText(section.description, `homePage.productLanding.${sectionName}.description`);
    validateLandingFeatures(section.features, `homePage.productLanding.${sectionName}.features`);
  }
  const privacy = requiredObject(landing.privacy, "homePage.productLanding.privacy");
  requiredText(privacy.title, "homePage.productLanding.privacy.title");
  requiredText(privacy.description, "homePage.productLanding.privacy.description");
  validateLandingFeatures(requiredObject(landing.featureGrid, "homePage.productLanding.featureGrid").features, "homePage.productLanding.featureGrid.features");
  const newsletter = requiredObject(landing.newsletter, "homePage.productLanding.newsletter");
  for (const field of ["title", "description", "placeholder", "buttonLabel"]) requiredText(newsletter[field], `homePage.productLanding.newsletter.${field}`);

  const featuredOn = requiredObject(document.featuredOn, "homePage.featuredOn");
  requiredText(featuredOn.label, "homePage.featuredOn.label");
  const badges = keyedObjects(featuredOn.badges, "homePage.featuredOn.badges", 1, 10);
  for (const [index, badge] of badges.entries()) {
    const path = `homePage.featuredOn.badges[${index}]`;
    requiredText(badge.name, `${path}.name`);
    validateHttpsUrl(badge.href, `${path}.href`);
    if (badge.image && isRecord(badge.image) && badge.image.asset) validateImage(badge.image, `${path}.image`);
    else validateHttpsUrl(badge.src, `${path}.src`);
    requiredText(badge.alt, `${path}.alt`);
    requiredInteger(badge.width, `${path}.width`);
    requiredInteger(badge.height, `${path}.height`);
  }
}

function validatePricing(document: SiteDocument) {
  const seo = requiredObject(document.seo, "pricingPage.seo");
  requiredText(seo.title, "pricingPage.seo.title");
  requiredText(seo.description, "pricingPage.seo.description");
  const hero = requiredObject(document.hero, "pricingPage.hero");
  requiredText(hero.title, "pricingPage.hero.title");
  requiredText(hero.description, "pricingPage.hero.description");
  const plans = keyedObjects(document.plans, "pricingPage.plans", 1, 4);
  for (const [index, plan] of plans.entries()) {
    const path = `pricingPage.plans[${index}]`;
    for (const field of ["name", "price", "description", "ctaLabel"]) requiredText(plan[field], `${path}.${field}`);
    expect(typeof plan.suffix === "string", `${path}.suffix must be a string`);
    validateStringArray(plan.features, `${path}.features`);
    expect(typeof plan.featured === "boolean", `${path}.featured must be boolean`);
  }
  const direct = requiredObject(document.direct, "pricingPage.direct");
  for (const field of ["showDownload", "showTerminalPrompt"]) expect(typeof direct[field] === "boolean", `pricingPage.direct.${field} must be boolean`);
  for (const field of ["downloadLabel", "terminalCommand", "terminalRequirement", "copyLabel", "copiedLabel"]) requiredText(direct[field], `pricingPage.direct.${field}`);
  const distribution = requiredObject(document.distribution, "pricingPage.distribution");
  for (const field of ["title", "description", "macAppStoreTitle", "macAppStoreDescription", "macAppStoreLabel", "setappTitle", "setappDescription", "setappLabel"]) requiredText(distribution[field], `pricingPage.distribution.${field}`);
  expect(typeof distribution.showMacAppStore === "boolean", "pricingPage.distribution.showMacAppStore must be boolean");
  expect(typeof distribution.showSetapp === "boolean", "pricingPage.distribution.showSetapp must be boolean");
  validateImage(distribution.macAppStoreBadge, "pricingPage.distribution.macAppStoreBadge");
  validateHttpsUrl(distribution.setappHref, "pricingPage.distribution.setappHref");
  const faq = requiredObject(document.faq, "pricingPage.faq");
  requiredText(faq.title, "pricingPage.faq.title");
  for (const [index, item] of keyedObjects(faq.items, "pricingPage.faq.items", 1, 12).entries()) {
    requiredText(item.question, `pricingPage.faq.items[${index}].question`);
    requiredText(item.answer, `pricingPage.faq.items[${index}].answer`);
  }
  requiredText(document.footer, "pricingPage.footer");
}

function validateHome(document: SiteDocument) {
  validateActiveHome(document);
  return;
  validateSeo(document.seo, "homePage.seo", true);

  const hero = requiredObject(document.hero, "homePage.hero");
  requiredText(hero.titlePrefix, "homePage.hero.titlePrefix");
  requiredText(hero.titleAccent, "homePage.hero.titleAccent");
  requiredText(hero.description, "homePage.hero.description");
  validateImage(hero.screenshot, "homePage.hero.screenshot");
  requiredText(hero.watchDemoLabel, "homePage.hero.watchDemoLabel");
  const heroProof = requiredObject(hero.socialProof, "homePage.hero.socialProof");
  requiredText(heroProof.label, "homePage.hero.socialProof.label");
  requiredInteger(heroProof.fallbackCount, "homePage.hero.socialProof.fallbackCount");
  for (const [index, avatar] of keyedObjects(heroProof.avatars, "homePage.hero.socialProof.avatars", 1, 8).entries()) {
    validateHttpsUrl(avatar.src, `homePage.hero.socialProof.avatars[${index}].src`);
    requiredText(avatar.alt, `homePage.hero.socialProof.avatars[${index}].alt`);
  }

  const featuredOn = requiredObject(document.featuredOn, "homePage.featuredOn");
  requiredText(featuredOn.label, "homePage.featuredOn.label");
  const badges = keyedObjects(featuredOn.badges, "homePage.featuredOn.badges", 1, 10);
  const badgeNames: string[] = [];
  for (const [index, badge] of badges.entries()) {
    badgeNames.push(requiredText(badge.name, `homePage.featuredOn.badges[${index}].name`));
    validateHttpsUrl(badge.href, `homePage.featuredOn.badges[${index}].href`);
    const src = requiredText(badge.src, `homePage.featuredOn.badges[${index}].src`);
    if (!src.startsWith("/")) validateHttpsUrl(src, `homePage.featuredOn.badges[${index}].src`);
    requiredText(badge.alt, `homePage.featuredOn.badges[${index}].alt`);
    requiredInteger(badge.width, `homePage.featuredOn.badges[${index}].width`);
    requiredInteger(badge.height, `homePage.featuredOn.badges[${index}].height`);
    enumValue(badge.variant, BADGE_VARIANTS, `homePage.featuredOn.badges[${index}].variant`);
  }
  expectUnique(badgeNames, "homePage.featuredOn.badges.name");

  const showcase = requiredObject(document.showcase, "homePage.showcase");
  requiredText(showcase.eyebrow, "homePage.showcase.eyebrow");
  requiredText(showcase.headingPrefix, "homePage.showcase.headingPrefix");
  requiredText(showcase.headingAccent, "homePage.showcase.headingAccent");
  requiredText(showcase.description, "homePage.showcase.description");
  validateVideo(showcase.mainVideo, "homePage.showcase.mainVideo", true);
  requiredText(showcase.firstSlideTitle, "homePage.showcase.firstSlideTitle");
  requiredText(showcase.firstSlideDescription, "homePage.showcase.firstSlideDescription");
  const actions = keyedObjects(showcase.actions, "homePage.showcase.actions", 1, 8);
  const actionNumbers: number[] = [];
  for (const [index, action] of actions.entries()) {
    actionNumbers.push(requiredInteger(action.number, `homePage.showcase.actions[${index}].number`));
    requiredText(action.title, `homePage.showcase.actions[${index}].title`);
    requiredText(action.description, `homePage.showcase.actions[${index}].description`);
    validateVideo(action.video, `homePage.showcase.actions[${index}].video`, false);
  }
  expectUnique(actionNumbers, "homePage.showcase.actions.number");

  const featureOverview = requiredObject(document.featureOverview, "homePage.featureOverview");
  requiredText(featureOverview.eyebrow, "homePage.featureOverview.eyebrow");
  requiredText(featureOverview.titlePrefix, "homePage.featureOverview.titlePrefix");
  requiredText(featureOverview.titleAccent, "homePage.featureOverview.titleAccent");
  requiredText(featureOverview.allFeaturesLabel, "homePage.featureOverview.allFeaturesLabel");
  const homeFeatures = keyedObjects(featureOverview.items, "homePage.featureOverview.items", 1, 12);
  const homeFeatureTitles: string[] = [];
  for (const [index, item] of homeFeatures.entries()) {
    enumValue(item.icon, HOME_FEATURE_ICONS, `homePage.featureOverview.items[${index}].icon`);
    homeFeatureTitles.push(requiredText(item.title, `homePage.featureOverview.items[${index}].title`));
    requiredText(item.description, `homePage.featureOverview.items[${index}].description`);
  }
  expectUnique(homeFeatureTitles, "homePage.featureOverview.items.title");

  const integrations = requiredObject(document.integrations, "homePage.integrations");
  requiredText(integrations.eyebrow, "homePage.integrations.eyebrow");
  requiredText(integrations.titlePrefix, "homePage.integrations.titlePrefix");
  requiredText(integrations.titleAccent, "homePage.integrations.titleAccent");
  const integrationItems = keyedObjects(integrations.items, "homePage.integrations.items", 1, 8);
  const providers: string[] = [];
  for (const [index, item] of integrationItems.entries()) {
    providers.push(enumValue(item.provider, HOME_INTEGRATION_PROVIDERS, `homePage.integrations.items[${index}].provider`));
    requiredText(item.name, `homePage.integrations.items[${index}].name`);
    requiredText(item.description, `homePage.integrations.items[${index}].description`);
  }
  expectUnique(providers, "homePage.integrations.items.provider");
  const founderNote = requiredObject(integrations.founderNote, "homePage.integrations.founderNote");
  validateStringArray(founderNote.lines, "homePage.integrations.founderNote.lines");
  reference(founderNote.author, "homePage.integrations.founderNote.author");

  const socialProof = requiredObject(document.socialProof, "homePage.socialProof");
  requiredText(socialProof.eyebrow, "homePage.socialProof.eyebrow");
  requiredText(socialProof.titlePrefix, "homePage.socialProof.titlePrefix");
  requiredText(socialProof.titleAccent, "homePage.socialProof.titleAccent");
  requiredText(socialProof.description, "homePage.socialProof.description");
  const testimonials = keyedObjects(socialProof.testimonials, "homePage.socialProof.testimonials", 1, 20);
  const testimonialIds: string[] = [];
  for (const [index, testimonial] of testimonials.entries()) {
    testimonialIds.push(requiredText(testimonial.id, `homePage.socialProof.testimonials[${index}].id`));
    requiredText(testimonial.quote, `homePage.socialProof.testimonials[${index}].quote`);
    requiredText(testimonial.author, `homePage.socialProof.testimonials[${index}].author`);
    requiredText(testimonial.handle, `homePage.socialProof.testimonials[${index}].handle`);
    validateHttpsUrl(testimonial.href, `homePage.socialProof.testimonials[${index}].href`);
    validateHttpsUrl(testimonial.avatarUrl, `homePage.socialProof.testimonials[${index}].avatarUrl`);
    enumValue(testimonial.platform, TESTIMONIAL_PLATFORMS, `homePage.socialProof.testimonials[${index}].platform`);
  }
  expectUnique(testimonialIds, "homePage.socialProof.testimonials.id");

  const roadmap = requiredObject(document.roadmap, "homePage.roadmap");
  for (const field of ["eyebrow", "titlePrefix", "titleAccent", "subtitle"]) {
    requiredText(roadmap[field], `homePage.roadmap.${field}`);
  }
  const roadmapItems = keyedObjects(roadmap.items, "homePage.roadmap.items", 3, 8);
  const roadmapNumbers: number[] = [];
  for (const [index, item] of roadmapItems.entries()) {
    roadmapNumbers.push(requiredInteger(item.number, `homePage.roadmap.items[${index}].number`));
    enumValue(item.status, ROADMAP_STATUSES, `homePage.roadmap.items[${index}].status`);
    requiredText(item.title, `homePage.roadmap.items[${index}].title`);
    requiredText(item.description, `homePage.roadmap.items[${index}].description`);
  }
  expectUnique(roadmapNumbers, "homePage.roadmap.items.number");

  const faq = requiredObject(document.faq, "homePage.faq");
  for (const field of ["eyebrow", "titlePrefix", "titleAccent", "subtitle", "footerTitle", "footerDescription", "footerLinkLabel"]) {
    requiredText(faq[field], `homePage.faq.${field}`);
  }
  const questions = keyedObjects(faq.items, "homePage.faq.items", 1, 20);
  const questionTexts: string[] = [];
  for (const [index, item] of questions.entries()) {
    questionTexts.push(requiredText(item.question, `homePage.faq.items[${index}].question`));
    requiredText(item.answer, `homePage.faq.items[${index}].answer`);
  }
  expectUnique(questionTexts, "homePage.faq.items.question");
}

function validateFeatures(document: SiteDocument) {
  validateSeo(document.seo, "featuresPage.seo", false);
  const hero = requiredObject(document.hero, "featuresPage.hero");
  requiredText(hero.titlePrefix, "featuresPage.hero.titlePrefix");
  requiredText(hero.titleAccent, "featuresPage.hero.titleAccent");
  requiredText(hero.subtitle, "featuresPage.hero.subtitle");
  const sections = keyedObjects(document.sections, "featuresPage.sections", 1, 12);
  const labels: string[] = [];
  for (const [sectionIndex, section] of sections.entries()) {
    const path = `featuresPage.sections[${sectionIndex}]`;
    labels.push(requiredText(section.label, `${path}.label`));
    if (section.screenshot) validateImage(section.screenshot, `${path}.screenshot`);
    const items = keyedObjects(section.items, `${path}.items`, 1, 20);
    const titles: string[] = [];
    for (const [itemIndex, item] of items.entries()) {
      titles.push(requiredText(item.title, `${path}.items[${itemIndex}].title`));
      requiredText(item.description, `${path}.items[${itemIndex}].description`);
      if (item.badges) {
        const badgeValues = validateStringArray(item.badges, `${path}.items[${itemIndex}].badges`, 0);
        expectUnique(badgeValues, `${path}.items[${itemIndex}].badges`);
      }
    }
    expectUnique(titles, `${path}.items.title`);
    if (section.wideShortcutsCard) {
      const card = requiredObject(section.wideShortcutsCard, `${path}.wideShortcutsCard`);
      requiredText(card.title, `${path}.wideShortcutsCard.title`);
      requiredText(card.description, `${path}.wideShortcutsCard.description`);
      const shortcuts = keyedObjects(card.shortcuts, `${path}.wideShortcutsCard.shortcuts`, 1, 20);
      for (const [shortcutIndex, shortcut] of shortcuts.entries()) {
        validateStringArray(shortcut.keys, `${path}.wideShortcutsCard.shortcuts[${shortcutIndex}].keys`);
        requiredText(shortcut.label, `${path}.wideShortcutsCard.shortcuts[${shortcutIndex}].label`);
      }
    }
  }
  expectUnique(labels, "featuresPage.sections.label");
}

function validatePortableText(value: unknown, path: string) {
  const blocks = keyedObjects(value, path);
  for (const [index, block] of blocks.entries()) {
    expect(block._type === "block", `${path}[${index}] has unsupported type ${String(block._type)}`);
    const children = keyedObjects(block.children, `${path}[${index}].children`);
    for (const [childIndex, child] of children.entries()) {
      expect(child._type === "span", `${path}[${index}].children[${childIndex}] is not a span`);
      expect(typeof child.text === "string", `${path}[${index}].children[${childIndex}].text is missing`);
      if (child.marks) validateStringArray(child.marks, `${path}[${index}].children[${childIndex}].marks`, 0);
    }
    if (block.markDefs) keyedObjects(block.markDefs, `${path}[${index}].markDefs`, 0);
  }
}

function validateAbout(document: SiteDocument) {
  validateSeo(document.seo, "aboutPage.seo", false);
  const hero = requiredObject(document.hero, "aboutPage.hero");
  requiredText(hero.titlePrefix, "aboutPage.hero.titlePrefix");
  requiredText(hero.titleAccent, "aboutPage.hero.titleAccent");
  requiredText(hero.subtitle, "aboutPage.hero.subtitle");
  const profile = requiredObject(document.profile, "aboutPage.profile");
  reference(profile.author, "aboutPage.profile.author");
  requiredText(profile.summary, "aboutPage.profile.summary");
  for (const [index, stat] of keyedObjects(document.stats, "aboutPage.stats", 1, 8).entries()) {
    for (const field of ["value", "label", "detail"]) requiredText(stat[field], `aboutPage.stats[${index}].${field}`);
  }
  const story = requiredObject(document.story, "aboutPage.story");
  for (const field of ["eyebrow", "quote", "quoteDetail"]) requiredText(story[field], `aboutPage.story.${field}`);
  validatePortableText(story.body, "aboutPage.story.body");
  const contacts = keyedObjects(document.contacts, "aboutPage.contacts", 1, 12);
  for (const [index, contact] of contacts.entries()) {
    requiredText(contact.label, `aboutPage.contacts[${index}].label`);
    const kind = enumValue(contact.kind, ABOUT_CONTACT_KINDS, `aboutPage.contacts[${index}].kind`);
    const href = requiredText(contact.href, `aboutPage.contacts[${index}].href`);
    if (kind === "email") {
      expect(/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/.test(href), `aboutPage.contacts[${index}].href is not a mailto address`);
    } else {
      validateHttpsUrl(href, `aboutPage.contacts[${index}].href`);
    }
  }
  const cta = requiredObject(document.cta, "aboutPage.cta");
  for (const field of ["eyebrow", "title", "description", "primaryLabel", "secondaryLabel"]) {
    requiredText(cta[field], `aboutPage.cta.${field}`);
  }
}

function validateLegal(document: SiteDocument, kind: "privacy" | "terms") {
  const path = `${kind}Page`;
  expect(document.kind === kind, `${path}.kind must be ${kind}`);
  const title = requiredObject(document.title, `${path}.title`);
  requiredText(title.prefix, `${path}.title.prefix`);
  requiredText(title.accent, `${path}.title.accent`);
  const lastUpdated = requiredText(document.lastUpdated, `${path}.lastUpdated`);
  expect(DATE_PATTERN.test(lastUpdated), `${path}.lastUpdated must use YYYY-MM-DD`);
  const parsedDate = new Date(`${lastUpdated}T00:00:00.000Z`);
  expect(
    !Number.isNaN(parsedDate.valueOf()) && parsedDate.toISOString().slice(0, 10) === lastUpdated,
    `${path}.lastUpdated is not a real calendar date`,
  );
  expect(lastUpdated <= new Date().toISOString().slice(0, 10), `${path}.lastUpdated is in the future`);
  validateSeo(document.seo, `${path}.seo`, false);
  validatePortableText(document.body, `${path}.body`);
}

function collectReferences(value: unknown, output = new Set<string>()) {
  if (Array.isArray(value)) {
    for (const item of value) collectReferences(item, output);
    return output;
  }
  if (!isRecord(value)) return output;
  if (value._type === "reference" && typeof value._ref === "string") output.add(value._ref);
  for (const child of Object.values(value)) collectReferences(child, output);
  return output;
}

function nestedReference(document: SiteDocument, path: string[]): Reference {
  let value: unknown = document;
  for (const field of path) value = requiredObject(value, path.join("."))[field];
  return reference(value, `${document._id}.${path.join(".")}`);
}

async function anonymousDocuments() {
  const ids = Object.keys(EXPECTED_SINGLETONS).map((id) => `"${id}"`).join(",");
  const query = `*[_id in [${ids}]]{_id,_type}`;
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set("query", query);
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  expect(response.ok, `anonymous Content Lake query returned ${response.status}`);
  const payload = (await response.json()) as { result?: Array<{ _id: string; _type: string }> };
  expect(Array.isArray(payload.result), "anonymous Content Lake query returned no result");
  return payload.result;
}

async function main() {
  const expectedIds = Object.keys(EXPECTED_SINGLETONS);
  const client = getCliClient({ apiVersion }).withConfig({ perspective: "raw", useCdn: false });
  const snapshot = await client.fetch<Snapshot>(`{
    "siteDocuments": *[
      _type in ["homePage", "pricingPage", "featuresPage", "aboutPage", "legalPage"] &&
      !(_id in path("drafts.**")) &&
      !(_id in path("versions.**"))
    ],
    "fixedIdDocuments": *[_id in ["homePage", "pricingPage", "featuresPage", "aboutPage", "privacyPage", "termsPage"]]{_id,_type},
    "drafts": *[
      _type in ["homePage", "pricingPage", "featuresPage", "aboutPage", "legalPage"] &&
      _id in path("drafts.**")
    ]{_id,_type}
  }`);

  expect(snapshot.siteDocuments.length === expectedIds.length, `found ${snapshot.siteDocuments.length} published site documents, expected ${expectedIds.length}`);
  expect(snapshot.fixedIdDocuments.length === expectedIds.length, "one or more fixed IDs are missing or duplicated by type");
  const invalidDrafts = snapshot.drafts.filter((draft) => {
    const publishedId = draft._id.replace(/^drafts\./, "");
    return (
      !(publishedId in EXPECTED_SINGLETONS) ||
      EXPECTED_SINGLETONS[publishedId as keyof typeof EXPECTED_SINGLETONS] !==
        draft._type
    );
  });
  expect(
    invalidDrafts.length === 0,
    `unexpected site drafts: ${invalidDrafts.map((draft) => draft._id).join(", ")}`,
  );

  const documents = new Map(snapshot.siteDocuments.map((document) => [document._id, document]));
  for (const [id, type] of Object.entries(EXPECTED_SINGLETONS)) {
    const document = documents.get(id);
    expect(document, `${id} is missing`);
    expect(document._type === type, `${id} has type ${document._type}, expected ${type}`);
    expect(PUBLIC_ID_PATTERN.test(document._id), `${id} is not a public ID`);
    requiredText(document._updatedAt, `${id}._updatedAt`);
  }
  const unexpected = snapshot.siteDocuments.filter((document) => !expectedIds.includes(document._id));
  expect(unexpected.length === 0, `singleton duplicates found: ${unexpected.map((document) => `${document._id} (${document._type})`).join(", ")}`);

  const publicDocuments = await anonymousDocuments();
  expect(publicDocuments.length === expectedIds.length, `anonymous query returned ${publicDocuments.length} site documents, expected ${expectedIds.length}`);
  for (const [id, type] of Object.entries(EXPECTED_SINGLETONS)) {
    expect(publicDocuments.some((document) => document._id === id && document._type === type), `${id} is not anonymously readable with type ${type}`);
  }

  const home = documents.get("homePage")!;
  const pricing = documents.get("pricingPage")!;
  const features = documents.get("featuresPage")!;
  const about = documents.get("aboutPage")!;
  const privacy = documents.get("privacyPage")!;
  const terms = documents.get("termsPage")!;
  validateHome(home);
  validatePricing(pricing);
  validateFeatures(features);
  validateAbout(about);
  validateLegal(privacy, "privacy");
  validateLegal(terms, "terms");

  const allReferences = Array.from(collectReferences(snapshot.siteDocuments));
  const resolvedDocuments = await client.fetch<ResolvedDocument[]>(
    `*[_id in $ids && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]{_id,_type,slug}`,
    { ids: allReferences },
  );
  const resolvedById = new Map(resolvedDocuments.map((document) => [document._id, document]));
  const missingReferences = allReferences.filter((id) => !resolvedById.has(id));
  expect(missingReferences.length === 0, `unresolved or private references: ${missingReferences.join(", ")}`);

  for (const id of allReferences) {
    const document = resolvedById.get(id)!;
    if (id.startsWith("image-")) expect(document._type === "sanity.imageAsset", `${id} is not an image asset`);
    if (id.startsWith("file-")) expect(document._type === "sanity.fileAsset", `${id} is not a file asset`);
  }

  const typedReferences: Array<[Reference, string, string]> = [
    [nestedReference(about, ["profile", "author"]), "author", "aboutPage.profile.author"],
  ];
  for (const [ref, expectedType, path] of typedReferences) {
    const resolved = resolvedById.get(ref._ref ?? "");
    expect(resolved?._type === expectedType, `${path} must resolve to ${expectedType}`);
    if (expectedType === "blogPost") {
      expect(Boolean(resolved.slug?.current), `${path} resolves to a blog post without a slug`);
    }
  }

  const imageAssets = resolvedDocuments.filter((document) => document._type === "sanity.imageAsset").length;
  const fileAssets = resolvedDocuments.filter((document) => document._type === "sanity.fileAsset").length;
  console.log("\nSANITY SITE CONTENT VERIFIED");
  console.log(
    `6 published singletons; 0 duplicates; ${snapshot.drafts.length} valid draft(s); anonymous reads: 6/6`,
  );
  console.log(`${imageAssets} image assets, ${fileAssets} file assets, ${allReferences.length} resolved references`);
  console.log("Rendered SEO titles, editorial legal dates, enums, arrays, links, and Portable Text are valid");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
