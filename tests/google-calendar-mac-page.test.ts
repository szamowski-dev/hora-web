import assert from "node:assert/strict";
import test from "node:test";
import { defaultGoogleCalendarMacPage } from "../content/google-calendar-mac";
import { mapGoogleCalendarMacPage } from "../lib/site-page-repository";
import type { SanityGoogleCalendarMacPageDocument } from "../sanity/lib/site-page-queries";

// Mirrors the copy seeded into the Sanity `googleCalendarMacPage` singleton, so
// the mapper and the SERP budgets are exercised against the real page content.
const LANDING_FEATURE_ICONS = new Set([
  "label", "event", "video-call", "contacts", "accounts", "search",
  "invitation", "menu-bar", "timer", "auto-awesome", "tasks", "focus-time",
  "availability", "widgets", "offline", "sync", "key", "storage", "speed",
  "notifications", "dock", "keyboard", "windows", "dark-mode", "apple-silicon",
  "view", "drag", "quick-add", "time-zone", "repeat", "location",
  "out-of-office",
]);
const LANDING_FEATURE_TONES = new Set([
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "cyan",
]);
const MAX_RENDERED_TITLE_LENGTH = 65;
const MAX_META_DESCRIPTION_LENGTH = 160;

function validDocument(): SanityGoogleCalendarMacPageDocument {
  return {
    _id: "googleCalendarMacPage",
    _updatedAt: "2026-09-17T10:00:00Z",
    seo: {
      metaTitle: "Google Calendar App for Mac — Native macOS App, Free Trial",
      metaDescription:
        "Google never made a Mac app for Google Calendar. hora is a native macOS client with real-time sync, Meet links and multiple accounts. Free 7-day trial.",
      noIndex: false,
    },
    hero: {
      title: "The Google Calendar app for Mac",
      description:
        "Google never shipped one, so we did.\nhora is a fast, native macOS client that talks straight to the Google Calendar API, with no browser tab and no Electron.",
      primaryCtaLabel: "Download for Mac",
      macAppStoreLabel: "Download on the Mac App Store",
      trialNote: "7-day free trial · then $2.99/month or $29.99/year",
      requirement: "macOS 15+ · Works with Google Calendar",
    },
    answer: {
      heading: "Is there a Google Calendar app for Mac?",
      items: [
        {
          eyebrow: "The short answer",
          body:
            "No. Google publishes Google Calendar for iPhone and Android, but it has never shipped a desktop app for macOS. That leaves a browser tab, a Dock shortcut to the web app, or syncing into Apple Calendar and losing half of what Google Calendar can do.",
        },
        {
          eyebrow: "What hora does instead",
          body:
            "hora is a Mac app built only for Google Calendar. It uses the official Google Calendar API, so colours, focus time, out of office, Meet links and appointment schedules arrive exactly as Google stores them.",
        },
      ],
    },
    features: {
      title: "Everything Google Calendar does, natively on your Mac",
      description:
        "hora talks directly to the Google Calendar API, so the details your workday depends on come across intact.",
      items: [
        {
          icon: "label",
          tone: "red",
          title: "Event colour labels",
          description:
            "Google's event colours stay intact across every calendar and every account.",
        },
        {
          icon: "event",
          tone: "blue",
          title: "Every event type",
          description:
            "Timed, all-day, recurring, focus time, working location, out of office and appointment schedules.",
        },
        {
          icon: "video-call",
          tone: "green",
          title: "Meet, Zoom and Teams",
          description:
            "Create and join meetings in one click, without opening a separate app.",
        },
        {
          icon: "accounts",
          tone: "yellow",
          title: "Multiple Google accounts",
          description:
            "Work and personal calendars side by side in one native window.",
        },
        {
          icon: "search",
          tone: "purple",
          title: "Real Google Calendar search",
          description:
            "Search events, people and details in Google Calendar itself, not only in a local cache.",
        },
        {
          icon: "sync",
          tone: "cyan",
          title: "Real-time sync",
          description:
            "Google watch channels and push notifications keep your Mac current within seconds.",
        },
        {
          icon: "offline",
          tone: "purple",
          title: "Works offline",
          description:
            "Read and edit your calendar without a connection, then sync when you are back online.",
        },
        {
          icon: "menu-bar",
          tone: "cyan",
          title: "Menu bar and widgets",
          description:
            "Your next event stays one click away, in the menu bar and in Notification Center.",
        },
      ],
    },
    trust: {
      title: "Your calendar stays on your Mac",
      description:
        "hora connects straight to the Google Calendar API and keeps credentials in the macOS Keychain. There is no intermediary sync service holding a copy of your schedule, and no separate account to create.",
      linkLabel: "Read the Trust Center",
    },
    pricing: {
      title: "Free for 7 days, then $2.99 a month",
      description:
        "The trial runs inside the app and needs no card. After that it is $2.99 monthly or $29.99 yearly. Direct purchases carry a 14-day refund window, and hora is also on the Mac App Store and Setapp.",
      linkLabel: "See full pricing",
    },
    faq: {
      title: "Google Calendar on Mac: common questions",
      items: [
        {
          question: "Is there an official Google Calendar app for Mac?",
          answer:
            "No. Google ships Google Calendar for iPhone and Android but has never released a macOS desktop app. hora is an independent native client built on Google's official Calendar API.",
        },
        {
          question: "Can you download Google Calendar on a Mac?",
          answer:
            "Not from Google. You can pin the web app to your Dock, sync into Apple Calendar, or install a native client such as hora, which downloads as a notarized Mac app.",
        },
        {
          question: "Is hora free?",
          answer:
            "hora includes a 7-day free trial inside the app, with no card required. After the trial it is $2.99 a month or $29.99 a year.",
        },
        {
          question: "Does hora sync with Google Calendar in real time?",
          answer:
            "Yes. hora subscribes to Google Calendar watch channels and receives push notifications, so a change made on the web or on your phone reaches your Mac within seconds.",
        },
        {
          question: "Can I use several Google accounts at once?",
          answer:
            "Yes. Add as many Google accounts as you need and see every calendar together, with colours and permissions preserved per account.",
        },
        {
          question: "What do I need to run hora?",
          answer:
            "macOS 15 or newer and a Google account. hora works with personal Google accounts and with Google Workspace.",
        },
      ],
    },
    closing: {
      title: "Get Google Calendar out of the browser",
      description:
        "Download hora, sign in with Google, and your calendar is native on your Mac in under a minute.",
      ctaLabel: "Download for Mac",
      guideLabel: "Compare all five ways to run Google Calendar on a Mac",
      guideHref: "/blog/2026-07-09-google-calendar-desktop-app-mac/",
    },
  };
}

