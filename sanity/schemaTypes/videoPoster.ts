import { defineField, defineType } from "sanity";

export const videoPoster = defineType({
  name: "videoPoster",
  title: "Video poster",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description:
        "Optional. The video accessibility label describes the content when no poster text is needed.",
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      validation: (rule) => rule.max(300),
    }),
  ],
});
