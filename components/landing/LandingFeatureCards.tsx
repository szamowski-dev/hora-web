import Image from "next/image";
import { ThemedProductImage } from "@/components/molecules/ThemedProductImage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  ProductLandingFeature,
  ProductLandingTone,
} from "@/lib/home-model";
import { cn } from "@/lib/cn";

const toneClasses: Record<ProductLandingTone, string> = {
  red: "text-label-red",
  blue: "text-label-blue",
  green: "text-label-green",
  yellow: "text-label-yellow",
  purple: "text-label-purple",
  cyan: "text-label-cyan",
};

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
}: {
  features: ProductLandingFeature[];
  images: FeatureImage[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {features.map((feature, index) => (
        <Card
          key={`${feature.icon}-${feature.title}`}
          className={cn(
            "flex min-h-[23rem] flex-col overflow-hidden rounded-[20px] border-transparent bg-feature-panel !py-0 shadow-none backdrop-blur-none sm:min-h-[26rem] lg:h-[33rem]",
            cardSpanClasses[index % cardSpanClasses.length],
          )}
        >
          <CardHeader className="!flex min-h-40 flex-col justify-start gap-4 px-7 pb-7 pt-8 sm:min-h-44 sm:px-8 sm:pt-9 lg:min-h-[12.5rem]">
            <CardTitle
              className={cn(
                "text-2xl sm:text-3xl",
                toneClasses[feature.tone],
              )}
            >
              <h3>{feature.title}</h3>
            </CardTitle>
            <CardDescription className="max-w-2xl text-base sm:text-lg">
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
        </Card>
      ))}
    </div>
  );
}
