"use client";

import { useEffect, useState } from "react";
import { initials, externalUrl } from "@/lib/utils";
import { getAllClients, CLIENTS_FALLBACK, type ClientDef } from "@/lib/clients-data";
import ScrollReveal from "./ScrollReveal";
import Marquee from "./Marquee";
import { REVEAL_STAGGER } from "@/lib/motion";

// A marquee only reads well once there's enough real content to loop — below that it'd
// just be one card sliding past on repeat. Falls back to the original static layout
// until the admin has added enough clients for the loop to feel intentional.
const MARQUEE_MIN = 5;

function ClientCard({ c }: { c: ClientDef }) {
  const href = externalUrl(c.websiteUrl);

  const inner = (
    <>
      {c.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={c.logoUrl}
          alt={c.name}
          className="h-9 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <span
          className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ background: "var(--grad)" }}
        >
          {initials(c.name)}
        </span>
      )}
      {/* nowrap keeps each marquee card a single clean line, but capping the width
          stops an unusually long client name from overflowing a 320px screen. */}
      <div className="min-w-0 max-w-[60vw] sm:max-w-none">
        <p
          className="text-sm font-medium whitespace-nowrap truncate transition-colors group-hover:text-[var(--cyan)]"
          style={{ color: "var(--white)" }}
        >
          {c.name}
        </p>
        {c.industry && <p className="text-xs whitespace-nowrap truncate" style={{ color: "var(--gray)" }}>{c.industry}</p>}
      </div>
    </>
  );

  const className = "group flex items-center gap-3 rounded-xl px-6 py-4 transition-colors";
  const style = { background: "var(--surface)", border: "1px solid var(--border)" };

  // The whole card is the click target when a site is configured, rather than just the
  // name text — a logo-sized hit area is what visitors actually aim at.
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className + " hover:border-[var(--blue)]"}
      style={style}
      title={`Visit ${c.name}`}
    >
      {inner}
    </a>
  ) : (
    <div className={className} style={style}>{inner}</div>
  );
}

export default function ClientsShowcase() {
  const [clients, setClients] = useState<ClientDef[]>(CLIENTS_FALLBACK);

  useEffect(() => {
    getAllClients().then(setClients);
  }, []);

  if (clients.length === 0) return null;

  return (
    <section className="py-[var(--space-6xl)]" style={{ background: "var(--navy2)", borderTop: "1px solid var(--border)" }} id="clients">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <p className="kicker mb-5">09 · Our clients</p>
          <h2 className="section-title" style={{ color: "var(--white)" }}>
            Trusted by businesses across <span className="serif-accent">India</span>
          </h2>
        </ScrollReveal>
      </div>

      {clients.length >= MARQUEE_MIN ? (
        <Marquee>
          {clients.map((c) => (
            <ClientCard key={c.name} c={c} />
          ))}
        </Marquee>
      ) : (
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-6">
          {clients.map((c, i) => (
            <ScrollReveal key={c.name} delay={i * REVEAL_STAGGER} y={16} duration={0.5}>
              <ClientCard c={c} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}
