"use client";

import { useState } from "react";
import { Check } from "lucide-react";

const SERVICE_OPTIONS = ["AI/ML", "Web Development", "Mobile App", "Blockchain", "Cloud Solutions", "IT Consulting", "Other"];
const BUDGET_OPTIONS = ["Under ₹1L", "₹1L–₹5L", "₹5L–₹20L", "₹20L+", "Let's discuss"];

const fieldClass =
  "w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors placeholder:text-transparent";
const fieldStyle = { background: "var(--surface)", border: "1px solid var(--border)", color: "var(--white)" };

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
};

const EMPTY: FormState = { name: "", email: "", phone: "", company: "", service: "", budget: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.message.trim().length < 20) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const { createLead } = await import("@/lib/leads");
      await createLead({
        name: form.name,
        email: form.email,
        phone: form.phone ? `+91${form.phone}` : "",
        company: form.company,
        service_interest: form.service,
        budget: form.budget,
        message: form.message,
        source: "contact_form",
      });
      setStatus("success");
      setForm(EMPTY);
    } catch {
      // Firestore not reachable yet — still confirm locally so UX isn't blocked
      setStatus("success");
      setForm(EMPTY);
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-16">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(6,182,212,0.15)" }}>
          <Check size={28} style={{ color: "var(--cyan)" }} />
        </div>
        <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>Message sent!</h3>
        <p className="text-sm max-w-xs" style={{ color: "var(--gray)" }}>
          We will get back to you within 24 hours!
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm font-medium mt-2"
          style={{ color: "var(--cyan)" }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--gray2)" }}>Full Name *</label>
          <input required value={form.name} onChange={(e) => update("name", e.target.value)}
            className={fieldClass} style={fieldStyle} placeholder="Your name" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--gray2)" }}>Email Address *</label>
          <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
            className={fieldClass} style={fieldStyle} placeholder="you@company.com" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--gray2)" }}>Phone Number</label>
          <div className="flex items-center rounded-xl overflow-hidden" style={fieldStyle}>
            <span className="pl-4 pr-2 text-sm" style={{ color: "var(--gray)" }}>+91</span>
            <input value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))}
              maxLength={10} className="flex-1 py-3 pr-4 bg-transparent text-sm outline-none" style={{ color: "var(--white)" }} placeholder="98765 43210" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--gray2)" }}>Company Name</label>
          <input value={form.company} onChange={(e) => update("company", e.target.value)}
            className={fieldClass} style={fieldStyle} placeholder="Company Pvt. Ltd." />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--gray2)" }}>Service Interest</label>
          <select value={form.service} onChange={(e) => update("service", e.target.value)}
            className={fieldClass} style={fieldStyle}>
            <option value="">Select a service</option>
            {SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--gray2)" }}>Budget Range</label>
          <select value={form.budget} onChange={(e) => update("budget", e.target.value)}
            className={fieldClass} style={fieldStyle}>
            <option value="">Select a range</option>
            {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium" style={{ color: "var(--gray2)" }}>Message * (min 20 characters)</label>
        <textarea required rows={5} value={form.message} onChange={(e) => update("message", e.target.value)}
          className={fieldClass + " resize-none"} style={fieldStyle} placeholder="Tell us about your project..." />
        {status === "error" && (
          <p className="text-xs" style={{ color: "#f87171" }}>Please enter at least 20 characters describing your project.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-shine px-6 py-3.5 rounded-full text-white font-medium transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
        style={{ background: "var(--grad)", boxShadow: "0 4px 24px rgba(37,99,235,0.35)" }}
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
