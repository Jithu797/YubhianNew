"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Briefcase } from "lucide-react";
import PageHero from "@/components/PageHero";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { getAllClients, type ClientDef } from "@/lib/clients-data";
import { PROJECTS } from "@/lib/projects-data";
import { initials, externalUrl } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";

function ClientTile({ c, i }: { c: ClientDef; i: number }) {
  const href = externalUrl(c.websiteUrl);
  const body = (
    <>
      <div className="h-16 flex items-center justify-center">
        {c.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- client logos come from the CMS (Cloudinary)
          <img
            src={c.logoUrl}
            alt={c.name}
            loading="lazy"
            className="max-h-14 max-w-[80%] w-auto object-contain grayscale opacity-80 transition duration-500 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
          />
        ) : (
          <span className="w-14 h-14 rounded-xl flex items-center justify-center text-base font-bold text-white" style={{ background: "var(--grad)" }}>
            {initials(c.name)}
          </span>
        )}
      </div>
      <div className="text-center min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: "var(--white)" }}>{c.name}</p>
        {c.industry && <p className="text-xs truncate" style={{ color: "var(--gray)" }}>{c.industry}</p>}
      </div>
      {href && (
        <ArrowUpRight size={15} className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: "var(--blue)" }} />
      )}
    </>
  );
  const className = "group relative flex flex-col items-center justify-center gap-4 p-6 h-full transition-colors hover:bg-[var(--surface)]";
  return (
    <motion.li {...fadeUp((i % 8) * 0.05)} style={{ borderRight: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={`${c.name} — visit website`}>
          {body}
        </a>
      ) : (
        <div className={className}>{body}</div>
      )}
    </motion.li>
  );
}

export default function WorkContent() {
  const settings = useSiteSettings();
  const [clients, setClients] = useState<ClientDef[] | null>(null);

  useEffect(() => {
    getAllClients().then(setClients);
  }, []);

  // The same admin-managed figures the homepage shows — never invented here.
  const figures = [
    { value: `${settings.stat_projects}+`, label: "Projects delivered" },
    { value: `${settings.stat_clients}+`, label: "Clients served" },
    { value: `${settings.stat_years}+`, label: "Years building" },
  ];

  return (
    <>
      <PageHero
        kicker="Our work"
        title={<>Work we&rsquo;re <em className="serif-accent">proud</em> of</>}
        subtitle="The businesses we've built for, and what we've shipped together."
        page="work"
        ghost={<Briefcase size={380} strokeWidth={0.7} />}
      />

      {/* Figures */}
      <section className="px-6 xl:px-10 pt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-3" style={{ borderTop: "1px solid var(--ink)" }}>
          {figures.map((f, i) => (
            <motion.div key={f.label} {...fadeUp(i * 0.1)} className={`pt-6 pb-2 pr-4 ${i ? "pl-4 sm:pl-8 border-l" : ""}`} style={{ borderColor: "var(--hairline)" }}>
              <p className="tabular-nums" style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2.25rem, 6vw, 4.5rem)", lineHeight: 1, color: "var(--white)" }}>
                {f.value}
              </p>
              <p className="mt-3 text-xs sm:text-sm" style={{ color: "var(--gray)" }}>{f.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Clients */}
      {clients && clients.length > 0 && (
        <section className="px-6 xl:px-10 pt-24 pb-8">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp(0)} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="kicker mb-5">Clients</p>
                <h2 className="section-title" style={{ color: "var(--white)" }}>
                  Trusted by <em className="serif-accent">these teams</em>
                </h2>
              </div>
              <p className="max-w-sm text-sm" style={{ color: "var(--gray)" }}>Select a logo to visit their website.</p>
            </motion.div>
            <ul
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              style={{ borderTop: "1px solid var(--hairline)", borderLeft: "1px solid var(--hairline)" }}
            >
              {clients.map((c, i) => (
                <ClientTile key={c.name} c={c} i={i} />
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Projects — shown once real projects are added to lib/projects-data.ts */}
      {PROJECTS.length > 0 && (
        <section className="px-6 xl:px-10 pt-24 pb-8">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp(0)} className="mb-10">
              <p className="kicker mb-5">Projects</p>
              <h2 className="section-title" style={{ color: "var(--white)" }}>
                What we&rsquo;ve <em className="serif-accent">shipped</em>
              </h2>
            </motion.div>
            <ul style={{ borderTop: "1px solid var(--ink)" }}>
              {PROJECTS.map((p, i) => {
                const href = p.url ? externalUrl(p.url) : null;
                return (
                  <motion.li key={p.name} {...fadeUp(i * 0.06)} style={{ borderBottom: "1px solid var(--hairline)" }}>
                    <div className="grid md:grid-cols-[3rem_minmax(0,1.2fr)_minmax(0,1fr)_auto] gap-4 md:gap-8 py-8 items-start">
                      <span className="text-sm tabular-nums" style={{ color: "var(--gray)" }}>{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <h3 className="text-2xl" style={{ color: "var(--white)" }}>{p.name}</h3>
                        <p className="mt-1 text-sm" style={{ color: "var(--blue)" }}>
                          {p.client} · {p.industry}
                          {p.year ? ` · ${p.year}` : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--gray)" }}>{p.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {p.services.map((s) => (
                            <span key={s} className="text-xs px-2.5 py-1 rounded-full" style={{ border: "1px solid var(--hairline)", color: "var(--gray2)" }}>{s}</span>
                          ))}
                        </div>
                      </div>
                      {href && (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--blue)" }}>
                          Visit <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
