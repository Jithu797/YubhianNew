"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Report-style tab bar fixed to the bottom of the homepage, after the Contra report's
// section index: one tab per section, the current one lit in the sky-blue highlight,
// which slides between tabs as the reader scrolls. Order must match page.tsx.
const SECTIONS = [
  { id: "hero", label: "Overview" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "numbers", label: "Numbers" },
  { id: "stack", label: "Our stack" },
  { id: "product", label: "Product" },
  { id: "why-us", label: "Why us" },
  { id: "solutions", label: "Use cases" },
  { id: "blog", label: "Insights" },
  { id: "cta", label: "Start a project" },
];

export default function ChapterIndex() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const mid = window.innerHeight * 0.5;
      let current = 0;
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= mid) current = i;
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
  }, []);

  function jump(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <nav
      aria-label="Page sections"
      className="hidden md:block fixed inset-x-0 bottom-0 z-40"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        background: "rgba(246,247,251,0.94)",
        WebkitBackdropFilter: "blur(10px)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid var(--hairline)",
      }}
    >
      <ol className="flex">
        {SECTIONS.map((s, i) => {
          const isActive = i === active;
          return (
            <li key={s.id} className="relative flex-1 min-w-0" style={{ borderLeft: i ? "1px solid var(--hairline)" : undefined }}>
              {isActive && (
                <motion.span
                  layoutId="tab-highlight"
                  className="absolute inset-0"
                  style={{ background: "var(--lime)" }}
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 36 }}
                />
              )}
              <button
                type="button"
                onClick={() => jump(s.id)}
                aria-current={isActive ? "true" : undefined}
                className="relative w-full h-14 px-2 truncate text-sm transition-colors duration-200 hover:bg-[rgba(11,16,51,0.04)] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--blue)]"
                style={{ color: "var(--ink)", fontWeight: isActive ? 500 : 400 }}
              >
                {s.label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
