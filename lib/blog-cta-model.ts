export type BlogCtaSlot = {
  enabled: boolean;
  heading: string;
  body: string;
  /** Overrides the shared `ctaLabel` for this banner only. */
  ctaLabel?: string;
};

export type BlogCtaContent = {
  eyebrow: string;
  ctaLabel: string;
  macAppStoreLabel: string;
  trialNote: string;
  requirement: string;
  showHomebrew: boolean;
  homebrewCommand: string;
  copyLabel: string;
  copiedLabel: string;
  /** Beside the post title and excerpt. */
  aside: BlogCtaSlot;
  /** Sticky rail outside the article column. Wide viewports only. */
  rail: BlogCtaSlot;
  /** Full-width band above the Topics footer. */
  band: BlogCtaSlot;
};
