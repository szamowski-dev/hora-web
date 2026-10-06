/**
 * Helper for the black + red "bold statement" hero headline used in the
 * App Store and deck materials. It only decides where the accent colour
 * starts; the text itself (edited in Sanity) is never changed.
 */

export type AccentSplit = { lead: string; accent: string };

function words(text: string) {
  return text.trim().split(/\s+/).filter(Boolean);
}

/**
 * Splits a headline into a near-black lead line and an accent line.
 *
 * 1. An explicit line break wins ("The Mac Calendar\nGoogle never built.").
 * 2. Several sentences: the last sentence becomes the accent.
 * 3. Otherwise the words are split where both halves have the most similar
 *    length, so "The Mac Calendar Google never built." becomes
 *    "The Mac Calendar" + "Google never built.".
 *
 * Returns null when the headline is too short to split; callers then render
 * the plain text.
 */
export function splitHeadline(text: string | undefined | null): AccentSplit | null {
  if (!text) return null;
  const trimmed = text.trim();

  const lines = trimmed.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length > 1) {
    return { lead: lines.slice(0, -1).join(" "), accent: lines[lines.length - 1] };
  }

  const sentences = trimmed.split(/(?<=[.!?])\s+(?=\S)/);
  if (sentences.length > 1) {
    return {
      lead: sentences.slice(0, -1).join(" "),
      accent: sentences[sentences.length - 1],
    };
  }

  const parts = words(trimmed);
  if (parts.length < 3) return null;

  let bestIndex = 1;
  let bestDiff = Number.POSITIVE_INFINITY;
  for (let index = 1; index < parts.length; index += 1) {
    const lead = parts.slice(0, index).join(" ");
    const accent = parts.slice(index).join(" ");
    const diff = Math.abs(lead.length - accent.length);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = index;
    }
  }

  return {
    lead: parts.slice(0, bestIndex).join(" "),
    accent: parts.slice(bestIndex).join(" "),
  };
}
