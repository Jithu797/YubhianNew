// Named easing curves, matching the ones antigravity.google actually ships (extracted
// from their production CSS custom properties) rather than generic "easeOut"/"easeInOut"
// strings — these deliberate curves are a meaningful part of why motion on that site
// reads as premium rather than default.
export const EASE_OUT_QUART = [0.165, 0.84, 0.44, 1] as const;
export const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;
export const EASE_OUT_BACK = [0.34, 1.85, 0.64, 1] as const;
export const EASE_IN_OUT_QUART = [0.77, 0, 0.175, 1] as const;

// Shared baseline for the scroll-reveal animation layer (ScrollReveal, CountUp,
// pinned/stacked sections) — one set of numbers so every reveal on the site moves at
// the same tempo instead of each component inventing its own timing.
export const REVEAL_DURATION = 0.75;
export const REVEAL_STAGGER = 0.1;
export const REVEAL_DISTANCE = 32; // px, translateY starting offset
export const REVEAL_EASE = EASE_OUT_QUART;

/** Scroll-triggered fade-up props for `motion.*` elements, sharing the same timing as
 *  <ScrollReveal>. Use this when spreading props onto an existing motion element;
 *  prefer <ScrollReveal> when you can wrap instead. */
export function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: REVEAL_DISTANCE },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-15% 0px -15% 0px" },
    transition: { duration: REVEAL_DURATION, delay, ease: REVEAL_EASE },
  } as const;
}
