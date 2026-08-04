"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { getAllClients, CLIENTS_FALLBACK, type ClientDef } from "@/lib/clients-data";

// A marquee only reads well once there's enough real content to loop — below that it'd
// just be one card sliding past on repeat. Falls back to the original static layout
// until the admin has added enough clients for the loop to feel intentional.
const MARQUEE_MIN = 5;

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function ClientCard({ c }: { c: ClientDef }) {
  return (
    <div
      className="group flex items-center gap-3 rounded-xl px-6 py-4 shrink-0"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
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
      <div>
        {c.websiteUrl ? (
          <a href={c.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-[var(--cyan)] transition-colors whitespace-nowrap" style={{ color: "var(--white)" }}>
            {c.name}
          </a>
        ) : (
          <p className="text-sm font-medium whitespace-nowrap" style={{ color: "var(--white)" }}>{c.name}</p>
        )}
        {c.industry && <p className="text-xs whitespace-nowrap" style={{ color: "var(--gray)" }}>{c.industry}</p>}
      </div>
    </div>
  );
}

export default function ClientsShowcase() {
  const [clients, setClients] = useState<ClientDef[]>(CLIENTS_FALLBACK);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    getAllClients().then(setClients);
  }, []);

  if (clients.length === 0) return null;

  return (
    <section className="py-[var(--space-6xl)]" style={{ background: "var(--navy2)", borderTop: "1px solid var(--border)" }} id="clients">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-medium mb-3 uppercase tracking-widest" style={{ color: "var(--cyan)" }}>Our Clients</p>
          <h2 className="text-4xl md:text-5xl font-extrabold" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
            Trusted by businesses across India
          </h2>
        </div>
      </div>

      <div ref={ref}>
        {clients.length >= MARQUEE_MIN ? (
          <div
            className="overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
          >
            <div className="marquee-track flex gap-6 w-max">
              {[...clients, ...clients].map((c, i) => (
                <ClientCard key={`${c.name}-${i}`} c={c} />
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-6">
            {clients.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <ClientCard c={c} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
