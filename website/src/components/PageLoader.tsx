"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LOGO_PARTS, LOGO_VIEWBOX } from "./LogoMark";

// Logo intro, after Codegene's: on a near-black screen the logo's four shapes draw
// themselves in glowing sky-blue strokes, fill in white and grey, the wordmark rises
// beneath, then a soft bloom lifts the curtain on the page. The full sequence plays once
// per browser session; later full loads get a quick version so it never becomes a toll.
const SEEN_KEY = "yubhian-intro-seen";
const FULL_MS = 2900; // draw + fill + wordmark + a beat to read it
const QUICK_MS = 650;
const MAX_MS = 6000; // a stalled asset can never trap anyone behind the intro

const EASE = [0.165, 0.84, 0.44, 1] as const;
const WORD = "Yubhian";

function readSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export default function PageLoader() {
  const reduceMotion = useReducedMotion() ?? false;
  // Server render (and the very first paint) always shows the full intro's first frame;
  // the browser then knows whether this session has already seen it.
  const seen = useSyncExternalStore(() => () => {}, readSeen, () => false);
  const quick = seen || reduceMotion;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = performance.now();
    const minMs = quick ? QUICK_MS : FULL_MS;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Private mode — the intro will simply play again next time.
      }
      setVisible(false);
    };
    const whenReady = () => setTimeout(finish, Math.max(0, minMs - (performance.now() - start)));
    let readyTimer: ReturnType<typeof setTimeout> | undefined;
    if (document.readyState === "complete") readyTimer = whenReady();
    else window.addEventListener("load", () => (readyTimer = whenReady()), { once: true });
    const capTimer = setTimeout(finish, MAX_MS);
    return () => {
      clearTimeout(capTimer);
      if (readyTimer) clearTimeout(readyTimer);
    };
  }, [quick]);

  // Timings (seconds) for the full sequence; the quick version shows the finished logo.
  const t = quick
    ? { draw: 0, stagger: 0, fill: 0, word: 0 }
    : { draw: 1.1, stagger: 0.16, fill: 1.25, word: 1.55 };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="preloader-overlay fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-7 px-6 overflow-hidden"
          style={{ background: "radial-gradient(ellipse at 50% 45%, #0A1550 0%, #050A2E 55%, #02041A 100%)" }}
          role="status"
          aria-label="Loading Yubhian Technologies"
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.04, filter: "blur(6px)" }}
          transition={{ duration: reduceMotion ? 0.25 : 0.75, ease: EASE }}
        >
          {/* Bloom that swells behind the logo as it completes */}
          {!quick && (
            <motion.div
              aria-hidden
              className="absolute rounded-full"
              style={{ width: "70vmin", height: "70vmin", background: "radial-gradient(closest-side, rgba(124,196,255,0.35), transparent)" }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: [0, 0.9, 0.55], scale: [0.4, 1.1, 1] }}
              transition={{ duration: 1.6, delay: t.fill - 0.2, ease: EASE }}
            />
          )}

          <svg
            viewBox={LOGO_VIEWBOX}
            className="relative w-[min(30vmin,176px)] h-auto overflow-visible"
            aria-hidden
            style={{ filter: "drop-shadow(0 0 10px rgba(124,196,255,0.7)) drop-shadow(0 0 28px rgba(124,196,255,0.35))" }}
          >
            {LOGO_PARTS.map((part, i) => (
              <g key={i}>
                {/* Fill fades in once the outlines are drawn */}
                <motion.path
                  d={part.d}
                  fill={part.fill}
                  initial={{ opacity: quick ? 1 : 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: t.fill + i * 0.06, ease: EASE }}
                />
                {/* Glowing outline that traces itself, then fades into the fill */}
                {!quick && (
                  <motion.path
                    d={part.d}
                    fill="none"
                    stroke="#7CC4FF"
                    strokeWidth={16}
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 1 }}
                    animate={{ pathLength: 1, opacity: [1, 1, 0] }}
                    transition={{
                      pathLength: { duration: t.draw, delay: i * t.stagger, ease: [0.65, 0, 0.35, 1] },
                      opacity: { duration: t.fill + 0.6, times: [0, 0.75, 1], delay: i * t.stagger },
                    }}
                  />
                )}
              </g>
            ))}
          </svg>

          {/* Wordmark */}
          <div className="relative flex flex-col items-center gap-2">
            <p aria-hidden className="flex overflow-hidden" style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.9rem, 5vmin, 2.6rem)", color: "#F6F7FB", lineHeight: 1.1 }}>
              {Array.from(WORD).map((ch, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={quick ? false : { y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: t.word + i * 0.05, ease: EASE }}
                >
                  {ch}
                </motion.span>
              ))}
            </p>
            <motion.p
              aria-hidden
              className="text-[10px] sm:text-xs uppercase"
              style={{ color: "rgba(246,247,251,0.6)", fontFamily: "var(--font-dm-sans)" }}
              initial={quick ? false : { opacity: 0, letterSpacing: "0.9em" }}
              animate={{ opacity: 1, letterSpacing: "0.42em" }}
              transition={{ duration: 0.9, delay: t.word + 0.35, ease: EASE }}
            >
              Technologies
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
