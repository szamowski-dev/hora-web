import type { PricingPageContent, PricingPlan } from "@/lib/pricing-model";

export const DIRECT_DOWNLOAD_HREF = "/download/direct/";
export const DIRECT_DOWNLOAD_LABEL = "Download";
export const DIRECT_DOWNLOAD_HELPER = "Choose a plan in the app.";
export const DIRECT_CHECKOUT_PRICE_NOTE =
  "Choose a plan in the app. Final currency and applicable taxes are confirmed in checkout.";

export const DIRECT_PRICING_HERO = {
  title: "Simple pricing. Everything included.",
  description:
    "Try hora Calendar free for 7 days. Choose monthly or annual billing after installing the app.",
} satisfies PricingPageContent["hero"];

export const DIRECT_PRICING_PLANS = [
  {
    name: "Monthly",
    price: "$2.99",
    suffix: "/month",
    priceDetail: "",
    billingLabel: "Billed monthly",
    savingsLabel: "",
    featuredLabel: "BEST VALUE",
    description: "Billed monthly",
    features: [
      "7-day free trial",
      "Cancel anytime",
    ],
    ctaLabel: DIRECT_DOWNLOAD_LABEL,
    ctaHelper: "Start your 7-day free trial",
    featured: false,
  },
  {
    name: "Annual",
    price: "$29.99",
    suffix: "/year",
    priceDetail: "$2.50/month",
    billingLabel: "Billed annually",
    savingsLabel: "SAVE 16%",
    featuredLabel: "BEST VALUE",
    description: "Billed annually",
    features: [
      "7-day free trial",
      "Cancel renewal anytime",
    ],
    ctaLabel: DIRECT_DOWNLOAD_LABEL,
    ctaHelper: "Start your 7-day free trial",
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
