"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Rocket, Building2, Users } from "lucide-react";
import Link from "next/link";
import { EASE_OUT_QUART } from "@/lib/motion";

const USE_CASES = [
  {
    icon: Rocket,
    title: "For Startups",
    tagline: "Ship your MVP without burning your runway",
    points: ["Fixed-scope pricing that fits early-stage budgets", "From idea to a working product in weeks", "A technical partner you can loop in on strategy, not just code"],
    accent: "#F59E0B",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=65",
  },
  {
    icon: Building2,
    title: "For Enterprises",
    tagline: "Modernize systems without disrupting operations",
    points: ["Compliance-aware architecture and access control", "Phased rollouts that don't interrupt live operations", "Integration with the systems you've already invested in"],
    accent: "#2563EB",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=65",
  },
  {
    icon: Users,
    title: "For Product Teams",
    tagline: "An extra senior team when you need to move faster",
    points: ["Slot directly into your existing sprint cadence", "AI/ML capability without a full-time hire", "Ongoing support, not a one-and-done handoff"],
    accent: "#1D9E75",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=65",
  },
];

export default function SolutionsByUseCase() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function updateEdges() {
    const el = scrollerRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 4);
  }

  function scrollByCard(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 360, behavior: "smooth" });
  }

  return (
    <section className="py-[var(--space-6xl)] px-6" style={{ background: "var(--navy2)", borderTop: "1px solid var(--border)" }} id="solutions">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_QUART }}
          className="flex items-end justify-between gap-4 mb-10 flex-wrap"
        >
          <div className="max-w-xl">
            <p className="text-sm font-medium mb-3 uppercase tracking-widest" style={{ color: "var(--cyan)" }}>
              Built For How You Work
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
              Solutions by use case
            </h2>
          </div>

          {/* Carousel controls */}
          <div className="flex gap-2">
            <button
              onClick={() => scrollByCard(-1)}
              disabled={atStart}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--white)" }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollByCard(1)}
              disabled={atEnd}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--white)" }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Horizontally scrollable card row */}
        <div
          ref={scrollerRef}
          onScroll={updateEdges}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {USE_CASES.map((u, i) => (
            <motion.div
              key={u.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: EASE_OUT_QUART }}
              className="snap-start shrink-0 w-[340px] rounded-2xl overflow-hidden flex flex-col"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              {/* Visual header panel */}
              <div className="relative h-32 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u.image} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${u.accent}55, rgba(0,0,0,0.45))` }} />
                <div className="relative w-14 h-14 rounded-xl flex items-center justify-center backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.18)" }}>
                  <u.icon size={26} color="#fff" />
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4 flex-1">
                <div>
                  <h3 className="text-lg font-bold mb-1.5" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
                    {u.title}
                  </h3>
                  <p className="text-sm font-light" style={{ color: "var(--gray2)" }}>{u.tagline}</p>
                </div>
                <ul className="flex flex-col gap-2 flex-1">
                  {u.points.map((p) => (
                    <li key={p} className="text-xs leading-relaxed flex items-start gap-2" style={{ color: "var(--gray)" }}>
                      <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: u.accent }} />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="flex items-center gap-1.5 text-sm font-medium mt-auto"
                  style={{ color: u.accent }}
                >
                  Talk to us <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
