"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { Stagger, StaggerItem } from "./Stagger";

export default function CTABanner() {
  const settings = useSiteSettings();

  return (
    <section
      className="relative py-28 px-6 text-center"
      style={{
        background: "var(--navy2)",
        borderTop: "1px solid rgba(37,99,235,0.15)",
        borderBottom: "1px solid rgba(37,99,235,0.15)",
      }}
    >
      <Stagger className="relative max-w-3xl mx-auto flex flex-col items-center gap-8">
        <StaggerItem
          className="text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-tight"
          style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}
        >
          <h2>{settings.cta_banner_title}</h2>
        </StaggerItem>

        <StaggerItem className="text-lg" style={{ color: "var(--gray)" }}>
          <p>{settings.cta_banner_subtitle}</p>
        </StaggerItem>

        <StaggerItem className="flex flex-col sm:flex-row gap-4">
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
        </StaggerItem>

        <StaggerItem className="text-sm" style={{ color: "var(--gray)" }}>
          <p>No long-term contracts. No hidden fees.</p>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
