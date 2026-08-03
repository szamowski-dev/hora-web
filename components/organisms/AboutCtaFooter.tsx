import Link from "next/link";
import { MdArrowForward } from "react-icons/md";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";
import type { AboutPageData } from "@/lib/site-page-model";

export function AboutCtaFooter({
  content,
}: {
  content: AboutPageData["cta"];
}) {
  return (
    <>
      <Separator
        aria-hidden="true"
        className="mx-auto max-w-16 bg-text/15 sm:max-w-24"
      />
      <section className="bg-bg px-5 py-20 sm:px-10 sm:py-28">
        <Card className="mx-auto max-w-landing items-center px-6 py-12 text-center sm:px-10 sm:py-16">
          <CardHeader className="w-full max-w-3xl justify-items-center gap-4 px-0">
            <p className="text-sm font-semibold text-muted">{content.eyebrow}</p>
            <CardTitle>
              <h2 className="text-balance text-4xl tracking-[-0.045em] sm:text-5xl">
                {content.title}
              </h2>
            </CardTitle>
            <CardDescription className="max-w-2xl text-base sm:text-lg">
              {content.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="accent">
                <AppStoreLink
                  href={site.cta.primary.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...analyticsAttrs("app_store_cta_click", {
                    placement: ANALYTICS_PLACEMENTS.about,
                    destination: "mac_app_store",
                  })}
                >
                  {content.primaryLabel}
                  <MdArrowForward
                    data-icon="inline-end"
                    aria-hidden="true"
                  />
                </AppStoreLink>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/blog/">{content.secondaryLabel}</Link>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="sr-only px-0">
            Actions for downloading hora or reading the product story.
          </CardFooter>
        </Card>
      </section>
    </>
  );
}
