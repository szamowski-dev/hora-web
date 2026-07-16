import { defineField, defineType } from "sanity";

export const optionalSiteImage = defineType({
  name: "optionalSiteImage",
  title: "Optional site image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Add when the screenshot conveys useful information.",
      validation: (rule) => rule.min(5).max(300),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      validation: (rule) => rule.max(300),
    }),
  ],
});
