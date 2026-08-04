"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSiteSettings } from "@/lib/useSiteSettings";
import HeroNetworkBackground from "./HeroNetworkBackground";
import { EASE_OUT_QUART } from "@/lib/motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE_OUT_QUART },
});

export default function Hero() {
  const settings = useSiteSettings();

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden dot-grid"
      style={{ background: "var(--navy)" }}
    >
      {/* Slow-breathing base glow — a gentle "alive" ambient pulse rather than a static shape */}
      <motion.div
        className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
        style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Animated node network — a data-graph visual filling the section and reacting to
          the cursor, on theme for an AI company rather than a decorative-only effect */}
      <HeroNetworkBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-8 pt-24">
        {/* Headline */}
        <motion.div {...fadeUp(0)}>
          <h1
            className="font-extrabold"
            style={{
              fontFamily: "var(--font-syne)",
              color: "var(--white)",
              fontSize: "var(--landing-main-text-size)",
              lineHeight: "var(--landing-main-text-line-height)",
              letterSpacing: "var(--landing-main-text-letter-spacing)",
            }}
          >
            {settings.hero_title}
            <br />
            <motion.span
              style={{ color: "var(--blue)" }}
              animate={{ textShadow: ["0 0 0px rgba(37,99,235,0)", "0 0 28px rgba(37,99,235,0.45)", "0 0 0px rgba(37,99,235,0)"] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              {settings.typewriter_words[0] ?? "AI Solutions"}
            </motion.span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          {...fadeUp(0.15)}
          className="max-w-xl text-lg md:text-xl leading-relaxed font-light"
          style={{ color: "var(--gray)", fontFamily: "var(--font-dm-sans)" }}
        >
          {settings.hero_subtitle}
        </motion.p>

        {/* CTA buttons */}
        <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/services"
            className="btn-shine flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-medium transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "var(--grad)",
              boxShadow: "0 4px 24px rgba(37,99,235,0.35)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(37,99,235,0.55)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(37,99,235,0.35)";
            }}
          >
            {settings.cta_primary} <ArrowRight size={16} />
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-2 px-7 py-3.5 rounded-full font-medium transition-all duration-300"
            style={{
              background: "transparent",
              border: "1px solid rgba(15,23,42,0.16)",
              color: "var(--white)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--blue)";
              el.style.background = "rgba(37,99,235,0.08)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(15,23,42,0.16)";
              el.style.background = "transparent";
            }}
          >
            {settings.cta_secondary}
          </Link>
        </motion.div>
      </div>

      {/* Scroll arrow — gentle continuous bounce cue */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <button
          className="text-[var(--gray)] hover:text-[var(--white)] transition-colors"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          aria-label="Scroll down"
        >
          <ChevronDown size={28} />
        </button>
      </motion.div>
    </section>
  );
}
