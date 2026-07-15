import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";

export function ContentLink({
  href,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (!href) return <a {...rest}>{children}</a>;

  if (/^https:\/\/apps\.apple\.com\//.test(href)) {
    return (
      <AppStoreLink
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </AppStoreLink>
    );
  }

  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
