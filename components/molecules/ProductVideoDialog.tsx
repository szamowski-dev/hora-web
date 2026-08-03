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

const videoUrl = "https://www.youtube.com/watch?v=ahVV5J25cYM";
const embedUrl =
  "https://www.youtube-nocookie.com/embed/ahVV5J25cYM?autoplay=1&rel=0";

export function ProductVideoDialog({ label }: { label: string }) {
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
