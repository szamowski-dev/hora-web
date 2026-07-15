import { cn } from "@/lib/cn";

export function AutoVideo({
  src,
  mp4Src,
  poster,
  className,
  autoPlay = true,
  loop = true,
  muted = true,
}: {
  src: string;
  mp4Src?: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}) {
  return (
    <video
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      controls={!autoPlay}
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
