import { ThemedProductImage } from "@/components/molecules/ThemedProductImage";

export function HoraWorkflowVisual() {
  return (
    <ThemedProductImage
      lightSrc="/assets/product/fast-native-light.png"
      darkSrc="/assets/product/fast-native.png"
      alt="hora event editor with natural-language event creation"
      width={3234}
      height={2028}
      unoptimized
      sizes="(min-width: 1024px) 1024px, calc(100vw - 2.5rem)"
      className="mx-auto h-auto w-full max-w-5xl"
    />
  );
}
