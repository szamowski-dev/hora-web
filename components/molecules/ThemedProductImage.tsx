import Image from "next/image";
import { cn } from "@/lib/cn";

type ThemedProductImageProps = {
  alt: string;
  className?: string;
  darkSrc: string;
  fetchPriority?: "high" | "low" | "auto";
  lightSrc: string;
  preload?: boolean;
  sizes: string;
  unoptimized?: boolean;
  width: number;
  height: number;
};

export function ThemedProductImage({
  alt,
  className,
  darkSrc,
  fetchPriority,
  height,
  lightSrc,
  preload,
  sizes,
  unoptimized,
  width,
}: ThemedProductImageProps) {
  return (
    <div className="themed-product-image">
      <Image
        src={lightSrc}
        alt={alt}
        width={width}
        height={height}
        preload={preload}
        fetchPriority={fetchPriority}
        sizes={sizes}
        unoptimized={unoptimized}
        className={cn(
          className,
          "themed-product-image-light",
        )}
      />
      <Image
        src={darkSrc}
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        preload={false}
        fetchPriority={fetchPriority}
        sizes={sizes}
        unoptimized={unoptimized}
        className={cn(
          className,
          "themed-product-image-dark",
        )}
      />
    </div>
  );
}
