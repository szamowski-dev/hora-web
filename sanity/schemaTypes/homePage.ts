import { defineArrayMember, defineField, defineType } from "sanity";

const trimmed = (value: string | undefined) =>
  !value || value.trim() === value
    ? true
    : "Remove whitespace from the beginning or end.";

const textField = (name: string, title: string, rows?: number) =>
  defineField({
    name,
    title,
    type: rows ? "text" : "string",
    ...(rows ? { rows } : {}),
    validation: (rule) => rule.min(2).max(rows ? 1500 : 180).custom(trimmed),
  });

const productLandingFeature = (name: string) =>
  defineArrayMember({
    type: "object",
    name,
    fields: [
      defineField({
        name: "icon",
        title: "Icon",
        type: "string",
        options: {
          list: [
            "label", "event", "video-call", "contacts", "accounts", "search",
            "invitation", "menu-bar", "timer", "auto-awesome", "tasks",
            "focus-time", "availability", "widgets", "offline", "sync", "key",
            "storage", "speed", "notifications", "dock", "keyboard", "windows",
            "dark-mode", "apple-silicon", "view", "drag", "quick-add", "time-zone",
            "repeat", "location", "out-of-office",
          ].map((value) => ({ title: value, value })),
        },
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "tone",
        title: "Tone",
        type: "string",
        options: { list: ["red", "blue", "green", "yellow", "purple", "cyan"] },
        validation: (rule) => rule.required(),
      }),
      textField("title", "Title"),
      textField("description", "Description", 3),
    ],
    preview: { select: { title: "title", subtitle: "description" } },
  });

