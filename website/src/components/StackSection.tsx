"use client";

import { motion, useReducedMotion } from "framer-motion";
import StackBubbles, { useStackSummary } from "./charts/StackBubbles";
import { EASE_OUT_QUART } from "@/lib/motion";

/** Full-bleed navy interlude holding the stack bubble chart — the report's
 *  "Creative AI tools by post mindshare" spread, told with Yubhian's own stack. */
export default function StackSection() {
  const reduceMotion = useReducedMotion();
  const { totalTechs, shown, services } = useStackSummary();

  return (
    <section
      id="stack"
      className="tone-light relative overflow-hidden px-6 xl:px-10"
      style={{
        paddingBlock: "var(--space-6xl)",
        background: "radial-gradient(ellipse 80% 60% at 70% 40%, #0E2F78 0%, #0A1550 45%, #050A2E 100%)",
      }}
    >
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE_OUT_QUART }}
          className="max-w-4xl"
        >
          <p className="kicker mb-5">04 · Our stack</p>
          <h2 className="section-title" style={{ color: "var(--white)" }}>
            The tools we <em className="serif-accent">build</em> with
          </h2>
          <p className="mt-5 text-sm sm:text-base" style={{ color: "var(--gray)" }}>
            {`Bubble size = how many of our ${services} services use each technology. The top ${shown} of the ${totalTechs} technologies we work with. Hover a bubble to see where it’s used.`}
          </p>
        </motion.div>

        <div className="mt-10 md:mt-6">
          <StackBubbles />
        </div>
      </div>
    </section>
  );
}
