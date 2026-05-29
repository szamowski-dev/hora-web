import { cn } from "@/lib/cn";

export function AutoVideo({
  src,
  mp4Src,
  poster,
  className,
}: {
  src: string;
  mp4Src?: string;
  poster?: string;
  className?: string;
}) {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      poster={poster}
      className={cn(
        "my-6 h-auto w-full rounded-xl border border-border",
        className,
      )}
    >
      <source src={src} type="video/webm" />
      {mp4Src ? <source src={mp4Src} type="video/mp4" /> : null}
    </video>
  );
}
