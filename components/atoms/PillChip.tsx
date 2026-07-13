import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  href?: string;
  className?: string;
};

const baseClasses =
  "relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium tracking-tight text-text " +
  "border border-white/15 bg-white/6 backdrop-blur-xl " +
  "shadow-[inset_0_1px_0_0_oklch(1_0_0/0.22),inset_0_-1px_0_0_oklch(0_0_0/0.25),0_8px_32px_-8px_oklch(0_0_0/0.55)] " +
  "transition-all md:text-base";

const interactiveClasses =
  "hover:border-white/25 hover:bg-white/10 hover:brightness-105 hover:saturate-110 hover:shadow-[inset_0_1px_0_0_oklch(1_0_0/0.3),0_12px_30px_-22px_oklch(0_0_0/0.9)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

function PillContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_oklch(0.6532_0.2328_25.7/0.95)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-3 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent"
      />
      <span className="relative">{children}</span>
    </>
  );
}

export function PillChip({ children, href, className }: Props) {
  if (href) {
    const isExternal = /^https?:/.test(href);
    const Tag = isExternal ? "a" : Link;
    const extraProps = isExternal
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    return (
      <Tag
        href={href}
        className={cn(baseClasses, interactiveClasses, className)}
        {...extraProps}
      >
        <PillContent>{children}</PillContent>
      </Tag>
    );
  }
  return (
    <span className={cn(baseClasses, className)}>
      <PillContent>{children}</PillContent>
    </span>
  );
}
