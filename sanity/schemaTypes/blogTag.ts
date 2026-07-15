import { defineField, defineType } from "sanity";

export const blogTag = defineType({
  name: "blogTag",
  title: "Blog tag",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(2).max(80),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 80 },
      validation: (rule) =>
        rule.required().custom((value) =>
          value?.current && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)
            ? true
            : "Use lowercase letters, numbers, and hyphens only.",
        ),
    }),
  ],
  orderings: [
    {
      title: "Title",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare({ title, slug }) {
      return { title, subtitle: slug ? `#${slug}` : "Missing slug" };
    },
  },
});
