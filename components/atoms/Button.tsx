import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[inset_0_1px_0_oklch(1_0_0/0.18),0_14px_34px_-24px_oklch(0_0_0/0.92)] transition-[background-color,filter] hover:bg-accent-hover hover:brightness-105 hover:saturate-110 focus-visible:ring-accent",
  outline:
    "ui-interactive border border-line bg-overlay text-text focus-visible:ring-accent",
  ghost: "text-muted hover:text-text focus-visible:ring-accent",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

const baseClasses =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full [corner-shape:superellipse(1.6)] font-medium disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
    external?: boolean;
  };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, external, ...rest } = props;
    const isExternal = external ?? /^https?:/.test(href);
    if (isExternal) {
      return (
        <a
          {...rest}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {children}
        </a>
      );
    }
    return (
      <Link {...rest} href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { ...buttonRest } = props;
  return (
    <button {...buttonRest} className={classes}>
      {children}
    </button>
  );
}
