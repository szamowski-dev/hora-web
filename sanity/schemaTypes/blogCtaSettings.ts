import { defineField, defineType } from "sanity";

const trimmed = (value: string | undefined) =>
  !value || value.trim() === value
    ? true
    : "Remove whitespace from the beginning or end.";

/**
 * Text copied out of the live preview carries Sanity's stega markers: runs of
 * zero-width characters that are invisible in the input but count towards the
 * length limit, so a 40-character line fails as "at most 180 characters" with
 * no hint why. Name the real problem instead.
 */
const invisibleCharacters = /[\u200B-\u200D\uFEFF]/;

const noHiddenCharacters = (value: string | undefined) =>
  !value || !invisibleCharacters.test(value)
    ? true
    : "This text carries invisible visual-editing characters, which happens when it is pasted from the live preview. Retype it by hand instead of pasting.";

const singletonId = (id: string | undefined) => id?.replace(/^drafts\./, "");

const textField = (name: string, title: string, rows?: number) =>
  defineField({
    name,
    title,
    type: rows ? "text" : "string",
    ...(rows ? { rows } : {}),
    validation: (rule) =>
      rule
        .max(rows ? 1500 : 180)
        .custom(trimmed)
        .custom(noHiddenCharacters),
  });

const slotField = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    type: "object",
    description,
    fields: [
      defineField({
        name: "enabled",
        title: "Show this banner",
        type: "boolean",
        initialValue: true,
      }),
      textField("heading", "Heading"),
      textField("body", "Supporting line", 3),
      defineField({
        name: "ctaLabel",
        title: "Button label for this banner",
        type: "string",
        description:
          "Leave empty to use the shared button label above.",
        validation: (rule) =>
          rule.max(180).custom(trimmed).custom(noHiddenCharacters),
      }),
    ],
  });

export const blogCtaSettings = defineType({
  name: "blogCtaSettings",
  title: "Blog download banners",
  type: "document",
  description:
    "Copy for the download banners on blog post pages. The Direct Download button and the Homebrew prompt still follow the Direct edition visibility switches on the Pricing document.",
  fields: [
    textField("eyebrow", "Eyebrow"),
    textField("ctaLabel", "Button label"),
    textField("macAppStoreLabel", "Mac App Store button label"),
    textField("trialNote", "Trial note"),
    textField("requirement", "System requirement note (banner above Topics)"),
    defineField({
      name: "showHomebrew",
      title: "Show the Homebrew prompt",
      type: "boolean",
      description:
        "Applies to the banner above Topics only. The title banner and the narrow sticky banner stay a single clear ask.",
      initialValue: true,
    }),
    textField("homebrewCommand", "Homebrew command"),
    textField("copyLabel", "Copy button label"),
    textField("copiedLabel", "Copied state label"),
    slotField(
      "aside",
      "Beside the title",
      "Sits to the right of the post title and excerpt. Moves below the byline on narrow screens.",
    ),
    slotField(
      "rail",
      "Sticky rail",
      "Narrow vertical banner hanging outside the article column. Appears only when the viewport has room for it, from 1400px up.",
    ),
    slotField(
      "band",
      "Above Topics",
      "Full-width banner between the article body and the Topics list.",
    ),
  ],
  validation: (rule) =>
    rule.custom((_document, context) =>
      singletonId(context.document?._id) === "blogCtaSettings"
        ? true
        : "Blog download banners must use the fixed document ID blogCtaSettings.",
    ),
  preview: { prepare: () => ({ title: "Blog download banners" }) },
});
