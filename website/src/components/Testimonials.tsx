"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { initials } from "@/lib/utils";
import { motion, AnimatePresence, useInView, useReducedMotion, type PanInfo } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

type Testimonial = {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
};

// No fabricated fallback quotes here — inventing client names, companies, and results
// and presenting them as real testimonials would be dishonest. The section stays hidden
// (see the empty-check below) until real testimonials are added via the admin, matching
// the same pattern used for Clients and Careers.
const FALLBACK: Testimonial[] = [];

const AUTO_ADVANCE_MS = 5500;

export default function Testimonials() {
  const reduceMotion = useReducedMotion();
  const [items, setItems] = useState<Testimonial[]>(FALLBACK);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    (async () => {
      try {
        const { db } = await import("@/lib/firebase");
        const { collection, getDocs, orderBy, query, where } = await import("firebase/firestore");
        const snap = await getDocs(
          query(collection(db, "testimonials"), where("is_active", "==", true), orderBy("order", "asc"))
        );
        if (!snap.empty) {
          setItems(
            snap.docs.map((doc) => {
              const d = doc.data();
              return {
                name: d.client_name,
                role: d.client_role,
                company: d.company,
                quote: d.quote,
                rating: d.rating ?? 5,
              };
            })
          );
        }
      } catch {
        // Firestore not reachable yet — keep fallback
      }
    })();
  }, []);

  const goTo = useCallback((next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex((next + items.length) % items.length);
  }, [index, items.length]);

  useEffect(() => {
    if (items.length <= 1 || paused || !inView) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % items.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [items.length, paused, inView]);

  if (items.length === 0) return null;

  const t = items[index];

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -60) goTo(index + 1);
    else if (info.offset.x > 60) goTo(index - 1);
  }

  return (
    <section className="py-[var(--space-6xl)] px-6" style={{ background: "var(--navy)", borderTop: "1px solid var(--border)" }} id="testimonials">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal className="mb-14 text-center">
          <p className="kicker mb-5">
            08 · Testimonials
          </p>
          <h2 className="section-title" style={{ color: "var(--white)" }}>
            What clients <span className="serif-accent">say</span> about us
          </h2>
        </ScrollReveal>

        <div
          ref={ref}
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="overflow-hidden rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderLeft: "3px solid var(--blue)" }}>
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: reduceMotion ? 0 : direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduceMotion ? 0 : direction * -40 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                drag={items.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="p-8 md:p-10 flex flex-col gap-4 cursor-grab active:cursor-grabbing"
              >
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="#F59E0B" stroke="#F59E0B" />
                  ))}
                </div>
                <p className="text-lg leading-relaxed font-normal" style={{ color: "var(--gray2)" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="pt-4 flex items-center gap-3" style={{ borderTop: "1px solid rgba(11,16,51,0.08)" }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: "var(--grad)" }}
                  >
                    {initials(t.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "var(--gray)" }}>
                      {t.role}{t.company ? `, ${t.company}` : ""}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {items.length > 1 && (
            <>
              <button
                onClick={() => goTo(index - 1)}
                aria-label="Previous testimonial"
                className="hidden lg:flex absolute top-1/2 -left-14 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center transition-colors"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--gray)" }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => goTo(index + 1)}
                aria-label="Next testimonial"
                className="hidden lg:flex absolute top-1/2 -right-14 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center transition-colors"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--gray)" }}
              >
                <ChevronRight size={16} />
              </button>

              <div className="flex justify-center gap-2 mt-6">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === index ? 20 : 6,
                      height: 6,
                      background: i === index ? "var(--blue)" : "var(--border)",
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
