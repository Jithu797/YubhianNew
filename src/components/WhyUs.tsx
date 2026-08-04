"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Brain, Zap, Layers, BadgeCheck, HeartHandshake, Globe } from "lucide-react";

const CARDS = [
  { title: "Intelligence, built in", desc: "We don't bolt AI on as an afterthought — it's part of how we architect the product from the first sprint.", icon: Brain },
  { title: "Weeks, not months", desc: "A small, senior team means fewer handoffs and faster decisions — from first call to shipped product.", icon: Zap },
  { title: "One team, start to finish", desc: "The same people who design it build it and deploy it — no agency-to-freelancer handoffs along the way.", icon: Layers },
  { title: "Fixed scope, fixed price", desc: "You get a quote before we start and a milestone plan you can hold us to — no surprise invoices mid-project.", icon: BadgeCheck },
  { title: "We stick around", desc: "Every engagement includes 3 months of support after launch, because most real bugs show up after real users do.", icon: HeartHandshake },
  { title: "Built from Andhra Pradesh", desc: "An India-based team building to the same bar as the agencies we compete with, at a fraction of the cost.", icon: Globe },
];

export default function WhyUs() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-[var(--space-6xl)] px-6" style={{ background: "var(--navy2)" }} id="why-us">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-sm font-medium mb-3 uppercase tracking-widest" style={{ color: "var(--cyan)" }}>Why Us</p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
            Engineering partners who build like founders
          </h2>
          <p className="text-lg max-w-xl" style={{ color: "var(--gray)" }}>
            We combine startup speed with enterprise quality.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex items-start gap-5 py-6"
              style={{ borderBottom: i < CARDS.length - 2 ? "1px solid var(--border)" : "none" }}
            >
              <card.icon size={20} strokeWidth={1.75} className="shrink-0 mt-1" style={{ color: "var(--blue)" }} />
              <div>
                <h3 className="text-base font-bold mb-1.5" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed font-light" style={{ color: "var(--gray)" }}>
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
