export type HeroGlow = {
  purple: number;
  pink: number;
  blue: number;
};

export const defaultHeroGlow: HeroGlow = { purple: 50, pink: 50, blue: 50 };

export function resolveHeroGlow(value?: Partial<HeroGlow>): HeroGlow {
  const intensity = (value: number | undefined) =>
    typeof value === "number" && Number.isFinite(value)
      ? Math.min(100, Math.max(0, value))
      : 50;

  return {
    purple: intensity(value?.purple),
    pink: intensity(value?.pink),
    blue: intensity(value?.blue),
  };
}
