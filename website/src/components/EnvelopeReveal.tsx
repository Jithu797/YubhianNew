"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EASE_OUT_QUART, EASE_OUT_BACK } from "@/lib/motion";

/** Envelope open animation — layered flap + body + letter, flap folds open via a
 *  perspective 3D rotate and the letter card slides up out of the pocket as the
 *  section scrolls into view. Triggers once. */
export default function EnvelopeReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px -20% 0px" });
  const reduceMotion = useReducedMotion();

  return (
    <div ref={ref} className="flex flex-col items-center">
      {/* Envelope illustration */}
      <div className="relative w-full max-w-[320px] mb-10" style={{ perspective: 1000 }}>
        <div className="relative w-full" style={{ paddingBottom: "62%" }}>
          {/* Back panel */}
          <div
            className="absolute inset-0 rounded-b-2xl rounded-t-md"
            style={{ background: "linear-gradient(160deg, #12203B 0%, #1A2C4E 100%)", border: "1px solid var(--border)" }}
          />

          {/* Letter — slides up out of the envelope */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 rounded-md shadow-lg"
            style={{
              bottom: "8%",
              width: "78%",
              height: "68%",
              background: "#F5F6FA",
              zIndex: 1,
            }}
            initial={reduceMotion ? false : { y: 6, opacity: 0 }}
            animate={inView ? { y: -34, opacity: 1 } : {}}
            transition={{ duration: reduceMotion ? 0.2 : 0.8, delay: reduceMotion ? 0 : 0.35, ease: EASE_OUT_QUART }}
          >
            <div className="p-3 flex flex-col gap-1.5">
              <div className="h-1.5 rounded-full w-3/4" style={{ background: "rgba(18,32,59,0.15)" }} />
              <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(18,32,59,0.1)" }} />
              <div className="h-1.5 rounded-full w-5/6" style={{ background: "rgba(18,32,59,0.1)" }} />
            </div>
          </motion.div>

          {/* Front pocket (bottom triangle) — sits above the letter's lower half */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 320 198"
            preserveAspectRatio="none"
            style={{ zIndex: 2 }}
          >
            <path d="M0,0 L160,120 L320,0 L320,198 L0,198 Z" fill="#0B1220" />
          </svg>

          {/* Flap — folds open via rotateX around its top edge */}
          <motion.div
            className="absolute top-0 left-0 right-0"
            style={{ transformOrigin: "top center", zIndex: 3 }}
            initial={{ rotateX: 0 }}
            animate={inView ? { rotateX: reduceMotion ? -180 : -170 } : {}}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: EASE_OUT_BACK }}
          >
            <svg viewBox="0 0 320 120" className="w-full" style={{ display: "block" }}>
              <path d="M0,0 L320,0 L160,110 Z" fill="#1A2C4E" stroke="var(--border)" strokeWidth="1" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Letter content */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: reduceMotion ? 0.2 : 0.6, delay: reduceMotion ? 0 : 0.9, ease: EASE_OUT_QUART }}
        className="max-w-2xl text-center"
      >
        {children}
      </motion.div>
    </div>
  );
}
