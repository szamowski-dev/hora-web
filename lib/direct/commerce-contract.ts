import type { PricingPageContent, PricingPlan } from "@/lib/pricing-model";

export const DIRECT_DOWNLOAD_HREF = "/download/direct/";
export const DIRECT_DOWNLOAD_LABEL = "Download";
export const DIRECT_TRIAL_PRICING_NOTE =
  "7-day free trial · $2.99/month, $29.99/year or $59.99 Lifetime";
export const DIRECT_CHECKOUT_PRICE_NOTE =
  "Choose a plan in the app. Final currency and applicable taxes are confirmed in checkout.";

export const DIRECT_PRICING_HERO = {
  title: "Choose how you want to pay.",
  description:
    "All plans unlock the same hora Calendar.\nTry it free for 7 days, then keep a subscription or pay once.",
} satisfies PricingPageContent["hero"];

export const DIRECT_PRICING_PLANS = [
  {
    name: "Monthly",
    price: "$2.99",
    suffix: "/month",
    priceDetail: "",
    billingLabel: "The smallest upfront commitment.",
    savingsLabel: "",
    featuredLabel: "BEST VALUE",
    description: "The smallest upfront commitment.",
    features: [
      "7-day free trial",
      "Billed monthly",
      "Cancel any time",
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
    billingLabel: "A lower price, renewed annually.",
    savingsLabel: "SAVE 16%",
    featuredLabel: "BEST VALUE",
    description: "A lower price, renewed annually.",
    features: [
      "7-day free trial",
      "Billed annually",
      "Cancel before renewal",
    ],
    ctaLabel: DIRECT_DOWNLOAD_LABEL,
    ctaHelper: "Start your 7-day free trial",
    featured: true,
  },
  {
    name: "Lifetime",
    price: "$59.99",
    suffix: "one-time",
    priceDetail: "",
    billingLabel: "Pay once. No recurring subscription.",
    savingsLabel: "PAY ONCE",
    featuredLabel: "",
    description: "Pay once. No recurring subscription.",
    features: [
      "7-day free trial",
      "One-time purchase",
      "Direct or Mac App Store",
    ],
    ctaLabel: DIRECT_DOWNLOAD_LABEL,
    ctaHelper: "Choose your plan in the app after the 7-day free trial.",
    featured: false,
    directOnly: false,
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
      "Yes. Lifetime is $59.99 as a one-time purchase, available with the Direct download and on the Mac App Store. It gives you permanent access to hora, including all current and future features and updates, with no recurring subscription. Lifetime unlocks hora in the edition where you buy it.",
  },
  {
    question: "Can I buy on the App Store?",
    answer: "Yes. hora is available on the Mac App Store with subscription plans and Lifetime. Apple handles billing, and Mac App Store purchases do not transfer to the Direct edition.",
  },
  {
    question: "Can I share my license with my family?",
    answer:
      "Family Sharing is available for eligible Mac App Store purchases, including Lifetime.",
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
      "You can cancel and get a full refund within 14 days of any Direct payment, including Lifetime, without giving a reason. Later requests are reviewed case by case. For Monthly and Annual, a refund and cancellation of automatic renewal are separate actions, so tell support which outcome you need. Lifetime does not renew. Mac App Store purchases, including Lifetime, are refunded by Apple under Apple's policy.",
  },
  {
    question: "What happens after my subscription expires?",
    answer:
      "When a subscription ends, choose Monthly, Annual, or Lifetime in the app to continue using Direct access. Lifetime is a one-time purchase and does not renew.",
  },
] satisfies PricingPageContent["faq"]["items"];
