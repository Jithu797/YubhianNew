"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, FileText, X } from "lucide-react";
import type { Project } from "@/lib/projects-data";
import { externalUrl } from "@/lib/utils";

/** Full-screen screenshot viewer with keyboard (←/→/Esc) support. */
function Lightbox({ images, start, title, onClose }: { images: string[]; start: number; title: string; onClose: () => void }) {
  const [i, setI] = useState(start);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((v) => (v + 1) % images.length);
      if (e.key === "ArrowLeft") setI((v) => (v - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [images.length, onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} screenshots`}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-10"
      style={{ background: "rgba(5,9,40,0.92)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- screenshots come from the CMS */}
      <img
        src={images[i]}
        alt={`${title} — screenshot ${i + 1} of ${images.length}`}
        className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      <button type="button" onClick={onClose} aria-label="Close" className="absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(246,247,251,0.12)", color: "#F6F7FB" }}>
        <X size={20} />
      </button>
      {images.length > 1 && (
        <>
          <button type="button" aria-label="Previous screenshot" onClick={(e) => { e.stopPropagation(); setI((v) => (v - 1 + images.length) % images.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(246,247,251,0.12)", color: "#F6F7FB" }}>
            <ChevronLeft size={20} />
          </button>
          <button type="button" aria-label="Next screenshot" onClick={(e) => { e.stopPropagation(); setI((v) => (v + 1) % images.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(246,247,251,0.12)", color: "#F6F7FB" }}>
            <ChevronRight size={20} />
          </button>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm tabular-nums" style={{ color: "rgba(246,247,251,0.75)" }}>
            {i + 1} / {images.length}
          </p>
        </>
      )}
    </motion.div>
  );
}

/** A delivered project as proof of work: screenshots, summary, services, live link and documents. */
export default function ProjectCard({ project: p, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState<number | null>(null);
  const live = p.url ? externalUrl(p.url) : null;
  const shots = p.screenshots;

  return (
    <article className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8 lg:gap-12 py-10" style={{ borderTop: "1px solid var(--hairline)" }}>
      {/* Screenshots */}
      {shots.length > 0 ? (
        <div className="grid grid-cols-4 gap-2 self-start">
          <button type="button" onClick={() => setOpen(0)} className="col-span-4 group relative overflow-hidden rounded-xl aspect-[16/10]" aria-label={`Open ${p.name} screenshots`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- screenshots come from the CMS */}
            <img src={shots[0]} alt={`${p.name} screenshot`} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </button>
          {shots.slice(1, 5).map((s, k) => (
            <button key={s} type="button" onClick={() => setOpen(k + 1)} className="group relative overflow-hidden rounded-lg aspect-[4/3]" aria-label={`Open screenshot ${k + 2}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- screenshots come from the CMS */}
              <img src={s} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              {k === 3 && shots.length > 5 && (
                <span className="absolute inset-0 flex items-center justify-center text-sm font-medium" style={{ background: "rgba(5,9,40,0.6)", color: "#F6F7FB" }}>
                  +{shots.length - 5}
                </span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-xl aspect-[16/10] flex items-center justify-center self-start" style={{ background: "var(--navy2)", border: "1px solid var(--hairline)" }}>
          <span style={{ fontFamily: "var(--font-syne)", fontSize: "4rem", color: "var(--blue)", fontStyle: "italic" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      )}

      {/* Details */}
      <div className="flex flex-col">
        <p className="text-sm" style={{ color: "var(--blue)" }}>
          {[p.client, p.industry, p.year].filter(Boolean).join(" · ")}
        </p>
        <h3 className="mt-2 text-3xl leading-tight" style={{ color: "var(--white)" }}>{p.name}</h3>
        <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--gray)" }}>{p.summary}</p>
        {p.services.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {p.services.map((s) => (
              <span key={s} className="text-xs px-3 py-1.5 rounded-full" style={{ background: "var(--navy2)", color: "var(--gray2)" }}>{s}</span>
            ))}
          </div>
        )}
        {(live || p.documents.length > 0) && (
          <div className="mt-7 flex flex-wrap gap-3">
            {live && (
              <a href={live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white" style={{ background: "var(--grad)" }}>
                Visit live project <ArrowUpRight size={15} />
              </a>
            )}
            {p.documents.map((d) => {
              const href = externalUrl(d.url);
              return href ? (
                <a key={d.url} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors hover:border-[var(--blue)]" style={{ border: "1px solid var(--hairline)", color: "var(--white)" }}>
                  <FileText size={15} /> {d.title}
                </a>
              ) : null;
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {open !== null && <Lightbox images={shots} start={open} title={p.name} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </article>
  );
}
