import { defineField, defineType } from "sanity";

type SiteVideoValue = {
  autoplay?: boolean;
  muted?: boolean;
  webm?: { asset?: unknown };
};

export const siteVideo = defineType({
  name: "siteVideo",
  title: "Site video",
  type: "object",
  initialValue: {
    autoplay: true,
    loop: true,
    muted: true,
  },
  fields: [
    defineField({
      name: "webm",
      title: "WebM video",
      type: "file",
      options: { accept: "video/webm" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mp4",
      title: "MP4 fallback",
      type: "file",
      options: { accept: "video/mp4" },
    }),
    defineField({
      name: "poster",
      title: "Poster image",
      type: "siteImage",
      description:
        "Required for primary videos. Small muted loops may omit a poster.",
    }),
    defineField({
      name: "accessibilityLabel",
      title: "Accessibility label",
      type: "string",
      validation: (rule) => rule.required().min(10).max(300),
    }),
    defineField({
      name: "autoplay",
      title: "Autoplay",
      type: "boolean",
      initialValue: true,
      readOnly: true,
      hidden: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "loop",
      title: "Loop",
      type: "boolean",
      initialValue: true,
      readOnly: true,
      hidden: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "muted",
      title: "Muted",
      type: "boolean",
      initialValue: true,
      readOnly: true,
      hidden: true,
      validation: (rule) => rule.required(),
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      const video = value as SiteVideoValue | undefined;
      if (!video?.webm?.asset) return "Upload a WebM video.";
      if (video.autoplay && video.muted === false) {
        return "Autoplay video must be muted.";
      }
      return true;
    }),
  preview: {
    select: { title: "accessibilityLabel", media: "poster" },
    prepare({ title, media }) {
      return { title: title || "Site video", subtitle: "Product video", media };
    },
  },
});
