import Image from "next/image";
import { Icon, type IconName } from "@/components/atoms/Icon";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";

const heroPills: { key: string; label: React.ReactNode; icon: IconName }[] = [
  { key: "macos-native", label: "macOS Native", icon: "apple" },
  {
    key: "nlp-quick-add",
    label: (
      <>
        <abbr
          title="Natural Language Processing"
          className="cursor-help border-b border-dotted border-current/70 pb-px no-underline"
        >
          NLP
        </abbr>{" "}
        Quick add
      </>
    ),
    icon: "edit",
  },
  { key: "offline-ready", label: "Offline Ready", icon: "shield" },
  { key: "multiple-accounts", label: "Multiple Accounts", icon: "users" },
];

export function HeroScene({ liveCount }: { liveCount: number }) {
  const hero = home.hero;
  const newsletter = hero.newsletter;
  const socialProof = newsletter.socialProof;

  return (
    <section className="relative flex min-h-180 w-full flex-col overflow-hidden border-b border-white/8 lg:min-h-195">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <Image
          src={hero.demo.posterSrc}
          alt="hora Calendar macOS app interface"
          fill
          priority
          fetchPriority="high"
          quality={60}
          sizes="(min-width: 1536px) 1455px, 100vw"
          className="object-cover opacity-[0.1]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.56)_0%,rgba(10,10,10,0.82)_58%,#0a0a0a_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_15%_24%,rgba(255,56,60,0.20),transparent_68%),radial-gradient(760px_460px_at_82%_20%,rgba(61,166,255,0.14),transparent_66%),radial-gradient(780px_520px_at_75%_86%,rgba(48,209,88,0.10),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 72%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-8 px-6 pb-14 pt-10 md:grid-cols-[0.72fr_1.28fr] md:gap-8 md:pb-12 md:pt-12 lg:gap-10">
        <div className="max-w-140 text-left">
          <div className="inline-flex items-center rounded-md border border-accent/35 bg-accent/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            Now on the Mac App Store
          </div>

          <h1
            data-anim="hero-title"
            className="mt-6 max-w-[12ch] text-5xl font-semibold leading-[1.02] tracking-tight text-text md:text-[68px] lg:text-[78px]"
          >
            The Mac Calendar{" "}
            <span className="text-accent">Google never built.</span>
          </h1>

          <p
            data-anim="hero-copy"
            className="mt-5 max-w-md text-pretty text-lg leading-8 text-muted md:text-[19px]"
          >
            Fast, Native, Beautiful. Built for keyboard-driven workflows.
            Finally, Google Calendar feels at home on your Mac.
          </p>

          <div data-anim="hero-cta" className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={site.cta.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={site.cta.primary.label}
              {...analyticsAttrs("app_store_cta_click", {
                placement: "hero",
                destination: "mac_app_store",
              })}
              className="inline-flex h-12 items-center rounded-xl transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Image
                src={site.macAppStoreBadgeSrc}
                alt={site.cta.primary.label}
                width={162}
                height={50}
                className="h-12 w-auto"
              />
            </a>
            <a
              href="#watch-demo"
              data-scroll-align="center"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/12 bg-white/5.5 px-5 text-sm font-semibold text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl transition-colors hover:border-white/24 hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Watch 1:43 Demo
              <span aria-hidden>▸</span>
            </a>
          </div>

          <div
            data-anim="hero-proof"
            className="mt-6 flex flex-col items-start gap-3 xl:flex-row xl:items-center xl:gap-6"
          >
            <div className="flex shrink-0 -space-x-2">
              {socialProof.avatars.slice(0, 5).map((avatar) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={avatar.src}
                  src={avatar.src}
                  alt={avatar.alt}
                  width={34}
                  height={34}
                  className="h-8.5 w-8.5 rounded-full border-2 border-bg object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
            <p className="max-w-100 text-sm leading-snug text-muted sm:max-w-108">
              <span className="font-semibold text-text">
                {liveCount.toLocaleString()}+ Mac users
              </span>{" "}
              already use hora.{" "}
              <span>Now on the Mac App Store.</span>
            </p>
          </div>
        </div>

        <div className="relative md:-mt-14 lg:-mt-18">
          <div
            aria-hidden
            className="absolute -inset-4 rounded-4xl bg-[radial-gradient(ellipse_at_50%_45%,rgba(255,56,60,0.24),transparent_62%)] blur-2xl"
          />
          <div
            aria-hidden
            className="absolute inset-x-10 -bottom-9 h-20 rounded-full bg-[radial-gradient(ellipse,rgba(255,56,60,0.34)_0%,rgba(255,56,60,0.16)_42%,transparent_74%)] blur-2xl"
          />
          <div
            data-anim="hero-shot"
            className="relative overflow-hidden rounded-[18px] shadow-[0_36px_100px_-42px_rgba(0,0,0,0.9)]"
          >
            <Image
              src={hero.demo.posterSrc}
              alt="hora Calendar macOS app interface"
              width={3188}
              height={1903}
              priority
              quality={90}
              sizes="(min-width: 1280px) 820px, (min-width: 1024px) 68vw, 100vw"
              className="w-full object-contain"
            />
          </div>

          <div className="relative z-10 mx-auto mt-4 grid max-w-3xl grid-cols-2 gap-2 text-xs text-muted sm:grid-cols-4 md:mt-5">
            {heroPills.map((item) => (
                <div
                  key={item.key}
                  data-anim="hero-pill"
                  className="flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-[#111216]/88 px-2.5 text-[10px] font-medium leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-xl lg:text-[11px]"
                >
                  <Icon name={item.icon} size={14} className="text-accent" />
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
