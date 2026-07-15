import { defineArrayMember, defineField, defineType } from "sanity";

type BlogFaqItemValue = { anchorId?: string };

const faqAnswerBlock = defineArrayMember({
  type: "block",
  styles: [{ title: "Normal", value: "normal" }],
  lists: [],
  marks: {
    decorators: [
      { title: "Strong", value: "strong" },
      { title: "Emphasis", value: "em" },
      { title: "Inline code", value: "code" },
    ],
    annotations: [
      defineArrayMember({ type: "externalLink" }),
      defineArrayMember({ type: "internalPostLink" }),
      defineArrayMember({ type: "internalPathLink" }),
    ],
  },
});

const anchorValidation = (value: string | undefined) =>
  value && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
    ? true
    : "Use lowercase letters, numbers, and hyphens only.";

export const blogFaqItem = defineType({
  name: "blogFaqItem",
  title: "FAQ item",
  type: "object",
  fields: [
    defineField({
      name: "anchorId",
      title: "Anchor ID",
      type: "string",
      description: "Stable ID used for analytics and deep links.",
      validation: (rule) =>
        rule.required().min(3).max(120).custom(anchorValidation),
    }),
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .min(5)
          .max(240)
          .custom((value) =>
            value && value.trim() === value
              ? true
              : "Remove whitespace from the beginning or end.",
          ),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "array",
      of: [faqAnswerBlock],
      validation: (rule) => rule.required().min(1).max(6),
    }),
  ],
  preview: {
    select: { title: "question", subtitle: "anchorId" },
  },
});

export const blogFaq = defineType({
  name: "blogFaq",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({
      name: "anchorId",
      title: "Section anchor ID",
      type: "string",
      initialValue: "faq",
      validation: (rule) =>
        rule.required().min(2).max(120).custom(anchorValidation),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Frequently asked questions",
      validation: (rule) => rule.required().min(3).max(160),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      of: [defineArrayMember({ type: "blogFaqItem" })],
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .max(20)
          .custom((value) => {
            const items = value as BlogFaqItemValue[] | undefined;
            if (!items) return true;
            const ids = items.map((item) => item?.anchorId).filter(Boolean);
            return new Set(ids).size === ids.length
              ? true
              : "Every FAQ item needs a unique anchor ID.";
          }),
    }),
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare({ title, items }) {
      return {
        title: title || "FAQ",
        subtitle: `${Array.isArray(items) ? items.length : 0} questions`,
      };
    },
  },
});
