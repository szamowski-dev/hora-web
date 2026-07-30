import { defineArrayMember, defineField, defineType } from "sanity";

const singletonId = (id: string | undefined) => id?.replace(/^drafts\./, "");

const trimmed = (value: string | undefined) =>
  !value || value.trim() === value
    ? true
    : "Remove whitespace from the beginning or end.";

const uniqueStringField = (
  items: Record<string, unknown>[] | undefined,
  field: string,
  label: string,
) => {
  if (!items) return true;
  const values = items
    .map((item) => item[field])
    .filter((value): value is string => typeof value === "string");
  return new Set(values).size === values.length
    ? true
    : `${label} must be unique.`;
};

const sitePathOrHttps = (value: string | undefined) => {
  if (!value) return true;
  if (/^\/(?!\/)[^\s]*$/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:"
      ? true
      : "Use a site-relative path or a complete https URL.";
  } catch {
    return "Use a site-relative path or a complete https URL.";
  }
};

const productLandingIconOptions = [
  { title: "Label", value: "label" },
  { title: "Event", value: "event" },
  { title: "Video call", value: "video-call" },
  { title: "Contacts", value: "contacts" },
  { title: "Accounts", value: "accounts" },
  { title: "Search", value: "search" },
  { title: "Invitation", value: "invitation" },
  { title: "Menu bar", value: "menu-bar" },
  { title: "Timer", value: "timer" },
  { title: "Apple Intelligence", value: "auto-awesome" },
  { title: "Tasks", value: "tasks" },
  { title: "Focus time", value: "focus-time" },
  { title: "Availability", value: "availability" },
  { title: "Sync", value: "sync" },
  { title: "Keychain", value: "key" },
  { title: "Storage", value: "storage" },
  { title: "Speed", value: "speed" },
  { title: "Notifications", value: "notifications" },
  { title: "Dock", value: "dock" },
  { title: "Keyboard", value: "keyboard" },
  { title: "Windows", value: "windows" },
  { title: "Dark mode", value: "dark-mode" },
  { title: "Apple Silicon", value: "apple-silicon" },
  { title: "Calendar views", value: "view" },
  { title: "Drag and drop", value: "drag" },
  { title: "Quick add", value: "quick-add" },
  { title: "Time zone", value: "time-zone" },
  { title: "Repeat", value: "repeat" },
  { title: "Location", value: "location" },
  { title: "Out of office", value: "out-of-office" },
];

const productLandingToneOptions = [
  { title: "Red", value: "red" },
  { title: "Blue", value: "blue" },
  { title: "Green", value: "green" },
  { title: "Yellow", value: "yellow" },
  { title: "Purple", value: "purple" },
  { title: "Cyan", value: "cyan" },
];

