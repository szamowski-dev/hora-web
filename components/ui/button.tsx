import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-[background-color,border-color,color,box-shadow,transform] outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-text text-bg shadow-[0_12px_30px_-18px_var(--ui-shadow-neutral)] hover:-translate-y-px hover:bg-white/90",
        accent:
          "bg-accent text-text shadow-[0_14px_34px_-18px_var(--color-accent)] hover:-translate-y-px hover:bg-accent-hover",
        "accent-outline":
          "border border-accent/55 bg-accent/8 text-accent shadow-[inset_0_1px_0_var(--ui-highlight)] hover:border-accent/75 hover:bg-accent/14 hover:text-text",
        destructive: "bg-accent text-text hover:bg-accent-hover",
        outline:
          "border border-line-strong bg-overlay text-text shadow-[inset_0_1px_0_var(--ui-highlight)] hover:border-white/20 hover:bg-overlay-strong",
        secondary: "bg-surface text-text hover:bg-panel",
        ghost: "text-muted hover:bg-overlay hover:text-text",
        link: "text-text underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 has-[>svg]:px-4",
        xs: "h-7 gap-1 px-3 text-xs has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-4 has-[>svg]:px-3.5",
        lg: "h-12 px-7 text-[15px] has-[>svg]:px-6",
        icon: "size-9",
        "icon-xs":
          "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
