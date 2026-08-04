"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

const NBSP = " ";

/** Per-character squash-and-bounce wave, looping with a pause between cycles — a
 *  Framer Motion stand-in for the reference site's GSAP SplitText + elastic-easing
 *  character animation (no SplitText/GSAP dependency needed for a single looping word). */
export default function WaveText({ text, className, style }: { text: string; className?: string; style?: CSSProperties }) {
  const chars = Array.from(text);
  return (
    <span aria-label={text} className={className} style={{ display: "inline-block", ...style }}>
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          style={{ display: "inline-block", transformOrigin: "center bottom" }}
          animate={{ y: [0, -14, 0], scaleY: [1, 0.7, 1.15, 1] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            repeatDelay: 1.6,
            ease: "easeInOut",
            delay: i * 0.045,
          }}
        >
          {ch === " " ? NBSP : ch}
        </motion.span>
      ))}
    </span>
  );
}
