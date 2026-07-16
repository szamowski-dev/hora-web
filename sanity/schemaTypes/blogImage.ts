import { defineField, defineType } from "sanity";

export const blogImage = defineType({
  name: "blogImage",
  title: "Blog image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description:
        "Describe the useful information in the image. Do not repeat the article title unless that is all the image communicates.",
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
      name: "listingAlt",
      title: "Listing alternative text",
      type: "string",
      description:
        "Optional context-specific alternative text for the blog listing. The article title is used when this is empty.",
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "presentation",
      title: "Presentation",
      type: "string",
      initialValue: "wide",
      options: {
        layout: "radio",
        list: [
          { title: "Wide", value: "wide" },
          { title: "Text column", value: "content" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
  validation: (rule) =>
    rule.custom((value) =>
      !value || value.asset ? true : "Choose or upload an image asset.",
    ),
  preview: {
    select: { title: "alt", subtitle: "caption", media: "asset" },
  },
});
