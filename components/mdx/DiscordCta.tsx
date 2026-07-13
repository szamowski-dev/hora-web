import { analyticsAttrs } from "@/lib/analyticsAttrs";

export function DiscordCta({
  href = "https://discord.gg/8JFz4FfBGQ",
  label = "Join the Discord",
  handle = "discord.gg/8JFz4FfBGQ",
}: {
  href?: string;
  label?: string;
  handle?: string;
}) {
  return (
    <div className="not-prose my-12">
      <div
        className="shader-panel ui-panel-deep relative overflow-hidden rounded-xl px-6 py-12 text-center sm:px-10 sm:py-14"
        style={{
          background:
            "radial-gradient(ellipse 520px 280px at 25% 0%, var(--ui-glow-accent-soft), transparent 70%), radial-gradient(ellipse 560px 320px at 82% 100%, var(--ui-glow-cool-soft), transparent 72%), var(--ui-panel-deep)",
        }}
      >
        <p
          className="m-0 mb-3 text-[11px] font-bold uppercase"
          style={{ color: "#ff736e", letterSpacing: "1.6px" }}
        >
          <span aria-hidden>●</span> Join the beta community
        </p>
        <h3
          className="m-0 mb-3 text-2xl font-bold tracking-tight text-white sm:text-3xl"
          style={{ lineHeight: 1.15 }}
        >
          Daily builds. Direct line to me.
          <br />
          Other early testers.
        </h3>
        <p
          className="mx-auto mb-7 max-w-md text-[15px]"
          style={{ color: "#c9c9c9", lineHeight: 1.65 }}
        >
          Discord is where feedback turns into fixes. That&apos;s where I&apos;ll
          be every day for the next few weeks.
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          {...analyticsAttrs("discord_click", { location: "blog_cta" })}
          className="inline-block font-bold text-white no-underline transition hover:brightness-110"
          style={{
            background: "var(--color-discord)",
            padding: "18px 44px",
            borderRadius: "999px",
            fontSize: "17px",
            letterSpacing: "0.3px",
            boxShadow:
              "0 18px 42px -24px oklch(0 0 0 / 0.95), 0 2px 0 oklch(1 0 0 / 0.2) inset",
            border: "1px solid oklch(0.5774 0.2091 273.9 / 0.45)",
          }}
        >
          {label}&nbsp;&nbsp;→
        </a>
        <p
          className="mt-5 text-[13px]"
          style={{ color: "#888", letterSpacing: "0.2px" }}
        >
          {handle}
        </p>
      </div>
    </div>
  );
}
