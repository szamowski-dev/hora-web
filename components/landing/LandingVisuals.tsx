import { ThemedProductImage } from "@/components/molecules/ThemedProductImage";
import type { ThemedSiteImage } from "@/lib/home-model";

export function HoraWorkflowVisual({ image }: { image: ThemedSiteImage }) {
  return (
    <ThemedProductImage
      lightSrc={image.light.src}
      darkSrc={image.dark.src}
      alt={image.light.alt}
      width={image.light.width}
      height={image.light.height}
      unoptimized
      sizes="(min-width: 1024px) 1024px, calc(100vw - 2.5rem)"
      className="mx-auto h-auto w-full max-w-5xl"
    />
  );
}
