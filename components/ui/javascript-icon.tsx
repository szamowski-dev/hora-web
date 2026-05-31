import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

const JavascriptIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(async () => {
      animate(
        ".js-text",
        { pathLength: [0, 1], opacity: [0, 1] },
        { duration: 0.6, ease: "easeOut" },
      );
      await animate(
        ".border",
        { rotate: [0, 5, -5, 0] },
        { duration: 0.5, ease: "easeInOut" },
      );
    }, [animate]);

    const stop = useCallback(() => {
      animate(
        ".js-text, .border",
        { pathLength: 1, opacity: 1, rotate: 0 },
        { duration: 0.2 },
      );
    }, [animate]);

    useImperativeHandle(ref, () => ({
      startAnimation: start,
      stopAnimation: stop,
    }));

    return (
      <motion.svg
        ref={scope}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`cursor-pointer ${className}`}
        onHoverStart={start}
        onHoverEnd={stop}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <motion.path
          className="border"
          style={{ transformOrigin: "center" }}
          d="M20 4l-2 14.5l-6 2l-6 -2l-2 -14.5z"
        />
        <motion.path
          className="js-text"
          initial={{ pathLength: 1, opacity: 1 }}
          d="M7.5 8h3v8l-2 -1"
        />
        <motion.path
          className="js-text"
          initial={{ pathLength: 1, opacity: 1 }}
          d="M16.5 8h-2.5a.5 .5 0 0 0 -.5 .5v3a.5 .5 0 0 0 .5 .5h1.423a.5 .5 0 0 1 .495 .57l-.418 2.93l-2 .5"
        />
      </motion.svg>
    );
  },
);

JavascriptIcon.displayName = "JavascriptIcon";
export default JavascriptIcon;
