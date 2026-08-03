import { cn } from "@/lib/cn";
import type { HomePageContent } from "@/lib/home-model";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FeaturedOn({
  content,
}: {
  content: HomePageContent["featuredOn"];
}) {
  return (
    <section
      aria-label={content.label}
      className="px-5 py-20 sm:px-10 sm:py-28"
    >
      <Card
        className="mx-auto max-w-landing gap-4 px-4 py-8 sm:gap-6 sm:px-10 sm:py-10"
      >
        <CardHeader className="justify-items-center px-0 text-center">
          <CardTitle>
            <h2 className="text-3xl tracking-[-0.035em] sm:text-4xl">{content.label}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <ul className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:max-w-5xl sm:gap-x-3 sm:gap-y-2">
            {content.badges.map((badge) => (
              <li
                key={badge.name}
                data-anim="featured-badge"
                className="flex min-w-0 basis-[calc(50%-0.25rem)] items-center justify-center sm:basis-auto"
              >
                <a
                  href={badge.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 w-full items-center justify-center rounded-lg px-1 opacity-80 grayscale transition-[opacity,filter] hover:opacity-100 hover:grayscale-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:min-h-14 sm:w-auto sm:px-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={badge.src}
                    alt={badge.alt}
                    width={badge.width}
                    height={badge.height}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: badge.displayWidth,
                      height: badge.displayHeight,
                    }}
                    className={cn(
                      "block",
                      badge.variant === "productHunt"
                        ? "h-12 w-auto max-w-full object-contain max-sm:!h-14 max-sm:!w-auto sm:h-14"
                        : "h-9 w-auto max-w-full object-contain max-sm:!h-11 max-sm:!w-auto sm:h-11",
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
