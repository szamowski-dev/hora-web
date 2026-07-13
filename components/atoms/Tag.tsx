import { cn } from "@/lib/cn";

export function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-overlay px-2.5 py-0.5 text-[11px] text-muted backdrop-blur-xl shadow-[inset_0_1px_0_oklch(1_0_0/0.08)] transition-[color,background-color,border-color,filter] hover:border-line-strong hover:bg-overlay-strong hover:text-text hover:brightness-105 hover:saturate-110",
        className,
      )}
    >
      {children}
    </span>
  );
}
