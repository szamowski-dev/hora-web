import { defineArrayMember, defineField, defineType } from "sanity";

const singletonId = (id: string | undefined) => id?.replace(/^drafts\./, "");
const trimmed = (value: string | undefined) =>
  !value || value.trim() === value
    ? true
    : "Remove whitespace from the beginning or end.";

type AboutContact = {
  kind?: "email" | "website" | "x" | "bluesky" | "github";
  href?: string;
};

const contactHref = (value: string | undefined, kind: AboutContact["kind"]) => {
  if (!value) return true;
  if (kind === "email") {
    return /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? true
      : "Use a complete mailto: address for an email contact.";
  }
  try {
    return new URL(value).protocol === "https:"
      ? true
      : "Use a complete https URL.";
  } catch {
    return "Use a complete https URL.";
  }
};

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
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
          validation: (rule) => rule.required().min(3).max(100).custom(trimmed),
        }),
        defineField({
          name: "titleAccent",
          title: "Accented title",
          type: "string",
          validation: (rule) => rule.required().min(3).max(100).custom(trimmed),
        }),
        defineField({
          name: "subtitle",
          title: "Subtitle",
          type: "text",
          rows: 4,
          validation: (rule) => rule.required().min(30).max(500).custom(trimmed),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "profile",
      title: "Profile",
      type: "object",
      fields: [
        defineField({
          name: "author",
          title: "Author",
          type: "reference",
          to: [{ type: "author" }],
          options: { disableNew: true },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "summary",
          title: "Summary",
          type: "text",
          rows: 4,
          validation: (rule) => rule.required().min(20).max(500).custom(trimmed),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "stats",
      title: "Profile facts",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "aboutStat",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (rule) => rule.required().min(1).max(30).custom(trimmed),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
            }),
            defineField({
              name: "detail",
              title: "Detail",
              type: "string",
              validation: (rule) => rule.required().min(3).max(160).custom(trimmed),
            }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(8),
    }),
    defineField({
      name: "story",
      title: "Story",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
          validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
        }),
        defineField({
          name: "quote",
          title: "Pull quote",
          type: "text",
          rows: 4,
          validation: (rule) => rule.required().min(20).max(500).custom(trimmed),
        }),
        defineField({
          name: "quoteDetail",
          title: "Quote detail",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required().min(10).max(400).custom(trimmed),
        }),
        defineField({
          name: "body",
          title: "Story body",
          type: "pageBody",
          validation: (rule) => rule.required().min(1),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contacts",
      title: "Contact links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "aboutContact",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required().min(2).max(100).custom(trimmed),
            }),
            defineField({
              name: "kind",
              title: "Kind",
              type: "string",
              options: {
                layout: "radio",
                list: [
                  { title: "Email", value: "email" },
                  { title: "Website", value: "website" },
                  { title: "X", value: "x" },
                  { title: "Bluesky", value: "bluesky" },
                  { title: "GitHub", value: "github" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "Destination",
              type: "string",
              validation: (rule) =>
                rule.required().max(500).custom((value, context) => {
                  const parent = context.parent as AboutContact | undefined;
                  return contactHref(value, parent?.kind);
                }),
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(12),
    }),
    defineField({
      name: "cta",
      title: "Call to action",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
          validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
        }),
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
          validation: (rule) => rule.required().min(20).max(400).custom(trimmed),
        }),
        defineField({
          name: "primaryLabel",
          title: "App Store button label",
          type: "string",
          description:
            "The attributed App Store URL remains controlled by the application.",
          validation: (rule) => rule.required().min(3).max(80).custom(trimmed),
        }),
        defineField({
          name: "secondaryLabel",
          title: "Blog button label",
          type: "string",
          description: "The destination remains the canonical /blog/ route.",
          validation: (rule) => rule.required().min(3).max(80).custom(trimmed),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  validation: (rule) =>
    rule.custom((_document, context) =>
      singletonId(context.document?._id) === "aboutPage"
        ? true
        : "About content must use the fixed document ID aboutPage.",
    ),
  preview: {
    prepare() {
      return { title: "About page" };
    },
  },
});
