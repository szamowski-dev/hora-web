"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BlogTag } from "@/lib/blog";
import { cn } from "@/lib/cn";

type Props = {
  tags: readonly BlogTag[];
  activeTag?: string;
};

const TOP_TAG_LIMIT = 10;

export function BlogTagSearch({ tags, activeTag }: Props) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const visibleTags = useMemo(() => {
    if (!normalizedQuery) return tags.slice(0, TOP_TAG_LIMIT);

    return tags.filter((tag) => {
      const haystack = `${tag.label} ${tag.slug}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery, tags]);

  return (
    <div className="flex flex-col gap-3">
      <label className="sr-only" htmlFor="blog-tag-search">
        Search blog tags
      </label>
      <input
        id="blog-tag-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search tags"
        className="blog-tag-search-input h-10 rounded-md border border-line bg-bg/70 px-3.5 text-sm text-text shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.08)] outline-none transition-colors placeholder:text-muted/70 focus:border-accent/45 focus:ring-2 focus:ring-accent/20"
      />
      <div className="flex flex-wrap gap-2">
        {visibleTags.map((tag) => (
          <Link
            key={tag.slug}
            href={tag.href}
            className={cn(
              "ui-interactive inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold",
              activeTag === tag.slug
                ? "border-accent/55 bg-accent/14 text-accent"
                : "border-line bg-overlay text-muted hover:text-text",
            )}
          >
            <span>{tag.label}</span>
            <span className="text-[10px] text-muted">{tag.count}</span>
          </Link>
        ))}
      </div>
      {visibleTags.length === 0 ? (
        <p className="text-sm text-muted">No matching tags.</p>
      ) : null}
    </div>
  );
}
