import { defineArrayMember, defineField, defineType } from "sanity";

type BlogTableRowValue = {
  header?: boolean;
  cells?: unknown[];
};

const tableCellBlock = defineArrayMember({
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

export const blogTableCell = defineType({
  name: "blogTableCell",
  title: "Table cell",
  type: "object",
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [tableCellBlock],
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .max(1)
          .error("A table cell must contain exactly one text block."),
    }),
  ],
  preview: {
    select: { content: "content" },
    prepare({ content }) {
      const text = Array.isArray(content)
        ? content
            .flatMap((block) =>
              Array.isArray(block?.children)
                ? block.children.map((child: { text?: string }) => child.text)
                : [],
            )
            .filter(Boolean)
            .join("")
        : "";
      return { title: text || "Empty table cell" };
    },
  },
});

export const blogTableRow = defineType({
  name: "blogTableRow",
  title: "Table row",
  type: "object",
  fields: [
    defineField({
      name: "header",
      title: "Header row",
      type: "boolean",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cells",
      title: "Cells",
      type: "array",
      of: [defineArrayMember({ type: "blogTableCell" })],
      validation: (rule) => rule.required().min(1).max(8),
    }),
  ],
  preview: {
    select: { header: "header", cells: "cells" },
    prepare({ header, cells }) {
      return {
        title: header ? "Header row" : "Table row",
        subtitle: `${Array.isArray(cells) ? cells.length : 0} cells`,
      };
    },
  },
});

export const blogTable = defineType({
  name: "blogTable",
  title: "Comparison table",
  type: "object",
  fields: [
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [defineArrayMember({ type: "blogTableRow" })],
      validation: (rule) =>
        rule
          .required()
          .min(2)
          .max(100)
          .custom((value) => {
            const rows = value as BlogTableRowValue[] | undefined;
            if (!rows?.length) return true;
            if (!rows[0]?.header) return "The first row must be a header row.";
            if (rows.slice(1).some((row) => row?.header)) {
              return "Only the first row can be a header row.";
            }

            const columnCount = rows[0]?.cells?.length ?? 0;
            if (columnCount === 0) return "The header row must contain cells.";

            const mismatchedRow = rows.findIndex(
              (row) => (row?.cells?.length ?? 0) !== columnCount,
            );
            return mismatchedRow === -1
              ? true
              : `Row ${mismatchedRow + 1} must contain ${columnCount} cells.`;
          }),
    }),
  ],
  preview: {
    select: { title: "caption", rows: "rows" },
    prepare({ title, rows }) {
      return {
        title: title || "Comparison table",
        subtitle: `${Array.isArray(rows) ? rows.length : 0} rows`,
      };
    },
  },
});
