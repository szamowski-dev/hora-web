import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO overrides",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      description: "Leave empty to use the post title.",
      validation: (rule) =>
        rule
          .max(100)
          .custom((value) =>
            !value || value.trim() === value
              ? true
              : "Remove whitespace from the beginning or end.",
          )
          .warning("Search results may truncate titles longer than 60 characters."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      description: "Leave empty to use the post description.",
      validation: (rule) =>
        rule
          .max(220)
          .custom((value) =>
            !value || value.trim() === value
              ? true
              : "Remove whitespace from the beginning or end.",
          )
          .warning(
            "Search results may truncate descriptions longer than 160 characters.",
          ),
    }),
    defineField({
      name: "ogImageOverride",
      title: "Social image override",
      type: "blogImage",
      description: "Leave empty to use the hero image.",
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL override",
      type: "url",
      description: "Leave empty to use the canonical URL generated from the slug.",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "noIndex",
      title: "Exclude from search engines",
      type: "boolean",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
  ],
});
