import type { SanityImageCrop, SanityImageHotspot } from "@sanity/image-url";
import { defineQuery } from "next-sanity";
import type { SanityImageAsset } from "@/sanity/lib/queries";

export type SanitySiteImageValue = {
  alt?: string;
  crop?: SanityImageCrop;
  hotspot?: SanityImageHotspot;
  asset?: SanityImageAsset;
};

export type SanityProductLandingFeatureValue = {
  _key?: string;
  icon?: string;
  tone?: string;
  title?: string;
  description?: string;
};

export type SanityThemedProductImageValue = {
  light?: SanitySiteImageValue;
  dark?: SanitySiteImageValue;
};

export type SanityHomePageDocument = {
  _id?: string;
  _updatedAt?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: SanitySiteImageValue;
    noIndex?: boolean;
  };
  featuredOn?: {
    label?: string;
    badges?: Array<{
      _key?: string;
      name?: string;
      href?: string;
      src?: string;
      image?: SanitySiteImageValue | null;
      alt?: string;
      width?: number;
      height?: number;
      displayWidth?: number | null;
      displayHeight?: number | null;
      variant?: string;
    }>;
  };
  productLanding?: {
    hero?: {
      title?: string;
      description?: string;
      primaryCtaLabel?: string;
      macAppStoreLabel?: string;
      watchVideoLabel?: string;
      watchVideoUrl?: string;
      showPrimaryCta?: boolean;
      showTerminalPrompt?: boolean;
      homebrewCommand?: string;
      requirement?: string;
      copyLabel?: string;
      copiedLabel?: string;
    };
    media?: {
      hero?: SanityThemedProductImageValue;
      workflow?: SanityThemedProductImageValue;
      googleCalendarCards?: SanityThemedProductImageValue[];
    };
    api?: { title?: string; description?: string };
    googleCalendar?: {
      title?: string;
      description?: string;
      primaryFeatures?: SanityProductLandingFeatureValue[];
      secondaryFeatures?: SanityProductLandingFeatureValue[];
    };
    hora?: {
      title?: string;
      description?: string;
      features?: SanityProductLandingFeatureValue[];
    };
    privacy?: { title?: string; description?: string };
    macos?: {
      title?: string;
      description?: string;
      features?: SanityProductLandingFeatureValue[];
    };
    featureGrid?: { features?: SanityProductLandingFeatureValue[] };
    newsletter?: {
      title?: string;
      description?: string;
      placeholder?: string;
      buttonLabel?: string;
    };
  };
};

export const siteImageProjection = `{
  alt,
  crop,
  hotspot,
  "asset": asset->{
    _id,
    url,
    metadata{dimensions, lqip}
  }
}`;

export const HOME_PAGE_QUERY = defineQuery(`
  *[
    _type == "homePage" &&
    (_id == "homePage" || _id == "drafts.homePage")
  ] | order(_updatedAt desc)[0]{
    _id,
    _updatedAt,
    seo{
      metaTitle,
      metaDescription,
      ogTitle,
      ogDescription,
      "ogImage": ogImage${siteImageProjection},
      noIndex
    },
    featuredOn{
      label,
      badges[]{
        _key,
        name,
        href,
        src,
        "image": select(defined(image.asset) => image${siteImageProjection}),
        alt,
        width,
        height,
        displayWidth,
        displayHeight,
        variant
      }
    },
    productLanding{
      hero{
        title,
        description,
        primaryCtaLabel,
        macAppStoreLabel,
        watchVideoLabel,
        watchVideoUrl,
        showPrimaryCta,
        showTerminalPrompt,
        homebrewCommand,
        requirement,
        copyLabel,
        copiedLabel
      },
      media{
        "hero": hero{
          "light": light${siteImageProjection},
          "dark": dark${siteImageProjection}
        },
        "workflow": workflow{
          "light": light${siteImageProjection},
          "dark": dark${siteImageProjection}
        },
        "googleCalendarCards": googleCalendarCards[]{
          "light": light${siteImageProjection},
          "dark": dark${siteImageProjection}
        }
      },
      api{title, description},
      googleCalendar{
        title,
        description,
        primaryFeatures[]{_key, icon, tone, title, description},
        secondaryFeatures[]{_key, icon, tone, title, description}
      },
      hora{title, description, features[]{_key, icon, tone, title, description}},
      privacy{title, description},
      macos{title, description, features[]{_key, icon, tone, title, description}},
      featureGrid{features[]{_key, icon, tone, title, description}},
      newsletter{title, description, placeholder, buttonLabel}
    }
  }
`);
