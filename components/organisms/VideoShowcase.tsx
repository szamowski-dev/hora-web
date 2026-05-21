import { Icon } from "@/components/atoms/Icon";
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
        src="/assets/redesign/focus_time.webm"
        fallbackSrc="/assets/redesign_raw/focus_time.mp4"
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
        src="/assets/redesign/hora_quick_add.webm"
        fallbackSrc="/assets/redesign_raw/hora_quick_add.mp4"
        label="hora Calendar natural language quick add demo"
      />
    ),
  },
  {
    title: "Menu bar",
    body: "Stay on top of your day without losing focus.",
    mediaKind: "media" as const,
    panel: (
      <MediaImage
        src="/assets/redesign/hora_menu_bar.webp"
        alt="hora Calendar menu bar popover"
      />
    ),
  },
  {
    title: "Powerful shortcuts",
    body: "Jump views, add events, and find dates without leaving the keyboard.",
    mediaKind: "custom" as const,
    panel: <ShortcutPanel />,
  },
];

export function VideoShowcase() {
  const v = home.videoShowcase;
  const demo = home.hero.demo;

  return (
    <section id="watch-demo" className="relative overflow-hidden py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_420px_at_20%_0%,rgba(255,56,60,0.13),transparent_68%),radial-gradient(760px_460px_at_84%_70%,rgba(131,199,255,0.08),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1180px] px-6">
        <h2 data-anim="video-title" className="text-4xl font-semibold tracking-tight text-text md:text-5xl">
          See hora <span className="text-accent">in action.</span>
        </h2>

        <div
          data-anim="video-player"
          className="mt-10 overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_40px_120px_-70px_rgba(255,56,60,0.8)]"
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
              <div className="relative flex h-[13.5rem] items-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] transition-colors group-hover:border-accent/35 group-hover:bg-white/[0.055]">
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

function MediaImage({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="h-full w-full bg-black object-cover"
    />
  );
}

function ShortcutPanel() {
  const shortcuts = [
    ["Today", "T"],
    ["Search", "/"],
  ];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-md bg-[radial-gradient(220px_160px_at_50%_18%,rgba(255,56,60,0.18),transparent_70%),rgba(0,0,0,0.22)] p-5">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10 text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_45px_-26px_rgba(255,56,60,0.9)]">
        <Icon name="keyboard" size={34} />
      </div>
      <div className="grid w-full max-w-[14rem] gap-2">
        {shortcuts.map(([label, ...keys]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-3 rounded-md bg-white/[0.045] px-3 py-2 text-xs"
          >
            <span className="truncate text-muted">{label}</span>
            <span className="flex shrink-0 gap-1">
              {keys.map((key) => (
                <kbd
                  key={key}
                  className="min-w-6 rounded bg-white/[0.075] px-1.5 py-1 text-center font-sans text-[11px] font-semibold leading-none text-text/80"
                >
                  {key}
                </kbd>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
