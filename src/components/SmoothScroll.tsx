"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Adds the inertia/momentum scroll feel the ithub reference gets from GSAP's
// ScrollSmoother — Lenis is the lightweight, dependency-free modern equivalent, and
// (unlike ScrollSmoother's transform-based virtual scroll) it still moves the real
// document scroll position, so existing useInView scroll-reveal triggers keep working
// unchanged.
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