test("maps the shipped landing page document", () => {
  const page = mapGoogleCalendarMacPage(validDocument());
  assert.equal(page.id, "googleCalendarMacPage");
  assert.equal(page.hero.title, "The Google Calendar app for Mac");
  assert.equal(page.features.items.length, 8);
  assert.equal(page.faq.items.length, 6);
  assert.equal(
    page.closing.guideHref,
    "/blog/2026-07-09-google-calendar-desktop-app-mac/",
  );
});

test("keeps the SERP title and description within budget", () => {
  const { seo } = mapGoogleCalendarMacPage(validDocument());
  assert.ok(
    seo.metaTitle.length <= MAX_RENDERED_TITLE_LENGTH,
    `metaTitle renders ${seo.metaTitle.length} characters`,
  );
  assert.ok(
    seo.metaDescription.length >= 40 &&
      seo.metaDescription.length <= MAX_META_DESCRIPTION_LENGTH,
    `metaDescription is ${seo.metaDescription.length} characters`,
  );
});

test("targets the head term in the title, description and H1", () => {
  const page = mapGoogleCalendarMacPage(validDocument());
  assert.match(page.seo.metaTitle, /Google Calendar App for Mac/i);
  assert.match(page.hero.title, /Google Calendar app for Mac/i);
  assert.match(page.answer.heading, /Google Calendar app for Mac/i);
  assert.ok(page.answer.items.length >= 1);
});

test("uses only supported feature icons and tones with unique titles", () => {
  const { items } = mapGoogleCalendarMacPage(validDocument()).features;
  for (const item of items) {
    assert.ok(
      LANDING_FEATURE_ICONS.has(item.icon),
      `unsupported icon ${item.icon}`,
    );
    assert.ok(
      LANDING_FEATURE_TONES.has(item.tone),
      `unsupported tone ${item.tone}`,
    );
  }
  assert.equal(new Set(items.map((item) => item.title)).size, items.length);
});

test("asks unique FAQ questions with substantive answers", () => {
  const { items } = mapGoogleCalendarMacPage(validDocument()).faq;
  assert.ok(items.length >= 3);
  assert.equal(new Set(items.map((item) => item.question)).size, items.length);
  for (const item of items) {
    assert.ok(item.answer.length >= 30, `answer too short: ${item.question}`);
  }
});

test("serves the packaged copy when the singleton is not published", () => {
  assert.deepEqual(
    mapGoogleCalendarMacPage(null),
    defaultGoogleCalendarMacPage,
  );
});

test("packaged copy matches the Sanity fixture field for field", () => {
  const fromSanity = mapGoogleCalendarMacPage(validDocument());
  const packaged = defaultGoogleCalendarMacPage;
  assert.equal(packaged.seo.metaTitle, fromSanity.seo.metaTitle);
  assert.equal(packaged.hero.title, fromSanity.hero.title);
  assert.equal(packaged.features.items.length, fromSanity.features.items.length);
  assert.equal(packaged.faq.items.length, fromSanity.faq.items.length);
  assert.equal(packaged.closing.guideHref, fromSanity.closing.guideHref);
});

test("rejects a wrong document id", () => {
  const document = { ...validDocument(), _id: "someOtherPage" };
  assert.throws(
    () => mapGoogleCalendarMacPage(document),
    /expected fixed document ID googleCalendarMacPage/,
  );
});

test("rejects an unsupported feature icon", () => {
  const document = validDocument();
  document.features!.items![0].icon = "rocket";
  assert.throws(
    () => mapGoogleCalendarMacPage(document),
    /features\.items\[0\]\.icon is unsupported/,
  );
});

test("rejects an unsupported feature tone", () => {
  const document = validDocument();
  document.features!.items![1].tone = "magenta";
  assert.throws(
    () => mapGoogleCalendarMacPage(document),
    /features\.items\[1\]\.tone is unsupported/,
  );
});

test("rejects a guide link that is not a site-relative path", () => {
  const document = validDocument();
  document.closing!.guideHref = "https://example.com/guide/";
  assert.throws(
    () => mapGoogleCalendarMacPage(document),
    /closing\.guideHref must be a site-relative path/,
  );
});

test("rejects an empty FAQ", () => {
  const document = validDocument();
  document.faq!.items = [];
  assert.throws(
    () => mapGoogleCalendarMacPage(document),
    /faq\.items must not be empty/,
  );
});

test("rejects a missing meta description", () => {
  const document = validDocument();
  delete document.seo!.metaDescription;
  assert.throws(
    () => mapGoogleCalendarMacPage(document),
    /seo\.metaDescription is missing/,
  );
});
