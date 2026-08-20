import { createReadStream } from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";
import { defaultProductLanding } from "../content/home-landing";
import { defaultPricingPage } from "../content/pricing";
import { apiVersion, dataset, projectId } from "../sanity/env";

type Asset = { _id: string };
type SiteImageValue = {
  _type: "siteImage";
  alt: string;
  asset: { _type: "reference"; _ref: string };
};

const client = getCliClient({ apiVersion }).withConfig({
  projectId,
  dataset,
  useCdn: false,
});

function key(value: string, index: number) {
  return `${value}-${index + 1}`;
}

async function uploadImage(
  source: string,
  alt: string,
): Promise<SiteImageValue> {
  const filePath = path.join(process.cwd(), "public", source.replace(/^\//, ""));
  const asset = (await client.assets.upload("image", createReadStream(filePath), {
    filename: path.basename(filePath),
  })) as Asset;

  return {
    _type: "siteImage",
    alt,
    asset: { _type: "reference", _ref: asset._id },
  };
}

async function uploadThemedImage(image: {
  light: { src: string; alt: string };
  dark: { src: string; alt: string };
}) {
  return {
    light: await uploadImage(image.light.src, image.light.alt),
    dark: await uploadImage(image.dark.src, image.dark.alt),
  };
}

function features(
  items: Array<{ icon: string; tone: string; title: string; description: string }>,
  prefix: string,
) {
  return items.map((item, index) => ({ _key: key(prefix, index), ...item }));
}

async function productLanding() {
  const landing = defaultProductLanding;
  return {
    hero: landing.hero,
    media: {
      hero: await uploadThemedImage(landing.media.hero),
      workflow: await uploadThemedImage(landing.media.workflow),
      googleCalendarCards: await Promise.all(
        landing.media.googleCalendarCards.map(uploadThemedImage),
      ),
    },
    api: landing.api,
    googleCalendar: {
      title: landing.googleCalendar.title,
      description: landing.googleCalendar.description,
      primaryFeatures: features(
        landing.googleCalendar.primaryFeatures,
        "google-primary",
      ),
      secondaryFeatures: features(
        landing.googleCalendar.secondaryFeatures,
        "google-secondary",
      ),
    },
    hora: {
      title: landing.hora.title,
      description: landing.hora.description,
      features: features(landing.hora.features, "hora"),
    },
    privacy: landing.privacy,
    macos: {
      title: landing.macos.title,
      description: landing.macos.description,
      features: features(landing.macos.features, "macos"),
    },
    featureGrid: {
      features: features(landing.featureGrid.features, "supporting"),
    },
    newsletter: landing.newsletter,
  };
}

async function pricingPage() {
  const pricing = defaultPricingPage;
  const macAppStoreBadge = await uploadImage(
    pricing.distribution.macAppStoreBadge.src,
    pricing.distribution.macAppStoreBadge.alt,
  );

  return {
    _id: "pricingPage",
    _type: "pricingPage",
    seo: pricing.seo,
    hero: pricing.hero,
    plans: pricing.plans.map((plan, index) => ({
      _key: key("plan", index),
      ...plan,
    })),
    includedNote: pricing.includedNote,
    accountNote: pricing.accountNote,
    currencyNote: pricing.currencyNote,
    direct: pricing.direct,
    distribution: {
      ...pricing.distribution,
      macAppStoreBadge,
    },
    faq: {
      title: pricing.faq.title,
      items: pricing.faq.items.map((item, index) => ({
        _key: key("faq", index),
        ...item,
      })),
    },
    footer: pricing.footer,
  };
}

async function main() {
  const landing = await productLanding();
  await client
    .patch("homePage")
    .set({ productLanding: landing })
    .unset([
      "hero",
      "showcase",
      "featureOverview",
      "integrations",
      "socialProof",
      "roadmap",
      "faq",
    ])
    .commit();

  await client.createOrReplace(await pricingPage());
  console.log("Synced Home and Pricing content plus product assets to Sanity.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
