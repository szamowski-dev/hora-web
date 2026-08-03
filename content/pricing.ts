import type { PricingPageContent } from "@/lib/pricing-model";

export const defaultPricingPage = {
  seo: {
    title: "Pricing",
    description:
      "Choose a hora Calendar plan, download it directly, or get it through the Mac App Store and Setapp.",
  },
  hero: {
    title: "Choose how you want to use hora.",
    description:
      "Use hora through the Mac App Store, Setapp, or the Direct edition for Annual and Lifetime access.",
  },
  plans: [
    {
      name: "Annual",
      price: "$29.99",
      suffix: "/year",
      description: "A 14-day free trial after checkout, then renews yearly.",
      featured: false,
    },
    {
      name: "Lifetime",
      price: "$49",
      suffix: " one time",
      description: "One payment for ongoing access to the Direct edition.",
      featured: true,
    },
  ],
  features: [
    "Native Mac app",
    "Direct Google Calendar integration",
    "The same pro access across supported hora editions",
  ],
  direct: {
    showDownload: false,
    downloadLabel: "Download Direct",
    showTerminalPrompt: false,
    terminalCommand: "brew install --cask hora",
    terminalRequirement: "Requires macOS 26 or newer.",
    copyLabel: "Copy",
    copiedLabel: "Copied",
  },
  distribution: {
    title: "Also available through",
    showMacAppStore: true,
    macAppStoreLabel: "Download on the Mac App Store",
    showSetapp: true,
    setappLabel: "Available on Setapp",
    setappHref: "https://setapp.com/",
  },
  faq: {
    title: "Questions before you choose?",
    description: "A few practical details about the available editions.",
    items: [
      {
        question: "Where can I get hora Calendar?",
        answer:
          "hora is available through the Mac App Store, Setapp, and as a Direct edition from this website when Direct downloads are enabled.",
      },
      {
        question: "What does the Direct Annual plan include?",
        answer:
          "The Annual plan starts with a 14-day trial after checkout and renews yearly while you keep the subscription active.",
      },
      {
        question: "What does the Direct Lifetime plan include?",
        answer:
          "The Lifetime plan is a one-time purchase for ongoing access to the Direct edition.",
      },
    ],
  },
  footer:
    "The Direct installer is notarized and updates through the Direct release channel. Checkout and license management are handled securely by RevenueCat and Paddle.",
} satisfies PricingPageContent;
