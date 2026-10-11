"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Check, CircleDashed } from "lucide-react";
import { NAAC_CRITERIA } from "@/lib/yucampus";
import { EASE_OUT_QUART } from "@/lib/motion";

// Sample fill levels — the board is clearly labelled "Illustrative" in the UI: it shows
// what the IQAC view looks like, not any real college's data.
const PREVIEW_LEVELS = [92, 76, 58, 88, 71, 64, 83];

/** Illustrative YuCampus IQAC readiness board: the seven NAAC criteria with sample progress. */
export default function ReadinessPreview({ accent = "#5ECFC8", primary = "#2B3990" }: { accent?: string; primary?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduceMotion = useReducedMotion();
  return (
    <div
      ref={ref}
      className="rounded-2xl overflow-hidden text-left"
      style={{ background: "#FFFFFF", border: "1px solid #DFE3EE", boxShadow: "0 30px 70px rgba(11,16,51,0.18)", color: "#0B1033" }}
    >
      <div className="flex items-center justify-between gap-3 px-5 py-3" style={{ borderBottom: "1px solid #DFE3EE", background: "#F6F7FB" }}>
        <div className="flex items-center gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: "#E1E6F2" }} />
          ))}
        </div>
        <p className="text-xs font-medium truncate" style={{ color: "#4A5172" }}>IQAC · NAAC readiness</p>
        <span className="text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full" style={{ background: "#DCE6FF", color: "#0B1033" }}>
          Illustrative
        </span>
      </div>

      <ul className="px-5 py-4 flex flex-col gap-3.5">
        {NAAC_CRITERIA.map((c, i) => {
          const level = PREVIEW_LEVELS[i];
          const done = level >= 85;
          return (
            <li key={c} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
              <span className="text-[11px] tabular-nums w-7" style={{ color: "#4A5172" }}>C{i + 1}</span>
              <div className="min-w-0">
                <p className="text-sm truncate">{c}</p>
                <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: "#E1E6F2" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: done ? primary : accent }}
                    initial={{ width: reduceMotion ? `${level}%` : "0%" }}
                    animate={inView ? { width: `${level}%` } : undefined}
                    transition={{ duration: 1.1, delay: 0.1 + i * 0.08, ease: EASE_OUT_QUART }}
                  />
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs whitespace-nowrap" style={{ color: done ? primary : "#4A5172" }}>
                {done ? <Check size={13} /> : <CircleDashed size={13} />}
                {done ? "Complete" : "Evidence missing"}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center gap-2 px-5 py-4" style={{ borderTop: "1px solid #DFE3EE" }}>
        <span className="text-xs mr-1" style={{ color: "#4A5172" }}>Generate:</span>
        {["SSR", "AQAR", "SAR"].map((r) => (
          <span key={r} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ border: "1px solid #DFE3EE" }}>
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}
