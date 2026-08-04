"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Search, PenTool, Code2, Rocket, LifeBuoy } from "lucide-react";
import { EASE_OUT_QUART, EASE_OUT_EXPO } from "@/lib/motion";

const STEPS = [
  { icon: Search, title: "Discover", text: "We dig into your goals, users, and constraints before writing a single line of code.", accent: "#7F77DD" },
  { icon: PenTool, title: "Design", text: "Architecture and interface design happen together, so the product feels right from day one.", accent: "#06B6D4" },
  { icon: Code2, title: "Build", text: "Senior engineers ship in short, visible sprints — no black-box development.", accent: "#2563EB" },
  { icon: Rocket, title: "Launch", text: "QA, performance tuning, and a deployment plan built for a calm launch day.", accent: "#F59E0B" },
  { icon: LifeBuoy, title: "Support", text: "3 months of post-launch support included — we don't disappear after delivery.", accent: "#1D9E75" },
];

// A handful of slow-floating accent dots — a light, ambient touch consistent with the
// data/AI visual language used in the Hero, not a busy repeat of the network canvas.
const PARTICLES = [
  { top: "12%", left: "6%", size: 5, delay: 0, duration: 7 },
  { top: "70%", left: "10%", size: 4, delay: 1.2, duration: 8.5 },
  { top: "22%", left: "92%", size: 6, delay: 0.6, duration: 6.5 },
  { top: "80%", left: "88%", size: 4, delay: 2, duration: 9 },
  { top: "45%", left: "50%", size: 3, delay: 1.6, duration: 7.5 },
];

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-[var(--space-6xl)] px-6 overflow-hidden" style={{ background: "var(--navy2)" }} id="process">
      {/* Floating ambient particles */}
      <div className="pointer-events-none absolute inset-0">
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{ top: p.top, left: p.left, width: p.size, height: p.size, background: "var(--cyan)", opacity: 0.35 }}
            animate={{ y: [0, -16, 0], opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_QUART }}
          className="text-center mb-16"
          ref={ref}
        >
          <p className="text-sm font-medium mb-3 uppercase tracking-widest" style={{ color: "var(--cyan)" }}>
            How We Work
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
            From idea to production
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--gray)" }}>
            The same five-stage process, every engagement — so you always know what happens next.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line — draws itself in as the section scrolls into view */}
          <div className="hidden lg:block absolute top-6 left-0 right-0 h-px" style={{ background: "var(--border)" }}>
            <motion.div
              className="h-full"
              style={{ background: "var(--grad)", transformOrigin: "left" }}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: EASE_OUT_EXPO }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.15, ease: EASE_OUT_QUART }}
                className="flex flex-col items-center text-center gap-4"
              >
                <div
                  className="relative w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "var(--surface)", border: `2px solid ${step.accent}` }}
                >
                  <step.icon size={20} style={{ color: step.accent }} />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1.5" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed font-light max-w-[220px]" style={{ color: "var(--gray)" }}>
                    {step.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
