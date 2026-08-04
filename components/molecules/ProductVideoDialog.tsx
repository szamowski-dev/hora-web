"use client";

import { MdPlayCircleOutline } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { analyticsAttrs } from "@/lib/analyticsAttrs";

function youtubeEmbedUrl(videoUrl: string) {
  const url = new URL(videoUrl);
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const videoId =
    hostname === "youtu.be"
      ? pathSegments[0]
      : url.searchParams.get("v") ??
        (["embed", "shorts", "live"].includes(pathSegments[0] ?? "")
          ? pathSegments[1]
          : undefined);

  if (!videoId) throw new Error("YouTube video URL is missing a video ID.");

  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
}

export function ProductVideoDialog({
  label,
  videoUrl,
}: {
  label: string;
  videoUrl: string;
}) {
  const embedUrl = youtubeEmbedUrl(videoUrl);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          variant="accent-outline"
          {...analyticsAttrs("nav_click", {
            link_text: label,
            link_url: videoUrl,
          })}
        >
          <MdPlayCircleOutline data-icon="inline-start" aria-hidden="true" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="aspect-video !w-[calc(100%-2rem)] !max-w-[90rem] max-h-[calc(100dvh-2rem)] overflow-hidden p-0">
        <DialogTitle className="sr-only">
          hora Calendar product video
        </DialogTitle>
        <iframe
          className="size-full border-0"
          src={embedUrl}
          title="hora Calendar product video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </DialogContent>
    </Dialog>
  );
}
