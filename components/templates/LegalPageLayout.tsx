import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import { Prose } from "@/components/atoms/Prose";
import { SectionBackdrop } from "@/components/atoms/SectionBackdrop";

export function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  const titleParts = title.split(" ");
  const accentWord = titleParts.pop();
  const titlePrefix = titleParts.join(" ");
  const isPrivacy = title.toLowerCase().includes("privacy");

  return (
    <article className="home-section relative overflow-hidden border-y py-16 md:py-24">
      <SectionBackdrop direction={isPrivacy ? "left" : "right"} />

      <div className="relative mx-auto max-w-295 px-6">
        <header className="border-b border-line-strong pb-8 md:pb-10">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-dim">
            Legal document
          </p>
          <h1 className="mt-3 text-5xl font-semibold leading-[1.04] tracking-tight text-text md:text-[64px]">
            {titlePrefix}{" "}
            <span className="text-accent">{accentWord}</span>
          </h1>
          <p className="mt-5 text-sm text-muted">Last updated: {lastUpdated}</p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start md:mt-12">
          <aside className="ui-panel-soft rounded-xl p-5 lg:sticky lg:top-24">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-dim">
              Documents
            </p>
            <nav className="mt-4 flex flex-col gap-2" aria-label="Legal pages">
              <Link
                href="/privacy/"
                className={`rounded-md border px-3 py-2.5 text-sm font-medium transition-colors ${
                  isPrivacy
                    ? "border-accent/40 bg-accent/10 text-text"
                    : "border-line bg-overlay text-muted hover:border-line-strong hover:bg-overlay-strong hover:text-text"
                }`}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms/"
                className={`rounded-md border px-3 py-2.5 text-sm font-medium transition-colors ${
                  !isPrivacy
                    ? "border-accent/40 bg-accent/10 text-text"
                    : "border-line bg-overlay text-muted hover:border-line-strong hover:bg-overlay-strong hover:text-text"
                }`}
              >
                Terms of Service
              </Link>
            </nav>
            <div className="mt-5 border-t border-line pt-5">
              <p className="text-xs leading-5 text-muted">
                Questions about these documents?
              </p>
              <Link
                href="/support/"
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-text"
              >
                Contact Support
                <Icon name="arrow-right" size={13} />
              </Link>
            </div>
          </aside>

          <div className="shader-panel ui-panel-deep relative overflow-hidden rounded-xl p-6 md:p-9 lg:p-12">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-accent/65 to-accent-cool/40"
            />
            <Prose className="relative mx-auto max-w-3xl prose-h2:border-t prose-h2:border-line prose-h2:pt-8 first:prose-h2:border-t-0 first:prose-h2:pt-0">
              {children}
            </Prose>
          </div>
        </div>
      </div>
    </article>
  );
}
