"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { Stagger, StaggerItem } from "./Stagger";

/** `standalone` is for pages without the homepage's ScrollStage: the section then
 *  paints its own navy backdrop instead of being a transparent window onto the stage. */
export default function CTABanner({ standalone = false }: { standalone?: boolean }) {
  const settings = useSiteSettings();

  return (
    // Homepage finale chapter: transparent over the "cta" world painted by ScrollStage,
    // so the final ask lands on the last cinematic scene — paper type, one sky-blue action.
    <section
      id="cta"
      data-chapter={standalone ? undefined : "cta"}
      className="tone-light relative overflow-hidden flex items-end px-6 xl:px-10 py-28 md:py-36"
      style={{ minHeight: standalone ? "70svh" : "100svh", color: "var(--paper)" }}
    >
      {standalone && (
        // Pages without the homepage stage get a branded navy backdrop — the sunset
        // artwork belongs to the homepage finale only.
        <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 70% at 75% 20%, #0E3F8F 0%, #0A1550 50%, #050A2E 100%)" }}>
          <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #F6F7FB 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        </div>
      )}
      {/* The finale artwork is a bright sunset sky, so the copy sits low on a soft
          dusk shade rising from the bottom of the screen. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(6,10,38,0.72) 0%, rgba(6,10,38,0.45) 38%, transparent 72%)" }}
      />
      <Stagger className="relative w-full max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-12 lg:gap-20 items-end">
        <div className="flex flex-col gap-6">
          <StaggerItem>
            <span className="kicker" style={{ color: "var(--paper)" }}>Conclusion</span>
          </StaggerItem>
          <StaggerItem>
            <h2 style={{ fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.98, letterSpacing: "-0.04em", color: "var(--paper)", textShadow: "0 2px 40px rgba(0,0,0,0.2)" }}>
              {settings.cta_banner_title}
            </h2>
          </StaggerItem>
        </div>

        <div className="flex flex-col gap-8 lg:pb-3">
          <StaggerItem className="text-lg" style={{ color: "rgba(246,247,251,0.88)" }}>
            <p>{settings.cta_banner_subtitle}</p>
          </StaggerItem>

          <StaggerItem className="flex flex-wrap items-center gap-6">
            <Link
              href="/contact"
              className="group flex items-center gap-3 pl-6 pr-2 py-2 rounded-full font-medium transition-transform duration-300 hover:-translate-y-0.5"
              style={{ background: "var(--lime)", color: "var(--ink)" }}
            >
              Start a Project
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-[-45deg]"
                style={{ background: "var(--ink)", color: "var(--lime)" }}
              >
                <ArrowRight size={16} />
              </span>
            </Link>
            <a
              href={`mailto:${settings.contact_email}`}
              className="flex items-center gap-2 font-medium underline underline-offset-[6px] decoration-1"
              style={{ color: "var(--paper)", textDecorationColor: "var(--sage)" }}
            >
              <Mail size={15} /> Email us
            </a>
          </StaggerItem>

          <StaggerItem className="text-sm pt-6" style={{ color: "rgba(246,247,251,0.75)", borderTop: "1px solid rgba(246,247,251,0.3)" }}>
            <p>No long-term contracts. No hidden fees.</p>
          </StaggerItem>
        </div>
      </Stagger>
    </section>
  );
}
