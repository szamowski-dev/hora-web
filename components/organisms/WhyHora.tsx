import Image from "next/image";
import { Icon } from "@/components/atoms/Icon";
import { home } from "@/content/home";

const integrations = [
  {
    name: "Google Calendar",
    detail: "Real-time sync with Google Calendar.",
    iconSrc: "/assets/redesign_raw/google-calendar.svg",
  },
  {
    name: "Zoom",
    detail: "Create & join Zoom meetings with one click.",
    iconSrc: "/assets/redesign_raw/zoom.svg",
  },
  {
    name: "Microsoft Teams",
    detail: "Create & join Microsoft Teams meetings with one click.",
    iconSrc: "/assets/redesign_raw/microsoft-teams-2018.svg",
  },
  {
    name: "Apple Intelligence",
    detail:
      "Quick Add, Focus Time Scheduling, and TL;DR meeting summaries on your machine.",
    iconSrc: "/assets/redesign_raw/Apple_Intelligence.svg",
  },
];

export function WhyHora() {
  const w = home.whyHora;
  const author = w.personalNoteAuthor;

  return (
    <section className="relative overflow-hidden border-t border-white/8 py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_420px_at_18%_8%,rgba(255,56,60,0.09),transparent_68%),radial-gradient(760px_460px_at_90%_84%,rgba(34,79,136,0.16),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-295 px-6">
        <div className="grid gap-10 border-y border-white/10 py-12 md:grid-cols-[0.38fr_1.62fr] md:items-start">
          <h2 className="max-w-[10ch] text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
            Works with <span className="text-accent">your world.</span>
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            {integrations.map((item) => (
              <div
                key={item.name}
                className="flex min-h-[6.25rem] items-start gap-3 rounded-lg border border-white/10 bg-white/3 p-3.5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/12 bg-white/4.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                  <Image
                    src={item.iconSrc}
                    alt={`${item.name} logo`}
                    width={22}
                    height={22}
                    className="h-[1.35rem] w-[1.35rem] object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold leading-tight text-text">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <figure className="shader-panel mt-14 rounded-lg border border-white/10 bg-white/[0.035] p-6 sm:p-7 md:mt-16 md:p-8">
          <blockquote className="space-y-3 text-[1.45rem] font-semibold leading-[1.28] tracking-tight text-text/95 sm:text-[1.7rem] md:space-y-2 md:text-[2.15rem] md:leading-[1.2]">
            {w.personalNote.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </blockquote>

          <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
            <Image
              src="/assets/maciej_szamowski.jpg"
              alt="Maciej Szamowski"
              width={40}
              height={40}
              className="rounded-full border border-white/10"
            />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-text">{author.name}</p>
              <p className="text-xs text-muted">{author.role}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <a
                href={author.twitterHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={author.twitterLabel}
                className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-white/12 bg-white/4.5 text-muted transition-colors hover:text-text"
              >
                <Icon name="x" size={14} />
              </a>
              <a
                href={author.blueskyHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={author.blueskyLabel}
                className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-white/12 bg-white/4.5 text-muted transition-colors hover:text-text"
              >
                <Icon name="bluesky" size={14} />
              </a>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
