import { defineField, defineType } from "sanity";

type BlogVideoValue = {
  autoplay?: boolean;
  muted?: boolean;
  webm?: { asset?: unknown };
  webmUrl?: string;
};

export const blogVideo = defineType({
  name: "blogVideo",
  title: "Blog video",
  type: "object",
  fields: [
    defineField({
      name: "webm",
      title: "WebM video",
      type: "file",
      options: { accept: "video/webm" },
      description: "Legacy Sanity-hosted source. Prefer the R2 URL below for new uploads.",
    }),
    defineField({
      name: "webmUrl",
      title: "WebM URL (R2)",
      type: "url",
      description: "Public URL from assets.horacal.app.",
    }),
    defineField({
      name: "mp4",
      title: "MP4 fallback",
      type: "file",
      options: { accept: "video/mp4" },
      description: "Legacy Sanity-hosted fallback. Prefer the R2 URL below for new uploads.",
    }),
    defineField({
      name: "mp4Url",
      title: "MP4 fallback URL (R2)",
      type: "url",
      description: "Public URL from assets.horacal.app.",
    }),
    defineField({
      name: "poster",
      title: "Poster image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "accessibilityLabel",
      title: "Accessibility label",
      type: "string",
      description:
        "Describe information that the adjacent article text does not already provide.",
      validation: (rule) =>
        rule
          .max(300)
          .warning("Add a label unless the muted loop is purely decorative."),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "autoplay",
      title: "Autoplay",
      type: "boolean",
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "loop",
      title: "Loop",
      type: "boolean",
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "muted",
      title: "Muted",
      type: "boolean",
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "presentation",
      title: "Presentation",
      type: "string",
      initialValue: "glow",
      options: {
        layout: "radio",
        list: [
          { title: "Wide", value: "wide" },
          { title: "Wide with glow", value: "glow" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      const video = value as BlogVideoValue | undefined;
      if (!video?.webm?.asset && !video?.webmUrl) {
        return "Upload a WebM video or provide its R2 URL.";
      }
      if (video.autoplay && video.muted === false) {
        return "Autoplay video must be muted.";
      }
      return true;
    }),
  preview: {
    select: {
      title: "caption",
      accessibilityLabel: "accessibilityLabel",
      media: "poster",
    },
    prepare({ title, accessibilityLabel, media }) {
      return {
        title: title || accessibilityLabel || "Blog video",
        subtitle: "Muted product video",
        media,
      };
    },
  },
});
