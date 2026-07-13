type SectionBackdropProps = {
  direction?: "left" | "right" | "balanced";
  grid?: boolean;
};

const glowBackgrounds = {
  left:
    "radial-gradient(ellipse 760px 440px at 12% 0%, var(--ui-glow-accent-faint), transparent 68%), radial-gradient(ellipse 800px 500px at 90% 88%, var(--ui-glow-cool-soft), transparent 72%)",
  right:
    "radial-gradient(ellipse 760px 440px at 88% 0%, var(--ui-glow-accent-faint), transparent 68%), radial-gradient(ellipse 800px 500px at 10% 88%, var(--ui-glow-cool-soft), transparent 72%)",
  balanced:
    "radial-gradient(ellipse 820px 500px at 12% 0%, var(--ui-glow-accent-faint), transparent 68%), radial-gradient(ellipse 860px 520px at 90% 52%, var(--ui-glow-cool-soft), transparent 72%), radial-gradient(ellipse 720px 440px at 14% 100%, var(--ui-glow-accent-faint), transparent 72%)",
};

export function SectionBackdrop({
  direction = "left",
  grid = true,
}: SectionBackdropProps) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: glowBackgrounds[direction] }}
      />
      <div
        aria-hidden
        className={`section-blob section-blob-${direction} pointer-events-none`}
      />
      {grid ? (
        <div
          aria-hidden
          className="home-grid pointer-events-none absolute inset-0 opacity-40"
          style={{ backgroundSize: "36px 36px" }}
        />
      ) : null}
    </>
  );
}
