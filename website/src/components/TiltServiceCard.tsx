"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTilt } from "@/lib/useTilt";

type TiltServiceCardProps = {
  slug: string;
  title: string;
  longDesc: string;
  techStack: string[];
  accent: string;
  /** Pre-rendered by the server component — a raw LucideIcon component reference
   *  can't cross the server → client boundary as a prop (not serializable). */
  icon: ReactNode;
};

export default function TiltServiceCard({ slug, title, longDesc, techStack, accent, icon }: TiltServiceCardProps) {
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt(6);

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <Link
        href={`/services/${slug}`}
        className="group relative rounded-2xl p-8 flex flex-col gap-5 h-full transition-colors duration-300"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: accent + "20" }}>
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>{title}</h2>
          <p className="text-sm font-normal leading-relaxed" style={{ color: "var(--gray)" }}>{longDesc}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {techStack.map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: accent + "15", color: accent }}>
              {t}
            </span>
          ))}
        </div>
        <span className="flex items-center gap-1.5 text-sm font-medium mt-auto" style={{ color: accent }}>
          <span className="link-swap">
            <span className="link-swap-inner" data-text="Learn more">Learn more</span>
          </span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </motion.div>
  );
}
