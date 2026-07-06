"use client";

import { useCallback } from "react";
import { useAnimate } from "motion/react";

/**
 * `useAnimate` wrapper whose returned `animate` never settles as a rejected
 * promise.
 *
 * motion rejects an animation's promise when it is interrupted — e.g. hovering
 * out cancels the in-flight hover-in animation. Our animated icons
 * `await animate(...)` inside async hover handlers wired straight to
 * `onHoverStart` / `onHoverEnd`, so that rejection had nothing catching it. On
 * Safari it surfaced as an unhandled `DOMException: InvalidStateError`
 * (observed on web, Mobile Safari, no stack trace).
 *
 * Swallowing the interruption rejection here fixes every animated icon in one
 * place. The icons only ever `await` the result, so collapsing it to a
 * never-rejecting promise is behaviourally transparent.
 *
 * The return type is intentionally left to inference so `scope` keeps the same
 * loose element type as a bare `useAnimate()` call — the icons attach it to
 * both `motion.svg` and `motion.div` refs.
 */
export function useSafeAnimate() {
  const [scope, animate] = useAnimate();

  const safeAnimate = useCallback(
    (...args: unknown[]) => {
      let controls: unknown;
      try {
        controls = (animate as (...a: unknown[]) => unknown)(...args);
      } catch {
        // motion threw synchronously (e.g. animating a detached node) —
        // nothing to await, the animation simply did not start.
        return Promise.resolve(undefined);
      }
      return Promise.resolve(controls as PromiseLike<unknown> | undefined).then(
        () => undefined,
        () => undefined,
      );
    },
    [animate],
  );

  return [scope, safeAnimate as unknown as typeof animate] as const;
}
