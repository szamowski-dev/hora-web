import type { PricingPageContent } from "@/lib/pricing-model";

export const defaultPricingPage = {
  seo: {
    title: "Pricing",
    description:
      "Choose a hora Calendar plan, download it directly, or get it through the Mac App Store and Setapp.",
  },
  hero: {
    title: "Choose your Direct plan",
    description:
      "Try hora free for 14 days in the native app. Choose how you would like to continue once the trial ends.",
  },
  plans: [
    {
      name: "Annual",
      price: "$29.99",
      suffix: "/year",
      description: "A lower upfront price, renewed yearly. No web trial.",
      features: ["Native Mac app", "Google Calendar, built in", "Cancel any time"],
      ctaLabel: "Choose Annual",
      featured: false,
    },
    {
      name: "Lifetime",
      price: "$49",
      suffix: "",
      description: "One payment for ongoing Direct access.",
      features: ["Native Mac app", "Google Calendar, built in", "No renewal"],
      ctaLabel: "Choose Lifetime",
      featured: true,
    },
  ],
  direct: {
    showDownload: false,
    downloadLabel: "Download",
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
    showSetapp: true,
    setappTitle: "Setapp",
    setappDescription:
      "hora is included with your Setapp subscription on Mac. No separate purchase is needed.",
    setappLabel: "Available on Setapp",
    setappHref: "https://setapp.com/",
  },
  faq: {
    title: "Frequently asked questions",
    description: "",
    items: [
      {
        question: "Can I try the app for free?",
        answer:
          "Yes. hora includes a 14-day trial in the native app before you choose a Direct plan.",
      },
      {
        question: "Is there a one-time purchase option?",
        answer:
          "Yes. The Lifetime plan is a one-time purchase for ongoing Direct access.",
      },
      {
        question: "Can I buy on the App Store?",
        answer:
          "Yes. hora is also available on the Mac App Store.",
      },
      {
        question: "Can I share my license with my family?",
        answer:
          "Family Sharing is available for eligible purchases through the Mac App Store.",
      },
      {
        question: "How do I cancel my subscription?",
        answer:
          "You can cancel an Annual plan before its renewal date. Your access continues until the end of the current billing period.",
      },
      {
        question: "Do you send a reminder email before renewing?",
        answer:
          "Renewal reminders and purchase communication are handled through the checkout and account flow for your edition.",
      },
      {
        question: "What is your refund policy?",
        answer:
          "Refund eligibility depends on the store or purchase flow used. Contact support with your order details if you need help.",
      },
      {
        question: "What happens after my subscription expires?",
        answer:
          "When an Annual plan ends, you can renew it or choose another available edition to continue using Direct access.",
      },
    ],
  },
  footer:
    "The Direct installer is notarized and updates through the Direct release channel. Checkout and license management are handled securely by RevenueCat and Paddle.",
} satisfies PricingPageContent;
