import { defineArrayMember, defineField, defineType } from "sanity";

const singletonId = (id: string | undefined) => id?.replace(/^drafts\./, "");

const trimmed = (value: string | undefined) =>
  !value || value.trim() === value
    ? true
    : "Remove whitespace from the beginning or end.";

const uniqueValues = (
  values: Record<string, unknown>[] | undefined,
  field: string,
  label: string,
) => {
  if (!values) return true;
  const strings = values
    .map((item) => item[field])
    .filter((value): value is string => typeof value === "string");
  return new Set(strings).size === strings.length
    ? true
    : `${label} must be unique.`;
};

const landingFeature = defineArrayMember({
  type: "object",
  name: "googleCalendarMacFeature",
  fields: [
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: {
        list: [
          "label", "event", "video-call", "contacts", "accounts", "search",
          "invitation", "menu-bar", "timer", "auto-awesome", "tasks",
          "focus-time", "availability", "widgets", "offline", "sync", "key",
          "storage", "speed", "notifications", "dock", "keyboard", "windows",
          "dark-mode", "apple-silicon", "view", "drag", "quick-add", "time-zone",
          "repeat", "location", "out-of-office",
        ].map((value) => ({ title: value, value })),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: {
        list: ["red", "blue", "green", "yellow", "purple", "cyan"].map(
          (value) => ({ title: value, value }),
        ),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(2).max(120).custom(trimmed),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(10).max(400).custom(trimmed),
    }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});

export const googleCalendarMacPage = defineType({
  name: "googleCalendarMacPage",
  title: "Google Calendar for Mac page",
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
          name: "title",
          title: "Heading (H1)",
          type: "string",
          validation: (rule) => rule.required().min(10).max(120).custom(trimmed),
        }),
        defineField({
          name: "description",
          title: "Subheading",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required().min(30).max(400).custom(trimmed),
        }),
        defineField({
          name: "primaryCtaLabel",
          title: "Primary CTA label",
          type: "string",
          validation: (rule) => rule.required().min(3).max(60).custom(trimmed),
        }),
        defineField({
          name: "macAppStoreLabel",
          title: "Mac App Store link label",
          type: "string",
          validation: (rule) => rule.required().min(3).max(80).custom(trimmed),
        }),
        defineField({
          name: "trialNote",
          title: "Trial note",
          description: "Rendered as a link to the pricing page.",
          type: "string",
          validation: (rule) => rule.required().min(10).max(160).custom(trimmed),
        }),
        defineField({
          name: "requirement",
          title: "Requirement line",
          type: "string",
          validation: (rule) => rule.required().min(5).max(160).custom(trimmed),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Direct answer",
      description:
        "Answers the query head-on, directly under the hero. Targets People Also Ask.",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          validation: (rule) => rule.required().min(10).max(140).custom(trimmed),
        }),
        defineField({
          name: "items",
          title: "Answer blocks",
          description:
            "Each block renders as its own card. Two blocks read best.",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "googleCalendarMacAnswerBlock",
              fields: [
                defineField({
                  name: "eyebrow",
                  title: "Eyebrow",
                  description:
                    "Short label above the block, e.g. \"The short answer\".",
                  type: "string",
                  validation: (rule) =>
                    rule.required().min(3).max(40).custom(trimmed),
                }),
                defineField({
                  name: "body",
                  title: "Body",
                  type: "text",
                  rows: 5,
                  validation: (rule) =>
                    rule.required().min(40).max(600).custom(trimmed),
                }),
              ],
              preview: { select: { title: "eyebrow", subtitle: "body" } },
            }),
          ],
          validation: (rule) =>
            rule
              .required()
              .min(1)
              .max(4)
              .custom((value) =>
                uniqueValues(
                  value as Record<string, unknown>[] | undefined,
                  "eyebrow",
                  "Answer block eyebrows",
                ),
              ),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Section title",
          type: "string",
          validation: (rule) => rule.required().min(5).max(140).custom(trimmed),
        }),
        defineField({
          name: "description",
          title: "Section description",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required().min(20).max(400).custom(trimmed),
        }),
        defineField({
          name: "items",
          title: "Feature list",
          type: "array",
          of: [landingFeature],
          validation: (rule) =>
            rule
              .required()
              .min(3)
              .max(12)
              .custom((value) =>
                uniqueValues(
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
      name: "trust",
      title: "Trust section",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required().min(5).max(140).custom(trimmed),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 5,
          validation: (rule) =>
            rule.required().min(40).max(700).custom(trimmed),
        }),
        defineField({
          name: "linkLabel",
          title: "Trust Center link label",
          type: "string",
          validation: (rule) => rule.required().min(3).max(80).custom(trimmed),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pricing",
      title: "Pricing note",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required().min(5).max(140).custom(trimmed),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 4,
          validation: (rule) =>
            rule.required().min(30).max(500).custom(trimmed),
        }),
        defineField({
          name: "linkLabel",
          title: "Pricing link label",
          type: "string",
          validation: (rule) => rule.required().min(3).max(80).custom(trimmed),
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
          name: "title",
          title: "Section title",
          type: "string",
          validation: (rule) => rule.required().min(5).max(140).custom(trimmed),
        }),
        defineField({
          name: "items",
          title: "Questions",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "googleCalendarMacFaqItem",
              fields: [
                defineField({
                  name: "question",
                  title: "Question",
                  type: "string",
                  validation: (rule) =>
                    rule.required().min(10).max(200).custom(trimmed),
                }),
                defineField({
                  name: "answer",
                  title: "Answer",
                  type: "text",
                  rows: 5,
                  validation: (rule) =>
                    rule.required().min(30).max(900).custom(trimmed),
                }),
              ],
              preview: { select: { title: "question", subtitle: "answer" } },
            }),
          ],
          validation: (rule) =>
            rule
              .required()
              .min(3)
              .max(10)
              .custom((value) =>
                uniqueValues(
                  value as Record<string, unknown>[] | undefined,
                  "question",
                  "FAQ questions",
                ),
              ),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "closing",
      title: "Closing CTA",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required().min(5).max(140).custom(trimmed),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 3,
          validation: (rule) =>
            rule.required().min(20).max(400).custom(trimmed),
        }),
        defineField({
          name: "ctaLabel",
          title: "CTA label",
          type: "string",
          validation: (rule) => rule.required().min(3).max(60).custom(trimmed),
        }),
        defineField({
          name: "guideLabel",
          title: "Guide link label",
          description: "Links to the Google Calendar on Mac comparison guide.",
          type: "string",
          validation: (rule) => rule.required().min(5).max(120).custom(trimmed),
        }),
        defineField({
          name: "guideHref",
          title: "Guide link path",
          type: "string",
          validation: (rule) =>
            rule
              .required()
              .custom((value) =>
                value && value.startsWith("/") && value.endsWith("/")
                  ? true
                  : "Use a site-relative path with a trailing slash.",
              ),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  validation: (rule) =>
    rule.custom((_document, context) =>
      singletonId(context.document?._id) === "googleCalendarMacPage"
        ? true
        : "This page must use the fixed document ID googleCalendarMacPage.",
    ),
  preview: {
    prepare() {
      return { title: "Google Calendar for Mac page" };
    },
  },
});
