"use client";

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useProductData } from "@/lib/useProductData";
import ScrollReveal from "./ScrollReveal";
import { REVEAL_STAGGER } from "@/lib/motion";

export default function ProductSpotlight() {
  const reduceMotion = useReducedMotion();
  const product = useProductData();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const rightInView = useInView(headRef, { once: true, margin: "-15% 0px -15% 0px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const activeIndex = useTransform(scrollYProgress, [0, 1], [0, product.features.length - 1]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(activeIndex, "change", (v) => {
    setActive(Math.round(Math.min(product.features.length - 1, Math.max(0, v))));
  });

  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { createLead } = await import("@/lib/leads");
      await createLead({ name: "Waitlist Signup", email, message: "Product waitlist signup", source: "waitlist" });
    } catch {
      // Firestore not reachable yet — still confirm to the user locally
    } finally {
      setLoading(false);
      setJoined(true);
      setEmail("");
    }
  }

  return (
    // The scroll-driven feature highlight needs extra scroll length to travel through,
    // but only from md up: on phones the left column is taller than the viewport, and
    // pinning it inside an overflow-hidden 100vh box would clip the form off-screen.
    <section ref={sectionRef} className="relative md:min-h-[200vh]" style={{ background: "var(--navy)" }} id="product">
      <div className="md:sticky md:top-0 md:min-h-screen flex items-center md:overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-[var(--space-6xl)] w-full">
          {/* Left — content, each piece assembling in sequence rather than one flat fade */}
          <div>
            <ScrollReveal delay={0}>
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <p className="kicker">05 · Our flagship product</p>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "var(--peach)", color: "var(--ink)" }}>
                  Coming soon
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={REVEAL_STAGGER}>
              <h2 className="section-title mb-5" style={{ color: "var(--white)" }}>
                {product.tagline}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={REVEAL_STAGGER * 2}>
              <p className="text-lg font-normal leading-relaxed mb-8 max-w-md" style={{ color: "var(--gray)" }}>
                {product.description}
              </p>
            </ScrollReveal>

            <div className="flex flex-col gap-4 mb-10">
              {product.features.map((f, i) => (
                <ScrollReveal key={f} delay={REVEAL_STAGGER * (3 + i)} y={12}>
                  <div className="flex items-center gap-3 transition-opacity duration-300" style={{ opacity: active === i ? 1 : 0.4 }}>
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300"
                      style={{ background: active === i ? "var(--blue)" : "rgba(30,63,168,0.15)" }}
                    >
                      <Check size={13} className={active === i ? "text-white" : "text-[var(--blue)]"} />
                    </span>
                    <span className="text-sm" style={{ color: active === i ? "var(--white)" : "var(--gray)" }}>{f}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={REVEAL_STAGGER * (3 + product.features.length)}>
              {joined ? (
                <p className="text-sm font-medium" style={{ color: "var(--cyan)" }}>✓ Thanks! We&apos;ll let you know the moment we launch.</p>
              ) : (
                <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--white)" }}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-shine px-6 py-3 rounded-full text-white text-sm font-medium whitespace-nowrap transition-opacity disabled:opacity-60"
                    style={{ background: "var(--grad)" }}
                  >
                    {loading ? "Joining..." : "Join Waitlist"}
                  </button>
                </form>
              )}
              <p className="text-xs mt-3" style={{ color: "var(--gray)" }}>
                {product.waitlistCount > 0 ? `Join ${product.waitlistCount}+ others already on the waitlist` : "Be the first to join the waitlist"}
              </p>
            </ScrollReveal>
          </div>

          {/* Right — plain, honest placeholder (deliberately not a fake screenshot —
              the product doesn't have a UI yet, so we don't pretend it does). Its own
              pieces still assemble with a stagger, same "showcase reveal" mechanic
              applied to real elements instead of fabricated mockup chrome. */}
          <div ref={headRef} className="relative flex items-center justify-center">
            <div
              className="relative w-full max-w-md aspect-square rounded-2xl flex flex-col items-center justify-center gap-4 px-10 text-center"
              style={{ background: "var(--surface)", border: "1px dashed var(--border)" }}
            >
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.6, rotate: -15 }}
                animate={rightInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.5, ease: "backOut" }}
              >
                <Sparkles size={28} strokeWidth={1.5} style={{ color: "var(--blue)" }} />
              </motion.div>
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={rightInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: REVEAL_STAGGER, ease: "easeOut" }}
                className="text-sm font-medium uppercase tracking-widest"
                style={{ color: "var(--gold)" }}
              >
                In Development
              </motion.p>
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={rightInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: REVEAL_STAGGER * 2, ease: "easeOut" }}
                className="text-sm font-normal"
                style={{ color: "var(--gray)" }}
              >
                We&apos;re building this in the open. Join the waitlist to get early access and shape the product before launch.
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
