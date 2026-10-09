"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { hierarchy, pack } from "d3-hierarchy";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { SERVICES } from "@/lib/services-data";

const TOP_N = 24;
// Same tool listed under two names in the services data.
const ALIASES: Record<string, string> = { "OpenAI API": "OpenAI" };
// Fill / text pairs cycled across bubbles: paper, sky highlight, periwinkle, royal, pale.
const FILLS: [string, string][] = [
  ["#F6F7FB", "#0B1033"],
  ["#7CC4FF", "#0B1033"],
  ["#93A7D6", "#0B1033"],
  ["#1E3FA8", "#F6F7FB"],
  ["#DDEEFF", "#0B1033"],
];

type Tech = { name: string; count: number; services: string[] };

function useTechCounts(): { techs: Tech[]; totalTechs: number } {
  return useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const s of SERVICES) {
      for (const raw of s.techStack) {
        const name = ALIASES[raw] ?? raw;
        if (!map.has(name)) map.set(name, new Set());
        map.get(name)!.add(s.title);
      }
    }
    const all = [...map.entries()].map(([name, set]) => ({ name, count: set.size, services: [...set] }));
    all.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    return { techs: all.slice(0, TOP_N), totalTechs: all.length };
  }, []);
}

/** Packed bubble chart of the technologies behind Yubhian's services. Bubble area is
 *  proportional to the number of services that use the technology. */
export default function StackBubbles() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [narrow, setNarrow] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const { techs } = useTechCounts();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const W = narrow ? 800 : 1400;
  const H = narrow ? 900 : 760;

  const nodes = useMemo(() => {
    const root = hierarchy<{ children?: Tech[] } & Partial<Tech>>({ children: techs }).sum((d) => d.count ?? 0);
    // Pack into a square, then spread sideways to fill the wide frame (as in the
    // report's scattered layout). Scaling x apart only increases distances, so circles
    // that didn't overlap in the pack never overlap after the spread.
    const side = Math.min(W, H);
    pack<{ children?: Tech[] } & Partial<Tech>>().size([side, side]).padding(narrow ? 6 : 10)(root);
    const spread = Math.max(1, Math.min(1.75, (W - 60) / side));
    return root.leaves().map((l) => {
      const p = l as unknown as { x: number; y: number; r: number };
      return { tech: l.data as Tech, x: (p.x - side / 2) * spread + W / 2, y: p.y + (H - side) / 2, r: p.r };
    });
  }, [techs, W, H, narrow]);

  const hovered = active === null ? null : nodes[active];

  return (
    <div ref={ref} className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full overflow-visible" role="group" aria-label="Technologies we use, sized by how many of our services use each one">
        {nodes.map((n, i) => {
          const [fill, ink] = FILLS[i % FILLS.length];
          // Largest size that still fits the full name across ~85% of the bubble.
          const nameSize = Math.min(n.r * 0.3, 34, (n.r * 1.7) / (n.tech.name.length * 0.56));
          return (
            <motion.g
              key={n.tech.name}
              tabIndex={0}
              role="img"
              aria-label={`${n.tech.name}: used in ${n.tech.count} of our services`}
              initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
              animate={inView ? { scale: active === i ? 1.06 : 1, opacity: 1 } : undefined}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: inView && active === null ? i * 0.035 : 0 }}
              style={{ transformBox: "fill-box", transformOrigin: "center", cursor: "default", outline: "none" }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <circle cx={n.x} cy={n.y} r={n.r} fill={fill} />
              {active === i && <circle cx={n.x} cy={n.y} r={n.r - 1.5} fill="none" stroke="#7CC4FF" strokeWidth={3} />}
              <text
                x={n.x}
                y={n.y - nameSize * 0.15}
                textAnchor="middle"
                fill={ink}
                style={{ fontFamily: "var(--font-dm-sans)", fontSize: nameSize, fontWeight: 500 }}
              >
                {n.tech.name}
              </text>
              <text
                x={n.x}
                y={n.y + nameSize * 0.95}
                textAnchor="middle"
                fill={ink}
                opacity={0.8}
                style={{ fontFamily: "var(--font-dm-sans)", fontSize: nameSize * 0.62 }}
                className="tabular-nums"
              >
                {n.tech.count} {n.tech.count === 1 ? "service" : "services"}
              </text>
            </motion.g>
          );
        })}
      </svg>

      {/* Which services use the hovered/focused technology */}
      {hovered && (
        <div
          className="pointer-events-none absolute z-10 max-w-[16rem] -translate-x-1/2 rounded-lg px-3 py-2 text-xs leading-relaxed shadow-lg"
          style={{
            left: `${(hovered.x / W) * 100}%`,
            top: `${((hovered.y + hovered.r) / H) * 100}%`,
            marginTop: 8,
            background: "#F6F7FB",
            color: "#0B1033",
          }}
        >
          <p className="font-medium">{hovered.tech.name} powers:</p>
          <p style={{ color: "#4A5172" }}>{hovered.tech.services.join(" · ")}</p>
        </div>
      )}
    </div>
  );
}

export function useStackSummary() {
  const { totalTechs } = useTechCounts();
  return { totalTechs, shown: Math.min(TOP_N, totalTechs), services: SERVICES.length };
}