const productLandingFeature = (name: string) =>
  defineArrayMember({
    name,
    type: "object",
    fields: [
      defineField({
        name: "icon",
        title: "Icon",
        type: "string",
        options: { list: productLandingIconOptions },
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "tone",
        title: "Accent color",
        type: "string",
        options: { list: productLandingToneOptions },
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "title",
        title: "Title",
        type: "string",
        validation: (rule) =>
          rule.required().min(2).max(100).custom(trimmed),
      }),
      defineField({
        name: "description",
        title: "Description",
        type: "text",
        rows: 3,
        validation: (rule) =>
          rule.required().min(5).max(360).custom(trimmed),
      }),
    ],
    preview: {
      select: { title: "title", subtitle: "description" },
    },
  });

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "seo",
      title: "SEO",
      type: "pageSeo",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({
          name: "titlePrefix",
          title: "Title prefix",
          type: "string",
          validation: (rule) => rule.required().min(3).max(80).custom(trimmed),
        }),
        defineField({
          name: "titleAccent",
          title: "Accented title",
          type: "string",
          validation: (rule) => rule.required().min(3).max(80).custom(trimmed),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required().min(30).max(300).custom(trimmed),
        }),
        defineField({
          name: "screenshot",
          title: "Product screenshot",
          type: "siteImage",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "watchDemoLabel",
          title: "Watch demo label",
          type: "string",
          validation: (rule) => rule.required().min(3).max(50).custom(trimmed),
        }),
        defineField({
          name: "socialProof",
          title: "Social proof",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required().min(10).max(140).custom(trimmed),
            }),
            defineField({
              name: "fallbackCount",
              title: "Fallback count",
              type: "number",
              description:
                "Used only when the live tester count cannot be loaded.",
              validation: (rule) => rule.required().integer().min(1).max(10000000),
            }),
            defineField({
              name: "avatars",
              title: "Avatars",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "socialProofAvatar",
                  fields: [
                    defineField({
                      name: "src",
                      title: "Image URL",
                      type: "url",
                      validation: (rule) =>
                        rule.required().uri({ scheme: ["https"] }),
                    }),
                    defineField({
                      name: "alt",
                      title: "Alternative text",
                      type: "string",
                      validation: (rule) => rule.required().min(3).max(160).custom(trimmed),
                    }),
                  ],
                  preview: { select: { title: "alt", subtitle: "src" } },
                }),
              ],
              validation: (rule) => rule.required().min(1).max(8),
            }),
          ],
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "productLanding",
      title: "Product landing page",
      type: "object",
      description:
        "Optional product-led homepage copy. Empty fields fall back to the versioned defaults in the Next.js app, so this section can be tuned gradually.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "hero",
          title: "Opening",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Headline",
              type: "string",
              validation: (rule) =>
                rule.required().min(10).max(120).custom(trimmed),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (rule) =>
                rule.required().min(20).max(320).custom(trimmed),
            }),
            defineField({
              name: "primaryCtaLabel",
              title: "Primary action",
              type: "string",
              validation: (rule) =>
                rule.required().min(3).max(60).custom(trimmed),
            }),
            defineField({
              name: "watchVideoLabel",
              title: "Video action",
              type: "string",
              validation: (rule) =>
                rule.required().min(3).max(60).custom(trimmed),
            }),
            defineField({
              name: "requirement",
              title: "System requirement",
              type: "string",
              validation: (rule) =>
                rule.required().min(5).max(100).custom(trimmed),
            }),
          ],
        }),
        defineField({
          name: "api",
          title: "Google Calendar API",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) =>
                rule.required().min(5).max(100).custom(trimmed),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (rule) =>
                rule.required().min(15).max(320).custom(trimmed),
            }),
          ],
        }),
        defineField({
          name: "googleCalendar",
          title: "Google Calendar features",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) =>
                rule.required().min(5).max(120).custom(trimmed),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
              validation: (rule) =>
                rule.required().min(10).max(280).custom(trimmed),
            }),
            defineField({
              name: "primaryFeatures",
              title: "Primary features",
              type: "array",
              of: [productLandingFeature("productLandingGooglePrimaryFeature")],
              validation: (rule) => rule.required().min(3).max(3),
            }),
            defineField({
              name: "secondaryFeatures",
              title: "Secondary features",
              type: "array",
              description:
                "Keep this list editable as the product story is tuned.",
              of: [productLandingFeature("productLandingGoogleSecondaryFeature")],
              validation: (rule) => rule.required().min(1).max(6),
            }),
          ],
        }),
        defineField({
          name: "hora",
          title: "hora-specific features",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) =>
                rule.required().min(5).max(120).custom(trimmed),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
              validation: (rule) =>
                rule.required().min(10).max(280).custom(trimmed),
            }),
            defineField({
              name: "features",
              title: "Features",
              type: "array",
              of: [productLandingFeature("productLandingHoraFeature")],
              validation: (rule) => rule.required().min(4).max(10),
            }),
          ],
        }),
        defineField({
          name: "privacy",
          title: "Privacy",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) =>
                rule.required().min(5).max(120).custom(trimmed),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (rule) =>
                rule.required().min(15).max(360).custom(trimmed),
            }),
            defineField({
              name: "features",
              title: "Privacy guarantees",
              type: "array",
              of: [productLandingFeature("productLandingPrivacyFeature")],
              validation: (rule) => rule.required().min(3).max(3),
            }),
          ],
        }),
        defineField({
          name: "macos",
          title: "macOS integration",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) =>
                rule.required().min(5).max(120).custom(trimmed),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
              validation: (rule) =>
                rule.required().min(10).max(280).custom(trimmed),
            }),
            defineField({
              name: "features",
              title: "macOS features",
              type: "array",
              of: [productLandingFeature("productLandingMacosFeature")],
              validation: (rule) => rule.required().min(6).max(12),
            }),
          ],
        }),
        defineField({
          name: "featureGrid",
          title: "Feature directory",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) =>
                rule.required().min(5).max(120).custom(trimmed),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
              validation: (rule) =>
                rule.required().min(10).max(280).custom(trimmed),
            }),
            defineField({
              name: "features",
              title: "Features",
              type: "array",
              description:
                "This is the main editable space for adding or removing supporting capabilities.",
              of: [productLandingFeature("productLandingGridFeature")],
              validation: (rule) => rule.required().min(6).max(18),
            }),
          ],
        }),
        defineField({
          name: "newsletter",
          title: "Mailing list",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) =>
                rule.required().min(5).max(100).custom(trimmed),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
              validation: (rule) =>
                rule.required().min(10).max(280).custom(trimmed),
            }),
            defineField({
              name: "placeholder",
              title: "Email placeholder",
              type: "string",
              validation: (rule) =>
                rule.required().min(3).max(80).custom(trimmed),
            }),
            defineField({
              name: "buttonLabel",
              title: "Submit button",
              type: "string",
              validation: (rule) =>
                rule.required().min(3).max(60).custom(trimmed),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "featuredOn",
      title: "Featured on",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Section label",
          type: "string",
          validation: (rule) => rule.required().min(3).max(80).custom(trimmed),
        }),
        defineField({
          name: "badges",
          title: "Badges",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "featuredBadge",
              fields: [
                defineField({
                  name: "name",
                  title: "Name",
                  type: "string",
                  validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
                }),
                defineField({
                  name: "href",
                  title: "Destination URL",
                  type: "url",
                  validation: (rule) =>
                    rule.required().uri({ scheme: ["https"] }),
                }),
                defineField({
                  name: "src",
                  title: "Badge image URL",
                  type: "string",
                  description:
                    "Optional when you upload a badge image below.",
                  validation: (rule) =>
                    rule.max(1000).custom((value) =>
                      !value || sitePathOrHttps(value),
                    ),
                }),
                defineField({
                  name: "image",
                  title: "Badge image upload",
                  type: "optionalSiteImage",
                  description:
                    "Upload a static badge here, or keep a URL above for dynamic badges.",
                }),
                defineField({
                  name: "alt",
                  title: "Alternative text",
                  type: "string",
                  validation: (rule) => rule.required().min(5).max(240).custom(trimmed),
                }),
                defineField({
                  name: "width",
                  title: "Intrinsic width",
                  type: "number",
                  description:
                    "Required only for a URL badge. Uploads use their intrinsic dimensions.",
                  validation: (rule) =>
                    rule.integer().min(1).max(4000).custom((value, context) =>
                      value ||
                        (context.parent as { image?: { asset?: unknown } })
                          ?.image?.asset
                        ? true
                        : "Add the width for a URL badge.",
                    ),
                }),
                defineField({
                  name: "height",
                  title: "Intrinsic height",
                  type: "number",
                  description:
                    "Required only for a URL badge. Uploads use their intrinsic dimensions.",
                  validation: (rule) =>
                    rule.integer().min(1).max(4000).custom((value, context) =>
                      value ||
                        (context.parent as { image?: { asset?: unknown } })
                          ?.image?.asset
                        ? true
                        : "Add the height for a URL badge.",
                    ),
                }),
                defineField({
                  name: "displayWidth",
                  title: "Display width",
                  type: "number",
                  description:
                    "Optional rendered width in pixels. Leave empty to preserve the badge's natural proportions.",
                  validation: (rule) => rule.integer().min(1).max(800),
                }),
                defineField({
                  name: "displayHeight",
                  title: "Display height",
                  type: "number",
                  description:
                    "Optional rendered height in pixels. Leave empty to preserve the badge's natural proportions.",
                  validation: (rule) => rule.integer().min(1).max(240),
                }),
                defineField({
                  name: "variant",
                  title: "Visual variant",
                  type: "string",
                  initialValue: "standard",
                  options: {
                    layout: "radio",
                    list: [
                      { title: "Standard", value: "standard" },
                      { title: "Product Hunt", value: "productHunt" },
                    ],
                  },
                  validation: (rule) => rule.required(),
                }),
              ],
              preview: {
                select: { title: "name", subtitle: "href" },
              },
              validation: (rule) =>
                rule.custom((value) => {
                  const badge = value as
                    | { src?: string; image?: { asset?: unknown } }
                    | undefined;
                  return badge?.src || badge?.image?.asset
                    ? true
                    : "Add a badge image URL or upload a badge image.";
                }),
            }),
          ],
          validation: (rule) =>
            rule
              .required()
              .min(1)
              .max(10)
              .custom((value) =>
                uniqueStringField(
                  value as Record<string, unknown>[] | undefined,
                  "name",
                  "Badge names",
                ),
              ),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "showcase",
      title: "Product showcase",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
          validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
        }),
        defineField({
          name: "headingPrefix",
          title: "Heading prefix",
          type: "string",
          validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
        }),
        defineField({
          name: "headingAccent",
          title: "Accented heading",
          type: "string",
          validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required().min(15).max(300).custom(trimmed),
        }),
        defineField({
          name: "mainVideo",
          title: "Main video",
          type: "siteVideo",
          validation: (rule) =>
            rule.required().custom((value) => {
              const video = value as { poster?: { asset?: unknown } } | undefined;
              return video?.poster?.asset
                ? true
                : "The main video needs a poster image.";
            }),
        }),
        defineField({
          name: "firstSlideTitle",
          title: "Mobile first slide title",
          type: "string",
          validation: (rule) => rule.required().min(3).max(100).custom(trimmed),
        }),
        defineField({
          name: "firstSlideDescription",
          title: "Mobile first slide description",
          type: "text",
          rows: 2,
          validation: (rule) => rule.required().min(10).max(240).custom(trimmed),
        }),
        defineField({
          name: "actions",
          title: "Feature videos",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "showcaseAction",
              fields: [
                defineField({
                  name: "number",
                  title: "Number",
                  type: "number",
                  validation: (rule) => rule.required().integer().min(1).max(99),
                }),
                defineField({
                  name: "title",
                  title: "Title",
                  type: "string",
                  validation: (rule) => rule.required().min(3).max(100).custom(trimmed),
                }),
                defineField({
                  name: "description",
                  title: "Description",
                  type: "text",
                  rows: 2,
                  validation: (rule) => rule.required().min(10).max(240).custom(trimmed),
                }),
                defineField({
                  name: "video",
                  title: "Video",
                  type: "siteVideo",
                  validation: (rule) => rule.required(),
                }),
              ],
              preview: {
                select: { title: "title", number: "number", media: "video.poster" },
                prepare({ title, number, media }) {
                  return {
                    title: title || "Feature video",
                    subtitle: number ? String(number).padStart(2, "0") : undefined,
                    media,
                  };
                },
              },
            }),
          ],
          validation: (rule) =>
            rule
              .required()
              .min(1)
              .max(8)
              .custom((value) =>
                uniqueStringField(
                  (value as Array<{ number?: number }> | undefined)?.map((item) => ({
                    number: String(item.number),
                  })) as
                    | Record<string, unknown>[]
                    | undefined,
                  "number",
                  "Feature video numbers",
                ),
              ),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featureOverview",
      title: "Feature overview",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
          validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
        }),
        defineField({
          name: "titlePrefix",
          title: "Title prefix",
          type: "string",
          validation: (rule) => rule.required().min(3).max(100).custom(trimmed),
        }),
        defineField({
          name: "titleAccent",
          title: "Accented title",
          type: "string",
          validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
        }),
        defineField({
          name: "allFeaturesLabel",
          title: "All features link label",
          type: "string",
          validation: (rule) => rule.required().min(3).max(80).custom(trimmed),
        }),
        defineField({
          name: "items",
          title: "Features",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "homeFeature",
              fields: [
                defineField({
                  name: "icon",
                  title: "Icon",
                  type: "string",
                  options: {
                    list: [
                      { title: "App window", value: "app-window" },
                      { title: "Calendar", value: "calendar" },
                      { title: "Bell", value: "bell" },
                      { title: "Sync", value: "sync" },
                      { title: "Shield", value: "shield" },
                      { title: "Check", value: "check" },
                      { title: "Gauge", value: "gauge" },
                    ],
                  },
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "title",
                  title: "Title",
                  type: "string",
                  validation: (rule) => rule.required().min(3).max(100).custom(trimmed),
                }),
                defineField({
                  name: "description",
                  title: "Description",
                  type: "text",
                  rows: 3,
                  validation: (rule) => rule.required().min(15).max(320).custom(trimmed),
                }),
              ],
              preview: { select: { title: "title", subtitle: "description" } },
            }),
          ],
          validation: (rule) =>
            rule
              .required()
              .min(1)
              .max(12)
              .custom((value) =>
                uniqueStringField(
                  value as Record<string, unknown>[] | undefined,
                  "title",
                  "Feature titles",
                ),
              ),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "integrations",
      title: "Integrations and founder note",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
          validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
        }),
        defineField({
          name: "titlePrefix",
          title: "Title prefix",
          type: "string",
          validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
        }),
        defineField({
          name: "titleAccent",
          title: "Accented title",
          type: "string",
          validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
        }),
        defineField({
          name: "items",
          title: "Integrations",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "integrationItem",
              fields: [
                defineField({
                  name: "provider",
                  title: "Provider",
                  type: "string",
                  options: {
                    list: [
                      { title: "Google Calendar", value: "google-calendar" },
                      { title: "Zoom", value: "zoom" },
                      { title: "Microsoft Teams", value: "microsoft-teams" },
                      { title: "Apple Intelligence", value: "apple-intelligence" },
                    ],
                  },
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "name",
                  title: "Name",
                  type: "string",
                  validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
                }),
                defineField({
                  name: "description",
                  title: "Description",
                  type: "text",
                  rows: 2,
                  validation: (rule) => rule.required().min(10).max(240).custom(trimmed),
                }),
              ],
              preview: { select: { title: "name", subtitle: "description" } },
            }),
          ],
          validation: (rule) =>
            rule
              .required()
              .min(1)
              .max(8)
              .custom((value) =>
                uniqueStringField(
                  value as Record<string, unknown>[] | undefined,
                  "provider",
                  "Integration providers",
                ),
              ),
        }),
        defineField({
          name: "founderNote",
          title: "Founder note",
          type: "object",
          fields: [
            defineField({
              name: "lines",
              title: "Lines",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (rule) => rule.required().min(1).max(8),
            }),
            defineField({
              name: "author",
              title: "Author",
              type: "reference",
              to: [{ type: "author" }],
              options: { disableNew: true },
              validation: (rule) => rule.required(),
            }),
          ],
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "socialProof",
      title: "Testimonials",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
          validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
        }),
        defineField({
          name: "titlePrefix",
          title: "Title prefix",
          type: "string",
          validation: (rule) => rule.required().min(2).max(100).custom(trimmed),
        }),
        defineField({
          name: "titleAccent",
          title: "Accented title",
          type: "string",
          validation: (rule) => rule.required().min(2).max(100).custom(trimmed),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required().min(10).max(300).custom(trimmed),
        }),
        defineField({
          name: "testimonials",
          title: "Testimonials",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "testimonial",
              fields: [
                defineField({
                  name: "id",
                  title: "Stable ID",
                  type: "string",
                  description: "Used for rendering keys and analytics. Do not change casually.",
                  validation: (rule) =>
                    rule
                      .required()
                      .min(3)
                      .max(100)
                      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
                        name: "lowercase slug",
                      }),
                }),
                defineField({
                  name: "quote",
                  title: "Quote",
                  type: "text",
                  rows: 5,
                  validation: (rule) => rule.required().min(20).max(1000).custom(trimmed),
                }),
                defineField({
                  name: "author",
                  title: "Author",
                  type: "string",
                  validation: (rule) => rule.required().min(1).max(100).custom(trimmed),
                }),
                defineField({
                  name: "handle",
                  title: "Handle",
                  type: "string",
                  validation: (rule) => rule.required().min(1).max(100).custom(trimmed),
                }),
                defineField({
                  name: "href",
                  title: "Source URL",
                  type: "url",
                  validation: (rule) => rule.required().uri({ scheme: ["https"] }),
                }),
                defineField({
                  name: "avatarUrl",
                  title: "Avatar URL",
                  type: "url",
                  validation: (rule) => rule.required().uri({ scheme: ["https"] }),
                }),
                defineField({
                  name: "platform",
                  title: "Platform",
                  type: "string",
                  options: {
                    layout: "radio",
                    list: [
                      { title: "X", value: "x" },
                      { title: "Reddit", value: "reddit" },
                      { title: "Discord", value: "discord" },
                    ],
                  },
                  validation: (rule) => rule.required(),
                }),
              ],
              preview: {
                select: { title: "author", subtitle: "quote" },
              },
            }),
          ],
          validation: (rule) =>
            rule
              .required()
              .min(1)
              .max(20)
              .custom((value) =>
                uniqueStringField(
                  value as Record<string, unknown>[] | undefined,
                  "id",
                  "Testimonial IDs",
                ),
              ),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pricing",
      title: "Pricing",
      type: "object",
      fields: [
        defineField({
          name: "titlePrefix",
          title: "Title prefix",
          type: "string",
          validation: (rule) => rule.required().min(3).max(80).custom(trimmed),
        }),
        defineField({
          name: "titleAccent",
          title: "Accented title",
          type: "string",
          validation: (rule) => rule.required().min(3).max(80).custom(trimmed),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 2,
          validation: (rule) => rule.required().min(10).max(240).custom(trimmed),
        }),
        defineField({
          name: "familySharing",
          title: "Family Sharing message",
          type: "string",
          validation: (rule) => rule.required().min(5).max(160).custom(trimmed),
        }),
        defineField({
          name: "crossPlatform",
          title: "Cross-platform message",
          type: "string",
          validation: (rule) => rule.required().min(5).max(160).custom(trimmed),
        }),
        defineField({
          name: "oneTime",
          title: "One-time purchase",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required().min(2).max(50).custom(trimmed),
            }),
            defineField({
              name: "badge",
              title: "Badge",
              type: "string",
              validation: (rule) => rule.required().min(2).max(50).custom(trimmed),
            }),
            defineField({
              name: "price",
              title: "Price",
              type: "string",
              validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
            }),
          ],
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "subscription",
          title: "Subscription",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required().min(2).max(50).custom(trimmed),
            }),
            defineField({
              name: "price",
              title: "Price",
              type: "string",
              validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
            }),
          ],
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "comparisonLabel",
          title: "Comparison label",
          type: "string",
          validation: (rule) => rule.required().min(5).max(160).custom(trimmed),
        }),
        defineField({
          name: "comparisonDescription",
          title: "Comparison description",
          type: "string",
          validation: (rule) => rule.required().min(5).max(200).custom(trimmed),
        }),
        defineField({
          name: "comparisonNameLabel",
          title: "Alternative column label",
          type: "string",
          validation: (rule) => rule.required().min(2).max(50).custom(trimmed),
        }),
        defineField({
          name: "comparisonPriceLabel",
          title: "Price column label",
          type: "string",
          validation: (rule) => rule.required().min(2).max(50).custom(trimmed),
        }),
        defineField({
          name: "comparisonItems",
          title: "Pricing alternatives",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "pricingComparisonItem",
              fields: [
                defineField({
                  name: "name",
                  title: "Name",
                  type: "string",
                  validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
                }),
                defineField({
                  name: "price",
                  title: "Price",
                  type: "string",
                  validation: (rule) => rule.required().min(1).max(100).custom(trimmed),
                }),
                defineField({
                  name: "description",
                  title: "Description",
                  type: "text",
                  rows: 2,
                  validation: (rule) => rule.required().min(5).max(240).custom(trimmed),
                }),
                defineField({
                  name: "recommendedLabel",
                  title: "Recommended badge",
                  type: "string",
                  description: "Leave empty for non-recommended alternatives.",
                  validation: (rule) => rule.max(50).custom(trimmed),
                }),
              ],
              preview: { select: { title: "name", subtitle: "price" } },
            }),
          ],
          validation: (rule) =>
            rule
              .required()
              .min(2)
              .max(8)
              .custom((value) =>
                uniqueStringField(
                  value as Record<string, unknown>[] | undefined,
                  "name",
                  "Alternative names",
                ),
              ),
        }),
        defineField({
          name: "comparisonCtaLabel",
          title: "Comparison link label",
          type: "string",
          validation: (rule) => rule.required().min(3).max(100).custom(trimmed),
        }),
        defineField({
          name: "comparisonCtaPost",
          title: "Comparison blog post",
          type: "reference",
          to: [{ type: "blogPost" }],
          options: { disableNew: true },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "appStoreLabel",
          title: "App Store button label",
          type: "string",
          description:
            "The attributed App Store URL remains controlled by the application.",
          validation: (rule) => rule.required().min(5).max(100).custom(trimmed),
        }),
        defineField({
          name: "showSetappBadge",
          title: "Show Setapp badge",
          type: "boolean",
          initialValue: false,
          description:
            "Shows the Setapp badge beside the Mac App Store button. Keep disabled until the Setapp launch is ready.",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "roadmap",
      title: "Roadmap",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
          validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
        }),
        defineField({
          name: "titlePrefix",
          title: "Title prefix",
          type: "string",
          validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
        }),
        defineField({
          name: "titleAccent",
          title: "Accented title",
          type: "string",
          validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
        }),
        defineField({
          name: "subtitle",
          title: "Subtitle",
          type: "text",
          rows: 2,
          validation: (rule) => rule.required().min(10).max(240).custom(trimmed),
        }),
        defineField({
          name: "items",
          title: "Milestones",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "roadmapItem",
              fields: [
                defineField({
                  name: "number",
                  title: "Number",
                  type: "number",
                  validation: (rule) => rule.required().integer().min(1).max(99),
                }),
                defineField({
                  name: "status",
                  title: "Status",
                  type: "string",
                  options: {
                    list: [
                      { title: "Shipped", value: "Shipped" },
                      { title: "Open Beta Tests", value: "Open Beta Tests" },
                      { title: "Up next", value: "Up next" },
                      { title: "Planned", value: "Planned" },
                      { title: "On the horizon", value: "On the horizon" },
                    ],
                  },
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "title",
                  title: "Title",
                  type: "string",
                  validation: (rule) => rule.required().min(3).max(120).custom(trimmed),
                }),
                defineField({
                  name: "description",
                  title: "Description",
                  type: "text",
                  rows: 3,
                  validation: (rule) => rule.required().min(10).max(400).custom(trimmed),
                }),
              ],
              preview: {
                select: { title: "title", subtitle: "status" },
              },
            }),
          ],
          validation: (rule) => rule.required().min(3).max(8),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
          validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
        }),
        defineField({
          name: "titlePrefix",
          title: "Title prefix",
          type: "string",
          validation: (rule) => rule.required().min(2).max(100).custom(trimmed),
        }),
        defineField({
          name: "titleAccent",
          title: "Accented title",
          type: "string",
          validation: (rule) => rule.required().min(2).max(100).custom(trimmed),
        }),
        defineField({
          name: "subtitle",
          title: "Subtitle",
          type: "text",
          rows: 2,
          validation: (rule) => rule.required().min(10).max(240).custom(trimmed),
        }),
        defineField({
          name: "items",
          title: "Questions",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "homeFaqItem",
              fields: [
                defineField({
                  name: "question",
                  title: "Question",
                  type: "string",
                  validation: (rule) => rule.required().min(5).max(240).custom(trimmed),
                }),
                defineField({
                  name: "answer",
                  title: "Answer",
                  type: "text",
                  rows: 5,
                  validation: (rule) => rule.required().min(20).max(1500).custom(trimmed),
                }),
              ],
              preview: { select: { title: "question", subtitle: "answer" } },
            }),
          ],
          validation: (rule) =>
            rule
              .required()
              .min(1)
              .max(20)
              .custom((value) =>
                uniqueStringField(
                  value as Record<string, unknown>[] | undefined,
                  "question",
                  "Questions",
                ),
              ),
        }),
        defineField({
          name: "footerTitle",
          title: "Footer title",
          type: "string",
          validation: (rule) => rule.required().min(3).max(100).custom(trimmed),
        }),
        defineField({
          name: "footerDescription",
          title: "Footer description",
          type: "text",
          rows: 2,
          validation: (rule) => rule.required().min(10).max(240).custom(trimmed),
        }),
        defineField({
          name: "footerLinkLabel",
          title: "Discord link label",
          type: "string",
          description: "The Discord URL remains controlled by the application.",
          validation: (rule) => rule.required().min(3).max(80).custom(trimmed),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  validation: (rule) =>
    rule.custom((_document, context) =>
      singletonId(context.document?._id) === "homePage"
        ? true
        : "Homepage content must use the fixed document ID homePage.",
    ),
  preview: {
    prepare() {
      return { title: "Homepage" };
    },
  },
});
