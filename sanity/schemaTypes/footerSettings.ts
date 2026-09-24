import { defineField, defineType } from "sanity";

const trimmed = (value: string | undefined) =>
  !value || value.trim() === value
    ? true
    : "Remove whitespace from the beginning or end.";

export const footerSettings = defineType({
  name: "footerSettings",
  title: "Footer",
  type: "document",
  fields: [
    defineField({
      name: "copyright",
      title: "Copyright text",
      description: "Shown in the global website footer.",
      type: "string",
      validation: (rule) => rule.required().min(2).max(180).custom(trimmed),
    }),
    defineField({
      name: "googleDisclaimer",
      title: "Google disclaimer",
      description:
        "Optional trademark / App Review independence wording shown under the copyright in the global footer.",
      type: "string",
      validation: (rule) => rule.max(500).custom(trimmed),
    }),
  ],
  validation: (rule) =>
    rule.custom((_document, context) =>
      context.document?._id?.replace(/^drafts\./, "") === "footerSettings"
        ? true
        : "Footer settings must use the fixed document ID footerSettings.",
    ),
  preview: { prepare: () => ({ title: "Footer" }) },
});
