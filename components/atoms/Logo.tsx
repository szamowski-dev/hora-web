import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

export function Logo({
  size = 28,
  className,
  asLink = true,
}: {
  size?: number;
  className?: string;
  asLink?: boolean;
}) {
  const content = (
    <>
      <Image
        src={site.brand.logoSrc}
        alt="hora Calendar logo"
        width={size}
        height={size}
        className="rounded-[6px]"
        priority
      />
      <span className="font-brand text-[22px] leading-none text-text">
        {site.brand.shortName}
      </span>
    </>
  );

  const classes = cn("inline-flex items-center gap-2.5 no-underline", className);

  if (!asLink) {
    return <span className={classes}>{content}</span>;
  }
  return (
    <Link href="/" className={classes} aria-label={site.brand.name}>
      {content}
    </Link>
  );
}
