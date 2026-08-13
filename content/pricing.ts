import type { PricingPageContent } from "@/lib/pricing-model";
import { site } from "@/content/site";
import {
  DIRECT_DOWNLOAD_LABEL,
  DIRECT_PRICING_FAQ_ITEMS,
  DIRECT_PRICING_HERO,
  DIRECT_PRICING_PLANS,
} from "@/lib/direct/commerce-contract";

export const defaultPricingPage = {
  seo: {
    title: "Pricing",
    description:
      "Choose a hora Calendar plan, download it directly, or get it through the Mac App Store and Setapp.",
  },
  hero: DIRECT_PRICING_HERO,
  plans: DIRECT_PRICING_PLANS,
  direct: {
    showDownload: true,
    downloadLabel: DIRECT_DOWNLOAD_LABEL,
    showTerminalPrompt: false,
    terminalCommand: "brew install --cask hora",
    terminalRequirement: "Requires macOS 26 or newer.",
    copyLabel: "Copy",
    copiedLabel: "Copied",
  },
  distribution: {
    title: "Other ways to get hora",
    description:
      "Prefer Apple’s purchase flow or already have Setapp? Both options are available for the Mac app.",
    showMacAppStore: true,
    macAppStoreTitle: "Mac App Store",
    macAppStoreDescription:
      "Purchase through Apple and use Family Sharing across eligible family members.",
    macAppStoreLabel: "Download on the Mac App Store",
    macAppStoreBadge: {
      src: site.macAppStoreBadgeSrc,
      alt: "Download on the Mac App Store",
      width: 162,
      height: 50,
    },
    showSetapp: true,
    setappTitle: "Setapp",
    setappDescription:
      "hora is included with your Setapp subscription on Mac. No separate purchase is needed.",
    setappLabel: "Available on Setapp",
    setappHref: "https://setapp.com/",
  },
  faq: {
    title: "Frequently asked questions",
    items: DIRECT_PRICING_FAQ_ITEMS,
  },
  footer:
    "The Direct installer is notarized and updates through the Direct release channel. Checkout and license management are handled securely by RevenueCat and Paddle.",
} satisfies PricingPageContent;
