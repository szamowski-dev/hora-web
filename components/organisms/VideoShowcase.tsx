import { LazyLoopingVideo } from "@/components/organisms/LazyLoopingVideo";
import { VideoShowcaseNativeVideo } from "@/components/organisms/VideoShowcaseNativeVideo";
import { home } from "@/content/home";

const DEMO_VIDEO_ID = "ahVV5J25cYM";

const actionCards = [
  {
    title: "Focus Time Scheduling",
    body: "Block deep work without breaking your week.",
    mediaKind: "media" as const,
    panel: (
      <LazyLoopingVideo
        src="/assets/redesign/updated/focus_time-card.webm"
        label="hora Calendar focus time scheduling demo"
      />
    ),
  },
  {
    title: "NLP Quick add",
    body: "Type like you talk. Hora handles the rest.",
    mediaKind: "media" as const,
    panel: (
      <LazyLoopingVideo
        src="/assets/redesign/updated/hora_quickadd-card.webm"
        label="hora Calendar natural language quick add demo"
      />
    ),
  },
  {
    title: "Menu bar",
    body: "Stay on top of your day without losing focus.",
    mediaKind: "media" as const,
    panel: (
      <LazyLoopingVideo
        src="/assets/redesign/updated/hora_menubar-card.webm"
        label="hora Calendar menu bar popover demo"
      />
    ),
  },
  {
    title: "Themes",
    body: "Match hora to your workspace, mood, and system appearance.",
    mediaKind: "media" as const,
    panel: (
      <LazyLoopingVideo
        src="/assets/redesign/updated/hora_themes-card.webm"
        label="hora Calendar themes demo"
      />
    ),
  },
];

export function VideoShowcase() {
  const v = home.videoShowcase;
  const demo = home.hero.demo;

  return (
    <section id="watch-demo" className="relative overflow-hidden py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_420px_at_20%_0%,rgba(255,56,60,0.11),transparent_68%),radial-gradient(760px_460px_at_84%_70%,rgba(34,79,136,0.17),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-295 px-6">
        <h2 data-anim="video-title" className="text-4xl font-semibold tracking-tight text-text md:text-5xl">
          See hora <span className="text-accent">in action.</span>
        </h2>

        <div
          data-anim="video-player"
          className="shader-panel mt-10 overflow-hidden rounded-lg border border-white/10 bg-white/[0.035]"
        >
          <VideoShowcaseNativeVideo
            ariaLabel={demo.ariaLabel}
            poster={demo.demoPosterSrc}
            sources={demo.videoSources}
            videoId={DEMO_VIDEO_ID}
          />
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {actionCards.map((card, index) => (
            <article key={card.title} data-anim="video-card" className="group">
              <div className="shader-panel-soft relative flex h-[13.5rem] items-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] transition-colors group-hover:border-accent/35 group-hover:bg-white/5.5">
                {index === 0 ? (
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(300px_180px_at_16%_10%,rgba(255,56,60,0.20),transparent_68%)]"
                  />
                ) : null}
                <div
                  className={
                    card.mediaKind === "media"
                      ? "absolute inset-0"
                      : "relative h-full w-full p-3"
                  }
                >
                  {card.panel}
                </div>
              </div>
              <h3 className="mt-4 text-center text-base font-semibold tracking-tight text-text">
                {card.title}
              </h3>
              <p className="mx-auto mt-1 max-w-[13rem] text-center text-sm leading-6 text-muted">
                {card.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {v.highlights.map((h) => (
            <span
              key={h}
              data-anim="video-chip"
              className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-muted"
            >
              {h}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
