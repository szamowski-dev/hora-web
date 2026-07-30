import Image from "next/image";

export function HoraWorkflowVisual() {
  return (
    <Image
      src="/assets/product/calendar-add-event.png"
      alt="hora event editor with natural-language event creation"
      width={1024}
      height={576}
      sizes="(min-width: 1024px) 1024px, calc(100vw - 2.5rem)"
      className="mx-auto h-auto w-full max-w-5xl"
    />
  );
}
