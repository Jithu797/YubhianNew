"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Menu, X, ChevronDown } from "lucide-react";
import { SERVICES, SERVICE_CATEGORIES, getAllServices, type ServiceDef } from "@/lib/services-data";
import { EASE_OUT_QUART } from "@/lib/motion";

function toMenuItems(list: ServiceDef[]) {
  return list.map((s) => ({
    label: s.title,
    desc: s.shortDesc,
    icon: s.icon,
    href: `/services/${s.slug}`,
    category: s.category,
    accent: s.accent,
  }));
}

// Pages whose top is a dark artwork hero (homepage stage or PageHero), where the bar
// starts with light text until it gains its paper background on scroll.
function opensOnArtwork(path: string) {
  return (
    ["/", "/about", "/services", "/product", "/blog", "/careers", "/contact"].includes(path) ||
    path.startsWith("/services/")
  );
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Product", href: "/product" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
];

export default function Navbar() {
  const reduceMotion = useReducedMotion();
  const onDarkHero = opensOnArtwork(usePathname());
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [services, setServices] = useState(toMenuItems(SERVICES));
  const [activeCategory, setActiveCategory] = useState<string>(SERVICE_CATEGORIES[0]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    getAllServices().then((list) => setServices(toMenuItems(list)));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? (y / docH) * 100 : 0);
      setScrolled(y > 80);
      // Hide on scroll-down, reveal on scroll-up — matches antigravity.google's header
      // behavior. Never hide while the dropdown/mobile menu is open.
      if (!servicesOpen && !mobileOpen) {
        setHidden(y > lastScrollY.current && y > 160);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [servicesOpen, mobileOpen]);

  // Click-outside + Escape close for the mega-menu — more robust than onMouseLeave
  // alone once the panel is wide enough to extend beyond its trigger's bounding box.
  useEffect(() => {
    if (!servicesOpen) return;
    function onDocClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setServicesOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setServicesOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [servicesOpen]);

  function openOnHover() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  }
  function closeOnHoverIntent() {
    // A short delay ("hover intent") so moving the cursor from the trigger down into
    // the wide mega-menu panel doesn't require pixel-perfect adjacency.
    closeTimer.current = setTimeout(() => setServicesOpen(false), 250);
  }

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[100]">
        <div
          className="h-full transition-all duration-100"
          style={{ width: `${scrollProgress}%`, background: "var(--cyan)" }}
        />
      </div>

      <motion.nav
        ref={navRef}
        animate={{ y: hidden ? "-100%" : 0 }}
        transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled || servicesOpen
            ? "bg-[rgba(246,247,251,0.92)] backdrop-blur-md border-b border-[var(--border)]"
            : `bg-transparent ${onDarkHero && !mobileOpen ? "tone-light" : ""}`
        }`}
      >
        <motion.div
          className="w-full px-6 xl:px-10 flex items-center"
          style={{ height: "var(--nav-height)", transformOrigin: "left center" }}
          animate={{ scale: scrolled ? 0.88 : 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE_OUT_QUART }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0">
              <Image src="/logo.jpg" alt="Yubhian Technologies" width={48} height={48} className="w-full h-full object-cover" priority />
            </div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="font-bold text-xl sm:text-2xl" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
                Yubhian
              </span>
              <span className="text-[10px] sm:text-xs font-medium tracking-wide -mt-0.5 truncate" style={{ color: "var(--gray)" }}>
                Technologies LLP
              </span>
            </div>
          </Link>

          {/* Nav links + CTA grouped together and pushed to the far right, well clear of the logo */}
          <div className="hidden lg:flex items-center gap-10 ml-auto">
            <div className="flex items-center gap-7">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={openOnHover}
                    onMouseLeave={closeOnHoverIntent}
                  >
                    <button
                      className="flex items-center gap-1 text-[var(--gray2)] hover:text-[var(--white)] transition-colors text-sm font-medium group"
                      onClick={() => setServicesOpen((v) => !v)}
                      aria-expanded={servicesOpen}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                      />
                      <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[var(--cyan)] transition-all duration-300 group-hover:w-full" />
                    </button>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="relative text-[var(--gray2)] hover:text-[var(--white)] transition-colors text-sm font-medium group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[var(--cyan)] transition-all duration-300 group-hover:w-full" />
                  </Link>
                )
              )}
            </div>

            {/* CTA — pill-shaped, grouped with the nav links at the far right corner */}
            <Link
              href="/contact"
              className="btn-shine flex items-center gap-2 px-5 py-2 rounded-full text-white text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "var(--grad)",
                boxShadow: "0 4px 20px rgba(30,63,168,0.3)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 30px rgba(30,63,168,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(30,63,168,0.3)";
              }}
            >
              Get in Touch <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile hamburger — pinned right on narrow screens */}
          <button
            className="ml-auto lg:hidden p-2"
            style={{ color: "var(--white)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={22} />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu size={22} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.div>

        {/* Services mega-menu — viewport-centered so it can be far wider than its trigger */}
        <AnimatePresence>
          {servicesOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: EASE_OUT_QUART }}
              onMouseEnter={openOnHover}
              onMouseLeave={closeOnHoverIntent}
              className="hidden lg:flex absolute top-full left-0 right-0 w-full"
              style={{
                background: "var(--surface)",
                borderTop: "1px solid var(--border)",
                borderRadius: "0 0 var(--shape-corner-lg) var(--shape-corner-lg)",
                boxShadow: "0 24px 70px rgba(11,16,51,0.14)",
              }}
            >
              <div className="w-full px-6 xl:px-10 py-8 flex gap-8 max-w-[1400px] mx-auto">
                {/* Category sub-sections on the left — a compact list, not a wall of services */}
                <div className="w-[240px] shrink-0 flex flex-col gap-0.5" style={{ borderRight: "1px solid var(--border)", paddingRight: "var(--space-lg)" }}>
                  {SERVICE_CATEGORIES.map((category) => {
                    const items = services.filter((s) => s.category === category);
                    if (items.length === 0) return null;
                    const active = category === activeCategory;
                    return (
                      <button
                        key={category}
                        onMouseEnter={() => setActiveCategory(category)}
                        onClick={() => setActiveCategory(category)}
                        className="flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                        style={active ? { background: "var(--navy2)", color: "var(--white)" } : { color: "var(--gray2)" }}
                      >
                        {category}
                        <span className="text-xs" style={{ color: "var(--gray)" }}>{items.length}</span>
                      </button>
                    );
                  })}
                  <Link
                    href="/services"
                    className="flex items-center gap-1.5 text-sm font-medium mt-2 px-3 py-2"
                    style={{ color: "var(--cyan)" }}
                    onClick={() => setServicesOpen(false)}
                  >
                    View all <ArrowRight size={13} />
                  </Link>
                </div>

                {/* Sub-panel — only the active category's services, so height stays compact */}
                <div className="flex-1 grid grid-cols-2 gap-1 content-start max-h-[60vh] overflow-y-auto">
                  {services
                    .filter((s) => s.category === activeCategory)
                    .map((s) => (
                      <Link
                        key={s.label}
                        href={s.href}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-black/[0.03] transition-colors group"
                        onClick={() => setServicesOpen(false)}
                      >
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: s.accent + "18" }}
                        >
                          <s.icon size={15} style={{ color: s.accent }} />
                        </div>
                        <div className="min-w-0">
                          <div
                            className="text-sm font-medium group-hover:text-[var(--cyan)] transition-colors"
                            style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}
                          >
                            {s.label}
                          </div>
                          <div className="text-xs mt-0.5 leading-snug" style={{ color: "var(--gray)" }}>{s.desc}</div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28 }}
            className="fixed inset-0 z-40 flex flex-col pt-20 px-6 pb-10 lg:hidden overflow-y-auto"
            style={{ background: "var(--navy)" }}
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div key={link.label}>
                    <button
                      className="flex items-center justify-between w-full py-3 text-lg font-medium border-b border-[var(--border)]"
                      style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    >
                      {link.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {mobileServicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          {SERVICE_CATEGORIES.map((category) => {
                            const items = services.filter((s) => s.category === category);
                            if (items.length === 0) return null;
                            return (
                              <div key={category} className="pt-3">
                                <p className="text-[10px] font-semibold uppercase tracking-widest pl-4 mb-1.5" style={{ color: "var(--cyan)" }}>
                                  {category}
                                </p>
                                {items.map((s) => (
                                  <Link
                                    key={s.label}
                                    href={s.href}
                                    className="flex items-center gap-3 py-2 pl-4 text-[var(--gray2)] hover:text-[var(--white)] transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                  >
                                    <s.icon size={15} style={{ color: s.accent }} />
                                    <span className="text-sm">{s.label}</span>
                                  </Link>
                                ))}
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="py-3 text-lg font-medium border-b border-[var(--border)]"
                    style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <Link
                href="/contact"
                className="btn-shine mt-6 flex items-center justify-center gap-2 py-3 rounded-full text-white font-medium"
                style={{ background: "var(--grad)" }}
                onClick={() => setMobileOpen(false)}
              >
                Get in Touch <ArrowRight size={15} />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