const themedImageFields = [
  defineField({ name: "light", title: "Light appearance", type: "siteImage" }),
  defineField({ name: "dark", title: "Dark appearance", type: "siteImage" }),
];

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({ name: "seo", title: "SEO", type: "pageSeo", validation: (rule) => rule.required() }),
    defineField({
      name: "productLanding",
      title: "Product landing page",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "hero",
          title: "Opening",
          type: "object",
          fields: [
            textField("title", "Headline"),
            textField("description", "Description", 3),
            textField("primaryCtaLabel", "Primary action"),
            textField("macAppStoreLabel", "Mac App Store badge label"),
            textField("trialNote", "Trial and pricing note"),
            textField("watchVideoLabel", "Video action"),
            defineField({
              name: "watchVideoUrl",
              title: "YouTube video URL",
              description: "The video opened by the Watch video button.",
              type: "url",
              validation: (rule) =>
                rule
                  .required()
                  .uri({ scheme: ["https"] })
                  .custom((value) => {
                    if (!value) return true;
                    try {
                      const url = new URL(value);
                      const hostname = url.hostname.toLowerCase();
                      const pathSegments = url.pathname.split("/").filter(Boolean);
                      const isYouTube =
                        hostname === "youtu.be" ||
                        hostname === "youtube.com" ||
                        hostname.endsWith(".youtube.com");
                      const videoId =
                        hostname === "youtu.be"
                          ? pathSegments[0]
                          : url.searchParams.get("v") ??
                            (["embed", "shorts", "live"].includes(pathSegments[0] ?? "")
                              ? pathSegments[1]
                              : undefined);

                      return isYouTube && videoId
                        ? true
                        : "Use a YouTube or youtu.be video URL.";
                    } catch {
                      return "Enter a valid YouTube URL.";
                    }
                  }),
            }),
            defineField({ name: "showPrimaryCta", title: "Show Download button", type: "boolean", initialValue: false }),
            defineField({ name: "showTerminalPrompt", title: "Show terminal prompt", type: "boolean", initialValue: false }),
            textField("homebrewCommand", "Homebrew command"),
            textField("directDownloadNote", "Direct download note", 2),
            textField("requirement", "System requirement"),
            textField("copyLabel", "Terminal copy button"),
            textField("copiedLabel", "Terminal copied state"),
          ],
        }),
        defineField({
          name: "media",
          title: "Product imagery",
          type: "object",
          fields: [
            defineField({ name: "hero", title: "Hero screenshot", type: "object", fields: themedImageFields }),
            defineField({ name: "workflow", title: "Event workflow screenshot", type: "object", fields: themedImageFields }),
            defineField({
              name: "googleCalendarCards",
              title: "Google Calendar feature screenshots",
              type: "array",
              description: "Keep four items in this order: color labels, event types, Meet and Contacts, multiple accounts.",
              of: [defineArrayMember({ type: "object", name: "productLandingThemedCardImage", fields: themedImageFields })],
              validation: (rule) => rule.length(4),
            }),
          ],
        }),
        defineField({
          name: "api",
          title: "Google Calendar API",
          type: "object",
          fields: [textField("title", "Title"), textField("description", "Description", 3)],
        }),
        defineField({
          name: "googleCalendar",
          title: "Google Calendar features",
          type: "object",
          fields: [
            textField("title", "Title"),
            textField("description", "Description", 3),
            defineField({ name: "primaryFeatures", title: "Primary features", type: "array", of: [productLandingFeature("productLandingGooglePrimaryFeature")], validation: (rule) => rule.length(3) }),
            defineField({ name: "secondaryFeatures", title: "Supporting features", type: "array", of: [productLandingFeature("productLandingGoogleSecondaryFeature")], validation: (rule) => rule.min(1).max(8) }),
          ],
        }),
        defineField({
          name: "hora",
          title: "hora-specific features",
          type: "object",
          fields: [
            textField("title", "Title"),
            textField("description", "Description", 3),
            defineField({ name: "features", title: "Features", type: "array", of: [productLandingFeature("productLandingHoraFeature")], validation: (rule) => rule.min(1).max(12) }),
          ],
        }),
        defineField({
          name: "privacy",
          title: "Privacy",
          type: "object",
          fields: [textField("title", "Title"), textField("description", "Description", 3)],
        }),
        defineField({
          name: "macos",
          title: "macOS integration",
          type: "object",
          fields: [
            textField("title", "Title"),
            textField("description", "Description", 3),
            defineField({ name: "features", title: "macOS features", type: "array", of: [productLandingFeature("productLandingMacosFeature")], validation: (rule) => rule.min(1).max(16) }),
          ],
        }),
        defineField({
          name: "featureGrid",
          title: "Supporting features",
          type: "object",
          fields: [
            defineField({ name: "features", title: "Features", type: "array", of: [productLandingFeature("productLandingGridFeature")], validation: (rule) => rule.min(1).max(20) }),
          ],
        }),
        defineField({
          name: "newsletter",
          title: "Mailing list",
          type: "object",
          fields: [textField("title", "Title"), textField("description", "Description", 3), textField("placeholder", "Email placeholder"), textField("buttonLabel", "Submit button")],
        }),
      ],
    }),
    defineField({
      name: "featuredOn",
      title: "Featured on",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        textField("label", "Section heading"),
        defineField({
          name: "badges",
          title: "Badges",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "featuredBadge",
              validation: (rule) =>
                rule.custom((badge) =>
                  badge?.src ||
                    (typeof badge?.image === "object" &&
                      badge.image !== null &&
                      "asset" in badge.image &&
                      Boolean(badge.image.asset))
                    ? true
                    : "Add either a hosted badge URL or an uploaded badge image.",
                ),
              fields: [
                textField("name", "Name"),
                defineField({ name: "href", title: "Destination URL", type: "url", validation: (rule) => rule.required().uri({ scheme: ["https"] }) }),
                defineField({ name: "src", title: "Hosted badge URL", description: "Use for a remotely hosted dynamic badge. An uploaded image below takes precedence.", type: "url", validation: (rule) => rule.uri({ scheme: ["https"] }) }),
                defineField({ name: "image", title: "Uploaded badge image", type: "optionalSiteImage" }),
                textField("alt", "Alternative text"),
                defineField({ name: "width", title: "Native width", type: "number", validation: (rule) => rule.required().integer().min(1) }),
                defineField({ name: "height", title: "Native height", type: "number", validation: (rule) => rule.required().integer().min(1) }),
                defineField({ name: "displayWidth", title: "Display width override", type: "number", validation: (rule) => rule.integer().min(1) }),
                defineField({ name: "displayHeight", title: "Display height override", type: "number", validation: (rule) => rule.integer().min(1) }),
                defineField({ name: "variant", title: "Style", type: "string", options: { list: ["standard", "productHunt"] }, validation: (rule) => rule.required() }),
              ],
              preview: { select: { title: "name", subtitle: "href", media: "image" } },
            }),
          ],
          validation: (rule) => rule.required().min(1).max(10),
        }),
      ],
    }),
  ],
  validation: (rule) =>
    rule.custom((_document, context) =>
      context.document?._id?.replace(/^drafts\./, "") === "homePage"
        ? true
        : "Homepage content must use the fixed document ID homePage.",
    ),
  preview: { prepare: () => ({ title: "Homepage" }) },
});
