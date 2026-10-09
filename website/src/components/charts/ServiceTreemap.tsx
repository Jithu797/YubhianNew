"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { hierarchy, treemap, treemapSquarify } from "d3-hierarchy";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { SERVICES, SERVICE_CATEGORIES, type ServiceDef } from "@/lib/services-data";
import { EASE_OUT_QUART } from "@/lib/motion";

// Practices get darker the more services they hold, like the Contra report's treemap.
const SHADES = ["#E6EDFA", "#D6E1F6", "#C2D2F0", "#A9BEE7", "#8EA7DC"];
const CATEGORY_PAD = 30; // room for the practice label above its tiles

type Node = { name: string; children?: Node[]; service?: ServiceDef; value?: number };

/** All 17 services as equal tiles, grouped by practice — so each practice's area is
 *  its real share of what Yubhian offers. Coordinates are computed in a fixed unit box
 *  and placed with percentages, so the chart scales with its container. */
export default function ServiceTreemap() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const W = 1000;
  const H = narrow ? 1500 : 620;

  const { groups, tiles } = useMemo(() => {
    const data: Node = {
      name: "root",
      children: SERVICE_CATEGORIES.map((c) => ({
        name: c,
        children: SERVICES.filter((s) => s.category === c).map((s) => ({ name: s.title, service: s, value: 1 })),
      })),
    };
    const root = hierarchy(data)
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
    treemap<Node>().tile(treemapSquarify.ratio(1.2)).size([W, H]).paddingInner(4).paddingTop((d) => (d.depth === 1 ? CATEGORY_PAD : 0)).round(true)(root);

    const counts = [...new Set(root.children!.map((c) => c.value ?? 0))].sort((a, b) => a - b);
    const groups = root.children!.map((g) => ({
      name: g.data.name,
      count: g.value ?? 0,
      shade: SHADES[Math.min(SHADES.length - 1, counts.indexOf(g.value ?? 0) + (SHADES.length - counts.length))],
      // d3 hands back x0/y0/x1/y1 once the layout has run
      ...(g as unknown as { x0: number; y0: number; x1: number; y1: number }),
    }));
    const tiles = root.leaves().map((l) => ({
      service: l.data.service!,
      group: l.parent!.data.name,
      ...(l as unknown as { x0: number; y0: number; x1: number; y1: number }),
    }));
    return { groups, tiles };
  }, [H]);

  const total = SERVICES.length;
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;

  return (
    <div ref={ref} className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
      {groups.map((g, gi) => (
        <motion.div
          key={g.name}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.6, delay: gi * 0.08 }}
          className="absolute flex items-baseline justify-between gap-2 px-1 text-xs sm:text-sm"
          style={{ left: pct(g.x0, W), top: pct(g.y0, H), width: pct(g.x1 - g.x0, W), height: pct(CATEGORY_PAD, H), color: "var(--gray)" }}
        >
          <span className="truncate font-medium" style={{ color: "var(--white)" }}>{g.name}</span>
          <span className="tabular-nums shrink-0">
            {g.count} of {total} · {Math.round((g.count / total) * 100)}%
          </span>
        </motion.div>
      ))}

      {tiles.map((t, i) => {
        const shade = groups.find((g) => g.name === t.group)!.shade;
        const Icon = t.service.icon;
        return (
          <motion.div
            key={t.service.slug}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.045, ease: EASE_OUT_QUART }}
            className="absolute"
            style={{ left: pct(t.x0, W), top: pct(t.y0, H), width: pct(t.x1 - t.x0, W), height: pct(t.y1 - t.y0, H), transformOrigin: "top left" }}
          >
            <Link
              href={`/services/${t.service.slug}`}
              className="group flex h-full w-full flex-col justify-between p-2.5 sm:p-3 transition-[filter] duration-300 hover:brightness-95 focus-visible:brightness-95"
              style={{ background: shade, color: "var(--ink)" }}
            >
              <Icon size={18} className="shrink-0 opacity-70 transition-transform duration-300 group-hover:scale-110" />
              <span
                className="text-right leading-tight"
                style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(0.8rem, 1.25vw, 1.05rem)" }}
              >
                {t.service.title}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
