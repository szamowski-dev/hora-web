import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import type { SanityImageCrop, SanityImageHotspot } from "@sanity/image-url";
import { stegaClean } from "next-sanity";
import { client } from "@/sanity/lib/client";
import type { SanityImageAsset } from "@/sanity/lib/queries";

export type SanityImageValue = {
  crop?: SanityImageCrop;
  hotspot?: SanityImageHotspot;
  asset?: SanityImageAsset;
};

const imageBuilder = createImageUrlBuilder(client);

function imageSource(value: SanityImageValue): SanityImageSource | null {
  const asset = value.asset?._id
    ? { _id: stegaClean(value.asset._id) }
    : value.asset?.url
      ? { url: stegaClean(value.asset.url) }
      : null;

  if (!asset) return null;

  return {
    asset,
    crop: value.crop,
    hotspot: value.hotspot,
  };
}

export function sanityImageDimensions(value: SanityImageValue) {
  const sourceWidth = value.asset?.metadata?.dimensions?.width;
  const sourceHeight = value.asset?.metadata?.dimensions?.height;
  const horizontalCrop = (value.crop?.left ?? 0) + (value.crop?.right ?? 0);
  const verticalCrop = (value.crop?.top ?? 0) + (value.crop?.bottom ?? 0);

  const width =
    typeof sourceWidth === "number" && sourceWidth > 0
      ? Math.max(1, Math.round(sourceWidth * (1 - horizontalCrop)))
      : undefined;
  const height =
    typeof sourceHeight === "number" && sourceHeight > 0
      ? Math.max(1, Math.round(sourceHeight * (1 - verticalCrop)))
      : undefined;

  return { width, height };
}

export function sanityImageUrl(
  value: SanityImageValue,
  options: { width?: number; height?: number; quality?: number } = {},
) {
  const source = imageSource(value);
  if (!source) return undefined;

  let url = imageBuilder
    .image(source)
    .auto("format")
    .quality(options.quality ?? 90);
  if (options.width) url = url.width(options.width);
  if (options.height) url = url.height(options.height);
  if (options.width && options.height) url = url.fit("crop");

  return url.url();
}
