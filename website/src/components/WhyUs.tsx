"use client";

import { Brain, Zap, Layers, BadgeCheck, HeartHandshake, Globe } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { REVEAL_STAGGER } from "@/lib/motion";

const CARDS = [
  { title: "Intelligence, built in", desc: "We don't bolt AI on as an afterthought — it's part of how we architect the product from the first sprint.", icon: Brain },
  { title: "Weeks, not months", desc: "A small, senior team means fewer handoffs and faster decisions — from first call to shipped product.", icon: Zap },
  { title: "One team, start to finish", desc: "The same people who design it build it and deploy it — no agency-to-freelancer handoffs along the way.", icon: Layers },
  { title: "Fixed scope, fixed price", desc: "You get a quote before we start and a milestone plan you can hold us to — no surprise invoices mid-project.", icon: BadgeCheck },
  { title: "We stick around", desc: "Every engagement includes 3 months of support after launch, because most real bugs show up after real users do.", icon: HeartHandshake },
  { title: "Built from Andhra Pradesh", desc: "An India-based team building to the same bar as the agencies we compete with, at a fraction of the cost.", icon: Globe },
];

export default function WhyUs() {
  return (
    <section className="py-[var(--space-6xl)] px-6" style={{ background: "var(--navy2)" }} id="why-us-list">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="mb-14">
          <p className="kicker mb-5">06 · Why us</p>
          <h2 className="section-title mb-4" style={{ color: "var(--white)" }}>
            Engineering partners who build like <span className="serif-accent">founders</span>
          </h2>
          <p className="text-lg max-w-xl" style={{ color: "var(--gray)" }}>
            We combine startup speed with enterprise quality.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          {CARDS.map((card, i) => (
            <ScrollReveal
              key={card.title}
              delay={i * REVEAL_STAGGER}
              y={16}
              duration={0.5}
              className="flex items-start gap-5 py-6"
              style={{ borderBottom: i < CARDS.length - 2 ? "1px solid var(--border)" : "none" }}
            >
              <card.icon size={20} strokeWidth={1.75} className="shrink-0 mt-1" style={{ color: "var(--blue)" }} />
              <div>
                <h3 className="text-base font-bold mb-1.5" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed font-normal" style={{ color: "var(--gray)" }}>
                  {card.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
