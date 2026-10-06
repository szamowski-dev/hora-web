import Image from "next/image";
import { ThemedProductImage } from "@/components/molecules/ThemedProductImage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReactNode } from "react";
import type { ProductLandingFeature } from "@/lib/home-model";
import { findKeyword } from "@/lib/accent-text";
import { cn } from "@/lib/cn";

/**
 * One key word per card title rendered in the accent red. Keys are the
 * lower-cased titles (Sanity content and the local fallback); unknown titles
 * stay fully near-black.
 */
const titleKeywords: Record<string, string> = {
  "color-coded calendars": "calendars",
  "event color labels": "color",
  "every event type": "event type",
  "meet and contacts": "meet",
  "multiple google accounts": "accounts",
  "multiple accounts": "accounts",
};

function CardTitleText({ title }: { title: string }) {
  const split = findKeyword(title, titleKeywords);
  if (!split) return <>{title}</>;
  return (
    <>
      {split.before}
      <span className="text-accent">{split.keyword}</span>
      {split.after}
    </>
  );
}

const cardSpanClasses = [
  "lg:col-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-2",
];

type FeatureImage = {
  alt: string;
  darkSrc?: string;
  height: number;
  lightSrc?: string;
  src?: string;
  width: number;
};

export function LandingFeatureCards({
  features,
  images,
  annotations,
  descriptionClassNames,
}: {
  features: ProductLandingFeature[];
  images: FeatureImage[];
  /** Optional decorative annotation per card (absolutely positioned). */
  annotations?: Array<ReactNode | undefined>;
  /** Optional extra classes for a card description, e.g. to make room for an annotation. */
  descriptionClassNames?: Array<string | undefined>;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {features.map((feature, index) => (
        <Card
          key={`${feature.icon}-${feature.title}`}
          className={cn(
            "relative flex min-h-[23rem] flex-col overflow-hidden rounded-[20px] border-transparent bg-feature-panel !py-0 shadow-none backdrop-blur-none sm:min-h-[26rem] lg:h-[33rem]",
            cardSpanClasses[index % cardSpanClasses.length],
          )}
        >
          <CardHeader className="!flex min-h-40 flex-col justify-start gap-4 px-7 pb-7 pt-8 sm:min-h-44 sm:px-8 sm:pt-9 lg:min-h-[12.5rem]">
            <CardTitle className="text-2xl text-text sm:text-3xl">
              <h3>
                <CardTitleText title={feature.title} />
              </h3>
            </CardTitle>
            <CardDescription
              className={cn(
                "max-w-2xl text-base sm:text-lg",
                descriptionClassNames?.[index],
              )}
            >
              {feature.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto flex flex-1 items-end !p-0 lg:h-80 lg:flex-none">
            {images[index].lightSrc && images[index].darkSrc ? (
              <ThemedProductImage
                lightSrc={images[index].lightSrc}
                darkSrc={images[index].darkSrc}
                alt={images[index].alt}
                width={images[index].width}
                height={images[index].height}
                sizes={index === 0 || index === 3 ? "(min-width: 1024px) 760px, calc(100vw - 5rem)" : "(min-width: 1024px) 360px, calc(100vw - 5rem)"}
                className="h-auto w-full rounded-t-[18px] lg:h-80 lg:object-cover lg:object-center"
              />
            ) : images[index].src ? (
              <Image
                src={images[index].src}
                alt={images[index].alt}
                width={images[index].width}
                height={images[index].height}
                sizes={index === 0 || index === 3 ? "(min-width: 1024px) 760px, calc(100vw - 5rem)" : "(min-width: 1024px) 360px, calc(100vw - 5rem)"}
                className="h-auto w-full rounded-t-[18px] lg:h-80 lg:object-cover lg:object-center"
              />
            ) : null}
          </CardContent>
          {annotations?.[index]}
        </Card>
      ))}
    </div>
  );
}
