import { cn } from "@/lib/cn";

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "blog-prose prose prose-invert max-w-[var(--container-article)] font-sans text-[17px] leading-7 md:text-[18px]",
        "prose-headings:scroll-mt-28 prose-headings:font-sans prose-headings:font-semibold prose-headings:tracking-[-0.025em] prose-headings:text-text",
        "prose-h1:text-3xl md:prose-h1:text-4xl prose-h2:mb-5 prose-h2:mt-12 prose-h2:text-[1.75rem] prose-h2:leading-tight md:prose-h2:text-[2rem] prose-h3:mb-3 prose-h3:mt-9 prose-h3:text-[1.35rem] md:prose-h3:text-2xl",
        "prose-p:my-5 prose-p:text-text/78 prose-p:leading-7",
        "prose-a:text-accent prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-text",
        "prose-code:text-text prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.875em] prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:bg-surface",
        "prose-blockquote:border-accent prose-blockquote:text-text/70",
        "prose-hr:border-border",
        "prose-img:rounded-lg prose-img:border prose-img:border-border",
        "prose-li:my-1.5 prose-li:text-text/78 prose-li:marker:text-accent",
        "[&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6",
        "prose-table:text-sm prose-th:font-sans prose-th:text-text prose-td:text-text/75",
        className,
      )}
    >
      {children}
    </div>
  );
}
