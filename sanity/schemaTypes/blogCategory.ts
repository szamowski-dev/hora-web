import { defineField, defineType } from "sanity";

const CATEGORY_SLUGS = [
  "guides",
  "build-notes",
  "engineering",
  "product-updates",
] as const;

export const blogCategory = defineType({
  name: "blogCategory",
  title: "Blog category",
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
      description: "Permanent route key managed by the blog integration.",
      readOnly: true,
      options: { source: "title", maxLength: 80 },
      validation: (rule) =>
        rule.required().custom((value) =>
          value?.current &&
          CATEGORY_SLUGS.includes(
            value.current as (typeof CATEGORY_SLUGS)[number],
          )
            ? true
            : "Choose one of the four managed blog category slugs.",
        ),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(20).max(400),
    }),
    defineField({
      name: "order",
      title: "Navigation order",
      type: "number",
      validation: (rule) => rule.required().integer().min(0).max(100),
    }),
  ],
  orderings: [
    {
      title: "Navigation order",
      name: "navigationOrder",
      by: [
        { field: "order", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "title", slug: "slug.current", order: "order" },
    prepare({ title, slug, order }) {
      return { title, subtitle: `${order ?? "?"}. /${slug || "missing-slug"}/` };
    },
  },
});
