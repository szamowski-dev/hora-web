import { Prose } from "@/components/atoms/Prose";

export function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-295 px-6 py-12 md:py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-text md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted">Last updated: {lastUpdated}</p>
      </header>
      <Prose>{children}</Prose>
    </article>
  );
}
