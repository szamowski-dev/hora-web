import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";

export function SitePageHero({
  title,
  description,
  meta,
  action,
  align = "left",
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  action?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <>
      <section
        className={cn(
          "relative bg-bg px-5 pb-20 pt-32 sm:px-10 sm:pb-28 sm:pt-44",
          className,
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-landing flex-col",
            centered ? "items-center text-center" : "items-start",
          )}
        >
          <h1
            className={cn(
              "text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-text sm:text-7xl",
              centered ? "max-w-5xl" : "max-w-4xl",
            )}
          >
            {title}
          </h1>
          {description ? (
            <div
              className={cn(
                "mt-7 max-w-2xl text-balance text-lg leading-8 text-muted sm:text-xl",
                centered ? "mx-auto" : undefined,
              )}
            >
              {description}
            </div>
          ) : null}
          {meta ? (
            <div className="mt-6 text-sm leading-6 text-muted">{meta}</div>
          ) : null}
          {action ? <div className="mt-8">{action}</div> : null}
        </div>
      </section>
      <Separator
        aria-hidden="true"
        className="mx-auto max-w-16 bg-text/15 sm:max-w-24"
      />
    </>
  );
}
