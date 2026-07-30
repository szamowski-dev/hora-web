import { MdOutlineImage } from "react-icons/md";
import { cn } from "@/lib/cn";

function ProductImagePlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      aria-label={label}
      role="img"
      className={cn(
        "relative mx-auto flex aspect-video w-full items-center justify-center overflow-hidden rounded-[30px] border border-dashed border-line-strong bg-panel-deep/55",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="flex flex-col items-center gap-3 text-muted"
      >
        <MdOutlineImage className="size-10" />
        <span className="text-sm font-medium">Product image placeholder</span>
      </div>
    </div>
  );
}

export function HoraWorkflowVisual() {
  return (
    <ProductImagePlaceholder
      label="Hora workflow screenshot placeholder"
      className="max-w-5xl"
    />
  );
}
