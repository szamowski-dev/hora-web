import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import { type IconName } from "@/components/atoms/Icon";
import { FooterSocialLink } from "@/components/molecules/FooterSocialLink";
import { site } from "@/content/site";

const linkClassName =
  "inline-flex min-h-10 items-center text-sm text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:text-accent";

export function Footer({ copyright }: { copyright: string }) {
  return (
    <footer className="border-t border-line bg-panel-deep px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-[1.45fr_0.8fr_1.25fr_0.8fr] lg:gap-12">
          <div className="order-4 col-span-2 flex max-w-xs flex-col items-start gap-5 border-t border-line pt-10 sm:order-none sm:col-span-1 sm:border-t-0 sm:pt-0">
            <Logo className="min-h-11" />
            <p className="whitespace-pre-line text-sm leading-6 text-muted">
              {site.footer.description}
            </p>
            <p className="text-sm leading-6 text-muted">
              {copyright}
            </p>
            <div className="-ml-3 flex flex-wrap items-center gap-0">
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

          <nav aria-label="Product links" className="order-1 sm:order-none">
            <p className="text-sm font-semibold text-text">Product</p>
            <div className="mt-3 flex flex-col items-start">
              {site.footer.productLinks.map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className={linkClassName}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav
            aria-label="Popular calendar guides"
            className="order-2 sm:order-none"
          >
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

          <nav
            aria-label="Company links"
            className="order-3 col-span-2 sm:order-none sm:col-span-1"
          >
            <p className="text-sm font-semibold text-text">Company</p>
            <div className="mt-3 grid grid-cols-2 justify-items-start sm:flex sm:flex-col sm:items-start">
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
      </div>
    </footer>
  );
}
