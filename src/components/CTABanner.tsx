"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";

export default function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const settings = useSiteSettings();

  return (
    <section
      ref={ref}
      className="relative py-28 px-6 text-center"
      style={{
        background: "var(--navy2)",
        borderTop: "1px solid rgba(37,99,235,0.15)",
        borderBottom: "1px solid rgba(37,99,235,0.15)",
      }}
    >
      <div className="relative max-w-3xl mx-auto flex flex-col items-center gap-8">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-tight"
          style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}
        >
          {settings.cta_banner_title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg"
          style={{ color: "var(--gray)" }}
        >
          {settings.cta_banner_subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/contact"
            className="btn-shine flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-medium transition-all duration-300 hover:-translate-y-1"
            style={{ background: "var(--grad)", boxShadow: "0 4px 24px rgba(37,99,235,0.4)" }}
          >
            Start a Project <ArrowRight size={16} />
          </Link>
          <a
            href="mailto:info@yubhiantechnologies.in"
            className="flex items-center gap-2 px-8 py-3.5 rounded-full font-medium transition-all duration-300 hover:border-[var(--blue)]"
            style={{ border: "1px solid rgba(15,23,42,0.16)", color: "var(--white)" }}
          >
            <Mail size={15} /> Email Us
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-sm"
          style={{ color: "var(--gray)" }}
        >
          No long-term contracts. No hidden fees.
        </motion.p>
      </div>
    </section>
  );
}
