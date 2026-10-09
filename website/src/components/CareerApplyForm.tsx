"use client";

import { useState } from "react";
import { Check, Upload } from "lucide-react";

const fieldClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors placeholder:text-transparent";
const fieldStyle = { background: "var(--surface)", border: "1px solid var(--border)", color: "var(--white)" };

type FormState = { name: string; email: string; phone: string; message: string };
const EMPTY: FormState = { name: "", email: "", phone: "", message: "" };

export default function CareerApplyForm({ careerSlug, careerTitle }: { careerSlug: string; careerTitle: string }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!resumeFile) {
      setError("Please attach your resume.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const { uploadFile } = await import("@/lib/storage-upload");
      const { createCareerApplication } = await import("@/lib/career-applications");
      const resume_url = await uploadFile("career-applications", resumeFile);
      await createCareerApplication({
        career_slug: careerSlug,
        career_title: careerTitle,
        name: form.name,
        email: form.email,
        phone: form.phone ? `+91${form.phone}` : "",
        resume_url,
        message: form.message,
      });
      setStatus("success");
      setForm(EMPTY);
      setResumeFile(null);
    } catch {
      setError("Something went wrong uploading your application. Please try again or email us directly.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-14">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(6,182,212,0.15)" }}>
          <Check size={28} style={{ color: "var(--cyan)" }} />
        </div>
        <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>Application received!</h3>
        <p className="text-sm max-w-xs" style={{ color: "var(--gray)" }}>
          Thanks for applying to {careerTitle}. Our team will review your application and reach out if there&apos;s a fit.
        </p>
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
            className={fieldClass} style={fieldStyle} placeholder="you@example.com" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium" style={{ color: "var(--gray2)" }}>Phone Number</label>
        <div className="flex items-center rounded-xl overflow-hidden" style={fieldStyle}>
          <span className="pl-4 pr-2 text-sm" style={{ color: "var(--gray)" }}>+91</span>
          <input value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))}
            maxLength={10} className="flex-1 py-3 pr-4 bg-transparent text-sm outline-none" style={{ color: "var(--white)" }} placeholder="98765 43210" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium" style={{ color: "var(--gray2)" }}>Resume / CV *</label>
        <label
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm cursor-pointer"
          style={fieldStyle}
        >
          <Upload size={15} style={{ color: "var(--gray)" }} />
          <span style={{ color: resumeFile ? "var(--white)" : "var(--gray)" }}>
            {resumeFile ? resumeFile.name : "Attach PDF or Word document"}
          </span>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium" style={{ color: "var(--gray2)" }}>Cover Note (optional)</label>
        <textarea rows={4} value={form.message} onChange={(e) => update("message", e.target.value)}
          className={fieldClass + " resize-none"} style={fieldStyle} placeholder="Tell us why you'd be a great fit..." />
      </div>

      {status === "error" && <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-shine px-6 py-3.5 rounded-full text-white font-medium transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
        style={{ background: "var(--grad)", boxShadow: "0 4px 24px rgba(30,63,168,0.35)" }}
      >
        {status === "loading" ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
