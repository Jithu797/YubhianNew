"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useReducedMotion } from "framer-motion";
import { EASE_OUT_QUART } from "@/lib/motion";

// Just long enough to avoid a jarring flash on a fast connection — deliberately not a
// padded "minimum show time", since holding a ready page hostage isn't a good first
// impression. The ceiling guarantees a stalled asset can never trap anyone.
const MIN_MS = 450;
const MAX_MS = 6000;
const SLOW_MS = 2500;

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [percent, setPercent] = useState(0);
  const [slow, setSlow] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;
  const scaleX = useMotionValue(0);
  const doneRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const slowTimer = setTimeout(() => setSlow(true), SLOW_MS);

    // Eases toward 90% while assets are still in flight, then completes once the
    // document is ready — so the bar reflects real progress rather than a fixed timer.
    const tick = (now: number) => {
      const elapsed = now - start;
      const ready = document.readyState === "complete" && elapsed >= MIN_MS;
      const ceiling = ready || elapsed >= MAX_MS ? 1 : 0.9;
      const eased = ceiling * (1 - Math.pow(1 - Math.min(elapsed / 900, 1), 3));
      const next = Math.min(ceiling, Math.max(scaleX.get(), eased));

      scaleX.set(next);
      // Only re-render when the displayed integer actually changes, so the label
      // costs ~100 renders total instead of one per frame.
      setPercent((p) => (Math.round(next * 100) !== p ? Math.round(next * 100) : p));

      if (next >= 1 && !doneRef.current) {
        doneRef.current = true;
        setTimeout(() => setVisible(false), 260);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(slowTimer);
    };
  }, [scaleX]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="preloader-overlay fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 px-6"
          style={{ background: "var(--navy)" }}
          initial={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.5, ease: EASE_OUT_QUART }}
        >
          <motion.div
            className="flex items-center gap-3"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT_QUART }}
          >
            <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0">
              <Image src="/logo.jpg" alt="" aria-hidden width={48} height={48} priority className="w-full h-full object-cover" />
            </span>
            <span
              className="text-xl sm:text-2xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}
            >
              Yubhian
            </span>
          </motion.div>

          {/* Determinate progress bar — a transform-only fill, centred at every width */}
          <div
            className="w-[min(220px,60vw)] h-[3px] rounded-full overflow-hidden"
            style={{ background: "var(--border)" }}
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Loading"
          >
            <motion.div
              className="h-full w-full rounded-full"
              style={{ background: "var(--grad)", scaleX, transformOrigin: "left center" }}
            />
          </div>

          <p className="text-xs tabular-nums tracking-widest uppercase" style={{ color: "var(--gray)" }}>
            {slow && percent < 100 ? "Slow connection…" : `${percent}%`}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
