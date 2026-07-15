import { defineField, defineType } from "sanity";

export const blogSettings = defineType({
  name: "blogSettings",
  title: "Blog settings",
  type: "document",
  fields: [
    defineField({
      name: "featuredPost",
      title: "Featured post",
      type: "reference",
      to: [{ type: "blogPost" }],
      options: { disableNew: true },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Blog settings" };
    },
  },
});
