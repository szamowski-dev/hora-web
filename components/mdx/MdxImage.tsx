import Image from "next/image";
import { cn } from "@/lib/cn";

export function MdxImage({
  src,
  alt = "",
  className,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  if (typeof src !== "string") return null;
  if (src.startsWith("/")) {
    return (
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={900}
        sizes="(min-width: 1200px) 1120px, calc(100vw - 3rem)"
        className={cn("mdx-media my-8 h-auto w-full rounded-lg border border-border", className)}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={cn("mdx-media my-8 h-auto w-full rounded-lg border border-border", className)}
      {...rest}
    />
  );
}
