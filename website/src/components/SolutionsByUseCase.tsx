"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, Rocket, Building2, Users } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import CountUp from "./CountUp";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { REVEAL_STAGGER } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Each card highlights one of the same real, admin-managed stats shown in the Stats
// section — reused rather than inventing new per-audience numbers we can't stand behind.
const USE_CASES = [
  {
    icon: Rocket,
    title: "For Startups",
    tagline: "Ship your MVP without burning your runway",
    points: ["Fixed-scope pricing that fits early-stage budgets", "From idea to a working product in weeks", "A technical partner you can loop in on strategy, not just code"],
    accent: "#F59E0B",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=70",
    statKey: "stat_years" as const,
    statSuffix: "+",
    statLabel: "Years shipping fast",
  },
  {
    icon: Building2,
    title: "For Enterprises",
    tagline: "Modernize systems without disrupting operations",
    points: ["Compliance-aware architecture and access control", "Phased rollouts that don't interrupt live operations", "Integration with the systems you've already invested in"],
    accent: "#2563EB",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=70",
    statKey: "stat_clients" as const,
    statSuffix: "+",
    statLabel: "Happy Clients",
  },
  {
    icon: Users,
    title: "For Product Teams",
    tagline: "An extra senior team when you need to move faster",
    points: ["Slot directly into your existing sprint cadence", "AI/ML capability without a full-time hire", "Ongoing support, not a one-and-done handoff"],
    accent: "#1D9E75",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=70",
    statKey: "stat_projects" as const,
    statSuffix: "+",
    statLabel: "Projects Delivered",
  },
];

function CardContent({ u, statValue, active }: { u: (typeof USE_CASES)[number]; statValue: number; active: boolean }) {
  return (
    <div className="relative z-10 w-full max-w-lg mx-auto px-6 text-center flex flex-col items-center gap-4 sm:gap-5">
      <div
        className="rounded-2xl flex items-center justify-center backdrop-blur-sm"
        style={{ background: "rgba(255,255,255,0.18)", width: "clamp(48px, 9vw, 64px)", height: "clamp(48px, 9vw, 64px)" }}
      >
        <u.icon size={28} color="#fff" />
      </div>

      <h3
        className="font-extrabold text-white"
        style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.6rem, 5vw, 2.5rem)", lineHeight: 1.1 }}
      >
        {u.title}
      </h3>
      <p className="text-white/85" style={{ fontSize: "clamp(0.95rem, 2.2vw, 1.05rem)" }}>{u.tagline}</p>

      <div className="flex flex-col items-center gap-1 py-1 sm:py-2">
        <span
          className="font-extrabold text-white tabular-nums"
          style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2.25rem, 6vw, 3rem)", lineHeight: 1 }}
        >
          <CountUp end={statValue} suffix={u.statSuffix} active={active} />
        </span>
        <span className="text-[11px] sm:text-xs uppercase tracking-widest text-white/70">{u.statLabel}</span>
      </div>

      <ul className="flex flex-col gap-2 text-left">
        {u.points.map((p) => (
          <li key={p} className="text-sm leading-relaxed flex items-start gap-2 text-white/80">
            <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ background: u.accent }} />
            {p}
          </li>
        ))}
      </ul>

      <Link
        href="/contact"
        className="btn-shine flex items-center gap-2 mt-1 sm:mt-2 px-6 py-3 rounded-full text-sm font-medium text-white"
        style={{ background: u.accent }}
      >
        Talk to us <ArrowRight size={14} />
      </Link>
    </div>
  );
}

export default function SolutionsByUseCase() {
  const reduceMotion = useReducedMotion();
  const settings = useSiteSettings();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRef = useRef(0);
  const [pinEnabled, setPinEnabled] = useState(false);

  // Pinning only makes sense on a large enough viewport — phones get the plain
  // stacked-in-flow layout instead (which also covers prefers-reduced-motion).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setPinEnabled(mq.matches && !reduceMotion);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduceMotion]);

  useLayoutEffect(() => {
    if (!pinEnabled) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".stack-card");
      if (items.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * items.length,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = Math.min(items.length - 1, Math.round(self.progress * (items.length - 1)));
            // Only commit to state on an actual change — onUpdate fires every scroll
            // tick and re-rendering the whole section that often would drop frames.
            if (next !== activeRef.current) {
              activeRef.current = next;
              setActiveIndex(next);
            }
          },
        },
      });

      items.forEach((card, i) => {
        if (i === 0) return;
        tl.fromTo(
          card,
          { yPercent: 100, scale: 0.9, opacity: 0 },
          { yPercent: 0, scale: 1, opacity: 1, duration: 1, ease: "none" },
          i - 1
        );
        tl.to(items[i - 1], { scale: 0.92, opacity: 0.3, duration: 1, ease: "none" }, i - 1);
      });

      // Lenis already drives ScrollTrigger.update globally from SmoothScroll, so no
      // per-section listener here — that would add a duplicate that never unsubscribes.
    }, wrapRef);

    return () => ctx.revert();
  }, [pinEnabled]);

  return (
    <section style={{ background: "var(--navy2)", borderTop: "1px solid var(--border)" }} id="solutions">
      <div className="max-w-7xl mx-auto px-6 pt-[var(--space-6xl)] pb-10">
        <ScrollReveal className="max-w-xl">
          <p className="text-sm font-medium mb-3 uppercase tracking-widest" style={{ color: "var(--cyan)" }}>
            Built For How You Work
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
            Solutions by use case
          </h2>
        </ScrollReveal>
      </div>

      {pinEnabled ? (
        <div ref={wrapRef} className="relative h-screen overflow-hidden">
          {USE_CASES.map((u, i) => (
            <div
              key={u.title}
              className="stack-card absolute inset-0 flex items-center justify-center overflow-hidden"
              style={{ zIndex: i + 1 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u.image} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${u.accent}66, rgba(11,18,32,0.88))` }} />
              <CardContent u={u} statValue={settings[u.statKey]} active={activeIndex === i} />
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 pb-[var(--space-6xl)] flex flex-col gap-6">
          {USE_CASES.map((u, i) => (
            <ScrollReveal key={u.title} delay={i * REVEAL_STAGGER}>
              <div className="relative rounded-2xl overflow-hidden flex items-center justify-center py-14 sm:py-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u.image} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${u.accent}66, rgba(11,18,32,0.88))` }} />
                <CardContent u={u} statValue={settings[u.statKey]} active />
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}
