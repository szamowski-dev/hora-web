import { defineArrayMember, defineField, defineType } from "sanity";

const trimmed = (value: string | undefined) =>
  !value || value.trim() === value
    ? true
    : "Remove whitespace from the beginning or end.";

const singletonId = (id: string | undefined) => id?.replace(/^drafts\./, "");

const textField = (name: string, title: string, rows?: number) =>
  defineField({
    name,
    title,
    type: rows ? "text" : "string",
    ...(rows ? { rows } : {}),
    validation: (rule) => rule.max(rows ? 1500 : 180).custom(trimmed),
  });

export const pricingPage = defineType({
  name: "pricingPage",
  title: "Pricing page",
  type: "document",
  fields: [
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        textField("title", "Page title"),
        textField("description", "Search description", 3),
      ],
    }),
    defineField({
      name: "hero",
      title: "Opening",
      type: "object",
      fields: [
        textField("title", "Headline"),
        textField("description", "Description", 3),
      ],
    }),
    defineField({
      name: "plans",
      title: "Direct plans",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "pricingPlan",
          fields: [
            textField("name", "Name"),
            textField("price", "Price"),
            textField("suffix", "Price suffix"),
            textField("description", "Description", 3),
            defineField({
              name: "features",
              title: "Included features",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (rule) => rule.max(6),
            }),
            textField("ctaLabel", "Button label"),
            defineField({ name: "featured", title: "Featured", type: "boolean" }),
          ],
          preview: { select: { title: "name", subtitle: "price" } },
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "direct",
      title: "Direct edition visibility",
      type: "object",
      description:
        "Direct Download and the terminal prompt stay hidden from visitors until you enable them here.",
      fields: [
        defineField({
          name: "showDownload",
          title: "Show Direct Download",
          type: "boolean",
          initialValue: false,
        }),
        textField("downloadLabel", "Direct Download label"),
        defineField({
          name: "showTerminalPrompt",
          title: "Show terminal prompt",
          type: "boolean",
          initialValue: false,
        }),
        textField("terminalCommand", "Terminal command"),
        textField("terminalRequirement", "Terminal requirement"),
        textField("copyLabel", "Terminal copy button"),
        textField("copiedLabel", "Terminal copied state"),
      ],
    }),
    defineField({
      name: "distribution",
      title: "Mac App Store and Setapp",
      type: "object",
      fields: [
        textField("title", "Section title"),
        textField("description", "Section description", 3),
        defineField({ name: "showMacAppStore", title: "Show Mac App Store link", type: "boolean", initialValue: true }),
        textField("macAppStoreTitle", "Mac App Store card title"),
        textField("macAppStoreDescription", "Mac App Store card description", 3),
        textField("macAppStoreLabel", "Mac App Store label"),
        defineField({
          name: "macAppStoreBadge",
          title: "Mac App Store badge",
          type: "siteImage",
        }),
        defineField({ name: "showSetapp", title: "Show Setapp link", type: "boolean", initialValue: true }),
        textField("setappTitle", "Setapp card title"),
        textField("setappDescription", "Setapp card description", 3),
        textField("setappLabel", "Setapp link label"),
        defineField({
          name: "setappHref",
          title: "Setapp URL",
          type: "url",
          validation: (rule) => rule.uri({ scheme: ["https"] }),
        }),
      ],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "object",
      fields: [
        textField("title", "Headline"),
        defineField({
          name: "items",
          title: "Questions",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "pricingFaqItem",
              fields: [
                textField("question", "Question"),
                textField("answer", "Answer", 5),
              ],
              preview: { select: { title: "question", subtitle: "answer" } },
            }),
          ],
          validation: (rule) => rule.max(12),
        }),
      ],
    }),
    textField("footer", "Footer note", 3),
  ],
  validation: (rule) =>
    rule.custom((_document, context) =>
      singletonId(context.document?._id) === "pricingPage"
        ? true
        : "Pricing content must use the fixed document ID pricingPage.",
    ),
  preview: {
    prepare: () => ({ title: "Pricing page" }),
  },
});
