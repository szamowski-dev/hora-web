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

export const featuresPage = defineType({
  name: "featuresPage",
  title: "Features page",
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
          rows: 3,
          validation: (rule) => rule.required().min(30).max(400).custom(trimmed),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Feature groups",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "featureSection",
          fields: [
            defineField({
              name: "label",
              title: "Section label",
              type: "string",
              validation: (rule) => rule.required().min(3).max(100).custom(trimmed),
            }),
            defineField({
              name: "screenshot",
              title: "Screenshot",
              type: "optionalSiteImage",
              description: "Optional. Some feature groups are text-only.",
            }),
            defineField({
              name: "wideShortcutsCard",
              title: "Keyboard shortcuts card",
              type: "object",
              description: "Optional wide card shown before the regular feature cards.",
              fields: [
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
                  validation: (rule) => rule.required().min(20).max(500).custom(trimmed),
                }),
                defineField({
                  name: "shortcuts",
                  title: "Shortcuts",
                  type: "array",
                  of: [
                    defineArrayMember({
                      type: "object",
                      name: "keyboardShortcut",
                      fields: [
                        defineField({
                          name: "keys",
                          title: "Keys",
                          type: "array",
                          of: [
                            defineArrayMember({
                              type: "string",
                              validation: (rule) =>
                                rule.required().min(1).max(30).custom(trimmed),
                            }),
                          ],
                          validation: (rule) =>
                            rule.required().min(1).max(5).unique(),
                        }),
                        defineField({
                          name: "label",
                          title: "Action",
                          type: "string",
                          validation: (rule) => rule.required().min(2).max(100).custom(trimmed),
                        }),
                      ],
                      preview: {
                        select: { title: "label", keys: "keys" },
                        prepare({ title, keys }) {
                          return {
                            title: title || "Shortcut",
                            subtitle: Array.isArray(keys) ? keys.join(" + ") : undefined,
                          };
                        },
                      },
                    }),
                  ],
                  validation: (rule) => rule.required().min(1).max(20),
                }),
              ],
            }),
            defineField({
              name: "items",
              title: "Features",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "featureItem",
                  fields: [
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
                      rows: 5,
                      validation: (rule) => rule.required().min(30).max(900).custom(trimmed),
                    }),
                    defineField({
                      name: "badges",
                      title: "Badges",
                      type: "array",
                      of: [
                        defineArrayMember({
                          type: "string",
                          validation: (rule) =>
                            rule.required().min(1).max(80).custom(trimmed),
                        }),
                      ],
                      validation: (rule) => rule.max(8).unique(),
                    }),
                  ],
                  preview: { select: { title: "title", subtitle: "description" } },
                }),
              ],
              validation: (rule) =>
                rule
                  .required()
                  .min(1)
                  .max(20)
                  .custom((value) =>
                    uniqueValues(
                      value as Record<string, unknown>[] | undefined,
                      "title",
                      "Feature titles within a group",
                    ),
                  ),
            }),
          ],
          preview: {
            select: { title: "label", items: "items", media: "screenshot" },
            prepare({ title, items, media }) {
              return {
                title: title || "Feature group",
                subtitle: `${Array.isArray(items) ? items.length : 0} features`,
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
          .max(12)
          .custom((value) =>
            uniqueValues(
              value as Record<string, unknown>[] | undefined,
              "label",
              "Feature group labels",
            ),
          ),
    }),
  ],
  validation: (rule) =>
    rule.custom((_document, context) =>
      singletonId(context.document?._id) === "featuresPage"
        ? true
        : "Features content must use the fixed document ID featuresPage.",
    ),
  preview: {
    prepare() {
      return { title: "Features page" };
    },
  },
});
