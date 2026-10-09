"use client";

import { useRef } from "react";
import { fadeUp } from "@/lib/motion";
import { motion, useInView } from "framer-motion";
import { Eye, Target, HeartHandshake, Landmark } from "lucide-react";
import EnvelopeReveal from "@/components/EnvelopeReveal";
import PageHero from "@/components/PageHero";

const VALUES = [
  { icon: Eye, title: "Vision", accent: "#1E3FA8", text: "To be India's most trusted partner for building intelligent, enterprise-grade software — from Andhra Pradesh to the world." },
  { icon: Target, title: "Mission", accent: "#0E57A6", text: "Deliver AI-first digital products with startup speed and enterprise quality, so every client — big or small — gets world-class engineering." },
  { icon: HeartHandshake, title: "Values", accent: "#5B6FB0", text: "Transparency, ownership, and craftsmanship. We treat every client's product like it's our own, and we never disappear after delivery." },
];

const TIMELINE = [
  { year: "2025", title: "Yubhian Technologies LLP founded", text: "Naga Venkata Rishi Kakarla, Jithendra Venkata Sai Bonam, and Satyanarayana Reddy Satti found Yubhian in Kaikaluru, Andhra Pradesh." },
  { year: "2025", title: "First client projects delivered", text: "Early web, mobile, and AI/ML engagements shipped for startups and growing businesses across India." },
  { year: "2026", title: "Building our own product", text: "Yubhian begins building its first in-house product, applying everything learned from client work to solve a problem the team knows firsthand." },
];

export default function AboutContent() {
  const valuesRef = useRef<HTMLDivElement>(null);
  const valuesInView = useInView(valuesRef, { once: true, margin: "-80px" });

  return (
    <>
      <PageHero
        kicker="Our story"
        title={<>Enterprise-grade software, built from <em className="serif-accent">Andhra Pradesh</em></>}
        page="about"
        ghost={<Landmark size={380} strokeWidth={0.7} />}
      />

      {/* Story — set as a large editorial lead under the hero */}
      <section className="px-6 pt-20 pb-20">
        <motion.p
          {...fadeUp(0)}
          className="max-w-4xl mx-auto"
          style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)", lineHeight: 1.35, color: "var(--white)" }}
        >
          Yubhian Technologies LLP started in Kaikaluru, Andhra Pradesh, with a simple belief: enterprise-grade
          software doesn&apos;t need to come from Silicon Valley or a metro city. We combine startup speed with
          enterprise discipline — <em className="serif-accent">AI-first, full-stack, and fully accountable</em> for what we build.
        </motion.p>
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
              <p className="text-sm font-normal leading-relaxed" style={{ color: "var(--gray)" }}>{v.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 pb-24" style={{ background: "var(--navy2)" }}>
        <div className="max-w-3xl mx-auto py-20">
          <motion.h2 {...fadeUp(0)} className="subsection-title mb-14 text-center" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
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
                <p className="text-sm font-normal leading-relaxed max-w-xl" style={{ color: "var(--gray)" }}>{t.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* A note from the team */}
      <section className="px-6 py-24">
        <EnvelopeReveal>
          <p className="kicker mb-5">
            A Note From Our Team
          </p>
          <p className="text-lg font-normal leading-relaxed mb-4" style={{ color: "var(--gray2)" }}>
            Thank you for taking the time to learn about Yubhian. We started this company in Kaikaluru with a simple
            bet — that great software doesn&apos;t require a Silicon Valley address, just a team willing to hold
            itself to that bar anyway.
          </p>
          <p className="text-lg font-normal leading-relaxed" style={{ color: "var(--gray2)" }}>
            Whether you&apos;re here to build something with us or just to see what we&apos;re about, we&apos;re glad
            you stopped by.
          </p>
          <p className="text-sm font-semibold mt-6" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
            — The Yubhian Team
          </p>
        </EnvelopeReveal>
      </section>
    </>
  );
}
