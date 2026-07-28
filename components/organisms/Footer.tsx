import Link from "next/link";
import { type IconName } from "@/components/atoms/Icon";
import { FooterSocialLink } from "@/components/molecules/FooterSocialLink";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-border px-8 py-10 sm:px-10 md:px-12 md:py-11">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 -top-64 h-[36rem] w-[50rem] bg-[radial-gradient(ellipse_at_center,var(--ui-glow-cool-soft),var(--ui-glow-flow-faint)_34%,transparent_68%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="home-grid pointer-events-none absolute inset-y-0 right-0 w-[58%] opacity-[0.18] [mask-image:linear-gradient(to_left,black,transparent)]"
      />

      <div className="relative mx-auto max-w-[68rem]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 text-left sm:gap-x-10 sm:gap-y-9 lg:grid-cols-[0.85fr_1.35fr_0.8fr_1fr_1.15fr] lg:gap-x-8 lg:gap-y-7">
          <nav aria-label="Product links">
            <p className="text-sm font-semibold tracking-tight text-text">
              Product
            </p>
            <div className="mt-3 flex flex-col items-start">
              {site.footer.productLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-[13px] text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:text-accent sm:text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Popular calendar guides">
            <p className="text-sm font-semibold tracking-tight text-text">
              Popular guides
            </p>
            <div className="mt-3 flex flex-col items-start">
              {site.footer.popularGuides.map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="inline-flex min-h-11 items-center text-[13px] text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:text-accent sm:text-sm"
                >
                  {guide.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Company links">
            <p className="text-sm font-semibold tracking-tight text-text">
              Company
            </p>
            <div className="mt-3 flex flex-col items-start">
              {site.footer.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-[13px] text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:text-accent sm:text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Follow hora Calendar">
            <p className="text-sm font-semibold tracking-tight text-text">
              Community
            </p>
            <div className="mt-3 flex flex-col items-start">
              {site.footer.socials.map((social) => (
                <FooterSocialLink
                  key={social.href}
                  href={social.href}
                  label={social.label}
                  icon={social.icon as IconName}
                  showLabel
                />
              ))}
            </div>
          </nav>

          <div className="col-span-2 border-t border-line pt-5 text-[13px] leading-5 text-muted sm:text-sm sm:leading-6 lg:col-span-1 lg:border-t-0 lg:pt-0">
            <p>{site.footer.copyright}</p>
            <p className="mt-1 max-w-[28ch] lg:max-w-[19ch]">
              A native Google Calendar app for Mac.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
