import { defineField, defineType } from "sanity";

const INTERNAL_PATH_PATTERN = /^\/(?!\/)[^\s]*$/;

export const externalLink = defineType({
  name: "externalLink",
  title: "External link",
  type: "object",
  fields: [
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["http", "https"] })
          .error("Enter a complete http or https URL."),
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in a new tab",
      type: "boolean",
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "href", openInNewTab: "openInNewTab" },
    prepare({ title, openInNewTab }) {
      return {
        title: title || "External link",
        subtitle: openInNewTab ? "Opens in a new tab" : "Opens in this tab",
      };
    },
  },
});

export const internalPostLink = defineType({
  name: "internalPostLink",
  title: "Blog post link",
  type: "object",
  fields: [
    defineField({
      name: "post",
      title: "Post",
      type: "reference",
      to: [{ type: "blogPost" }],
      options: { disableNew: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "anchor",
      title: "Section anchor",
      type: "string",
      description: "Optional heading ID without the leading #.",
      validation: (rule) =>
        rule
          .max(120)
          .custom((value) =>
            !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
              ? true
              : "Use lowercase letters, numbers, and hyphens only.",
          ),
    }),
  ],
  preview: {
    select: { title: "post.title", anchor: "anchor" },
    prepare({ title, anchor }) {
      return {
        title: title || "Blog post link",
        subtitle: anchor ? `Section: #${anchor}` : "Internal blog post",
      };
    },
  },
});

export const internalPathLink = defineType({
  name: "internalPathLink",
  title: "Site link",
  type: "object",
  fields: [
    defineField({
      name: "path",
      title: "Path",
      type: "string",
      description: "A site-relative path such as /features/ or /privacy/.",
      validation: (rule) =>
        rule
          .required()
          .max(500)
          .custom((value) =>
            typeof value === "string" && INTERNAL_PATH_PATTERN.test(value)
              ? true
              : "Start with one / and do not include spaces.",
          ),
    }),
  ],
  preview: {
    select: { title: "path" },
    prepare({ title }) {
      return { title: title || "Site link", subtitle: "Internal path" };
    },
  },
});
