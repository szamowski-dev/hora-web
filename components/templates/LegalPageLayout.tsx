import Link from "next/link";
import { MdArrowForward, MdHelpOutline } from "react-icons/md";
import { Prose } from "@/components/atoms/Prose";
import { Card, CardContent } from "@/components/ui/card";
import { SitePageHero } from "@/components/templates/SitePageHero";
import type { LegalPageKind, SplitHeading } from "@/lib/site-page-model";
import { cn } from "@/lib/cn";

type LegalPageLayoutProps =
  | {
      kind: LegalPageKind;
      title: SplitHeading;
      lastUpdated: string;
      children: React.ReactNode;
    }
  | {
      kind?: never;
      title: string;
      lastUpdated: string;
      children: React.ReactNode;
    };

function displayDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function LegalPageLayout({
  kind,
  title,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  const isGuide = kind === undefined;
  const isPrivacy = kind === "privacy";
  const displayTitle =
    typeof title === "string" ? title : `${title.prefix} ${title.accent}`;

  return (
    <>
      <SitePageHero
        title={displayTitle}
        description={
          isGuide
            ? "A practical setup guide for using Zoom meetings with hora Calendar."
            : "Clear terms, plain language, and no surprises hidden behind legal shorthand."
        }
        meta={`Last updated: ${displayDate(lastUpdated)}`}
      />

      <section className="bg-bg px-5 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto grid min-w-0 max-w-landing gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start lg:gap-16">
          <aside className="min-w-0 lg:sticky lg:top-28">
            <p className="text-sm font-semibold text-text">
              {isGuide ? "Need a hand?" : "Documents"}
            </p>
            {isGuide ? (
              <div className="mt-4 flex flex-col gap-4">
                <p className="text-sm leading-6 text-muted">
                  If Zoom still does not connect after following the guide,
                  send the details directly to the developer.
                </p>
                <Link
                  href="/support/"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-text transition-colors hover:text-accent focus-visible:outline-none focus-visible:text-accent"
                >
                  <MdHelpOutline aria-hidden="true" className="size-5" />
                  Contact Support
                </Link>
              </div>
            ) : (
              <>
                <nav
                  className="mt-4 flex flex-col gap-1"
                  aria-label="Legal pages"
                >
                  <LegalLink href="/privacy/" active={isPrivacy}>
                    Privacy Policy
                  </LegalLink>
                  <LegalLink href="/terms/" active={!isPrivacy}>
                    Terms of Service
                  </LegalLink>
                </nav>
                <div className="mt-6 border-t border-line pt-6">
                  <p className="text-sm leading-6 text-muted">
                    Questions about these documents?
                  </p>
                  <Link
                    href="/support/"
                    className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-text transition-colors hover:text-accent focus-visible:outline-none focus-visible:text-accent"
                  >
                    Contact Support
                    <MdArrowForward aria-hidden="true" className="size-4" />
                  </Link>
                </div>
              </>
            )}
          </aside>

          <Card className="min-w-0 gap-0 overflow-hidden px-0 py-0">
            <CardContent className="px-6 py-8 sm:px-10 sm:py-12">
              <Prose className="mx-auto max-w-3xl break-words prose-a:break-all prose-h2:border-t prose-h2:border-line prose-h2:pt-8 first:prose-h2:border-t-0 first:prose-h2:pt-0">
                {children}
              </Prose>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

function LegalLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        active
          ? "bg-overlay-strong text-text"
          : "text-muted hover:bg-overlay hover:text-text",
      )}
    >
      {children}
    </Link>
  );
}
