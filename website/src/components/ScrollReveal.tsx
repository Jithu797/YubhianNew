"use client";

import { useRef, type ReactNode, type CSSProperties, type ComponentType } from "react";
import { motion, useInView, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { REVEAL_DURATION, REVEAL_DISTANCE, REVEAL_EASE } from "@/lib/motion";

// Pre-created once at module scope (not per-render) — creating a component type with
// motion.create() inside the component body would give it a fresh identity every
// render, silently resetting its animation state each time. Cast to a single shared
// props shape since every tag here accepts the same subset of props this component
// actually passes (id/className/style/ref/initial/animate/transition/children).
const TAGS = {
  div: motion.create("div"),
  section: motion.create("section"),
  span: motion.create("span"),
  p: motion.create("p"),
  h1: motion.create("h1"),
  h2: motion.create("h2"),
  h3: motion.create("h3"),
  ul: motion.create("ul"),
  li: motion.create("li"),
} as unknown as Record<string, ComponentType<HTMLMotionProps<"div">>>;

type ScrollRevealProps = {
  children: ReactNode;
  /** Render as a different tag — same motion.div-style API the codebase already uses,
   *  just centralized so every section shares one timing/easing baseline. */
  as?: keyof typeof TAGS;
  className?: string;
  style?: CSSProperties;
  /** Stagger offset in seconds — pass `index * REVEAL_STAGGER` when mapping a list,
   *  matching the delay-per-item pattern already used throughout the site. */
  delay?: number;
  duration?: number;
  /** Starting vertical offset in px (translateY). */
  y?: number;
  /** Re-trigger every time the element scrolls into view instead of only once. */
  repeat?: boolean;
  /** How far into the viewport before triggering — matches the 15-20% spec. */
  margin?: string;
  id?: string;
};

export default function ScrollReveal({
  children,
  as = "div",
  className,
  style,
  delay = 0,
  duration = REVEAL_DURATION,
  y = REVEAL_DISTANCE,
  repeat = false,
  margin = "-15% 0px -15% 0px",
  id,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: !repeat, margin: margin as `${number}px` });
  const reduceMotion = useReducedMotion();
  const Component = TAGS[as];

  if (reduceMotion) {
    // prefers-reduced-motion: reduce — render in its final state immediately, no
    // transform/slide, just an instant fade so content isn't jarringly absent.
    return (
      <Component ref={ref} id={id} className={className} style={style}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      ref={ref}
      id={id}
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration, delay, ease: REVEAL_EASE }}
    >
      {children}
    </Component>
  );
}
