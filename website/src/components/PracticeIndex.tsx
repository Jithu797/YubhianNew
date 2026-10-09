"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EASE_OUT_QUART } from "@/lib/motion";

export type Practice = { id: string; name: string; blurb: string; count: number };

/**
 * Sticky "chapter card" for the Services page: stays pinned beside the list while the
 * reader scrolls, showing which practice they're in (big italic number, progress ring,
 * clickable index). The page's practice sections carry the matching ids.
 */
export default function PracticeIndex({ practices }: { practices: Practice[] }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const probe = window.innerHeight * 0.35;
      let current = 0;
      practices.forEach((p, i) => {
        const el = document.getElementById(p.id);
        if (el && el.getBoundingClientRect().top <= probe) current = i;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [practices]);

  function go(i: number) {
    const el = document.getElementById(practices[i]?.id ?? "");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - (window.innerHeight * 0.2);
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  }

  const p = practices[active];
  const total = practices.length;
  const pct = (active + 1) / total;
  const R = 18;
  const C = 2 * Math.PI * R;
  const num = String(active + 1).padStart(2, "0");

  return (
    <aside
      aria-label="Practices"
      className="sticky self-start rounded-2xl p-6 overflow-hidden"
      style={{
        top: "calc(var(--nav-height) + 24px)",
        // Faint dot grid over white, like a sheet of graph paper
        backgroundColor: "var(--surface)",
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(11,16,51,0.06) 1px, transparent 0)",
        backgroundSize: "18px 18px",
        border: "1px solid var(--hairline)",
        boxShadow: "0 20px 50px rgba(11,16,51,0.08)",
      }}
    >
      <div className="flex items-start justify-between">
        <p className="text-[11px] uppercase tracking-[0.16em] leading-relaxed" style={{ color: "var(--gray)" }}>
          Practice
          <br />
          <span className="tabular-nums">{num} of {String(total).padStart(2, "0")}</span>
        </p>
        {/* Progress ring */}
        <svg width="52" height="52" viewBox="0 0 48 48" aria-hidden>
          <circle cx="24" cy="24" r={R} fill="none" stroke="var(--hairline)" strokeWidth="2" />
          <motion.circle
            cx="24"
            cy="24"
            r={R}
            fill="none"
            stroke="var(--blue)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={false}
            animate={{ strokeDashoffset: C * (1 - pct) }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: EASE_OUT_QUART }}
            transform="rotate(-90 24 24)"
          />
          <text x="24" y="27.5" textAnchor="middle" style={{ fontSize: 9, fill: "var(--ink)", fontFamily: "var(--font-dm-sans)" }}>
            {Math.round(pct * 100)}%
          </text>
        </svg>
      </div>

      {/* Big italic number + practice name swap as the reader moves between practices */}
      <div className="relative mt-5 h-[188px] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={p?.id}
            initial={reduceMotion ? false : { y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { y: -40, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_QUART }}
            className="absolute inset-0"
          >
            <p className="leading-none" style={{ fontFamily: "var(--font-syne)", fontStyle: "italic", fontSize: "4.5rem", color: "var(--blue)" }}>
              {num}
              <span className="text-2xl align-top ml-1" style={{ color: "var(--sage)" }}>/{total}</span>
            </p>
            <p className="mt-3 text-xl leading-snug" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
              {p?.name}
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--gray)" }}>{p?.blurb}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <ol className="mt-6 flex flex-col">
        {practices.map((item, i) => {
          const on = i === active;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={on ? "true" : undefined}
                className="w-full flex items-center gap-3 py-2 text-left text-sm transition-colors"
                style={{ color: on ? "var(--white)" : "var(--gray)" }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] tabular-nums shrink-0 transition-colors"
                  style={on ? { background: "var(--blue)", color: "var(--paper)" } : { border: "1px solid var(--hairline)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 truncate">{item.name}</span>
                <span
                  className="h-px transition-all duration-500"
                  style={{ width: on ? 28 : 12, background: on ? "var(--blue)" : "var(--hairline)" }}
                />
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 pt-4 flex items-center justify-between text-xs uppercase tracking-[0.14em]" style={{ borderTop: "1px solid var(--hairline)" }}>
        <button type="button" onClick={() => go(Math.max(0, active - 1))} disabled={active === 0} className="flex items-center gap-1 disabled:opacity-30" style={{ color: "var(--gray)" }}>
          <ChevronLeft size={14} /> Prev
        </button>
        <button type="button" onClick={() => go(Math.min(total - 1, active + 1))} disabled={active === total - 1} className="flex items-center gap-1 disabled:opacity-30" style={{ color: "var(--gray)" }}>
          Next <ChevronRight size={14} />
        </button>
      </div>
    </aside>
  );
}
