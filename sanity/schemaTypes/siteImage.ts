import { defineField, defineType } from "sanity";

export const siteImage = defineType({
  name: "siteImage",
  title: "Site image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description:
        "Describe the useful information in the image. Leave decorative treatment to the frontend.",
      validation: (rule) =>
        rule
          .required()
          .min(5)
          .max(300)
          .custom((value) =>
            value && value.trim() === value
              ? true
              : "Remove whitespace from the beginning or end.",
          ),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      validation: (rule) => rule.max(300),
    }),
  ],
  validation: (rule) =>
    rule.custom((value) =>
      value?.asset ? true : "Choose or upload an image asset.",
    ),
  preview: {
    select: { title: "alt", subtitle: "caption", media: "asset" },
  },
});
