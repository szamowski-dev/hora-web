import type { PricingPageContent, PricingPlan } from "@/lib/pricing-model";

export const DIRECT_DOWNLOAD_HREF = "/download/direct/";
export const DIRECT_DOWNLOAD_LABEL = "Download";
export const DIRECT_DOWNLOAD_HELPER = "Choose a plan in the app.";
export const DIRECT_CHECKOUT_PRICE_NOTE =
  "Choose a plan in the app. Final currency and applicable taxes are confirmed in checkout.";

export const DIRECT_PRICING_HERO = {
  title: "Choose your Direct plan",
  description:
    "Try hora free for 7 days without a payment card. Choose Monthly or Annual in the app when you are ready.",
} satisfies PricingPageContent["hero"];

export const DIRECT_PRICING_PLANS = [
  {
    name: "Monthly",
    price: "USD 2.99",
    suffix: "/month",
    description: "A flexible subscription renewed monthly.",
    features: [
      "7-day cardless trial in the app",
      "Native Mac app",
      "Cancel any time",
    ],
    ctaLabel: DIRECT_DOWNLOAD_LABEL,
    featured: false,
  },
  {
    name: "Annual",
    price: "USD 29.99",
    suffix: "/year",
    description: "The best value, renewed yearly.",
    features: [
      "7-day cardless trial in the app",
      "Native Mac app",
      "Cancel any time",
    ],
    ctaLabel: DIRECT_DOWNLOAD_LABEL,
    featured: true,
  },
] satisfies PricingPlan[];

export const DIRECT_PRICING_FAQ_ITEMS = [
  {
    question: "Can I try the app for free?",
    answer:
      "Yes. hora includes a 7-day cardless trial in the native app before you choose a Direct plan.",
  },
  {
    question: "Is there a one-time purchase option?",
    answer:
      "No new Lifetime plan is available. Direct currently offers Monthly and Annual subscriptions.",
  },
  {
    question: "Can I buy on the App Store?",
    answer: "Yes. hora is also available on the Mac App Store.",
  },
  {
    question: "Can I share my license with my family?",
    answer:
      "Family Sharing is available for eligible purchases through the Mac App Store.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel renewal before the next billing date. Your access continues until the end of the current billing period.",
  },
  {
    question: "Do you send a reminder email before renewing?",
    answer:
      "Renewal reminders and purchase communication are handled through the checkout flow for your edition.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "Direct refund requests are reviewed case by case. A refund and cancellation of automatic renewal are separate actions, so tell support which outcome you need.",
  },
  {
    question: "What happens after my subscription expires?",
    answer:
      "When a subscription ends, choose Monthly or Annual in the app to continue using Direct access.",
  },
] satisfies PricingPageContent["faq"]["items"];
