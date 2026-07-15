import { defineField, defineType } from "sanity";

const TITLE_SUFFIX = " — hora Calendar";
const MAX_RENDERED_TITLE_LENGTH = 65;

export const pageSeo = defineType({
  name: "pageSeo",
  title: "Page SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .min(10)
          .custom((value) =>
            value && value.trim() === value
              ? true
              : "Remove whitespace from the beginning or end.",
          )
          .custom((value, context) => {
            if (!value) return true;
            const suffix =
              context.document?._type === "homePage" ? "" : TITLE_SUFFIX;
            const renderedLength = `${value}${suffix}`.length;
            return renderedLength <= MAX_RENDERED_TITLE_LENGTH
              ? true
              : `The rendered HTML title is ${renderedLength} characters. Shorten it to ${MAX_RENDERED_TITLE_LENGTH} characters or fewer, including the site suffix.`;
          }),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule
          .required()
          .min(40)
          .max(160)
          .custom((value) =>
            value && value.trim() === value
              ? true
              : "Remove whitespace from the beginning or end.",
          ),
    }),
    defineField({
      name: "ogTitle",
      title: "Social title",
      type: "string",
      description: "Leave empty to use the meta title.",
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: "ogDescription",
      title: "Social description",
      type: "text",
      rows: 3,
      description: "Leave empty to use the meta description.",
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: "ogImage",
      title: "Social image",
      type: "siteImage",
      description: "Leave empty to use the site-wide social image.",
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
