export const HORA_HERO_VIDEO_ID = "hora_hero_video";

export const ANALYTICS_PLACEMENTS = {
  hero: "hero",
  nav: "nav",
  pricing: "pricing",
  about: "about",
  blog: "blog",
  download: "download",
  betaCta: "beta_cta",
  stayInLoop: "stay_in_loop",
  testflightPrompt: "testflight_prompt",
} as const;

export type NewsletterPlacement =
  | typeof ANALYTICS_PLACEMENTS.betaCta
  | typeof ANALYTICS_PLACEMENTS.stayInLoop
  | typeof ANALYTICS_PLACEMENTS.download
  | typeof ANALYTICS_PLACEMENTS.blog;
