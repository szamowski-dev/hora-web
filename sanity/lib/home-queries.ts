import type { SanityImageCrop, SanityImageHotspot } from "@sanity/image-url";
import { defineQuery } from "next-sanity";
import type { SanityImageAsset } from "@/sanity/lib/queries";

export type SanitySiteImageValue = {
  alt?: string;
  crop?: SanityImageCrop;
  hotspot?: SanityImageHotspot;
  asset?: SanityImageAsset;
};

type SanitySiteVideoValue = {
  webmUrl?: string;
  mp4Url?: string;
  poster?: SanitySiteImageValue;
  accessibilityLabel?: string;
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
  hero?: {
    titlePrefix?: string;
    titleAccent?: string;
    description?: string;
    screenshot?: SanitySiteImageValue;
    watchDemoLabel?: string;
    socialProof?: {
      label?: string;
      fallbackCount?: number;
      avatars?: Array<{ _key?: string; src?: string; alt?: string }>;
    };
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
  showcase?: {
    eyebrow?: string;
    headingPrefix?: string;
    headingAccent?: string;
    description?: string;
    mainVideo?: SanitySiteVideoValue;
    firstSlideTitle?: string;
    firstSlideDescription?: string;
    actions?: Array<{
      _key?: string;
      number?: number;
      title?: string;
      description?: string;
      video?: SanitySiteVideoValue;
    }>;
  };
  featureOverview?: {
    eyebrow?: string;
    titlePrefix?: string;
    titleAccent?: string;
    allFeaturesLabel?: string;
    items?: Array<{
      _key?: string;
      icon?: string;
      title?: string;
      description?: string;
    }>;
  };
  integrations?: {
    eyebrow?: string;
    titlePrefix?: string;
    titleAccent?: string;
    items?: Array<{
      _key?: string;
      provider?: string;
      name?: string;
      description?: string;
    }>;
    founderNote?: {
      lines?: string[];
      author?: {
        name?: string;
        role?: string;
        portrait?: SanitySiteImageValue;
      };
    };
  };
  socialProof?: {
    eyebrow?: string;
    titlePrefix?: string;
    titleAccent?: string;
    description?: string;
    testimonials?: Array<{
      _key?: string;
      id?: string;
      quote?: string;
      author?: string;
      handle?: string;
      href?: string;
      avatarUrl?: string;
      platform?: string;
    }>;
  };
  roadmap?: {
    eyebrow?: string;
    titlePrefix?: string;
    titleAccent?: string;
    subtitle?: string;
    items?: Array<{
      _key?: string;
      number?: number;
      status?: string;
      title?: string;
      description?: string;
    }>;
  };
  faq?: {
    eyebrow?: string;
    titlePrefix?: string;
    titleAccent?: string;
    subtitle?: string;
    items?: Array<{
      _key?: string;
      question?: string;
      answer?: string;
    }>;
    footerTitle?: string;
    footerDescription?: string;
    footerLinkLabel?: string;
  };
  productLanding?: {
    hero?: {
      title?: string;
      description?: string;
      primaryCtaLabel?: string;
      macAppStoreLabel?: string;
      watchVideoLabel?: string;
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
    api?: {
      title?: string;
      description?: string;
    };
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
    privacy?: {
      title?: string;
      description?: string;
      features?: SanityProductLandingFeatureValue[];
    };
    macos?: {
      title?: string;
      description?: string;
      features?: SanityProductLandingFeatureValue[];
    };
    featureGrid?: {
      title?: string;
      description?: string;
      features?: SanityProductLandingFeatureValue[];
    };
    newsletter?: {
      title?: string;
      description?: string;
      placeholder?: string;
      buttonLabel?: string;
    };
  };
};

const siteImageProjection = `{
  alt,
  crop,
  hotspot,
  "asset": asset->{
    _id,
    url,
    metadata{dimensions, lqip}
  }
}`;

const siteVideoProjection = `{
  "webmUrl": coalesce(webmUrl, webm.asset->url),
  "mp4Url": coalesce(mp4Url, mp4.asset->url),
  "poster": poster${siteImageProjection},
  accessibilityLabel
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
    hero{
      titlePrefix,
      titleAccent,
      description,
      "screenshot": screenshot${siteImageProjection},
      watchDemoLabel,
      socialProof{
        label,
        fallbackCount,
        avatars[]{_key, src, alt}
      }
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
    showcase{
      eyebrow,
      headingPrefix,
      headingAccent,
      description,
      "mainVideo": mainVideo${siteVideoProjection},
      firstSlideTitle,
      firstSlideDescription,
      actions[]{
        _key,
        number,
        title,
        description,
        "video": video${siteVideoProjection}
      }
    },
    featureOverview{
      eyebrow,
      titlePrefix,
      titleAccent,
      allFeaturesLabel,
      items[]{_key, icon, title, description}
    },
    integrations{
      eyebrow,
      titlePrefix,
      titleAccent,
      items[]{_key, provider, name, description},
      founderNote{
        lines,
        "author": author->{
          name,
          role,
          "portrait": portrait${siteImageProjection}
        }
      }
    },
    socialProof{
      eyebrow,
      titlePrefix,
      titleAccent,
      description,
      testimonials[]{
        _key,
        id,
        quote,
        author,
        handle,
        href,
        avatarUrl,
        platform
      }
    },
    roadmap{
      eyebrow,
      titlePrefix,
      titleAccent,
      subtitle,
      items[]{_key, number, status, title, description}
    },
    faq{
      eyebrow,
      titlePrefix,
      titleAccent,
      subtitle,
      items[]{_key, question, answer},
      footerTitle,
      footerDescription,
      footerLinkLabel
    },
    productLanding{
      hero{
      title,
      description,
      primaryCtaLabel,
      macAppStoreLabel,
      watchVideoLabel,
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
      api{
        title,
        description
      },
      googleCalendar{
        title,
        description,
        primaryFeatures[]{_key, icon, tone, title, description},
        secondaryFeatures[]{_key, icon, tone, title, description}
      },
      hora{
        title,
        description,
        features[]{_key, icon, tone, title, description}
      },
      privacy{
        title,
        description,
        features[]{_key, icon, tone, title, description}
      },
      macos{
        title,
        description,
        features[]{_key, icon, tone, title, description}
      },
      featureGrid{
        title,
        description,
        features[]{_key, icon, tone, title, description}
      },
      newsletter{
        title,
        description,
        placeholder,
        buttonLabel
      }
    }
  }
`);
