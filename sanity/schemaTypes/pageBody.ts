import { defineArrayMember, defineType } from "sanity";

export const pageBody = defineType({
  name: "pageBody",
  title: "Page body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
      ],
      lists: [
        { title: "Bullet list", value: "bullet" },
        { title: "Numbered list", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Inline code", value: "code" },
        ],
        annotations: [
          defineArrayMember({ type: "externalLink" }),
          defineArrayMember({ type: "internalPathLink" }),
        ],
      },
    }),
  ],
  validation: (rule) => rule.required().min(1),
});
