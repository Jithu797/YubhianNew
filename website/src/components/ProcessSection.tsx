"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Search, PenTool, Code2, Rocket, LifeBuoy } from "lucide-react";
import { EASE_OUT_EXPO, REVEAL_STAGGER } from "@/lib/motion";
import ScrollReveal from "./ScrollReveal";

const STEPS = [
  { icon: Search, title: "Discover", text: "We dig into your goals, users, and constraints before writing a single line of code.", accent: "#4B3FA0" },
  { icon: PenTool, title: "Design", text: "Architecture and interface design happen together, so the product feels right from day one.", accent: "#0E57A6" },
  { icon: Code2, title: "Build", text: "Senior engineers ship in short, visible sprints — no black-box development.", accent: "#1E3FA8" },
  { icon: Rocket, title: "Launch", text: "QA, performance tuning, and a deployment plan built for a calm launch day.", accent: "#5B6FB0" },
  { icon: LifeBuoy, title: "Support", text: "3 months of post-launch support included — we don't disappear after delivery.", accent: "#2C4A8C" },
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
  const reduceMotion = useReducedMotion();
  const lineRef = useRef<HTMLDivElement>(null);
  const lineInView = useInView(lineRef, { once: true, margin: "-100px" });

  return (
    <section className="relative py-[var(--space-6xl)] px-6 overflow-hidden" style={{ background: "var(--navy2)" }} id="process-steps">
      {/* Floating ambient particles */}
      {!reduceMotion && (
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
      )}

      <div className="relative max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <p className="kicker mb-5">
            02 · How we work
          </p>
          <h2 className="section-title mb-4" style={{ color: "var(--white)" }}>
            From idea to <span className="serif-accent">production</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--gray)" }}>
            The same five-stage process, every engagement — so you always know what happens next.
          </p>
        </ScrollReveal>

        <div className="relative" ref={lineRef}>
          {/* Connecting line — draws itself in as the section scrolls into view */}
          <div className="hidden lg:block absolute top-6 left-0 right-0 h-px" style={{ background: "var(--border)" }}>
            <motion.div
              className="h-full"
              style={{ background: "var(--grad)", transformOrigin: "left" }}
              initial={{ scaleX: reduceMotion ? 1 : 0 }}
              animate={lineInView ? { scaleX: 1 } : {}}
              transition={{ duration: reduceMotion ? 0 : 1.2, delay: reduceMotion ? 0 : 0.3, ease: EASE_OUT_EXPO }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
            {STEPS.map((step, i) => (
              <ScrollReveal
                key={step.title}
                delay={0.3 + i * REVEAL_STAGGER}
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
                  <p className="text-sm leading-relaxed font-normal max-w-[220px]" style={{ color: "var(--gray)" }}>
                    {step.text}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
