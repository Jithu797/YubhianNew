"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { useCountUp } from "./CountUp";
import { EASE_OUT_QUART } from "@/lib/motion";
import { SERVICES } from "@/lib/services-data";
import ServiceTreemap from "./charts/ServiceTreemap";

type Stat = { value: number; suffix: string; label: string; note: string };

function StatItem({ stat, active, index }: { stat: Stat; active: boolean; index: number }) {
  const reduceMotion = useReducedMotion();
  const count = useCountUp(stat.value, active);
  return (
    // Report-style figure column: index number, oversized serif numeral, caption.
    // 2×2 on phones, 1×4 from lg, separated by hairlines rather than cards.
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={active ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.75, delay: index * 0.1, ease: EASE_OUT_QUART }}
      className={[
        "py-8 pr-4 min-w-0",
        index % 2 === 1 ? "pl-4 sm:pl-6 border-l" : "",
        index >= 2 ? "border-t lg:border-t-0" : "",
        index > 0 ? "lg:pl-8 lg:border-l" : "",
      ].join(" ")}
      style={{ borderColor: "var(--hairline)" }}
    >
      <div className="text-xs tabular-nums mb-6" style={{ color: "var(--gray)" }}>
        {String(index + 1).padStart(2, "0")}
      </div>
      <div
        className="flex items-start gap-1 tabular-nums"
        style={{
          fontFamily: "var(--font-syne)",
          fontSize: "clamp(3rem, 8vw, 6rem)",
          lineHeight: 0.95,
          letterSpacing: "-0.04em",
          color: "var(--white)",
        }}
      >
        {Math.floor(count)}
        {stat.suffix && (
          <span className="text-[0.55em] mt-[0.1em]" style={{ color: "var(--sage)" }}>
            {stat.suffix}
          </span>
        )}
      </div>
      <div className="mt-5 text-sm font-medium" style={{ color: "var(--white)" }}>
        {stat.label}
      </div>
      <div className="mt-1 text-xs max-w-[22ch]" style={{ color: "var(--gray)" }}>
        {stat.note}
      </div>
    </motion.div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const settings = useSiteSettings();
  const stats: Stat[] = [
    { value: settings.stat_projects, suffix: "+", label: "Projects delivered", note: "Web, mobile, AI and SaaS builds." },
    { value: settings.stat_clients, suffix: "+", label: "Clients served", note: "Businesses we have partnered with." },
    { value: settings.stat_team, suffix: "", label: "Team members", note: "Engineers, designers and strategists under one roof." },
    { value: settings.stat_years, suffix: "+", label: "Years building", note: "Since the studio was founded." },
  ];

  return (
    <section ref={ref} id="numbers-grid" className="relative px-6 xl:px-10" style={{ background: "var(--navy2)", paddingBlock: "var(--space-6xl)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8" style={{ borderBottom: "1px solid var(--ink)" }}>
          <div className="flex flex-col gap-4">
            <span className="kicker">03 · By the numbers</span>
            <h2 style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", lineHeight: 1.05, color: "var(--white)" }}>
              Small team. <span className="serif-accent">Serious</span> output.
            </h2>
          </div>
          <p className="max-w-sm text-sm" style={{ color: "var(--gray)" }}>
            A snapshot of the work so far — measured in shipped products, not slide decks.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} active={inView} index={i} />
          ))}
        </div>

        {/* Where the work sits — every service as a tile, grouped by practice */}
        <div className="mt-16 pt-10" style={{ borderTop: "1px solid var(--hairline)" }}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <h3 className="subsection-title" style={{ color: "var(--white)" }}>
              Where our <em className="serif-accent">work</em> sits
            </h3>
            <p className="max-w-sm text-sm" style={{ color: "var(--gray)" }}>
              All {SERVICES.length} services, grouped by practice. Tap a tile to see what each one includes.
            </p>
          </div>
          <ServiceTreemap />
        </div>

        {/* Pull quote, set like a magazine aside */}
        <figure className="mt-12 pt-10 grid md:grid-cols-[auto_1fr] gap-6 md:gap-12" style={{ borderTop: "1px solid var(--hairline)" }}>
          <span aria-hidden className="leading-none select-none" style={{ fontFamily: "var(--font-syne)", fontSize: "5rem", color: "var(--sage)" }}>
            &ldquo;
          </span>
          <blockquote>
            <p
              className="italic max-w-3xl"
              style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.25, color: "var(--white)" }}
            >
              Building the future of technology from the heart of Andhra Pradesh.
            </p>
            <figcaption className="mt-4 text-xs uppercase tracking-[0.14em]" style={{ color: "var(--gray)" }}>
              — Yubhian Technologies
            </figcaption>
          </blockquote>
        </figure>
      </div>
    </section>
  );
}
