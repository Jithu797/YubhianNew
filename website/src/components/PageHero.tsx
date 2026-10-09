"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT_QUART } from "@/lib/motion";
import { artSources } from "@/lib/chapters";
import { PAGE_ART } from "@/lib/page-art";

type PageHeroProps = {
  kicker: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Which page this is — picks its own artwork from PAGE_ART when one exists */
  page: string;
  /** Large faint icon drawn into the branded backdrop (used when there's no artwork) */
  ghost?: ReactNode;
  children?: ReactNode;
};

/**
 * Cinematic header for inner pages: the page's own artwork full-bleed behind a giant
 * serif title (or a branded navy backdrop until that artwork exists), so moving from
 * the homepage into any page keeps the same feel. The art drifts slowly (CSS, so it
 * costs nothing per frame) and the copy rises in on load.
 */
export default function PageHero({ kicker, title, subtitle, page, ghost, children }: PageHeroProps) {
  const art = PAGE_ART[page];
  const reduceMotion = useReducedMotion();
  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 40, filter: "blur(10px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 1, delay, ease: EASE_OUT_QUART },
        };

  return (
    <section className="tone-light relative overflow-hidden flex items-end" style={{ minHeight: "min(78svh, 760px)" }}>
      {art ? (
        // eslint-disable-next-line @next/next/no-img-element -- pre-optimized WebP set; next/image adds nothing here
        <img
          {...artSources(page, "pages")}
          sizes="100vw"
          alt=""
          fetchPriority="high"
          className="page-hero-art absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: art.position ?? "50% 50%" }}
        />
      ) : (
        // Branded backdrop for pages without their own artwork: the logo's navy-to-royal
        // gradient, a drifting glow, a faint dot grid and an optional ghosted icon.
        <div aria-hidden className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(135deg, #050A2E 0%, #0A1550 55%, #0E3F8F 100%)" }}>
          <div className="page-hero-glow absolute -top-1/4 right-[-10%] w-[70vw] h-[70vw] rounded-full" style={{ background: "radial-gradient(closest-side, rgba(124,196,255,0.28), transparent)" }} />
          <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #F6F7FB 1px, transparent 0)", backgroundSize: "28px 28px" }} />
          {ghost && (
            <div className="absolute right-[4%] top-1/2 -translate-y-1/2 hidden md:block" style={{ color: "#7CC4FF", opacity: 0.1 }}>
              {ghost}
            </div>
          )}
        </div>
      )}
      {/* Navy shade rising from the bottom-left, where the copy sits */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(5,9,40,0.82) 0%, rgba(5,9,40,0.45) 40%, rgba(5,9,40,0.1) 75%), linear-gradient(90deg, rgba(5,9,40,0.45) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 xl:px-10 pb-14 md:pb-20" style={{ paddingTop: "calc(var(--nav-height) + 3rem)" }}>
        <motion.p {...rise(0)} className="kicker mb-5">
          {kicker}
        </motion.p>
        <motion.h1
          {...rise(0.08)}
          className="max-w-4xl"
          style={{
            color: "var(--white)",
            fontSize: "clamp(2.75rem, 7vw, 6.5rem)",
            lineHeight: 0.98,
            letterSpacing: "-0.04em",
            fontWeight: 400,
            textShadow: "0 2px 40px rgba(0,0,0,0.25)",
          }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p {...rise(0.18)} className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: "var(--gray2)" }}>
            {subtitle}
          </motion.p>
        )}
        {children && <motion.div {...rise(0.28)} className="mt-8">{children}</motion.div>}
      </div>
    </section>
  );
}
