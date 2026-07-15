import { defineArrayMember, defineField, defineType } from "sanity";

type CodeBlockParent = { code?: string };

export const codeBlock = defineType({
  name: "codeBlock",
  title: "Code block",
  type: "object",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        layout: "dropdown",
        list: [
          { title: "Swift", value: "swift" },
          { title: "JSON", value: "json" },
          { title: "Plain text", value: "text" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "code",
      title: "Code",
      type: "text",
      rows: 16,
      validation: (rule) => rule.required().max(50_000),
    }),
    defineField({
      name: "filename",
      title: "Filename",
      type: "string",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "highlightLines",
      title: "Highlighted lines",
      type: "array",
      of: [
        defineArrayMember({
          type: "number",
          validation: (rule) => rule.integer().positive(),
        }),
      ],
      validation: (rule) =>
        rule.unique().custom((value, context) => {
          const highlightedLines = value as number[] | undefined;
          if (!highlightedLines?.length) return true;
          const parent = context.parent as CodeBlockParent | undefined;
          const lineCount = parent?.code?.split("\n").length ?? 0;
          return highlightedLines.every((line) => line <= lineCount)
            ? true
            : `Highlighted lines cannot exceed line ${lineCount}.`;
        }),
    }),
  ],
  preview: {
    select: { title: "filename", language: "language", code: "code" },
    prepare({ title, language, code }) {
      const firstLine = typeof code === "string" ? code.split("\n")[0] : "";
      return {
        title: title || firstLine || "Code block",
        subtitle: language || "Plain text",
      };
    },
  },
});
