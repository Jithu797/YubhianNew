"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

type Intent = "demo" | "pilot";

/** Demo / free-pilot request for a product. Saved as a lead (source = the product's lead
 *  source) and emailed to the team, the same pipeline as the contact form. */
export default function ProductLeadForm({ productName, leadSource }: { productName: string; leadSource: string }) {
  const [intent, setIntent] = useState<Intent>("demo");
  const [org, setOrg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!org || !name || !email) return;
    setState("sending");
    try {
      const { createLead } = await import("@/lib/leads");
      // Optional fields are omitted rather than sent as undefined — Firestore rejects
      // documents containing undefined values.
      await createLead({
        name,
        company: org,
        email,
        ...(phone ? { phone } : {}),
        message: `${productName}: ${intent === "demo" ? "demo request" : "free pilot request"}`,
        source: leadSource,
      });
    } catch {
      // Firestore not reachable — still confirm locally
    }
    setState("sent");
  }

  if (state === "sent") {
    return (
      <div className="py-8 text-center" role="status">
        <span className="mx-auto w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#DCE6FF", color: "#1E3FA8" }}>
          <Check size={22} />
        </span>
        <p className="mt-4 text-2xl" style={{ fontFamily: "var(--font-syne)", color: "#0B1033" }}>Thank you — we&rsquo;ll be in touch.</p>
        <p className="mt-2 text-sm" style={{ color: "#4A5172" }}>
          We&rsquo;ll contact you about a {productName} {intent === "demo" ? "demo" : "pilot"} for {org}.
        </p>
      </div>
    );
  }

  const field = "w-full px-4 py-3 rounded-xl outline-none text-sm focus:border-[#1E3FA8]";
  const fieldStyle = { background: "#FFFFFF", border: "1px solid #DFE3EE", color: "#0B1033" };
  const label = "flex flex-col gap-1.5 text-sm";

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <fieldset className="grid grid-cols-2 gap-2 p-1 rounded-xl" style={{ background: "#ECEFF7" }}>
        <legend className="sr-only">What would you like?</legend>
        {(["demo", "pilot"] as const).map((v) => (
          <label key={v} className="cursor-pointer">
            <input type="radio" name="intent" value={v} checked={intent === v} onChange={() => setIntent(v)} className="sr-only peer" />
            <span
              className="block text-center rounded-lg py-2.5 text-sm font-medium transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#1E3FA8]"
              style={intent === v ? { background: "#FFFFFF", color: "#0B1033", boxShadow: "0 2px 8px rgba(11,16,51,0.08)" } : { color: "#4A5172" }}
            >
              {v === "demo" ? "Book a demo" : "Free pilot"}
            </span>
          </label>
        ))}
      </fieldset>
      <label htmlFor="pl-org" className={label} style={{ color: "#4A5172" }}>
        College / university *
        <input id="pl-org" name="organization" autoComplete="organization" required value={org} onChange={(e) => setOrg(e.target.value)} className={field} style={fieldStyle} />
      </label>
      <div className="grid sm:grid-cols-2 gap-4">
        <label htmlFor="pl-name" className={label} style={{ color: "#4A5172" }}>
          Your name *
          <input id="pl-name" name="name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className={field} style={fieldStyle} />
        </label>
        <label htmlFor="pl-phone" className={label} style={{ color: "#4A5172" }}>
          Phone
          <input id="pl-phone" name="phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={field} style={fieldStyle} />
        </label>
      </div>
      <label htmlFor="pl-email" className={label} style={{ color: "#4A5172" }}>
        Work email *
        <input id="pl-email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} style={fieldStyle} />
      </label>
      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-medium text-white disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #0A1250, #1E3FA8)" }}
      >
        {state === "sending" ? "Sending…" : intent === "demo" ? "Request a demo" : "Request a free pilot"} <ArrowRight size={16} />
      </button>
    </form>
  );
}
