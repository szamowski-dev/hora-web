import { MdOutlineImage } from "react-icons/md";
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

export function LandingFeatureCards({
  features,
}: {
  features: ProductLandingFeature[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {features.map((feature, index) => (
        <Card
          key={`${feature.icon}-${feature.title}`}
          className={cn(
            "min-h-[30rem] overflow-hidden rounded-[20px] border-transparent bg-feature-panel py-0 shadow-none backdrop-blur-none",
            cardSpanClasses[index % cardSpanClasses.length],
          )}
        >
          <CardHeader className="gap-4 px-7 pb-7 pt-8 sm:px-8 sm:pt-9">
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
          <CardContent className="mt-auto flex flex-1 items-end px-5 pb-0 sm:px-6">
            <div
              aria-label={`${feature.title} product image placeholder`}
              role="img"
              className="flex min-h-64 w-full items-center justify-center rounded-t-[18px] border border-b-0 border-dashed border-line-strong bg-feature-visual"
            >
              <div
                aria-hidden="true"
                className="flex flex-col items-center gap-3 text-muted"
              >
                <MdOutlineImage className="size-9" />
                <span className="text-sm font-medium">
                  Product image placeholder
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
