"use client";

import { useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import type { MouseEvent } from "react";

/** Subtle 3D tilt that follows the cursor — the reference site's tilt.jquery.min.js
 *  effect, reimplemented with Framer Motion's spring physics instead of a jQuery plugin. */
export function useTilt(intensity = 8): {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  onMouseMove: (e: MouseEvent<HTMLElement>) => void;
  onMouseLeave: () => void;
} {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 300, damping: 30, mass: 0.5 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [intensity, -intensity]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-intensity, intensity]), spring);

  function onMouseMove(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    px.set(0);
    py.set(0);
  }

  return { rotateX, rotateY, onMouseMove, onMouseLeave };
}
