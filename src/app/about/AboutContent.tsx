"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Eye, Target, HeartHandshake } from "lucide-react";

const VALUES = [
  { icon: Eye, title: "Vision", accent: "#2563EB", text: "To be India's most trusted partner for building intelligent, enterprise-grade software — from Andhra Pradesh to the world." },
  { icon: Target, title: "Mission", accent: "#06B6D4", text: "Deliver AI-first digital products with startup speed and enterprise quality, so every client — big or small — gets world-class engineering." },
  { icon: HeartHandshake, title: "Values", accent: "#F59E0B", text: "Transparency, ownership, and craftsmanship. We treat every client's product like it's our own, and we never disappear after delivery." },
];

const TIMELINE = [
  { year: "2025", title: "Yubhian Technologies LLP founded", text: "Naga Venkata Rishi Kakarla, Jithendra Venkata Sai Bonam, and Satyanarayana Reddy Satti found Yubhian in Kaikaluru, Andhra Pradesh." },
  { year: "2025", title: "First client projects delivered", text: "Early web, mobile, and AI/ML engagements shipped for startups and growing businesses across India." },
  { year: "2026", title: "Building our own product", text: "Yubhian begins building its first in-house product, applying everything learned from client work to solve a problem the team knows firsthand." },
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, delay },
  };
}

export default function AboutContent() {
  const valuesRef = useRef<HTMLDivElement>(null);
  const valuesInView = useInView(valuesRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* Story */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p {...fadeUp(0)} className="text-sm font-medium mb-3 uppercase tracking-widest" style={{ color: "var(--cyan)" }}>
            Our Story
          </motion.p>
          <motion.h1 {...fadeUp(0.05)} className="text-4xl md:text-6xl font-extrabold mb-6" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
            Enterprise-grade software, built from Andhra Pradesh
          </motion.h1>
          <motion.p {...fadeUp(0.1)} className="text-lg font-light leading-relaxed" style={{ color: "var(--gray)" }}>
            Yubhian Technologies LLP started in Kaikaluru, Andhra Pradesh, with a simple belief: enterprise-grade
            software doesn&apos;t need to come from Silicon Valley or a metro city. We combine startup speed with
            enterprise discipline — AI-first, full-stack, and fully accountable for what we build.
          </motion.p>
        </div>
      </section>

      {/* Vision / Mission / Values */}
      <section ref={valuesRef} className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl p-8"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: v.accent + "20" }}>
                <v.icon size={22} style={{ color: v.accent }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>{v.title}</h3>
              <p className="text-sm font-light leading-relaxed" style={{ color: "var(--gray)" }}>{v.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 pb-24" style={{ background: "var(--navy2)" }}>
        <div className="max-w-3xl mx-auto py-20">
          <motion.h2 {...fadeUp(0)} className="text-3xl md:text-4xl font-extrabold mb-14 text-center" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
            Our journey
          </motion.h2>
          <div className="relative flex flex-col gap-12 pl-8" style={{ borderLeft: "1px solid var(--border)" }}>
            {TIMELINE.map((t, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="relative">
                <span
                  className="absolute -left-[41px] top-1 w-3.5 h-3.5 rounded-full"
                  style={{ background: "var(--cyan)", boxShadow: "0 0 0 4px rgba(6,182,212,0.15)" }}
                />
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--cyan)", fontFamily: "var(--font-syne)" }}>{t.year}</p>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>{t.title}</h3>
                <p className="text-sm font-light leading-relaxed max-w-xl" style={{ color: "var(--gray)" }}>{t.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
