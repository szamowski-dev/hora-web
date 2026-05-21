"use client";

import { useEffect } from "react";
import gsap from "gsap";

function onceInView(
  selector: string,
  onEnter: (el: Element) => void,
  rootMargin = "0px 0px -12% 0px",
) {
  const elements = Array.from(document.querySelectorAll(selector));
  if (!elements.length) return () => {};

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        onEnter(entry.target);
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.2, rootMargin },
  );

  elements.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

export function LandingGsapAnimations() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    const cleaners: Array<() => void> = [];

    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        desktop: "(min-width: 960px)",
      },
      (ctx) => {
        const { reduceMotion, desktop } = ctx.conditions as {
          reduceMotion: boolean;
          desktop: boolean;
        };
        if (reduceMotion) return;

        gsap.defaults({ ease: "power2.out", duration: 0.7 });

        gsap.from("[data-anim='hero-title']", { y: 20, autoAlpha: 0, duration: 0.75 });
        gsap.from("[data-anim='hero-copy']", {
          y: 16,
          autoAlpha: 0,
          duration: 0.7,
          delay: 0.08,
        });
        gsap.from("[data-anim='hero-cta']", {
          y: 14,
          autoAlpha: 0,
          duration: 0.7,
          delay: 0.16,
        });
        gsap.from("[data-anim='hero-proof']", {
          y: 12,
          autoAlpha: 0,
          duration: 0.65,
          delay: 0.22,
        });
        gsap.from("[data-anim='hero-shot']", {
          y: desktop ? 28 : 16,
          scale: desktop ? 1.035 : 1.015,
          autoAlpha: 0,
          duration: 0.95,
          ease: "power3.out",
          delay: 0.2,
        });
        gsap.from("[data-anim='hero-pill']", {
          y: 10,
          autoAlpha: 0,
          stagger: 0.07,
          duration: 0.55,
          delay: 0.38,
        });

        cleaners.push(
          onceInView("[data-anim='featured-badge']", () => {
            gsap.fromTo(
              "[data-anim='featured-badge']",
              { x: 18, autoAlpha: 0 },
              { x: 0, autoAlpha: 1, duration: 0.55, stagger: 0.06, overwrite: "auto" },
            );
          }),
        );

        cleaners.push(
          onceInView("[data-anim='video-title']", () => {
            gsap.fromTo(
              "[data-anim='video-title']",
              { y: 18, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.7, overwrite: "auto" },
            );
            gsap.fromTo(
              "[data-anim='video-player']",
              { y: 22, autoAlpha: 0, scale: 0.985 },
              { y: 0, autoAlpha: 1, scale: 1, duration: 0.85, delay: 0.08, overwrite: "auto" },
            );
            gsap.fromTo(
              "[data-anim='video-card']",
              { y: 16, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.58, stagger: 0.08, delay: 0.12, overwrite: "auto" },
            );
            gsap.fromTo(
              "[data-anim='video-chip']",
              { y: 10, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.04, delay: 0.2, overwrite: "auto" },
            );
          }),
        );

        cleaners.push(
          onceInView("[data-anim='feature-card']", () => {
            gsap.fromTo(
              "[data-anim='features-title']",
              { y: 16, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.72, overwrite: "auto" },
            );
            gsap.fromTo(
              "[data-anim='feature-card']",
              { y: 14, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.56, stagger: 0.06, delay: 0.08, overwrite: "auto" },
            );
            gsap.fromTo(
              "[data-anim='feature-icon']",
              { scale: 0.9, autoAlpha: 0 },
              { scale: 1, autoAlpha: 1, duration: 0.45, stagger: 0.05, ease: "back.out(1.7)", delay: 0.18, overwrite: "auto" },
            );
          }),
        );

        cleaners.push(
          onceInView("[data-anim='pricing-title']", () => {
            gsap.fromTo(
              "[data-anim='pricing-title'], [data-anim='pricing-copy']",
              { y: 14, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.08, overwrite: "auto" },
            );
            gsap.fromTo(
              "[data-anim='pricing-card']",
              { y: 12, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.52, stagger: 0.06, delay: 0.1, overwrite: "auto" },
            );
            gsap.fromTo(
              "[data-anim='pricing-hora']",
              { boxShadow: "0 0 0 rgba(255,56,60,0)" },
              {
                boxShadow: "0 0 28px rgba(255,56,60,0.22)",
                duration: 0.8,
                yoyo: true,
                repeat: 1,
                ease: "sine.inOut",
                delay: 0.28,
                overwrite: "auto",
              },
            );
          }),
        );

        cleaners.push(
          onceInView("[data-anim='roadmap-item']", () => {
            gsap.fromTo(
              "[data-anim='roadmap-item']",
              { y: 18, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.62, stagger: 0.11, overwrite: "auto" },
            );
            gsap.fromTo(
              "[data-anim='roadmap-connector']",
              { scaleY: 0, transformOrigin: "top top" },
              { scaleY: 1, duration: 0.6, stagger: 0.1, delay: 0.08, overwrite: "auto" },
            );
          }),
        );

        cleaners.push(
          onceInView("[data-anim='faq-item']", () => {
            gsap.fromTo(
              "[data-anim='faq-item']",
              { y: 12, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.045, overwrite: "auto" },
            );
          }),
        );
      },
    );

    return () => {
      cleaners.forEach((clean) => clean());
      mm.revert();
    };
  }, []);

  return null;
}
