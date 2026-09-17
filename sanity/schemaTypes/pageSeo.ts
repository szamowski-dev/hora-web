import { defineField, defineType } from "sanity";

const TITLE_SUFFIX = " — hora Calendar";
const MAX_RENDERED_TITLE_LENGTH = 65;

/**
 * Pages whose route renders `title.absolute` opt out of the layout's
 * "%s — hora Calendar" template, so their meta title is the whole HTML title
 * and the suffix must not be counted against their budget. Every other page
 * inherits the template and spends part of the budget on the suffix.
 */
const ABSOLUTE_TITLE_TYPES = new Set(["homePage", "googleCalendarMacPage"]);

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
            const documentType = context.document?._type;
            const usesSuffix =
              typeof documentType === "string" &&
              !ABSOLUTE_TITLE_TYPES.has(documentType);
            const suffix = usesSuffix ? TITLE_SUFFIX : "";
            const renderedLength = `${value}${suffix}`.length;
            if (renderedLength <= MAX_RENDERED_TITLE_LENGTH) return true;
            return usesSuffix
              ? `The rendered HTML title is ${renderedLength} characters, including the "${TITLE_SUFFIX.trim()}" suffix. Shorten it to ${MAX_RENDERED_TITLE_LENGTH} characters or fewer.`
              : `The rendered HTML title is ${renderedLength} characters. This page sets its own full title, so shorten it to ${MAX_RENDERED_TITLE_LENGTH} characters or fewer.`;
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
