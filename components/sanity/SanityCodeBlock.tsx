import { codeToHtml } from "shiki";
import type { SanityCodeBlockValue } from "@/sanity/lib/queries";

export async function SanityCodeBlock({
  value,
}: {
  value: SanityCodeBlockValue;
}) {
  const code = value.code ?? "";
  const language = value.language ?? "text";
  const highlightedLines = new Set(value.highlightLines ?? []);
  let html: string | undefined;

  try {
    html = await codeToHtml(code, {
      lang: language,
      theme: "github-dark-dimmed",
      transformers: [
        {
          line(node, line) {
            if (!highlightedLines.has(line)) return;
            const current = node.properties.className;
            node.properties.className = Array.isArray(current)
              ? [...current, "highlighted"]
              : ["line", "highlighted"];
          },
        },
      ],
    });
  } catch {
    html = undefined;
  }

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-lg border border-border bg-surface">
      {value.filename ? (
        <figcaption className="border-b border-border px-4 py-2 font-mono text-xs text-muted">
          {value.filename}
        </figcaption>
      ) : null}
      {html ? (
        <div
          className="overflow-x-auto [&_.highlighted]:bg-accent/10 [&_.highlighted]:shadow-[inset_2px_0_0_var(--color-accent)] [&_.shiki]:m-0 [&_.shiki]:min-w-max [&_.shiki]:bg-transparent! [&_.shiki]:p-5 [&_.shiki]:text-[0.84rem] [&_.shiki]:leading-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="m-0 overflow-x-auto p-5 text-[0.84rem] leading-6 text-text">
          <code>{code}</code>
        </pre>
      )}
    </figure>
  );
}
