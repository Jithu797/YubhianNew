"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Brain, Smartphone, Cloud, Blocks, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { EASE_OUT_QUART, EASE_OUT_EXPO } from "@/lib/motion";

// Practice chips floating beside the hero art, each opening its service page.
const HERO_CHIPS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "AI & Machine Learning", href: "/services/ai-ml", icon: Brain },
  { label: "Web & Mobile Apps", href: "/services/web-development", icon: Smartphone },
  { label: "Cloud & DevOps", href: "/services/cloud", icon: Cloud },
  { label: "Blockchain & Web3", href: "/services/blockchain", icon: Blocks },
];
// The practices named in the hero's "Our ecosystem" bar.
const ECOSYSTEM = ["AI", "Automation", "Web", "Mobile", "Cloud", "Data", "Design", "Blockchain"];

function fadeUp(reduceMotion: boolean, delay = 0) {
  if (reduceMotion) {
    return { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } };
  }
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE_OUT_QUART },
  };
}

/** Cycles through the CMS's typewriter words with a vertical slide, editorial-style —
 *  one italic serif word swapped in place rather than characters typed out. */
function RotatingWord({ words, reduceMotion }: { words: string[]; reduceMotion: boolean }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reduceMotion || words.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2800);
    return () => clearInterval(id);
  }, [words.length, reduceMotion]);

  const word = words[index] ?? "AI Solutions";
  // No overflow mask: clipping a line of descender-heavy italic serif cuts glyphs, so the
  // swap is a short rise + blur in normal flow (mode="wait" keeps one word in layout).
  return (
    // The holder keeps the line's height while one word leaves and the next arrives,
    // so the paragraph and buttons below never jump.
    <span className="inline-block align-top" style={{ minHeight: "1.05em" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={word}
          className="serif-accent inline-block"
          style={{ color: "var(--lime)" }}
          initial={{ y: "0.35em", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-0.35em", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// Opens like the Contra report: the artwork does the talking. One giant serif title on
// the calm left side of the hero world, a single line of copy, one action, and a quiet
// cue to scroll. The numbers that used to sit here have their own chapter now.
export default function Hero() {
  const settings = useSiteSettings();
  const reduceMotion = useReducedMotion() ?? false;

  return (
    // Transparent: this is the first chapter, so ScrollStage paints the "hero" world
    // behind it. svh excludes mobile browser chrome.
    <section id="hero" data-chapter="hero" className="tone-light relative flex flex-col" style={{ minHeight: "100svh" }}>
      {/* Phones: the art sits behind the whole text column, so a deeper shade rises
          from the bottom to keep the paragraph readable over the bright network */}
      <div
        className="md:hidden pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(5,9,40,0.82) 0%, rgba(5,9,40,0.55) 45%, rgba(5,9,40,0.2) 80%)" }}
      />
      {/* Soft shade on the headline side so type stays legible on any artwork */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(90deg, rgba(5,9,40,0.55) 0%, rgba(5,9,40,0.2) 45%, transparent 75%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 70%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, #000 70%, transparent 100%)",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-7xl mx-auto px-6 xl:px-10 page-top pb-28 md:pb-48">
        <motion.span {...fadeUp(reduceMotion, 0)} className="kicker">
          AI &amp; software studio<span className="hidden sm:inline"> · Andhra Pradesh</span>
        </motion.span>

        <motion.h1
          {...fadeUp(reduceMotion, 0.1)}
          className="mt-6 max-w-4xl"
          style={{
            color: "var(--white)",
            fontSize: "clamp(3.25rem, 8.5vw, 8.75rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.045em",
            fontWeight: 400,
            textShadow: "0 2px 40px rgba(0,0,0,0.25)",
          }}
        >
          {settings.hero_title}
          <br />
          <RotatingWord words={settings.typewriter_words} reduceMotion={reduceMotion} />
        </motion.h1>

        <motion.p
          {...fadeUp(reduceMotion, 0.25)}
          className="mt-8 max-w-md text-lg leading-relaxed"
          style={{ color: "var(--gray)" }}
        >
          {settings.hero_subtitle}
        </motion.p>

        <motion.div {...fadeUp(reduceMotion, 0.35)} className="mt-10 flex flex-wrap items-center gap-6">
          <Link
            href="/services"
            className="group flex items-center gap-3 pl-6 pr-2 py-2 rounded-full font-medium transition-transform duration-300 hover:-translate-y-0.5"
            style={{ background: "var(--paper)", color: "var(--ink)" }}
          >
            {settings.cta_primary}
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-[-45deg]"
              style={{ background: "var(--lime)", color: "var(--ink)" }}
            >
              <ArrowRight size={16} />
            </span>
          </Link>
          <Link
            href="/work"
            className="font-medium underline underline-offset-[6px] decoration-1 transition-colors hover:text-[var(--lime)]"
            style={{ color: "var(--white)", textDecorationColor: "rgba(246,247,251,0.5)" }}
          >
            {settings.cta_secondary}
          </Link>
        </motion.div>
      </div>

      {/* Floating practice chips over the network (wide screens): glass labels that slide
          in one after another, then bob gently, each linking to its service */}
      <ul className="hidden lg:flex absolute z-10 right-[5%] xl:right-[7%] top-[34%] flex-col gap-3" aria-label="What we build">
        {HERO_CHIPS.map((chip, i) => (
          <motion.li
            key={chip.href}
            initial={reduceMotion ? false : { opacity: 0, x: 48, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.6 + i * 0.15, ease: EASE_OUT_QUART }}
            style={{ marginLeft: i % 2 ? 0 : 28 }}
          >
            <Link
              href={chip.href}
              className="hero-chip group flex items-center gap-3 rounded-2xl pl-2.5 pr-5 py-2.5 text-sm font-medium transition-colors"
              style={{ animationDelay: `${i * -1.1}s` }}
            >
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors group-hover:bg-[var(--lime)] group-hover:text-[var(--ink)]"
                style={{ background: "rgba(124,196,255,0.16)", color: "var(--lime)" }}
              >
                <chip.icon size={15} />
              </span>
              {chip.label}
            </Link>
          </motion.li>
        ))}
      </ul>

      {/* "Our ecosystem" glass bar along the bottom (wide screens; sits above the tab bar) */}
      <motion.div
        {...fadeUp(reduceMotion, 0.9)}
        className="hidden md:flex absolute z-10 left-6 right-6 xl:left-10 xl:right-10 bottom-[84px] max-w-7xl mx-auto items-center justify-between gap-6 rounded-2xl px-6 py-4"
        style={{ background: "rgba(5,9,40,0.38)", border: "1px solid rgba(246,247,251,0.14)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] shrink-0" style={{ color: "var(--gray)" }}>
          Our ecosystem
        </span>
        <ul className="flex flex-wrap justify-end items-center gap-x-4 gap-y-1 text-sm" style={{ color: "var(--white)" }}>
          {ECOSYSTEM.map((item, i) => (
            <li key={item} className="flex items-center gap-4">
              {i > 0 && <span aria-hidden style={{ color: "var(--lime)" }}>·</span>}
              {item}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Scroll cue (phones): a label and a line that keeps drawing downwards */}
      <motion.button
        {...fadeUp(reduceMotion, 0.6)}
        className="md:hidden absolute left-1/2 -translate-x-1/2 bottom-8 z-10 flex flex-col items-center gap-3 text-xs font-medium uppercase tracking-[0.18em]"
        style={{ color: "var(--gray)" }}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: reduceMotion ? "auto" : "smooth" })}
        aria-label="Scroll to explore"
      >
        Scroll to explore
        <span className="relative block w-px h-10 overflow-hidden" style={{ background: "rgba(246,247,251,0.25)" }}>
          <motion.span
            className="absolute left-0 top-0 w-px h-full"
            style={{ background: "var(--lime)" }}
            animate={reduceMotion ? undefined : { y: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.button>
    </section>
  );
}
