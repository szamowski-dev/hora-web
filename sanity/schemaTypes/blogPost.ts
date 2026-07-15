import { defineArrayMember, defineField, defineType } from "sanity";
import { ReadingMinutesInput } from "@/sanity/components/ReadingMinutesInput";

type BlogPostDates = { publishedAt?: string };
type TagReference = { _ref?: string };

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .min(10)
          .max(100)
          .custom((value) =>
            value && value.trim() === value
              ? true
              : "Remove whitespace from the beginning or end.",
          ),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "This is the permanent public URL. Preserve imported slugs exactly.",
      options: { source: "title", maxLength: 120 },
      validation: (rule) =>
        rule.required().custom((value) =>
          value?.current && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)
            ? true
            : "Use lowercase letters, numbers, and hyphens only.",
        ),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "The article deck and default meta description.",
      validation: (rule) =>
        rule
          .required()
          .min(40)
          .max(200)
          .custom((value) =>
            value && value.trim() === value
              ? true
              : "Remove whitespace from the beginning or end.",
          ),
    }),
    defineField({
      name: "publishedAt",
      title: "Published date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contentUpdatedAt",
      title: "Content updated date",
      type: "date",
      description: "The editorial update date shown to search engines.",
      validation: (rule) =>
        rule.required().custom((value, context) => {
          const parent = context.parent as BlogPostDates | undefined;
          return !value || !parent?.publishedAt || value >= parent.publishedAt
            ? true
            : "The updated date cannot be earlier than the published date.";
        }),
    }),
    defineField({
      name: "readingMinutes",
      title: "Estimated reading time",
      type: "number",
      description: "Calculated automatically from the current article body.",
      initialValue: 1,
      components: { input: ReadingMinutesInput },
      validation: (rule) => rule.required().integer().min(1).max(60),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      options: { disableNew: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "blogCategory" }],
      options: { disableNew: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "blogTag" }],
          options: { disableNew: true },
        }),
      ],
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .max(15)
          .custom((value) => {
            const references = value as TagReference[] | undefined;
            if (!references) return true;
            const refs = references.map((item) => item?._ref).filter(Boolean);
            return new Set(refs).size === refs.length
              ? true
              : "A tag can only be added once.";
          }),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "blogImage",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Article body",
      type: "blogBody",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
    defineField({
      name: "legacySourceFile",
      title: "Legacy MDX source",
      type: "string",
      description: "Original filename retained for migration audits.",
      readOnly: true,
      hidden: true,
      validation: (rule) =>
        rule.custom((value) =>
          !value || /^[a-z0-9][a-z0-9-]*\.mdx$/.test(value)
            ? true
            : "Expected a lowercase MDX filename.",
        ),
    }),
    defineField({
      name: "legacyChecksum",
      title: "Legacy MDX checksum",
      type: "string",
      description: "SHA-256 checksum retained for idempotent migrations.",
      readOnly: true,
      hidden: true,
      validation: (rule) =>
        rule.custom((value) =>
          !value || /^[a-f0-9]{64}$/.test(value)
            ? true
            : "Expected a lowercase SHA-256 checksum.",
        ),
    }),
  ],
  orderings: [
    {
      title: "Published date, newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Updated date, newest first",
      name: "contentUpdatedAtDesc",
      by: [{ field: "contentUpdatedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      publishedAt: "publishedAt",
      category: "category.title",
      media: "heroImage",
    },
    prepare({ title, publishedAt, category, media }) {
      return {
        title,
        subtitle: [category, publishedAt].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
