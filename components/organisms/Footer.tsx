import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import { type IconName } from "@/components/atoms/Icon";
import { FooterSocialLink } from "@/components/molecules/FooterSocialLink";
import { site } from "@/content/site";

const linkClassName =
  "inline-flex min-h-10 items-center text-sm text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:text-accent";

export function Footer() {
  return (
    <footer className="border-t border-line bg-panel-deep px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1.35fr_0.8fr] lg:gap-10">
          <div className="flex max-w-xs flex-col items-start gap-5">
            <Logo className="min-h-11" />
            <p className="text-sm leading-6 text-muted">
              A fast, native Google Calendar app built for the Mac.
            </p>
          </div>

          <nav aria-label="Product links">
            <p className="text-sm font-semibold text-text">Product</p>
            <div className="mt-3 flex flex-col items-start">
              {site.footer.productLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClassName}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Popular calendar guides">
            <p className="text-sm font-semibold text-text">Popular guides</p>
            <div className="mt-3 flex flex-col items-start">
              {site.footer.popularGuides.map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className={linkClassName}
                >
                  {guide.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Company links">
            <p className="text-sm font-semibold text-text">Company</p>
            <div className="mt-3 flex flex-col items-start">
              {site.footer.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClassName}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">{site.footer.copyright}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
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
