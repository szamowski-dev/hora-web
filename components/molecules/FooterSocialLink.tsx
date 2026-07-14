import { Icon, type IconName } from "@/components/atoms/Icon";
import { analyticsAttrs } from "@/lib/analyticsAttrs";

function platformFromHref(href: string) {
  if (href.startsWith("mailto:")) return "email";
  if (href.includes("github.com")) return "github";
  if (href.includes("x.com") || href.includes("twitter.com")) return "x_twitter";
  if (href.includes("bsky.app") || href.includes("bsky.social")) return "bluesky";
  if (href.includes("discord")) return "discord";
  return "other";
}

export function FooterSocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: IconName;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...analyticsAttrs("social_click", {
        platform: platformFromHref(href),
      })}
      className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted transition-colors hover:bg-white/4.5 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      <Icon name={icon} size={18} />
    </a>
  );
}
