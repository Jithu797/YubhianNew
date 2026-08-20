"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// Adds the inertia/momentum scroll feel the ithub reference gets from GSAP's
// ScrollSmoother — Lenis is the lightweight, dependency-free modern equivalent, and
// (unlike ScrollSmoother's transform-based virtual scroll) it still moves the real
// document scroll position, so existing useInView scroll-reveal triggers keep working
// unchanged.
//
// Driven by gsap.ticker rather than its own rAF loop, and reports every scroll tick to
// ScrollTrigger.update — this is what keeps pinned/stacked GSAP sections in sync with
// Lenis's eased scroll position instead of jittering a frame behind it.
export default function SmoothScroll() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    function tick(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reduceMotion]);

  return null;
}
