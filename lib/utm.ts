export function normalizeUtmMedium(
  value: string | null | undefined,
): string | undefined {
  const normalized = value
    ?.trim()
    .toLowerCase()
    .replace(/[\\/]+$/, "")
    .trim();
  return normalized || undefined;
}
