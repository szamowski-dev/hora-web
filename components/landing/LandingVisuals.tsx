import Image from "next/image";

export function HoraWorkflowVisual() {
  return (
    <Image
      src="/assets/product/fast-native.png"
      alt="hora event editor with natural-language event creation"
      width={3090}
      height={2052}
      unoptimized
      sizes="(min-width: 1024px) 1024px, calc(100vw - 2.5rem)"
      className="mx-auto h-auto w-full max-w-5xl"
    />
  );
}
