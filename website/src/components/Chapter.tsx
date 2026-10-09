"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { WORLD_BY_ID } from "@/lib/chapters";
import { EASE_OUT_QUART } from "@/lib/motion";

type ChapterProps = {
  /** Must match an id in CHAPTER_WORLDS — it picks the world ScrollStage paints */
  world: string;
  /** Anchor id for the bottom tab bar (defaults to the world id) */
  id?: string;
  title?: ReactNode;
  /** Small uppercase line set beside the title ("Across AI, software & cloud") */
  subtitle?: string;
  children?: ReactNode;
  /** Render children straight onto the world instead of on a paper panel */
  bare?: boolean;
  /** "top" lifts the title into the upper third, for artwork whose calm space is the
   *  sky or wall above the subject; "center" (default) sets it mid-screen. */
  titlePlacement?: "center" | "top";
};

/** Giant serif chapter opener over the world, then the chapter's content. */
function ChapterTitle({ title, subtitle, placement }: { title: ReactNode; subtitle?: string; placement: "center" | "top" }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // The title drifts up slower than the page and fades as it leaves — a parallax lift.
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["18%", "-28%"]);
  // Fades in only as it nears the middle of the screen, which is when its own world
  // has taken the stage, so a dark title never sits on the previous chapter's scene.
  const opacity = useTransform(scrollYProgress, [0.25, 0.42, 0.6, 0.85], [0, 1, 1, 0]);

  return (
    <div
      ref={ref}
      className={`relative flex justify-center px-6 ${placement === "top" ? "items-start pt-[3svh]" : "items-center"}`}
      style={{ minHeight: "100svh" }}
    >
      <motion.div style={{ y, opacity }} className="text-center">
        <motion.h2
          initial={reduceMotion ? false : { opacity: 0, y: 80, filter: "blur(14px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: EASE_OUT_QUART }}
          className="chapter-title"
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.25, ease: EASE_OUT_QUART }}
            className="chapter-subtitle"
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

function PanelReveal({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="chapter-panel"
      initial={reduceMotion ? false : { clipPath: "inset(10% 8% 10% 8%)", opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 1.1, ease: EASE_OUT_QUART }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A transparent homepage section whose background is the chapter's world (painted by
 * ScrollStage). Content sits on a floating paper panel, with open world above and below
 * it so the scene keeps showing between chapters.
 */
export default function Chapter({ world, id, title, subtitle, children, bare, titlePlacement = "center" }: ChapterProps) {
  const tone = WORLD_BY_ID[world]?.tone ?? "dark";
  return (
    <section id={id ?? world} data-chapter={world} className={`relative ${tone === "light" ? "tone-light" : ""}`}>
      {title && <ChapterTitle title={title} subtitle={subtitle} placement={titlePlacement} />}
      {children &&
        (bare ? (
          children
        ) : (
          <div className="px-3 sm:px-6 xl:px-10 pb-[35vh]">
            {/* The panel wipes open from a smaller window as it arrives */}
            <PanelReveal>{children}</PanelReveal>
          </div>
        ))}
    </section>
  );
}
