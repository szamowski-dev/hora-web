import { defineField, defineType } from "sanity";

const LEGAL_IDS = {
  privacy: "privacyPage",
  terms: "termsPage",
} as const;

type LegalDocument = {
  kind?: keyof typeof LEGAL_IDS;
};

const singletonId = (id: string | undefined) => id?.replace(/^drafts\./, "");
const trimmed = (value: string | undefined) =>
  !value || value.trim() === value
    ? true
    : "Remove whitespace from the beginning or end.";

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  fields: [
    defineField({
      name: "kind",
      title: "Document kind",
      type: "string",
      readOnly: true,
      options: {
        layout: "radio",
        list: [
          { title: "Privacy Policy", value: "privacy" },
          { title: "Terms of Service", value: "terms" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        defineField({
          name: "prefix",
          title: "Title prefix",
          type: "string",
          validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
        }),
        defineField({
          name: "accent",
          title: "Accented title",
          type: "string",
          validation: (rule) => rule.required().min(2).max(80).custom(trimmed),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lastUpdated",
      title: "Last updated",
      type: "date",
      description: "The public editorial date shown at the top of the page.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "pageSeo",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Legal content",
      type: "pageBody",
      validation: (rule) => rule.required().min(1),
    }),
  ],
  validation: (rule) =>
    rule.custom((value, context) => {
      const document = value as LegalDocument | undefined;
      const expectedId = document?.kind ? LEGAL_IDS[document.kind] : undefined;
      const id = singletonId(context.document?._id);
      if (!id || !Object.values(LEGAL_IDS).includes(id as "privacyPage" | "termsPage")) {
        return "Legal documents must use the fixed IDs privacyPage or termsPage.";
      }
      return expectedId === id
        ? true
        : "The document kind does not match its fixed document ID.";
    }),
  preview: {
    select: {
      kind: "kind",
      prefix: "title.prefix",
      accent: "title.accent",
      lastUpdated: "lastUpdated",
    },
    prepare({ kind, prefix, accent, lastUpdated }) {
      return {
        title:
          [prefix, accent].filter(Boolean).join(" ") ||
          (kind === "privacy" ? "Privacy Policy" : "Terms of Service"),
        subtitle: lastUpdated ? `Updated ${lastUpdated}` : undefined,
      };
    },
  },
});
