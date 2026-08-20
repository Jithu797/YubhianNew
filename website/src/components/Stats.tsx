"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { useCountUp } from "./CountUp";

type Stat = { value: number; suffix: string; label: string };

function StatItem({ stat, active, isLast }: { stat: Stat; active: boolean; isLast: boolean }) {
  const reduceMotion = useReducedMotion();
  const count = useCountUp(stat.value, active);
  const settled = Math.floor(count) === stat.value;
  return (
    // basis-1/2 until lg: with `flex-1` alone (flex-basis 0) all four columns would
    // stay on a single row at every width, squeezing the numbers off-screen on phones.
    <div className="flex items-center basis-1/2 lg:basis-0 lg:grow">
      <div className="flex-1 text-center py-8 px-4 sm:px-6 min-w-0">
        <motion.div
          animate={settled && !reduceMotion ? { scale: [1, 1.12, 1] } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="font-extrabold grad-text mb-2 tabular-nums"
          style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2.5rem, 9vw, 4.5rem)", lineHeight: 1.05 }}
        >
          {Math.floor(count)}{stat.suffix}
        </motion.div>
        <div className="text-xs sm:text-sm font-medium" style={{ color: "var(--gray)" }}>
          {stat.label}
        </div>
      </div>
      {/* Divider only belongs in the single-row (4-across) layout. */}
      {!isLast && <div className="hidden lg:block w-px h-16 opacity-40 bg-black/20" />}
    </div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const settings = useSiteSettings();
  const stats = [
    { value: settings.stat_projects, suffix: "+", label: "Projects Delivered" },
    { value: settings.stat_clients, suffix: "+", label: "Happy Clients" },
    { value: settings.stat_team, suffix: "", label: "Team Members" },
    { value: settings.stat_years, suffix: "+", label: "Years of Excellence" },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: "var(--navy2)",
        borderTop: "1px solid rgba(37,99,235,0.15)",
        borderBottom: "1px solid rgba(37,99,235,0.15)",
      }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(var(--blue) 1px, transparent 1px), linear-gradient(90deg, var(--blue) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-24 pointer-events-none" style={{ background: "linear-gradient(to right, var(--navy2), transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-24 pointer-events-none" style={{ background: "linear-gradient(to left, var(--navy2), transparent)" }} />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-wrap">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} active={inView} isLast={i === stats.length - 1} />
          ))}
        </div>

        {/* Quote */}
        <div className="text-center pb-12 px-6">
          <p
            className="text-xl md:text-2xl italic grad-text font-semibold"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            &ldquo;Building the future of technology from the heart of Andhra Pradesh&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
