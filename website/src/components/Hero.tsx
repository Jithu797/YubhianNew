"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  AnimatePresence,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { EASE_OUT_QUART, EASE_OUT_EXPO } from "@/lib/motion";
import HeroDust from "./HeroDust";

// The practices in the hero's "Our ecosystem" bar, each opening its service page.
const ECOSYSTEM: { label: string; href: string }[] = [
  { label: "AI", href: "/services/ai-ml" },
  { label: "Automation", href: "/services/ai-automation" },
  { label: "Web", href: "/services/web-development" },
  { label: "Mobile", href: "/services/mobile-apps" },
  { label: "Cloud", href: "/services/cloud" },
  { label: "Data", href: "/services/data-analytics" },
  { label: "Design", href: "/services/ui-ux-design" },
  { label: "Blockchain", href: "/services/blockchain" },
];

// Mouse/trackpad users get the spotlight and parallax; touch screens don't need them.
function subscribeFinePointer(onChange: () => void) {
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getFinePointer = () => window.matchMedia("(pointer: fine)").matches;

function rise(reduceMotion: boolean, delay = 0) {
  if (reduceMotion) return {};
  // A rise + focus pull rather than a fade from opacity 0: browsers don't count
  // invisible text as painted, so fading the headline in pushed Largest Contentful
  // Paint back by the length of the animation.
  return {
    initial: { y: 28, filter: "blur(10px)" },
    animate: { y: 0, filter: "blur(0px)" },
    transition: { duration: 0.9, delay, ease: EASE_OUT_QUART },
  };
}

/** Cycles through the CMS's words. Each word is set in a shimmering gold-to-sky
 *  gradient (the colours of the network glow and the brand highlight). */
function RotatingWord({ words, reduceMotion }: { words: string[]; reduceMotion: boolean }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reduceMotion || words.length < 2) return;
    // The first swap waits until the page has settled: each new word is a new element,
    // and an early swap would be recorded as a late Largest Contentful Paint.
    let interval: ReturnType<typeof setInterval> | undefined;
    const first = setTimeout(() => {
      setIndex((i) => (i + 1) % words.length);
      interval = setInterval(() => setIndex((i) => (i + 1) % words.length), 3000);
    }, 5000);
    return () => {
      clearTimeout(first);
      if (interval) clearInterval(interval);
    };
  }, [words.length, reduceMotion]);

  const word = words[index] ?? "AI Solutions";
  return (
    // The holder keeps the line's height while one word leaves and the next arrives,
    // so the paragraph and buttons below never jump.
    <span className="inline-block align-top" style={{ minHeight: "1.05em" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={word}
          className="hero-gradient-word serif-accent inline-block pr-[0.08em]"
          initial={{ y: "0.35em", opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-0.35em", opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// The night-lake world with the headline set big on its calm side. The scene responds to
// the visitor: a warm spotlight follows the cursor and lights up the network, golden dust
// drifts in front of the video, and the copy and dust shift slightly with the pointer
// (parallax). Everything interactive is skipped for reduced-motion and touch visitors.
export default function Hero() {
  const settings = useSiteSettings();
  const reduceMotion = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);

  // Pointer position over the hero: raw percentages for the spotlight, and springy
  // -1..1 values for parallax.
  const mx = useMotionValue(70);
  const my = useMotionValue(35);
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const px = useSpring(nx, { stiffness: 60, damping: 20 });
  const py = useSpring(ny, { stiffness: 60, damping: 20 });
  const copyX = useTransform(px, (v) => v * -10);
  const copyY = useTransform(py, (v) => v * -6);
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${mx}% ${my}%, rgba(255, 212, 140, 0.22), rgba(124, 196, 255, 0.08) 40%, transparent 70%)`;
  const finePointer = useSyncExternalStore(subscribeFinePointer, getFinePointer, () => false);
  const interactive = finePointer && !reduceMotion;

  function onPointerMove(e: React.PointerEvent) {
    if (!interactive || !sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    mx.set(x * 100);
    my.set(y * 100);
    nx.set(x * 2 - 1);
    ny.set(y * 2 - 1);
  }

  return (
    // Transparent: this is the first chapter, so ScrollStage paints the "hero" world
    // behind it. svh excludes mobile browser chrome.
    <section
      ref={sectionRef}
      id="hero"
      data-chapter="hero"
      onPointerMove={onPointerMove}
      className="tone-light relative flex flex-col overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      {/* Shade only where it's needed: a soft pool behind the copy, a band under the
          navbar, and (phones) a rise from the bottom — the rest of the scene stays vivid. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 22% 55%, rgba(5,9,40,0.62) 0%, rgba(5,9,40,0.25) 55%, transparent 80%), linear-gradient(to bottom, rgba(5,9,40,0.55) 0%, transparent 18%)",
        }}
      />
      <div
        className="md:hidden pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(5,9,40,0.85) 0%, rgba(5,9,40,0.5) 45%, rgba(5,9,40,0.15) 80%)" }}
      />

      {/* Cursor spotlight (desktop) */}
      {interactive && (
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: spotlight }} />
      )}

      {/* Golden dust in front of the video */}
      {!reduceMotion && <HeroDust px={px} py={py} />}

      <motion.div
        style={{ x: copyX, y: copyY }}
        className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-7xl mx-auto px-6 xl:px-10 page-top pb-28 md:pb-48"
      >
        {/* Live badge: the product Yubhian is building right now */}
        <motion.div {...rise(reduceMotion, 0)}>
          <Link
            href="/products/yucampus"
            className="group inline-flex items-center gap-3 rounded-full pl-2 pr-4 py-1.5 text-sm transition-colors"
            style={{ background: "rgba(5,9,40,0.45)", border: "1px solid rgba(246,247,251,0.18)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
          >
            <span className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ background: "var(--lime)", color: "var(--ink)" }}>
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "var(--ink)", opacity: 0.5 }} />
                <span className="relative rounded-full w-1.5 h-1.5" style={{ background: "var(--ink)" }} />
              </span>
              New
            </span>
            <span style={{ color: "var(--white)" }}>YuCampus — now onboarding pilot colleges</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" style={{ color: "var(--lime)" }} />
          </Link>
        </motion.div>

        {/* One animated unit: splitting the headline into separately animated words
            delayed when browsers count it as painted (Largest Contentful Paint). */}
        {/* Rise only (no blur): the headline is the page's largest paint, and browsers
            don't count it as painted until a blur filter clears. */}
        <motion.h1
          initial={reduceMotion ? false : { y: 28 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE_OUT_QUART }}
          className="mt-7 max-w-5xl"
          style={{
            color: "var(--white)",
            fontSize: "clamp(3.25rem, 9vw, 9.5rem)",
            lineHeight: 0.94,
            letterSpacing: "-0.045em",
            fontWeight: 400,
            textShadow: "0 4px 60px rgba(0,0,0,0.35)",
          }}
        >
          {settings.hero_title}
          <br />
          <RotatingWord words={settings.typewriter_words} reduceMotion={reduceMotion} />
        </motion.h1>

        <motion.p {...rise(reduceMotion, 0.45)} className="mt-8 max-w-md text-lg leading-relaxed" style={{ color: "var(--gray2)" }}>
          {settings.hero_subtitle}
        </motion.p>

        <motion.div {...rise(reduceMotion, 0.55)} className="mt-10 flex flex-wrap items-center gap-6">
          <Link
            href="/services"
            className="hero-cta group relative flex items-center gap-3 pl-6 pr-2 py-2 rounded-full font-semibold transition-transform duration-300 hover:-translate-y-0.5"
            style={{ background: "var(--paper)", color: "var(--ink)" }}
          >
            {settings.cta_primary}
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-[-45deg]"
              style={{ background: "linear-gradient(135deg, #F6C66B, #7CC4FF)", color: "var(--ink)" }}
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
      </motion.div>

      {/* "Our ecosystem" glass bar along the bottom — each practice links to its page */}
      <motion.nav
        aria-label="Our ecosystem"
        {...rise(reduceMotion, 0.9)}
        className="hidden md:flex absolute z-10 left-6 right-6 xl:left-10 xl:right-10 bottom-10 max-w-7xl mx-auto items-center justify-between gap-6 rounded-2xl px-6 py-4"
        style={{ background: "rgba(5,9,40,0.42)", border: "1px solid rgba(246,247,251,0.14)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] shrink-0" style={{ color: "var(--gray)" }}>
          Our ecosystem
        </span>
        <ul className="flex flex-wrap justify-end items-center gap-x-4 gap-y-1 text-sm">
          {ECOSYSTEM.map((item, i) => (
            <li key={item.label} className="flex items-center gap-4">
              {i > 0 && <span aria-hidden style={{ color: "var(--lime)" }}>·</span>}
              <Link href={item.href} className="transition-colors hover:text-[var(--lime)]" style={{ color: "var(--white)" }}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </motion.nav>

      {/* Scroll cue (phones): a label and a line that keeps drawing downwards */}
      <motion.button
        {...rise(reduceMotion, 0.6)}
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
