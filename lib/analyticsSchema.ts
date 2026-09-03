export const HORA_HERO_VIDEO_ID = "hora_hero_video";

export const ANALYTICS_EVENTS = {
  downloadClick: "download_click",
  directDownloadClick: "direct_download_clicked",
  brewCopyClick: "brew_copy_click",
} as const;

export const ANALYTICS_PLACEMENTS = {
  hero: "hero",
  nav: "nav",
  pricing: "pricing",
  about: "about",
  blog: "blog",
  blogPostAside: "blog_post_aside",
  blogPostRail: "blog_post_rail",
  blogPostBand: "blog_post_band",
  download: "download",
  betaCta: "beta_cta",
  stayInLoop: "stay_in_loop",
  testflightPrompt: "testflight_prompt",
} as const;

export type AnalyticsPlacement =
  (typeof ANALYTICS_PLACEMENTS)[keyof typeof ANALYTICS_PLACEMENTS];

export type BlogPostCtaPlacement =
  | typeof ANALYTICS_PLACEMENTS.blogPostAside
  | typeof ANALYTICS_PLACEMENTS.blogPostRail
  | typeof ANALYTICS_PLACEMENTS.blogPostBand;

export type NewsletterPlacement =
  | typeof ANALYTICS_PLACEMENTS.betaCta
  | typeof ANALYTICS_PLACEMENTS.stayInLoop
  | typeof ANALYTICS_PLACEMENTS.download
  | typeof ANALYTICS_PLACEMENTS.blog;
