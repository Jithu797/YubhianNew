"use client";

import { useState } from "react";
import { fadeUp } from "@/lib/motion";
import { motion } from "framer-motion";
import { Sparkles, Shield, Zap, LineChart, Plug } from "lucide-react";
import { useProductData } from "@/lib/useProductData";
import PageHero from "@/components/PageHero";

const FEATURES = [
  { icon: Sparkles, title: "AI-native from the ground up", text: "Intelligence isn't bolted on — every core workflow is designed with AI assistance built in.", accent: "#4B3FA0" },
  { icon: Zap, title: "Built for speed", text: "Sub-second interactions, optimistic UI, and a backend architected to stay fast as you scale.", accent: "#5B6FB0" },
  { icon: Shield, title: "Enterprise-grade security", text: "Role-based access, audit logs, and encryption at rest — ready for serious business use from day one.", accent: "#2C4A8C" },
  { icon: Plug, title: "Integrates with your stack", text: "Open APIs and webhooks so the product fits into tools you already use, not the other way around.", accent: "#1E3FA8" },
  { icon: LineChart, title: "Built on real feedback", text: "Every feature comes from problems we've seen firsthand building for clients across India.", accent: "#0E57A6" },
];

const ROADMAP = [
  { phase: "Phase 1", title: "Private Beta", text: "Closed beta with early waitlist members and design partners.", status: "In progress" },
  { phase: "Phase 2", title: "Public Launch", text: "Open signup with core feature set and onboarding flow.", status: "Upcoming" },
  { phase: "Phase 3", title: "Scale & Integrations", text: "Marketplace integrations, team plans, and API access.", status: "Planned" },
];

const FAQ = [
  { q: "What exactly is Yubhian building?", a: "We're not ready to reveal full product details yet — but it's a tool designed to solve a real, recurring problem we've seen across the businesses we've worked with in India." },
  { q: "When will it launch?", a: "We're targeting a private beta first, with waitlist members getting early access before the public launch." },
  { q: "Will it cost anything?", a: "Waitlist members will get early access with special founding pricing. Full pricing details will be announced closer to launch." },
  { q: "Can I give feedback before launch?", a: "Yes — waitlist members are invited to shape the product through beta feedback sessions." },
];

export default function ProductContent() {
  const product = useProductData();
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { createLead } = await import("@/lib/leads");
      await createLead({ name: "Waitlist Signup", email, message: "Product waitlist signup", source: "waitlist" });
    } catch {
      // Firestore not reachable yet — still confirm locally
    } finally {
      setLoading(false);
      setJoined(true);
      setEmail("");
    }
  }

  return (
    <>
      <PageHero
        kicker="Our flagship product · coming soon"
        title={product.tagline}
        subtitle={product.description}
        page="product"
        ghost={<Sparkles size={380} strokeWidth={0.7} />}
      />

      {/* Features */}
      <section className="px-6 pt-20 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} {...fadeUp(i * 0.08)}
              className="rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: f.accent + "20" }}>
                <f.icon size={22} style={{ color: f.accent }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>{f.title}</h3>
              <p className="text-sm font-normal leading-relaxed" style={{ color: "var(--gray)" }}>{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="px-6 pb-24" style={{ background: "var(--navy2)" }}>
        <div className="max-w-4xl mx-auto py-16">
          <motion.h2 {...fadeUp(0)} className="subsection-title mb-12 text-center" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
            Roadmap
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROADMAP.map((r, i) => (
              <motion.div key={r.phase} {...fadeUp(i * 0.1)}
                className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "rgba(30,63,168,0.15)", color: "var(--blue2)" }}>
                  {r.status}
                </span>
                <p className="kicker mt-4 mb-1">{r.phase}</p>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>{r.title}</h3>
                <p className="text-sm font-normal" style={{ color: "var(--gray)" }}>{r.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section className="px-6 pb-24">
        <div className="max-w-2xl mx-auto text-center rounded-3xl p-12" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="subsection-title mb-3" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
            Be first to know when we launch
          </h2>
          <p className="text-sm font-normal mb-8" style={{ color: "var(--gray)" }}>
            {product.waitlistCount > 0
              ? `Join ${product.waitlistCount}+ others on the waitlist for early access and founding-member pricing.`
              : "Join the waitlist for early access and founding-member pricing."}
          </p>
          {joined ? (
            <p className="text-sm font-medium" style={{ color: "var(--cyan)" }}>✓ Thanks! We&apos;ll be in touch soon.</p>
          ) : (
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "var(--navy2)", border: "1px solid var(--border)", color: "var(--white)" }}
              />
              <button type="submit" disabled={loading}
                className="btn-shine px-6 py-3 rounded-full text-white text-sm font-medium whitespace-nowrap disabled:opacity-60"
                style={{ background: "var(--grad)" }}>
                {loading ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fadeUp(0)} className="subsection-title mb-10 text-center" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
            Frequently asked questions
          </motion.h2>
          <div className="flex flex-col gap-3">
            {FAQ.map((f, i) => (
              <div key={f.q} className="rounded-xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <button
                  className="w-full flex items-center justify-between text-left px-6 py-4 font-medium"
                  style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {f.q}
                  <span className="text-lg" style={{ color: "var(--cyan)" }}>{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <p className="px-6 pb-5 text-sm font-normal leading-relaxed" style={{ color: "var(--gray)" }}>{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
