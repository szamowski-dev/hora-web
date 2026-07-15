import { defineField, defineType } from "sanity";

const authorHrefIsValid = (value: string | undefined) => {
  if (!value) return true;
  if (/^\/(?!\/)[^\s]*$/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? true
      : "Use a site-relative path or a complete http or https URL.";
  } catch {
    return "Use a site-relative path or a complete http or https URL.";
  }
};

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required().min(2).max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(20).max(500),
    }),
    defineField({
      name: "href",
      title: "Profile link",
      type: "string",
      description: "A site-relative path or complete external URL.",
      validation: (rule) => rule.required().max(500).custom(authorHrefIsValid),
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "portrait" },
  },
});
