"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SERVICES, getAllServices, type ServiceDef } from "@/lib/services-data";
import { SERVICE_ART } from "@/lib/service-art";
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
    <section className="py-[var(--space-6xl)] px-6" style={{ background: "var(--navy)", borderTop: "1px solid var(--border)" }} id="services-list">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <ScrollReveal className="mb-14 max-w-2xl" id="services-heading">
          <p className="kicker mb-5">
            01 · What we do
          </p>
          <h2 className="section-title mb-4" style={{ color: "var(--white)" }}>
            Our <span className="serif-accent">Services</span>
          </h2>
          <p className="text-lg" style={{ color: "var(--gray)" }}>
            End-to-end technology solutions tailored for businesses at every stage — from first prototype to production scale.
          </p>
        </ScrollReveal>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 lg:pb-32" ref={ref}>
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


// Contra-style framed picture card: a tall painting in a paper mat, a serif caption
// plate, then one line of copy. Columns are staggered on desktop so the grid reads
// like prints pinned at different heights.
function ServiceCard({ service: s, index, parentInView }: {
  service: ServiceDef; index: number; parentInView: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt(5);
  const art = SERVICE_ART[s.slug];
  const stagger = ["", "lg:mt-16", "lg:mt-32"][index % 3];

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      animate={parentInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : index * REVEAL_STAGGER, ease: [0.165, 0.84, 0.44, 1] }}
      className={stagger}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <Link
        href={`/services/${s.slug}`}
        className="group block p-3 sm:p-4 transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(11,16,51,0.16)]"
        style={{ background: "var(--surface)", border: "1px solid var(--hairline)" }}
      >
        <div className="relative overflow-hidden aspect-[3/4]" style={{ background: s.accent + "18" }}>
          {art ? (
            // eslint-disable-next-line @next/next/no-img-element -- static artwork; next/image adds nothing for these local, pre-sized files
            <img
              src={art}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <s.icon size={56} style={{ color: s.accent }} />
            </div>
          )}
        </div>

        {/* Caption plate */}
        <div className="mt-3 sm:mt-4 px-3 py-3 text-center" style={{ border: "1px solid var(--hairline)" }}>
          <h3 className="text-lg leading-snug" style={{ color: "var(--white)", fontWeight: 500 }}>
            {s.title}
          </h3>
        </div>

        <p className="mt-4 px-1 text-sm leading-relaxed" style={{ color: "var(--gray)" }}>
          {s.shortDesc}
        </p>
        <span className="mt-3 mb-1 px-1 inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-300 group-hover:gap-2.5" style={{ color: "var(--blue)" }}>
          Learn more <ArrowRight size={13} />
        </span>
      </Link>
    </motion.div>
  );
}
