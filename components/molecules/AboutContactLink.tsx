import { analyticsAttrs } from "@/lib/analyticsAttrs";

function platformFromHref(href: string): string {
  if (href.startsWith("mailto:")) return "email";
  if (href.includes("x.com") || href.includes("twitter.com")) return "x_twitter";
  if (href.includes("bsky.app") || href.includes("bsky.social")) return "bluesky";
  if (href.includes("mastodon")) return "mastodon";
  if (href.includes("github.com")) return "github";
  return "other";
}

export function AboutContactLink({
  href,
  external,
  children,
  className,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...analyticsAttrs("contact_link_click", {
        platform: platformFromHref(href),
      })}
      className={className}
    >
      {children}
    </a>
  );
}
