import { cn } from "@/lib/cn";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-12 w-full rounded-full border border-border bg-surface px-5 text-sm text-text placeholder:text-muted transition-[border-color,box-shadow] focus-visible:border-line-strong focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/10 focus-visible:ring-offset-0",
        className,
      )}
    />
  );
}
