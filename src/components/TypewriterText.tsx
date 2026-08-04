"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";

/** Types out `text`, holds, deletes, and repeats — a hand-rolled stand-in for the
 *  reference site's TypeIt.js loop (its .variable-text footer watermark), avoiding a
 *  new dependency for a single looping word. */
export default function TypewriterText({ text, className, style }: { text: string; className?: string; style?: CSSProperties }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let i = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    function tick() {
      if (!deleting) {
        i++;
        setDisplay(text.slice(0, i));
        timeout = setTimeout(tick, i === text.length ? 1600 : 160);
        if (i === text.length) deleting = true;
      } else {
        i--;
        setDisplay(text.slice(0, i));
        timeout = setTimeout(tick, i === 0 ? 500 : 80);
        if (i === 0) deleting = false;
      }
    }

    timeout = setTimeout(tick, 400);
    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <span aria-hidden className={className} style={style}>
      {display}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        |
      </motion.span>
    </span>
  );
}
