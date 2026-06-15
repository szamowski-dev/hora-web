import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/atoms/Icon";
import { Logo } from "@/components/atoms/Logo";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { MobileNav } from "./MobileNav";

export function Nav({ activePath }: { activePath?: string }) {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#090a0c]/82 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-295 items-center justify-between px-6">
        <Logo className="min-h-12" />
        <div className="hidden items-center gap-6 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              {...analyticsAttrs("nav_click", {
                link_text: item.label,
                link_url: item.href,
              })}
              className={
                activePath === item.href
                  ? "inline-flex min-h-12 items-center text-sm text-text transition-colors focus-visible:outline-none focus-visible:text-accent"
                  : "inline-flex min-h-12 items-center text-sm text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:text-accent"
              }
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.community.discord.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={site.community.discord.label}
            {...analyticsAttrs("discord_click", { location: "nav_desktop" })}
            className="inline-flex h-12 w-12 items-center justify-center text-muted transition-colors hover:text-[#5865F2]"
          >
            <Icon name="discord" size={20} />
          </a>
          <a
            href={site.cta.primary.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={site.cta.primary.label}
            {...analyticsAttrs("app_store_cta_click", {
              placement: "nav_desktop",
              destination: "mac_app_store",
            })}
            className="inline-flex h-10 items-center rounded-lg transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <Image
              src={site.macAppStoreBadgeSrc}
              alt={site.cta.primary.label}
              width={162}
              height={50}
              className="h-10 w-auto"
            />
          </a>
        </div>
        <div className="flex items-center gap-1 md:hidden">
          <a
            href={site.community.discord.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={site.community.discord.label}
            {...analyticsAttrs("discord_click", { location: "nav_mobile" })}
            className="inline-flex h-12 w-12 items-center justify-center text-text transition-colors hover:text-[#5865F2]"
          >
            <Icon name="discord" size={22} />
          </a>
          <MobileNav activePath={activePath} />
        </div>
      </div>
    </nav>
  );
}
