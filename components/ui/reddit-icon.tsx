"use client";

import { forwardRef, useCallback, useImperativeHandle } from "react";
import { motion } from "motion/react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { useSafeAnimate } from "./useSafeAnimate";

const RedditIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useSafeAnimate();

    const start = useCallback(async () => {
      await animate(
        ".reddit-icon",
        { scale: [1, 1.1, 1], rotate: [0, -6, 6, 0] },
        { duration: 0.45, ease: "easeInOut" },
      );
    }, [animate]);

    const stop = useCallback(() => {
      animate(
        ".reddit-icon",
        { scale: 1, rotate: 0 },
        { duration: 0.2, ease: "easeOut" },
      );
    }, [animate]);

    useImperativeHandle(ref, () => ({
      startAnimation: start,
      stopAnimation: stop,
    }));

    return (
      <motion.svg
        ref={scope}
        onHoverStart={start}
        onHoverEnd={stop}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="2 1 20 20"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`cursor-pointer ${className}`}
      >
        <motion.g className="reddit-icon" style={{ transformOrigin: "center" }}>
          <path d="M12 8c-3.866 0 -7 2.239 -7 5s3.134 5 7 5s7 -2.239 7 -5s-3.134 -5 -7 -5z" />
          <path d="M12 8l1 -5l5 1" />
          <circle cx="19" cy="4" r="1" />
          <circle cx="8.5" cy="13" r=".5" fill={color} stroke="none" />
          <circle cx="15.5" cy="13" r=".5" fill={color} stroke="none" />
          <path d="M9 16c1 .667 2 .833 3 .833s2 -.166 3 -.833" />
        </motion.g>
      </motion.svg>
    );
  },
);

RedditIcon.displayName = "RedditIcon";
export default RedditIcon;
