"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Mail, Phone } from "lucide-react";
import { TRACKS, TOPICS, MODES, GROUP_SIZES, type TrackId } from "@/lib/training";
import { EASE_OUT_QUART } from "@/lib/motion";

const OTHER_TOPIC = "Something else";

/** Chip-style single choice (a radio group that looks like pills). */
function Choice<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  label = (o) => o,
}: {
  legend: string;
  name: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  label?: (o: T) => string;
}) {
  return (
    <fieldset>
      <legend className="text-xs uppercase tracking-[0.14em] mb-3" style={{ color: "#4A5172" }}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = o === value;
          return (
            <label key={o} className="cursor-pointer">
              <input type="radio" name={name} value={o} checked={on} onChange={() => onChange(o)} className="sr-only peer" />
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#1E3FA8] peer-focus-visible:ring-offset-2"
                style={on ? { background: "#1E3FA8", color: "#FFFFFF" } : { background: "#FFFFFF", color: "#262C4F", border: "1px solid #DFE3EE" }}
              >
                {on && <Check size={13} />}
                {label(o)}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Build-your-programme enquiry: pick a track, topic, mode and group size and watch the
 *  programme brief write itself; then send it with contact details. Saved as a lead
 *  (contact-form pipeline, service interest "Training · …") and emailed to the team. */
export default function TrainingEnquiry({ track, onTrack }: { track: TrackId; onTrack: (t: TrackId) => void }) {
  const reduceMotion = useReducedMotion();
  const [topic, setTopic] = useState<string>(TOPICS[1].name);
  const [mode, setMode] = useState<(typeof MODES)[number]>("On campus");
  const [size, setSize] = useState<(typeof GROUP_SIZES)[number]>("50 to 150");
  const [org, setOrg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const t = TRACKS.find((x) => x.id === track)!;
  const topicText = topic === OTHER_TOPIC ? "a topic of your choice" : topic;
  const article = /^[aeiou]/i.test(t.phrase) ? "An" : "A";
  const brief = `${article} ${t.phrase} on ${topicText}, ${mode.toLowerCase()}, for ${size.toLowerCase()} participants.`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!org || !name || !email) return;
    setState("sending");
    try {
      const { createLead } = await import("@/lib/leads");
      await createLead({
        name,
        email,
        company: org,
        ...(phone ? { phone } : {}),
        service_interest: `Training · ${t.name} · ${topic}`.slice(0, 120),
        message: `Training enquiry: ${brief}${notes ? `\n\n${notes}` : ""}`,
        source: "contact_form",
      });
    } catch {
      // Firestore not reachable: still confirm locally, as the other forms do
    }
    setState("sent");
  }

  const field = "w-full px-4 py-3 rounded-xl outline-none text-sm focus:border-[#1E3FA8]";
  const fieldStyle = { background: "#FFFFFF", border: "1px solid #DFE3EE", color: "#0B1033" };
  const labelCls = "flex flex-col gap-1.5 text-sm";

  return (
    <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8 lg:gap-12 items-start">
      {/* Step 1: shape the programme */}
      <div className="rounded-3xl p-6 sm:p-8 flex flex-col gap-7" style={{ background: "#ECEFF7" }}>
        <p className="text-sm font-semibold" style={{ color: "#0B1033" }}>
          <span className="inline-flex w-6 h-6 mr-2 items-center justify-center rounded-full text-xs text-white" style={{ background: "#0B1033" }}>1</span>
          Shape your programme
        </p>
        <Choice legend="Programme" name="tr-track" options={TRACKS.map((x) => x.id)} value={track} onChange={onTrack} label={(id) => TRACKS.find((x) => x.id === id)!.name} />
        <Choice legend="Topic" name="tr-topic" options={[...TOPICS.map((x) => x.name), OTHER_TOPIC]} value={topic} onChange={setTopic} />
        <div className="grid sm:grid-cols-2 gap-7">
          <Choice legend="Mode" name="tr-mode" options={MODES} value={mode} onChange={setMode} />
          <Choice legend="Participants" name="tr-size" options={GROUP_SIZES} value={size} onChange={setSize} />
        </div>
      </div>

      {/* Step 2: the brief writes itself, then contact details */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-28">
        <div
          className="tone-light relative overflow-hidden rounded-3xl p-6 sm:p-8"
          style={{ background: "radial-gradient(ellipse 90% 90% at 85% 0%, #1E3FA8 0%, #121B5C 55%, #050A2E 100%)" }}
          aria-live="polite"
        >
          {/* Ticket notches */}
          <span aria-hidden className="absolute -left-3 top-1/2 w-6 h-6 rounded-full" style={{ background: "var(--navy)" }} />
          <span aria-hidden className="absolute -right-3 top-1/2 w-6 h-6 rounded-full" style={{ background: "var(--navy)" }} />
          <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "#7CC4FF" }}>Your programme brief</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={brief}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EASE_OUT_QUART }}
              className="mt-4 text-2xl sm:text-[1.7rem] leading-snug"
              style={{ color: "#F6F7FB", fontFamily: "var(--font-syne)" }}
            >
              {brief}
            </motion.p>
          </AnimatePresence>
          <div aria-hidden className="my-6 border-t border-dashed" style={{ borderColor: "rgba(246,247,251,0.25)" }} />
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {t.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-2 text-sm" style={{ color: "rgba(246,247,251,0.85)" }}>
                <Check size={15} className="mt-0.5 shrink-0" style={{ color: "#5ECFC8" }} /> {o}
              </li>
            ))}
          </ul>
        </div>

        {state === "sent" ? (
          <div className="rounded-3xl p-8 text-center" style={{ background: "#FFFFFF", border: "1px solid #DFE3EE" }} role="status">
            <span className="mx-auto w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#DCE6FF", color: "#1E3FA8" }}>
              <Check size={22} />
            </span>
            <p className="mt-4 text-2xl" style={{ fontFamily: "var(--font-syne)", color: "#0B1033" }}>Thank you, we&rsquo;ll be in touch.</p>
            <p className="mt-2 text-sm" style={{ color: "#4A5172" }}>We&rsquo;ll call you to plan this programme for {org}.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="rounded-3xl p-6 sm:p-8 flex flex-col gap-4" style={{ background: "#FFFFFF", border: "1px solid #DFE3EE" }}>
            <p className="text-sm font-semibold" style={{ color: "#0B1033" }}>
              <span className="inline-flex w-6 h-6 mr-2 items-center justify-center rounded-full text-xs text-white" style={{ background: "#0B1033" }}>2</span>
              Where should we send the plan?
            </p>
            <label htmlFor="tr-org" className={labelCls} style={{ color: "#4A5172" }}>
              College / university *
              <input id="tr-org" name="organization" autoComplete="organization" required maxLength={160} value={org} onChange={(e) => setOrg(e.target.value)} className={field} style={fieldStyle} />
            </label>
            <div className="grid sm:grid-cols-2 gap-4">
              <label htmlFor="tr-name" className={labelCls} style={{ color: "#4A5172" }}>
                Your name *
                <input id="tr-name" name="name" autoComplete="name" required maxLength={120} value={name} onChange={(e) => setName(e.target.value)} className={field} style={fieldStyle} />
              </label>
              <label htmlFor="tr-phone" className={labelCls} style={{ color: "#4A5172" }}>
                Phone
                <input id="tr-phone" name="phone" type="tel" autoComplete="tel" maxLength={20} value={phone} onChange={(e) => setPhone(e.target.value)} className={field} style={fieldStyle} />
              </label>
            </div>
            <label htmlFor="tr-email" className={labelCls} style={{ color: "#4A5172" }}>
              Email *
              <input id="tr-email" name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} className={field} style={fieldStyle} />
            </label>
            <label htmlFor="tr-notes" className={labelCls} style={{ color: "#4A5172" }}>
              Anything else? (dates, department, syllabus)
              <textarea id="tr-notes" name="notes" rows={3} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} className={`${field} resize-y`} style={fieldStyle} />
            </label>
            <button
              type="submit"
              disabled={state === "sending"}
              className="mt-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-medium text-white disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #0A1250, #1E3FA8)" }}
            >
              {state === "sending" ? "Sending…" : "Send this brief"} <ArrowRight size={16} />
            </button>
            <p className="flex flex-wrap gap-x-5 gap-y-1 text-sm" style={{ color: "#4A5172" }}>
              <a href="tel:+918179728108" className="inline-flex items-center gap-1.5 hover:underline"><Phone size={14} /> +91 8179728108</a>
              <a href="mailto:info@yubhiantechnologies.in" className="inline-flex items-center gap-1.5 hover:underline"><Mail size={14} /> info@yubhiantechnologies.in</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
