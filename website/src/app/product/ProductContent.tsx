"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, CircleDashed, GraduationCap, Plus, Minus } from "lucide-react";
import { fadeUp, EASE_OUT_QUART } from "@/lib/motion";
import { useProductData } from "@/lib/useProductData";
import PageHero from "@/components/PageHero";
import {
  YUCAMPUS,
  YUCAMPUS_WHY,
  YUCAMPUS_STEPS,
  YUCAMPUS_MODULES,
  YUCAMPUS_LATER,
  YUCAMPUS_AUDIENCE,
  YUCAMPUS_PLATFORM,
  YUCAMPUS_PRICING,
  YUCAMPUS_FAQ,
  NAAC_CRITERIA,
} from "@/lib/yucampus";

// Sample fill levels for the readiness preview — clearly labelled as illustrative in
// the UI; they show what the IQAC view looks like, not any real college's data.
const PREVIEW_LEVELS = [92, 76, 58, 88, 71, 64, 83];

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="kicker mb-5">{children}</p>;
}

/** Illustrative IQAC readiness board: the seven NAAC criteria with sample progress. */
function ReadinessPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduceMotion = useReducedMotion();
  return (
    <div
      ref={ref}
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--surface)", border: "1px solid var(--hairline)", boxShadow: "0 30px 70px rgba(11,16,51,0.12)" }}
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between gap-3 px-5 py-3" style={{ borderBottom: "1px solid var(--hairline)", background: "var(--navy2)" }}>
        <div className="flex items-center gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--navy3)" }} />
          ))}
        </div>
        <p className="text-xs font-medium truncate" style={{ color: "var(--gray)" }}>IQAC · NAAC readiness</p>
        <span className="text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full" style={{ background: "var(--peach)", color: "var(--ink)" }}>
          Illustrative
        </span>
      </div>

      <ul className="px-5 py-4 flex flex-col gap-3.5">
        {NAAC_CRITERIA.map((c, i) => {
          const level = PREVIEW_LEVELS[i];
          const done = level >= 85;
          return (
            <li key={c} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
              <span className="text-[11px] tabular-nums w-7" style={{ color: "var(--gray)" }}>C{i + 1}</span>
              <div className="min-w-0">
                <p className="text-sm truncate" style={{ color: "var(--white)" }}>{c}</p>
                <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--navy3)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: done ? "var(--blue)" : "var(--lime)" }}
                    initial={{ width: reduceMotion ? `${level}%` : "0%" }}
                    animate={inView ? { width: `${level}%` } : undefined}
                    transition={{ duration: 1.1, delay: 0.1 + i * 0.08, ease: EASE_OUT_QUART }}
                  />
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs whitespace-nowrap" style={{ color: done ? "var(--blue)" : "var(--gray)" }}>
                {done ? <Check size={13} /> : <CircleDashed size={13} />}
                {done ? "Complete" : "Evidence missing"}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center gap-2 px-5 py-4" style={{ borderTop: "1px solid var(--hairline)" }}>
        <span className="text-xs mr-1" style={{ color: "var(--gray)" }}>Generate:</span>
        {["SSR", "AQAR", "SAR"].map((r) => (
          <span key={r} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ border: "1px solid var(--hairline)", color: "var(--white)" }}>
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ProductContent() {
  const product = useProductData();
  const [college, setCollege] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  async function handlePilot(e: React.FormEvent) {
    e.preventDefault();
    if (!college || !email) return;
    setLoading(true);
    try {
      const { createLead } = await import("@/lib/leads");
      await createLead({
        name: college,
        company: college,
        email,
        phone: phone || undefined,
        message: "YuCampus free pilot request",
        source: "yucampus-pilot",
      });
    } catch {
      // Firestore not reachable yet — still confirm locally
    } finally {
      setLoading(false);
      setSent(true);
    }
  }

  const fieldStyle = { background: "var(--surface)", border: "1px solid var(--hairline)", color: "var(--ink)" };

  return (
    <>
      <PageHero
        kicker={`${YUCAMPUS.byline} · Coming soon`}
        title={product.tagline}
        subtitle={product.description}
        page="product"
        ghost={<GraduationCap size={380} strokeWidth={0.7} />}
      >
        <div className="flex flex-wrap items-center gap-6">
          <a
            href="#pilot"
            className="group flex items-center gap-3 pl-6 pr-2 py-2 rounded-full font-medium transition-transform duration-300 hover:-translate-y-0.5"
            style={{ background: "var(--paper)", color: "var(--ink)" }}
          >
            Apply for a free pilot
            <span className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-[-45deg]" style={{ background: "var(--lime)" }}>
              <ArrowRight size={16} />
            </span>
          </a>
          <a href="#how" className="font-medium underline underline-offset-[6px] decoration-1" style={{ color: "var(--white)", textDecorationColor: "rgba(246,247,251,0.5)" }}>
            See how it works
          </a>
        </div>
      </PageHero>

      {/* Why now */}
      <section className="px-6 xl:px-10 pt-24 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)}>
            <Kicker>Why now</Kicker>
            <h2 className="section-title max-w-3xl" style={{ color: "var(--white)" }}>
              Accreditation isn&rsquo;t a five-year event <em className="serif-accent">anymore</em>
            </h2>
          </motion.div>
          <div className="mt-12 grid md:grid-cols-3" style={{ borderTop: "1px solid var(--ink)" }}>
            {YUCAMPUS_WHY.map((w, i) => (
              <motion.div
                key={w.title}
                {...fadeUp(i * 0.1)}
                className={`pt-8 pb-4 md:pr-8 ${i ? "md:pl-8 md:border-l" : ""}`}
                style={{ borderColor: "var(--hairline)" }}
              >
                <p className="text-xs tabular-nums mb-5" style={{ color: "var(--gray)" }}>{String(i + 1).padStart(2, "0")}</p>
                <h3 className="text-xl leading-snug mb-3" style={{ color: "var(--white)" }}>{w.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--gray)" }}>{w.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works + readiness preview */}
      <section id="how" className="px-6 xl:px-10 py-24 scroll-mt-24" style={{ background: "var(--navy2)" }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-14 items-center">
          <div>
            <motion.div {...fadeUp(0)}>
              <Kicker>How it works</Kicker>
              <h2 className="section-title" style={{ color: "var(--white)" }}>
                Evidence in all year, <em className="serif-accent">reports out</em> on demand
              </h2>
            </motion.div>
            <ol className="mt-10 flex flex-col">
              {YUCAMPUS_STEPS.map((s, i) => (
                <motion.li
                  key={s.title}
                  {...fadeUp(0.1 + i * 0.1)}
                  className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 py-6"
                  style={{ borderTop: "1px solid var(--hairline)" }}
                >
                  <span className="leading-none" style={{ fontFamily: "var(--font-syne)", fontStyle: "italic", fontSize: "2.4rem", color: "var(--blue)" }}>
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-xl mb-1.5" style={{ color: "var(--white)" }}>{s.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--gray)" }}>{s.text}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
          <motion.div {...fadeUp(0.2)}>
            <ReadinessPreview />
            <p className="mt-3 text-xs text-center" style={{ color: "var(--gray)" }}>
              Illustrative preview with sample data — the seven NAAC criteria as the IQAC team sees them.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Modules */}
      <section className="px-6 xl:px-10 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Kicker>Modules</Kicker>
              <h2 className="section-title" style={{ color: "var(--white)" }}>
                Start with accreditation, <em className="serif-accent">grow</em> from there
              </h2>
            </div>
            <p className="max-w-sm text-sm" style={{ color: "var(--gray)" }}>
              Choose the modules you need — everything shares one source of truth for your campus data.
            </p>
          </motion.div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {YUCAMPUS_MODULES.map((m, i) => {
              const first = m.stage === "First";
              return (
                <motion.div
                  key={m.name}
                  {...fadeUp(i * 0.1)}
                  className="relative rounded-2xl p-7 flex flex-col gap-4 transition-transform duration-500 hover:-translate-y-1"
                  style={first ? { background: "linear-gradient(150deg, #0A1550, #1E3FA8)" } : { background: "var(--surface)", border: "1px solid var(--hairline)" }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={first ? { background: "rgba(124,196,255,0.18)", color: "var(--lime)" } : { background: "rgba(30,63,168,0.1)", color: "var(--blue)" }}
                    >
                      <m.icon size={20} />
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full"
                      style={first ? { background: "var(--lime)", color: "var(--ink)" } : { border: "1px solid var(--hairline)", color: "var(--gray)" }}
                    >
                      {first ? "Launching first" : "Next"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl" style={{ color: first ? "var(--paper)" : "var(--white)" }}>{m.name}</h3>
                    <p className="mt-1 text-sm font-medium" style={{ color: first ? "var(--lime)" : "var(--blue)" }}>{m.scope}</p>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: first ? "rgba(246,247,251,0.82)" : "var(--gray)" }}>{m.detail}</p>
                </motion.div>
              );
            })}
          </div>
          <motion.div {...fadeUp(0.3)} className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl px-6 py-5" style={{ border: "1px dashed var(--hairline)" }}>
            <span className="text-sm font-medium mr-2" style={{ color: "var(--white)" }}>Later:</span>
            {YUCAMPUS_LATER.map((l) => (
              <span key={l.name} className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full" style={{ background: "var(--navy2)", color: "var(--gray2)" }}>
                <l.icon size={14} /> {l.name}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who it's for + platform */}
      <section className="px-6 xl:px-10 py-24" style={{ background: "var(--navy2)" }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          <motion.div {...fadeUp(0)}>
            <Kicker>Who it&rsquo;s for</Kicker>
            <h2 className="subsection-title" style={{ color: "var(--white)" }}>
              Built for Indian <em className="serif-accent">colleges &amp; universities</em>
            </h2>
            <ul className="mt-8 grid sm:grid-cols-2 gap-3">
              {YUCAMPUS_AUDIENCE.now.map((a) => (
                <li key={a} className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm" style={{ background: "var(--surface)", border: "1px solid var(--hairline)", color: "var(--white)" }}>
                  <Check size={16} style={{ color: "var(--blue)" }} /> {a}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm" style={{ color: "var(--gray)" }}>Later: {YUCAMPUS_AUDIENCE.later}</p>
          </motion.div>
          <motion.div {...fadeUp(0.15)}>
            <Kicker>The platform</Kicker>
            <h2 className="subsection-title" style={{ color: "var(--white)" }}>
              One cloud platform, <em className="serif-accent">always current</em>
            </h2>
            <ul className="mt-8 flex flex-col">
              {YUCAMPUS_PLATFORM.map((p) => (
                <li key={p.title} className="py-5" style={{ borderTop: "1px solid var(--hairline)" }}>
                  <h3 className="text-lg mb-1" style={{ color: "var(--white)" }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--gray)" }}>{p.text}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Pricing + free pilot */}
      <section
        id="pilot"
        className="tone-light px-6 xl:px-10 py-24 scroll-mt-24"
        style={{ background: "radial-gradient(ellipse 80% 70% at 75% 20%, #0E3F8F 0%, #0A1550 50%, #050A2E 100%)" }}
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <motion.div {...fadeUp(0)}>
            <Kicker>Pricing &amp; pilots</Kicker>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              Free pilots for <em className="serif-accent">early colleges</em>
            </h2>
            <p className="mt-6 text-lg leading-relaxed max-w-lg" style={{ color: "var(--gray2)" }}>
              {YUCAMPUS_PRICING.model} {YUCAMPUS_PRICING.pilot}
            </p>
          </motion.div>
          <motion.div {...fadeUp(0.15)} className="rounded-2xl p-7 sm:p-8" style={{ background: "var(--paper)" }}>
            {sent ? (
              <div className="py-6 text-center">
                <p className="text-2xl" style={{ fontFamily: "var(--font-syne)", color: "var(--ink)" }}>Thank you — we&rsquo;ll be in touch.</p>
                <p className="mt-2 text-sm" style={{ color: "#4A5172" }}>We&rsquo;ll reach out about a YuCampus pilot for {college || "your college"}.</p>
              </div>
            ) : (
              <form onSubmit={handlePilot} className="flex flex-col gap-4">
                <p className="text-lg font-medium" style={{ color: "var(--ink)" }}>Apply for a free pilot</p>
                <label htmlFor="pilot-college" className="flex flex-col gap-1.5 text-sm" style={{ color: "#4A5172" }}>
                  College / university name *
                  <input id="pilot-college" required value={college} onChange={(e) => setCollege(e.target.value)} className="px-4 py-3 rounded-xl outline-none focus:border-[var(--blue)]" style={fieldStyle} />
                </label>
                <label htmlFor="pilot-email" className="flex flex-col gap-1.5 text-sm" style={{ color: "#4A5172" }}>
                  Your email *
                  <input id="pilot-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="px-4 py-3 rounded-xl outline-none focus:border-[var(--blue)]" style={fieldStyle} />
                </label>
                <label htmlFor="pilot-phone" className="flex flex-col gap-1.5 text-sm" style={{ color: "#4A5172" }}>
                  Phone (optional)
                  <input id="pilot-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="px-4 py-3 rounded-xl outline-none focus:border-[var(--blue)]" style={fieldStyle} />
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-medium text-white disabled:opacity-60"
                  style={{ background: "var(--grad)" }}
                >
                  {loading ? "Sending…" : "Request a pilot"} <ArrowRight size={16} />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 xl:px-10 py-24">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <Kicker>Questions</Kicker>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              About <em className="serif-accent">{YUCAMPUS.name}</em>
            </h2>
          </motion.div>
          <div className="flex flex-col" style={{ borderTop: "1px solid var(--ink)" }}>
            {YUCAMPUS_FAQ.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} style={{ borderBottom: "1px solid var(--hairline)" }}>
                  <button
                    type="button"
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-4 text-left py-5 text-lg"
                    style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    {f.q}
                    <span className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ border: "1px solid var(--hairline)", color: "var(--blue)" }}>
                      {open ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </button>
                  {open && <p className="pb-6 text-sm leading-relaxed" style={{ color: "var(--gray)" }}>{f.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
