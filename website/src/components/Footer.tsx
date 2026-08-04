"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, ChevronUp, ArrowUpRight } from "lucide-react";
import { Linkedin, Twitter, Instagram } from "./icons/SocialIcons";
import { useSiteSettings } from "@/lib/useSiteSettings";
import WaveText from "./WaveText";
import TypewriterText from "./TypewriterText";

const SERVICES_LINKS = [
  { label: "AI & Machine Learning", href: "/services/ai-ml" },
  { label: "Generative AI & LLMs", href: "/services/generative-ai" },
  { label: "Web Application Development", href: "/services/web-development" },
  { label: "Mobile App Development", href: "/services/mobile-apps" },
  { label: "Cloud Solutions & Migration", href: "/services/cloud" },
  { label: "IT Consulting", href: "/services/consulting" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Our Product", href: "/product" },
  { label: "Blog & Insights", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" },
];

// Dark, floating footer panel — sits on its own inset card against the site's light
// background rather than reusing the --navy/--white tokens (those are calibrated for
// light-on-light body content, and are literally inverted for a dark surface like this).
const PANEL_TEXT = "#F5F6FA";
const PANEL_MUTED = "rgba(245,246,250,0.62)";
const PANEL_BORDER = "rgba(245,246,250,0.12)";
const PANEL_SURFACE = "rgba(245,246,250,0.06)";

export default function Footer() {
  const settings = useSiteSettings();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Only shows icons for platforms that actually have a configured URL — no dead
  // placeholder links pointing to "#".
  const socials = [
    { icon: Linkedin, url: settings.linkedin_url, label: "LinkedIn" },
    { icon: Twitter, url: settings.twitter_url, label: "Twitter" },
    { icon: Instagram, url: settings.instagram_url, label: "Instagram" },
  ].filter((s) => s.url);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      const { createLead } = await import("@/lib/leads");
      await createLead({ name: "Newsletter Signup", email, message: "Footer newsletter subscription", source: "newsletter" });
    } catch {
      // Firestore not reachable yet — still confirm to the user locally
    } finally {
      setSubscribing(false);
      setSubscribed(true);
      setEmail("");
    }
  }

  return (
    <>
      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-1"
          style={{ background: "var(--grad)", boxShadow: "0 4px 20px rgba(37,99,235,0.4)" }}
          aria-label="Back to top"
        >
          <ChevronUp size={18} />
        </button>
      )}

      <footer className="px-3 md:px-4 pb-3 md:pb-4 pt-10" style={{ background: "var(--navy)" }}>
        <div
          className="relative overflow-hidden rounded-[28px] md:rounded-[40px]"
          style={{ background: "linear-gradient(165deg, #0B1220 0%, #12203B 55%, #1A2C4E 100%)" }}
        >
          {/* Giant watermark wordmark — typed and deleted on a loop, echoing the reference
              footer's TypeIt.js treatment instead of sitting static. */}
          <TypewriterText
            text="YUBHIAN"
            className="pointer-events-none select-none absolute left-1/2 -bottom-[6%] -translate-x-1/2 whitespace-nowrap font-bold"
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: "clamp(4rem, 16vw, 13rem)",
              lineHeight: 1,
              color: "rgba(245,246,250,0.05)",
            }}
          />

          {/* Big CTA */}
          <div className="relative px-6 md:px-14 pt-16 pb-10">
            <Link href="/contact" className="group inline-flex items-center gap-4 md:gap-6">
              <WaveText
                text="Let's build something great"
                className="font-bold tracking-tight transition-colors group-hover:text-[var(--cyan)]"
                style={{
                  fontFamily: "var(--font-syne)",
                  fontSize: "clamp(2.25rem, 7vw, 5rem)",
                  lineHeight: 1,
                  color: PANEL_TEXT,
                }}
              />
              <ArrowUpRight
                size={40}
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1.5"
                style={{ color: "var(--cyan)" }}
              />
            </Link>
          </div>

          {/* Newsletter strip */}
          <div className="relative border-t px-6 md:px-14 py-8" style={{ borderColor: PANEL_BORDER }}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="font-semibold text-lg" style={{ fontFamily: "var(--font-syne)", color: PANEL_TEXT }}>
                  Stay updated with Yubhian
                </p>
                <p className="text-sm mt-1" style={{ color: PANEL_MUTED }}>
                  Get our latest insights and project updates.
                </p>
              </div>
              {subscribed ? (
                <p className="text-sm font-medium" style={{ color: "var(--cyan)" }}>Thanks for subscribing! ✓</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="px-4 py-2.5 rounded-xl text-sm outline-none w-64 focus:border-[var(--cyan)]"
                    style={{ background: PANEL_SURFACE, border: `1px solid ${PANEL_BORDER}`, color: PANEL_TEXT }}
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="btn-shine px-5 py-2.5 rounded-full text-white text-sm font-medium disabled:opacity-60"
                    style={{ background: "var(--grad)" }}
                  >
                    {subscribing ? "Subscribing..." : "Subscribe"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Main footer */}
          <div className="relative max-w-7xl mx-auto px-6 md:px-14 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Col 1 — Company */}
            <div className="flex flex-col gap-5">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                  <Image src="/logo.jpg" alt="Yubhian Technologies" width={40} height={40} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-2xl" style={{ fontFamily: "var(--font-syne)", color: PANEL_TEXT }}>Yubhian</span>
                  <span className="text-xs font-medium tracking-wide" style={{ color: PANEL_MUTED }}>Technologies LLP</span>
                </div>
              </Link>
              <p className="text-sm leading-relaxed font-light" style={{ color: PANEL_MUTED }}>
                Enterprise IT solutions from Andhra Pradesh, India. Building intelligent digital products that drive business growth.
              </p>
              {socials.length > 0 && (
                <div className="flex gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                      style={{ background: PANEL_SURFACE, border: `1px solid ${PANEL_BORDER}`, color: PANEL_MUTED }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--cyan)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = PANEL_MUTED; }}
                    >
                      <s.icon size={15} />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Col 2 — Services */}
            <div>
              <p className="font-semibold mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: "var(--font-syne)", color: PANEL_TEXT }}>
                Services
              </p>
              <ul className="flex flex-col gap-3">
                {SERVICES_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm transition-colors hover:text-[var(--cyan)]" style={{ color: PANEL_MUTED }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Company */}
            <div>
              <p className="font-semibold mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: "var(--font-syne)", color: PANEL_TEXT }}>
                Company
              </p>
              <ul className="flex flex-col gap-3">
                {COMPANY_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm transition-colors hover:text-[var(--cyan)]" style={{ color: PANEL_MUTED }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Contact */}
            <div>
              <p className="font-semibold mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: "var(--font-syne)", color: PANEL_TEXT }}>
                Contact
              </p>
              <ul className="flex flex-col gap-4">
                <li>
                  <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-2.5 text-sm transition-colors hover:text-[var(--cyan)] group" style={{ color: PANEL_MUTED }}>
                    <Mail size={14} className="shrink-0 group-hover:text-[var(--cyan)] transition-colors" />
                    {settings.contact_email}
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-2.5 text-sm" style={{ color: PANEL_MUTED }}>
                    <MapPin size={14} className="shrink-0 mt-0.5" />
                    {settings.address}
                  </div>
                </li>
              </ul>
              <Link
                href="/contact"
                className="btn-shine mt-6 inline-flex px-5 py-2.5 rounded-full text-white text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: "var(--grad)" }}
              >
                Send us a message
              </Link>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="relative border-t px-6 py-5" style={{ borderColor: PANEL_BORDER }}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-xs" style={{ color: PANEL_MUTED }}>
                © {new Date().getFullYear()} Yubhian Technologies LLP. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/privacy-policy" className="text-xs transition-colors hover:text-[var(--cyan)]" style={{ color: PANEL_MUTED }}>
                  Privacy Policy
                </Link>
                <Link href="/cookie-policy" className="text-xs transition-colors hover:text-[var(--cyan)]" style={{ color: PANEL_MUTED }}>
                  Cookie Policy
                </Link>
                <button
                  onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
                  className="text-xs transition-colors hover:text-[var(--cyan)]"
                  style={{ color: PANEL_MUTED }}
                >
                  Cookie Settings
                </button>
                <Link href="/sitemap.xml" className="text-xs transition-colors hover:text-[var(--cyan)]" style={{ color: PANEL_MUTED }}>
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
