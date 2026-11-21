"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, Check, Minus, Plus, School } from "lucide-react";
import PageHero from "@/components/PageHero";
import TrainingEnquiry from "@/components/training/TrainingEnquiry";
import { fadeUp, EASE_OUT_QUART } from "@/lib/motion";
import { TRACKS, JOURNEY, TOPICS, CAMPUS_FIT, AUDIENCE, PROCESS, TRAINING_FAQ, type TrackId } from "@/lib/training";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Training for colleges and universities: five programme tracks in an interactive
 *  explorer, the learn-build-ship-show journey, topics, campus fit, how it runs, FAQ and a
 *  build-your-programme enquiry whose track stays in sync with the explorer. */
export default function TrainingContent() {
  const reduceMotion = useReducedMotion();
  const [track, setTrack] = useState<TrackId>("skills");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const active = TRACKS.find((t) => t.id === track)!;

  // The journey line fills as the section scrolls through the viewport.
  const journeyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: journeyRef, offset: ["start 80%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const plan = (id: TrackId) => {
    setTrack(id);
    scrollToId("enquire");
  };

  return (
    <>
      <PageHero
        kicker="Training & development"
        title={<>From classroom to <em className="serif-accent">real projects</em></>}
        subtitle="Skill training, workshops, faculty development, research and AI internships for AICTE-approved colleges and universities, taught by engineers who build real software."
        page="training"
        ghost={<School size={380} strokeWidth={0.7} />}
      >
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#enquire"
            onClick={(e) => { e.preventDefault(); scrollToId("enquire"); }}
            className="group flex items-center gap-3 pl-6 pr-2 py-2 rounded-full font-semibold transition-transform hover:-translate-y-0.5"
            style={{ background: "#FFFFFF", color: "#0B1033" }}
          >
            Plan a programme
            <span className="w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:-rotate-45" style={{ background: "#7CC4FF", color: "#0B1033" }}>
              <ArrowRight size={16} />
            </span>
          </a>
          <a
            href="#programmes"
            onClick={(e) => { e.preventDefault(); scrollToId("programmes"); }}
            className="px-6 py-3.5 rounded-full font-medium"
            style={{ border: "1px solid rgba(246,247,251,0.4)", color: "#F6F7FB" }}
          >
            See the programmes
          </a>
        </div>
      </PageHero>

      {/* Five tracks: an interactive explorer */}
      <section id="programmes" className="px-6 xl:px-10 py-24 scroll-mt-20" style={{ background: "var(--navy)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="max-w-3xl">
            <p className="kicker mb-5">Programmes</p>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              Five ways we work with <em className="serif-accent">your campus</em>
            </h2>
            <p className="mt-5 text-lg" style={{ color: "var(--gray)" }}>Pick a track to see who it&rsquo;s for, how it runs and what everyone leaves with.</p>
          </motion.div>

          <div className="mt-12 grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] gap-6 lg:gap-10">
            {/* Track list: a row of tabs that scrolls sideways on phones, a column on desktop */}
            <div role="tablist" aria-label="Training programmes" className="-mx-6 px-6 lg:mx-0 lg:px-0 flex lg:flex-col gap-2 overflow-x-auto snap-x"
              style={{ scrollbarWidth: "none" }}>
              {TRACKS.map((t, i) => {
                const on = t.id === track;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    id={`tab-${t.id}`}
                    aria-selected={on}
                    aria-controls="track-panel"
                    onClick={() => setTrack(t.id)}
                    className="snap-start shrink-0 lg:shrink flex items-center gap-4 rounded-2xl px-4 py-3.5 lg:px-5 lg:py-5 text-left transition-colors cursor-pointer"
                    style={on ? { background: "#0B1033", color: "#F6F7FB" } : { background: "var(--surface)", color: "var(--white)", border: "1px solid var(--hairline)" }}
                  >
                    <span className="hidden lg:block text-3xl tabular-nums w-10" style={{ fontFamily: "var(--font-syne)", color: on ? "#7CC4FF" : "var(--gray)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center" style={{ background: on ? "rgba(124,196,255,0.16)" : "rgba(30,63,168,0.08)", color: on ? "#7CC4FF" : "#1E3FA8" }}>
                      <t.icon size={19} />
                    </span>
                    <span className="whitespace-nowrap lg:whitespace-normal">
                      <span className="block font-semibold">{t.name}</span>
                      <span className="hidden lg:block text-sm mt-0.5" style={{ color: on ? "rgba(246,247,251,0.7)" : "var(--gray)" }}>{t.tagline}</span>
                    </span>
                    <ArrowRight size={16} className="hidden lg:block ml-auto shrink-0 transition-opacity" style={{ opacity: on ? 1 : 0 }} />
                  </button>
                );
              })}
            </div>

            {/* The selected track */}
            <div
              id="track-panel"
              role="tabpanel"
              aria-labelledby={`tab-${track}`}
              className="tone-light relative overflow-hidden rounded-3xl p-7 sm:p-10 min-h-[32rem]"
              style={{ background: "radial-gradient(ellipse 80% 80% at 90% 0%, #1E3FA8 0%, #121B5C 50%, #050A2E 100%)" }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: -24 }}
                  transition={{ duration: 0.4, ease: EASE_OUT_QUART }}
                  className="relative"
                >
                  <active.icon aria-hidden size={260} strokeWidth={0.6} className="pointer-events-none absolute -right-16 -top-16 hidden sm:block" style={{ color: "#7CC4FF", opacity: 0.08 }} />
                  <h3 className="text-3xl sm:text-4xl leading-tight" style={{ color: "#F6F7FB", fontFamily: "var(--font-syne)" }}>{active.name}</h3>
                  <p className="mt-3 text-lg" style={{ color: "#7CC4FF" }}>{active.tagline}</p>
                  <p className="mt-5 text-base max-w-2xl" style={{ color: "rgba(246,247,251,0.85)" }}>
                    <span className="font-semibold" style={{ color: "#F6F7FB" }}>For: </span>{active.forWho}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {active.formats.map((f) => (
                      <span key={f} className="text-sm px-3 py-1.5 rounded-full" style={{ background: "rgba(246,247,251,0.1)", color: "#F6F7FB" }}>{f}</span>
                    ))}
                  </div>
                  <div className="mt-8 grid md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "rgba(246,247,251,0.6)" }}>What happens</p>
                      <ul className="mt-4 flex flex-col gap-3">
                        {active.covers.map((c) => (
                          <li key={c} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "rgba(246,247,251,0.9)" }}>
                            <span aria-hidden className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full" style={{ background: "#7CC4FF" }} /> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "rgba(246,247,251,0.6)" }}>Everyone leaves with</p>
                      <ul className="mt-4 flex flex-col gap-3">
                        {active.outcomes.map((o) => (
                          <li key={o} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "rgba(246,247,251,0.9)" }}>
                            <Check size={16} className="mt-0.5 shrink-0" style={{ color: "#5ECFC8" }} /> {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => plan(active.id)}
                    className="group mt-10 inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full font-semibold cursor-pointer transition-transform hover:-translate-y-0.5"
                    style={{ background: "#FFFFFF", color: "#0B1033" }}
                  >
                    Plan this programme
                    <span className="w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:-rotate-45" style={{ background: "#7CC4FF" }}>
                      <ArrowRight size={16} />
                    </span>
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Learn → Build → Ship → Show */}
      <section id="journey" className="tone-light px-6 xl:px-10 py-24 overflow-hidden" style={{ background: "linear-gradient(160deg, #050A2E 0%, #0A1550 60%, #0E3F8F 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="max-w-3xl">
            <p className="kicker mb-5">How we teach</p>
            <h2 className="section-title" style={{ color: "#F6F7FB" }}>
              Every programme ends in <em className="serif-accent" style={{ color: "#7CC4FF" }}>something real</em>
            </h2>
          </motion.div>
          <div ref={journeyRef} className="relative mt-16">
            {/* Track line: across on desktop, down on phones */}
            <div aria-hidden className="absolute hidden md:block left-0 right-0 top-7 h-px" style={{ background: "rgba(246,247,251,0.18)" }} />
            <motion.div aria-hidden className="absolute hidden md:block left-0 right-0 top-7 h-px origin-left" style={{ background: "#7CC4FF", scaleX: reduceMotion ? 1 : fill }} />
            <div aria-hidden className="absolute md:hidden left-7 top-0 bottom-0 w-px" style={{ background: "rgba(246,247,251,0.18)" }} />
            <motion.div aria-hidden className="absolute md:hidden left-7 top-0 bottom-0 w-px origin-top" style={{ background: "#7CC4FF", scaleY: reduceMotion ? 1 : fill }} />
            <ol className="relative grid md:grid-cols-4 gap-10 md:gap-8">
              {JOURNEY.map((j, i) => (
                <motion.li key={j.step} {...fadeUp(i * 0.08)} className="flex md:flex-col gap-5 md:gap-6">
                  <span className="w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: "#0B1033", border: "1px solid #7CC4FF", color: "#7CC4FF" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-5xl md:text-6xl leading-none" style={{ fontFamily: "var(--font-syne)", color: "#F6F7FB" }}>{j.step}</span>
                    <span className="block mt-4 font-semibold" style={{ color: "#F6F7FB" }}>{j.title}</span>
                    <span className="block mt-2 text-sm leading-relaxed" style={{ color: "rgba(246,247,251,0.75)" }}>{j.text}</span>
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section id="topics" className="px-6 xl:px-10 py-24" style={{ background: "var(--navy)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <p className="kicker mb-5">What we teach</p>
              <h2 className="section-title" style={{ color: "var(--white)" }}>
                The technology we <em className="serif-accent">build with every day</em>
              </h2>
            </div>
            <p className="max-w-sm text-sm" style={{ color: "var(--gray)" }}>The same tools our engineers use on client projects and our own products, YuCampus and YuProof.</p>
          </motion.div>
          <ul className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOPICS.map((tp, i) => (
              <motion.li
                key={tp.name}
                {...fadeUp((i % 4) * 0.05)}
                className={`group relative overflow-hidden rounded-2xl p-6 transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(11,16,51,0.14)] ${tp.wide ? "lg:col-span-2" : ""}`}
                style={tp.wide ? { background: "#0B1033" } : { background: "var(--surface)", border: "1px solid var(--hairline)" }}
              >
                {tp.wide && <tp.icon aria-hidden size={180} strokeWidth={0.6} className="absolute -right-8 -bottom-10 transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110" style={{ color: "#7CC4FF", opacity: 0.12 }} />}
                <span className="relative w-11 h-11 rounded-xl flex items-center justify-center" style={tp.wide ? { background: "rgba(124,196,255,0.16)", color: "#7CC4FF" } : { background: "rgba(30,63,168,0.08)", color: "#1E3FA8" }}>
                  <tp.icon size={20} />
                </span>
                <h3 className="relative mt-5 text-xl" style={{ fontFamily: "var(--font-syne)", color: tp.wide ? "#F6F7FB" : "var(--white)" }}>{tp.name}</h3>
                <p className="relative mt-2 text-sm leading-relaxed max-w-md" style={{ color: tp.wide ? "rgba(246,247,251,0.75)" : "var(--gray)" }}>{tp.text}</p>
              </motion.li>
            ))}
            <motion.li {...fadeUp(0.15)}>
              <a
                href="#enquire"
                onClick={(e) => { e.preventDefault(); scrollToId("enquire"); }}
                className="group flex h-full flex-col justify-between gap-6 rounded-2xl p-6 transition-colors"
                style={{ border: "1px dashed #1E3FA8", background: "rgba(30,63,168,0.04)" }}
              >
                <span>
                  <span className="block text-xl" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>Need a different topic?</span>
                  <span className="block mt-2 text-sm leading-relaxed" style={{ color: "var(--gray)" }}>Tell us what your students or faculty need and we&rsquo;ll build the course around it.</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "#1E3FA8" }}>
                  Ask us <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            </motion.li>
          </ul>
        </div>
      </section>

      {/* Built for campuses */}
      <section id="campus" className="px-6 xl:px-10 py-24" style={{ background: "var(--navy2)" }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-12">
          <motion.div {...fadeUp(0)}>
            <p className="kicker mb-5">Made for campuses</p>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              Easy for colleges to <em className="serif-accent">say yes to</em>
            </h2>
            <p className="mt-8 text-xs uppercase tracking-[0.14em]" style={{ color: "var(--gray)" }}>Who we work with</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {AUDIENCE.map((a) => (
                <li key={a} className="text-sm px-3.5 py-2 rounded-full" style={{ background: "var(--surface)", border: "1px solid var(--hairline)", color: "var(--white)" }}>{a}</li>
              ))}
            </ul>
          </motion.div>
          <ul className="grid sm:grid-cols-2 gap-4">
            {CAMPUS_FIT.map((c, i) => (
              <motion.li key={c.title} {...fadeUp((i % 2) * 0.06)} className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--hairline)" }}>
                <span className="text-sm tabular-nums" style={{ color: "#1E3FA8" }}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-lg font-semibold" style={{ color: "var(--white)" }}>{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--gray)" }}>{c.text}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* How a programme comes together */}
      <section id="how" className="px-6 xl:px-10 py-24" style={{ background: "var(--navy)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="max-w-3xl">
            <p className="kicker mb-5">How it works</p>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              From first call to <em className="serif-accent">final report</em>
            </h2>
          </motion.div>
          <ol className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <span aria-hidden className="hidden lg:block absolute top-6 left-12 right-12 h-px" style={{ background: "var(--hairline)" }} />
            {PROCESS.map((p, i) => (
              <motion.li key={p.title} {...fadeUp(i * 0.08)} className="relative">
                <span className="relative w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white" style={{ background: "#1E3FA8" }}>{i + 1}</span>
                <h3 className="mt-5 text-xl" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--gray)" }}>{p.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Build your programme */}
      <section id="enquire" className="px-6 xl:px-10 py-24 scroll-mt-20" style={{ background: "var(--navy)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="max-w-3xl mb-12">
            <p className="kicker mb-5">Plan a programme</p>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              Build your programme <em className="serif-accent">in a minute</em>
            </h2>
            <p className="mt-5 text-lg" style={{ color: "var(--gray)" }}>Choose what you need and the brief writes itself. Send it, and we&rsquo;ll come back with a plan and a clear quote.</p>
          </motion.div>
          <TrainingEnquiry track={track} onTrack={setTrack} />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 xl:px-10 py-24" style={{ background: "var(--navy2)" }}>
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <p className="kicker mb-5 justify-center">Good questions</p>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              What colleges <em className="serif-accent">usually ask us</em>
            </h2>
          </motion.div>
          <div className="flex flex-col" style={{ borderTop: "1px solid var(--ink)" }}>
            {TRAINING_FAQ.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} style={{ borderBottom: "1px solid var(--hairline)" }}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`tfaq-${i}`}
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex items-center justify-between gap-6 py-6 text-left cursor-pointer"
                    >
                      <span className="text-lg font-medium" style={{ color: "var(--white)" }}>{f.q}</span>
                      <span className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center" style={{ background: open ? "#1E3FA8" : "var(--surface)", color: open ? "#FFFFFF" : "var(--white)", border: "1px solid var(--hairline)" }}>
                        {open ? <Minus size={15} /> : <Plus size={15} />}
                      </span>
                    </button>
                  </h3>
                  <div id={`tfaq-${i}`} hidden={!open} className="pb-6 pr-14 text-base leading-relaxed" style={{ color: "var(--gray)" }}>
                    {f.a}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
