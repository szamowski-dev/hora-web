import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/atoms/Icon";
import { Logo } from "@/components/atoms/Logo";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { MobileNav } from "./MobileNav";

export function Nav({ activePath }: { activePath?: string }) {
  return (
    <nav className="relative isolate overflow-hidden border-b border-white/[0.045] bg-[#090a0c] md:mx-auto md:max-w-295 md:rounded-[22px] md:border md:border-white/[0.09] md:bg-[#0b0c10]/76 md:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_18px_52px_-24px_rgba(0,0,0,0.88),0_12px_46px_-32px_rgba(34,79,136,0.6)] md:backdrop-blur-2xl md:backdrop-saturate-150">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(115deg,rgba(255,255,255,0.065)_0%,rgba(255,255,255,0.015)_38%,rgba(34,79,136,0.055)_70%,rgba(255,56,60,0.04)_100%)] md:block"
      />
      <div className="relative mx-auto flex h-16 max-w-295 items-center justify-between px-6">
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
