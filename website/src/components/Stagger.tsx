"use client";

import type { ReactNode, CSSProperties } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { REVEAL_DURATION, REVEAL_STAGGER, REVEAL_DISTANCE, REVEAL_EASE } from "@/lib/motion";

// Orchestration lives on the container and cascades to any <StaggerItem> descendant,
// so a list reveals in sequence without each item hand-computing its own delay.
const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: REVEAL_STAGGER, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: REVEAL_DISTANCE },
  show: { opacity: 1, y: 0, transition: { duration: REVEAL_DURATION, ease: REVEAL_EASE } },
};

type CommonProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

/**
 * Wraps an existing layout element (a grid, a flex column) and reveals its
 * <StaggerItem> children in sequence.
 *
 * Deliberately does NOT inject wrapper elements around each child: the container
 * itself carries the caller's layout classes, so grid/flex placement of the real
 * children is untouched.
 */
export function Stagger({ children, className, style, id, amount = 0.2 }: CommonProps & { amount?: number }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} style={style} id={id}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      id={id}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

/** A single member of a <Stagger> group. Inherits its timing from the parent. */
export function StaggerItem({ children, className, style, id }: CommonProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} style={style} id={id}>
        {children}
      </div>
    );
  }

  return (
    <motion.div className={className} style={style} id={id} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
