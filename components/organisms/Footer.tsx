import Link from "next/link";
import { type IconName } from "@/components/atoms/Icon";
import { FooterSocialLink } from "@/components/molecules/FooterSocialLink";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-295 flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
        <p className="max-w-[22rem] text-sm leading-6 text-muted md:max-w-none">
          {site.footer.copyright}.{" "}
          <span className="whitespace-nowrap">
            Developed by{" "}
            <a
              href={site.footer.developedBy.href}
              className="inline-flex min-h-11 items-center text-muted underline transition-colors hover:text-text focus-visible:outline-none focus-visible:text-accent"
            >
              {site.footer.developedBy.label}
            </a>
          </span>
        </p>
        <div className="flex w-full max-w-md flex-col items-center gap-3 lg:w-auto lg:max-w-none lg:flex-row lg:items-center lg:gap-5">
          <div className="flex max-w-full flex-wrap items-center justify-center gap-x-5 gap-y-1">
            {site.footer.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex max-w-full flex-wrap items-center justify-center gap-1 lg:flex-nowrap">
            {site.footer.socials.map((social) => (
              <FooterSocialLink
                key={social.href}
                href={social.href}
                label={social.label}
                icon={social.icon as IconName}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
