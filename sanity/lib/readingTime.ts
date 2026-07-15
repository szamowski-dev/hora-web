const READING_WORDS_PER_MINUTE = 220;
const READABLE_STRING_FIELDS = new Set([
  "caption",
  "code",
  "heading",
  "intro",
  "question",
  "text",
]);

function collectReadableText(
  value: unknown,
  fieldName: string | undefined,
  output: string[],
) {
  if (typeof value === "string") {
    if (fieldName && READABLE_STRING_FIELDS.has(fieldName)) {
      output.push(value);
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectReadableText(item, fieldName, output);
    }
    return;
  }

  if (!value || typeof value !== "object") return;

  for (const [key, child] of Object.entries(value)) {
    if (key.startsWith("_")) continue;
    collectReadableText(child, key, output);
  }
}

export function calculateReadingMinutes(body: unknown): number {
  const text: string[] = [];
  collectReadableText(body, undefined, text);
  const words = text.join(" ").match(/[\p{L}\p{N}’'-]+/gu)?.length ?? 0;
  return Math.max(1, Math.ceil(words / READING_WORDS_PER_MINUTE));
}
