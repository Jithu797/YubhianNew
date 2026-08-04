"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useSiteSettings } from "@/lib/useSiteSettings";

function useCountUp(target: number, active: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

type Stat = { value: number; suffix: string; label: string };

function StatItem({ stat, active, isLast }: { stat: Stat; active: boolean; isLast: boolean }) {
  const count = useCountUp(stat.value, active);
  const settled = count === stat.value;
  return (
    <div className="flex items-center flex-1">
      <div className="flex-1 text-center py-8 px-6">
        <motion.div
          animate={settled ? { scale: [1, 1.12, 1] } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-6xl md:text-7xl font-extrabold grad-text mb-2"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          {count}{stat.suffix}
        </motion.div>
        <div className="text-sm font-medium" style={{ color: "var(--gray)" }}>
          {stat.label}
        </div>
      </div>
      {!isLast && <div className="hidden md:block w-px h-16 opacity-40 bg-black/20" />}
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
