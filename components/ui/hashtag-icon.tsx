"use client";

import { forwardRef, useCallback, useImperativeHandle } from "react";
import { motion } from "motion/react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { useSafeAnimate } from "./useSafeAnimate";

const HashtagIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useSafeAnimate();

    const start = useCallback(async () => {
      animate(
        ".line-horizontal",
        {
          scaleX: 1.1,
          opacity: 0.7,
        },
        {
          duration: 0.3,
          ease: "easeOut",
        },
      );

      animate(
        ".line-vertical",
        {
          scaleY: 1.1,
          opacity: 0.7,
        },
        {
          duration: 0.3,
          delay: 0.1,
          ease: "easeOut",
        },
      );
    }, [animate]);

    const stop = useCallback(async () => {
      animate(
        ".line-horizontal, .line-vertical",
        {
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
        },
        {
          duration: 0.25,
          ease: "easeInOut",
        },
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
        <motion.path className="line-horizontal" d="M5 9l14 0" />
        <motion.path className="line-horizontal" d="M5 15l14 0" />
        <motion.path className="line-vertical" d="M11 4l-4 16" />
        <motion.path className="line-vertical" d="M17 4l-4 16" />
      </motion.svg>
    );
  },
);

HashtagIcon.displayName = "HashtagIcon";
export default HashtagIcon;
