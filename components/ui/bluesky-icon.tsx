"use client";

import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion } from "motion/react";
import { useSafeAnimate } from "./useSafeAnimate";

// Arcticons Bluesky butterfly (https://www.shadcn.io/icon/arcticons-bluesky),
// animated to flutter its wings on hover to match the other hover icons.
const BlueskyIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 3, className = "" },
    ref,
  ) => {
    const [scope, animate] = useSafeAnimate();

    const start = useCallback(async () => {
      await animate(
        ".bluesky-icon",
        {
          scaleX: [1, 0.8, 1.06, 0.92, 1],
          rotate: [0, -7, 7, -3, 0],
          y: [0, -1.5, 0],
        },
        { duration: 0.7, ease: "easeInOut" },
      );
    }, [animate]);

    const stop = useCallback(() => {
      animate(
        ".bluesky-icon",
        { scaleX: 1, rotate: 0, y: 0 },
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
        viewBox="0 0 48 48"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`cursor-pointer ${className}`}
      >
        <motion.g className="bluesky-icon" style={{ transformOrigin: "center" }}>
          <path d="M24 32.19c0-.196.075.025.237.5c.874 2.577 4.289 12.631 12.096 4.593c4.111-4.232 2.208-8.463-5.275-9.741c4.28.73 9.094-.477 10.414-5.212c.38-1.362 1.028-9.752 1.028-10.885c0-5.676-4.96-3.892-8.02-1.587c-4.242 3.195-8.805 9.673-10.48 13.15c-1.675-3.477-6.238-9.954-10.48-13.15C10.46 7.553 5.5 5.77 5.5 11.445c0 1.133.647 9.523 1.028 10.885c1.32 4.735 6.133 5.943 10.414 5.212c-7.483 1.278-9.386 5.51-5.275 9.741c7.807 8.038 11.222-2.016 12.096-4.592c.162-.476.237-.697.237-.501" />
        </motion.g>
      </motion.svg>
    );
  },
);

BlueskyIcon.displayName = "BlueskyIcon";
export default BlueskyIcon;
