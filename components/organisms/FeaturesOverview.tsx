import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/atoms/Icon";
import { SectionBackdrop } from "@/components/atoms/SectionBackdrop";
import { LazyLoopingVideo } from "@/components/organisms/LazyLoopingVideo";
import { MobileVideoCarousel } from "@/components/organisms/MobileVideoCarousel";
import { VideoShowcaseNativeVideo } from "@/components/organisms/VideoShowcaseNativeVideo";
import { site } from "@/content/site";
import { HORA_HERO_VIDEO_ID } from "@/lib/analyticsSchema";
import type {
  HomeIntegrationProvider,
  HomePageContent,
} from "@/lib/home-model";

const iconMap: Record<string, IconName> = {
  "app-window": "app-window",
  calendar: "calendar",
  bell: "bell",
  sync: "sync",
  shield: "shield",
  check: "check",
  gauge: "gauge",
};

const integrationIcons: Record<HomeIntegrationProvider, string> = {
  "google-calendar": "/assets/integrations/google-calendar.svg",
  zoom: "/assets/integrations/zoom.svg",
  "microsoft-teams": "/assets/integrations/microsoft-teams.svg",
  "apple-intelligence": "/assets/integrations/apple-intelligence.svg",
};

export function FeaturesOverview({
  showcase,
  featureOverview,
  integrations,
}: {
  showcase: HomePageContent["showcase"];
  featureOverview: HomePageContent["featureOverview"];
  integrations: HomePageContent["integrations"];
}) {
  const author = integrations.founderNote.author;
  const mainVideoPoster = showcase.mainVideo.poster;
  const actionCards = showcase.actions.map((action) => ({
    number: action.number,
    title: action.title,
    body: action.description,
    src: action.video.sources.find((source) => source.type === "video/webm")!
      .src,
    label: action.video.ariaLabel,
  }));

  return (
    <section
      id="features"
      className="home-section relative overflow-hidden border-y py-20 md:py-24"
    >
      <SectionBackdrop direction="balanced" />

      <div className="relative mx-auto max-w-295 px-6">
        <div id="watch-demo" className="scroll-mt-28">
          <h2
            data-anim="video-title"
            className="text-4xl font-semibold tracking-tight text-text md:text-5xl"
          >
            {showcase.headingPrefix}{" "}
            <span className="text-accent">{showcase.headingAccent}</span>
          </h2>

          <MobileVideoCarousel
            launchVideo={{
              ariaLabel: showcase.mainVideo.ariaLabel,
              poster: mainVideoPoster?.src ?? "",
              sources: showcase.mainVideo.sources,
              title: showcase.firstSlideTitle,
              description: showcase.firstSlideDescription,
            }}
            actionCards={actionCards}
            videoId={HORA_HERO_VIDEO_ID}
          />

          <div className="hidden md:block">
            <div
              data-anim="video-player"
              className="shader-panel ui-panel mt-8 overflow-hidden rounded-xl"
            >
              <VideoShowcaseNativeVideo
                ariaLabel={showcase.mainVideo.ariaLabel}
                poster={mainVideoPoster?.src ?? ""}
                sources={showcase.mainVideo.sources}
                videoId={HORA_HERO_VIDEO_ID}
              />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {actionCards.map((card) => (
                <article
                  key={card.title}
                  data-anim="video-card"
                  className="ui-interactive shader-panel-soft ui-panel-soft group overflow-hidden rounded-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
                    <LazyLoopingVideo src={card.src} label={card.label} />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] tracking-[0.16em] text-accent/75">
                        {String(card.number).padStart(2, "0")}
                      </span>
                      <h3 className="text-sm font-semibold tracking-tight text-text">
                        {card.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted">
                      {card.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-line pt-14 md:mt-24 md:pt-16">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">
                {featureOverview.eyebrow}
              </p>
              <h3
                data-anim="features-title"
                className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-text md:text-4xl"
              >
                {featureOverview.titlePrefix}
                <span className="text-accent">
                  {" "}
                  {featureOverview.titleAccent}
                </span>
              </h3>
            </div>
            <Link
              href="/features/"
              className="ui-interactive inline-flex h-10 w-fit items-center gap-2 rounded-md border border-line bg-overlay px-4 text-sm text-muted hover:text-text"
            >
              {featureOverview.allFeaturesLabel}
            </Link>
          </div>

          <div className="ui-panel-deep mt-8 grid overflow-hidden rounded-xl sm:grid-cols-2 lg:grid-cols-3">
            {featureOverview.items.map((item, index) => (
              <article
                key={item.title}
                data-anim="feature-card"
                className={`group relative flex gap-4 border-line p-5 transition-colors hover:bg-overlay ${
                  index < featureOverview.items.length - 1 ? "border-b" : ""
                } ${index % 2 === 0 ? "sm:border-r" : ""} ${
                  index >= featureOverview.items.length - 2 ? "sm:border-b-0" : ""
                } ${index % 3 !== 2 ? "lg:border-r" : "lg:border-r-0"} ${
                  index < featureOverview.items.length - 3
                    ? "lg:border-b"
                    : "lg:border-b-0"
                }`}
              >
                <span
                  data-anim="feature-icon"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-accent/25 bg-accent/8 text-accent"
                >
                  <Icon name={iconMap[item.icon]} size={17} />
                </span>
                <div>
                  <h4 className="text-sm font-semibold leading-tight tracking-tight text-text md:text-base">
                    {item.title}
                  </h4>
                  <p className="mt-1.5 text-xs leading-5 text-muted md:text-sm md:leading-6">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-line pt-14 md:mt-20 md:pt-16">
          <div className="grid gap-7 lg:grid-cols-[0.34fr_1.66fr] lg:items-start">
            <div>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">
                {integrations.eyebrow}
              </p>
              <h3 className="mt-3 max-w-[12ch] text-3xl font-semibold leading-tight tracking-tight text-text md:text-4xl">
                {integrations.titlePrefix}{" "}
                <span className="text-accent">{integrations.titleAccent}</span>
              </h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {integrations.items.map((item) => (
                <article
                  key={item.name}
                  className="ui-panel-soft flex items-start gap-3 rounded-lg p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line-strong bg-overlay shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.1)]">
                    <Image
                      src={integrationIcons[item.provider]}
                      alt={`${item.name} logo`}
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold leading-tight text-text">
                      {item.name}
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <figure className="shader-panel ui-panel mt-10 grid gap-8 rounded-xl p-6 sm:p-7 md:grid-cols-[1.45fr_0.55fr] md:items-end md:p-8">
            <blockquote className="space-y-2 text-xl font-semibold leading-[1.28] tracking-tight text-text/95 sm:text-2xl md:text-[1.65rem]">
              {integrations.founderNote.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </blockquote>

            <figcaption className="flex items-center gap-3 border-t border-line pt-5 md:border-t-0 md:border-l md:pl-7 md:pt-0">
              <Image
                src={author.portrait.src}
                alt={author.portrait.alt}
                width={author.portrait.width}
                height={author.portrait.height}
                className="h-10 w-10 shrink-0 rounded-full border border-white/10 object-cover"
              />
              <div className="min-w-0 leading-tight">
                <p className="text-sm font-semibold text-text">{author.name}</p>
                <p className="text-xs text-muted">{author.role}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <a
                  href={site.footer.socials.find((item) => item.icon === "x")?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow ${author.name} on X`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/12 bg-white/4.5 text-muted transition-colors hover:text-text"
                >
                  <Icon name="x" size={14} />
                </a>
                <a
                  href={site.footer.socials.find((item) => item.icon === "bluesky")?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow ${author.name} on Bluesky`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/12 bg-white/4.5 text-muted transition-colors hover:text-text"
                >
                  <Icon name="bluesky" size={14} />
                </a>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
