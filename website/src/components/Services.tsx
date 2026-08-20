"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { SERVICES, getAllServices, type ServiceDef } from "@/lib/services-data";
import { useTilt } from "@/lib/useTilt";
import ScrollReveal from "./ScrollReveal";
import { REVEAL_STAGGER } from "@/lib/motion";

// The homepage shows a curated preview, not the full catalog — the dedicated /services
// page is where all specialties get listed in full.
const HOMEPAGE_PREVIEW_COUNT = 6;

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const [services, setServices] = useState<ServiceDef[]>(SERVICES);

  useEffect(() => {
    getAllServices().then(setServices);
  }, []);

  const preview = services.slice(0, HOMEPAGE_PREVIEW_COUNT);

  return (
    <section className="py-[var(--space-6xl)] px-6" style={{ background: "var(--navy)", borderTop: "1px solid var(--border)" }} id="services">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <ScrollReveal className="mb-14 max-w-2xl" id="services-heading">
          <p className="text-sm font-medium mb-3 uppercase tracking-widest" style={{ color: "var(--cyan)" }}>
            What We Do
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
            Our Services
          </h2>
          <p className="text-lg" style={{ color: "var(--gray)" }}>
            End-to-end technology solutions tailored for businesses at every stage — from first prototype to production scale.
          </p>
        </ScrollReveal>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" ref={ref}>
          {preview.map((s, i) => (
            <ServiceCard key={s.slug} service={s} index={i} parentInView={inView} />
          ))}
        </div>

        {services.length > HOMEPAGE_PREVIEW_COUNT && (
          <div className="flex justify-center mt-12">
            <Link
              href="/services"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5"
              style={{ border: "1px solid var(--border)", color: "var(--white)" }}
            >
              <span className="link-swap">
                <span className="link-swap-inner" data-text={`View All ${services.length} Services`}>View All {services.length} Services</span>
              </span>
              <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceCard({ service: s, index, parentInView }: {
  service: ServiceDef; index: number; parentInView: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const { rotateX, rotateY, onMouseMove, onMouseLeave: resetTilt } = useTilt(6);

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      animate={parentInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : index * REVEAL_STAGGER }}
      className="group relative rounded-2xl p-8 flex flex-col gap-6 transition-colors duration-300 overflow-hidden"
      style={{ background: "var(--surface)", border: "1px solid var(--border)", rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={onMouseMove}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = s.accent + "55";
        el.style.boxShadow = `0 20px 60px ${s.accent}18`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border)";
        el.style.boxShadow = "none";
        resetTilt();
      }}
    >
      {/* Left accent bar — always visible, not just on hover */}
      <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: s.accent }} />

      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: s.accent + "18" }}
        >
          <s.icon size={26} style={{ color: s.accent }} />
        </div>
        <div className="flex-1 pt-1">
          <h3 className="text-xl font-bold mb-1.5" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
            {s.title}
          </h3>
          <p className="text-sm leading-relaxed font-normal" style={{ color: "var(--gray)" }}>
            {s.longDesc}
          </p>
        </div>
      </div>

      {/* Process highlights — first 3 steps */}
      {s.process.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {s.process.slice(0, 3).map((step) => (
            <div key={step} className="flex items-start gap-2">
              <Check size={14} className="shrink-0 mt-0.5" style={{ color: s.accent }} />
              <span className="text-xs leading-snug" style={{ color: "var(--gray2)" }}>{step}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tech stack */}
      <div className="flex flex-wrap gap-2">
        {s.techStack.slice(0, 5).map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: s.accent + "15", color: s.accent }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Learn more — always visible for clarity and touch-device usability */}
      <Link
        href={`/services/${s.slug}`}
        className="flex items-center gap-1.5 text-sm font-medium transition-all duration-300 group-hover:gap-2.5 mt-auto"
        style={{ color: s.accent }}
      >
        <span className="link-swap">
          <span className="link-swap-inner" data-text="Learn more">Learn more</span>
        </span>
        <ArrowRight size={13} />
      </Link>
    </motion.div>
  );
}
