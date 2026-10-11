"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Minus, Plus, FileText, ArrowUpRight } from "lucide-react";
import { getProduct } from "@/lib/products";
import { getAllProjects, type Project } from "@/lib/projects-data";
import { fadeUp, EASE_OUT_QUART } from "@/lib/motion";
import ReadinessPreview from "@/components/products/ReadinessPreview";
import ProjectCard from "@/components/products/ProjectCard";
import ProductLeadForm from "@/components/products/ProductLeadForm";

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="kicker mb-5">{children}</p>;
}

/** Zoho-style product page: branded hero, a sticky section bar, then overview → features
 *  → how it works → benefits → modules → audience → screenshots → proof → resources →
 *  pricing & demo → FAQ. Optional sections render only when they have real content. */
export default function ProductDetail({ slug }: { slug: string }) {
  const product = getProduct(slug)!;
  const reduceMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getAllProjects().then((all) => setProjects(all.filter((p) => p.productSlug === slug)));
  }, [slug]);

  const sections = useMemo(
    () =>
      [
        { id: "overview", label: "Overview" },
        { id: "features", label: "Features" },
        { id: "how", label: "How it works" },
        { id: "modules", label: "Modules" },
        { id: "audience", label: "Who it's for" },
        product.screenshots.length > 0 && { id: "screenshots", label: "Screenshots" },
        projects.length > 0 && { id: "proof", label: "Proof" },
        product.resources.length > 0 && { id: "resources", label: "Resources" },
        { id: "pricing", label: "Pricing" },
        { id: "faq", label: "FAQ" },
      ].filter(Boolean) as { id: string; label: string }[],
    [product, projects.length],
  );

  // Highlight the section currently under the sticky bar.
  const [active, setActive] = useState("overview");
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = sections[0]?.id ?? "overview";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 180) current = s.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  const { brand } = product;
  const heroBg = `radial-gradient(ellipse 70% 80% at 80% 20%, ${brand.primary} 0%, #121B5C 45%, #050A2E 100%)`;

  return (
    <>
      {/* Hero */}
      <section className="tone-light relative overflow-hidden" style={{ background: heroBg }}>
        <div aria-hidden className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #F6F7FB 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div aria-hidden className="page-hero-glow absolute -top-1/3 right-[-10%] w-[65vw] h-[65vw] rounded-full" style={{ background: `radial-gradient(closest-side, ${brand.accent}33, transparent)` }} />
        <div className="relative max-w-7xl mx-auto px-6 xl:px-10 pb-20 md:pb-28 grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-14 items-center" style={{ paddingTop: "calc(var(--nav-height) + 3.5rem)" }}>
          <div>
            <motion.div {...fadeUp(0)} className="flex flex-wrap items-center gap-3">
              <Link href="/products" className="text-sm transition-colors hover:text-white" style={{ color: "var(--gray)" }}>
                Products
              </Link>
              <span aria-hidden style={{ color: "var(--gray)" }}>/</span>
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium" style={{ background: `${brand.accent}22`, color: brand.accent, border: `1px solid ${brand.accent}55` }}>
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inset-0 rounded-full animate-ping" style={{ background: brand.accent, opacity: 0.6 }} />
                  <span className="relative w-1.5 h-1.5 rounded-full" style={{ background: brand.accent }} />
                </span>
                {product.status}
              </span>
            </motion.div>

            <motion.div {...fadeUp(0.05)} className="mt-8">
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG wordmark */}
              <img src={product.logo.wordmarkLight} alt={product.name} className="h-12 sm:h-14 w-auto" />
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="mt-7"
              style={{ color: "var(--white)", fontSize: "clamp(2.6rem, 6vw, 5.25rem)", lineHeight: 1, letterSpacing: "-0.04em", fontWeight: 400 }}
            >
              {product.tagline.split(",")[0]}
              {product.tagline.includes(",") && (
                <>
                  ,<br />
                  <em className="serif-accent" style={{ color: brand.accent }}>{product.tagline.split(",").slice(1).join(",").trim()}</em>
                </>
              )}
            </motion.h1>
            <motion.p {...fadeUp(0.15)} className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: "var(--gray2)" }}>
              {product.summary}
            </motion.p>
            <motion.div {...fadeUp(0.2)} className="mt-9 flex flex-wrap items-center gap-5">
              <a href="#pricing" className="group flex items-center gap-3 pl-6 pr-2 py-2 rounded-full font-semibold transition-transform hover:-translate-y-0.5" style={{ background: "#FFFFFF", color: "#0B1033" }}>
                Request a demo
                <span className="w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:-rotate-45" style={{ background: brand.accent, color: "#0B1033" }}>
                  <ArrowRight size={16} />
                </span>
              </a>
              <a href="#how" className="font-medium underline underline-offset-[6px] decoration-1" style={{ color: "var(--white)", textDecorationColor: "rgba(246,247,251,0.5)" }}>
                See how it works
              </a>
            </motion.div>
            <motion.ul {...fadeUp(0.25)} className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: "var(--gray2)" }}>
              {["NAAC & NBA ready", "SSR · AQAR · SAR reports", "Free pilots for early colleges"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check size={15} style={{ color: brand.accent }} /> {t}
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            initial={reduceMotion ? false : { y: 40, rotate: 1.5, filter: "blur(8px)" }}
            animate={{ y: 0, rotate: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.2, ease: EASE_OUT_QUART }}
            className="relative"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- product icon */}
            <img src={product.logo.icon} alt="" aria-hidden className="absolute -top-10 -left-8 w-20 h-20 rounded-[22px] shadow-2xl z-10 hidden sm:block" />
            <ReadinessPreview accent={brand.accent} primary={brand.primary} />
          </motion.div>
        </div>
      </section>

      {/* Sticky section bar */}
      <nav aria-label={`${product.name} sections`} className="sticky top-0 z-30" style={{ background: "rgba(246,247,251,0.94)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: "1px solid var(--hairline)" }}>
        <div className="max-w-7xl mx-auto px-6 xl:px-10 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- product icon */}
          <img src={product.logo.icon} alt="" aria-hidden className="w-7 h-7 rounded-lg hidden md:block" />
          <ul className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={active === s.id ? "true" : undefined}
                  className="relative block whitespace-nowrap px-3 py-4 text-sm transition-colors"
                  style={{ color: active === s.id ? "var(--white)" : "var(--gray)", fontWeight: active === s.id ? 600 : 400 }}
                >
                  {s.label}
                  {active === s.id && <motion.span layoutId="product-tab" className="absolute left-3 right-3 bottom-0 h-0.5 rounded-full" style={{ background: brand.primary }} />}
                </a>
              </li>
            ))}
          </ul>
          <a href="#pricing" className="hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white" style={{ background: brand.primary }}>
            Request a demo <ArrowRight size={14} />
          </a>
        </div>
      </nav>

      {/* Overview — why now */}
      <section id="overview" className="px-6 xl:px-10 pt-24 pb-20 scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="grid lg:grid-cols-2 gap-8 items-end">
            <div>
              <Kicker>Why {product.name}</Kicker>
              <h2 className="section-title" style={{ color: "var(--white)" }}>
                Accreditation isn&rsquo;t a five-year event <em className="serif-accent">anymore</em>
              </h2>
            </div>
            <p className="text-lg leading-relaxed" style={{ color: "var(--gray)" }}>{product.oneLiner}</p>
          </motion.div>
          <div className="mt-12 grid md:grid-cols-3" style={{ borderTop: "1px solid var(--ink)" }}>
            {product.why.map((w, i) => (
              <motion.div key={w.title} {...fadeUp(i * 0.1)} className={`pt-8 pb-4 md:pr-8 ${i ? "md:pl-8 md:border-l" : ""}`} style={{ borderColor: "var(--hairline)" }}>
                <p className="text-xs tabular-nums mb-5" style={{ color: "var(--gray)" }}>{String(i + 1).padStart(2, "0")}</p>
                <h3 className="text-xl leading-snug mb-3" style={{ color: "var(--white)" }}>{w.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--gray)" }}>{w.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 xl:px-10 py-24 scroll-mt-32" style={{ background: "var(--navy2)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="max-w-3xl">
            <Kicker>Features</Kicker>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              Everything the IQAC needs, <em className="serif-accent">in one place</em>
            </h2>
          </motion.div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {product.features.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp((i % 4) * 0.08)}
                className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(11,16,51,0.1)]"
                style={{ background: "var(--surface)", border: "1px solid var(--hairline)" }}
              >
                <span className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors" style={{ background: `${brand.primary}14`, color: brand.primary }}>
                  <f.icon size={20} />
                </span>
                <h3 className="mt-5 text-lg leading-snug" style={{ color: "var(--white)" }}>{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--gray)" }}>{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-6 xl:px-10 py-24 scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="max-w-3xl">
            <Kicker>How it works</Kicker>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              Evidence in all year, <em className="serif-accent">reports out</em> on demand
            </h2>
          </motion.div>
          <ol className="mt-14 grid md:grid-cols-3 gap-6 relative">
            <span aria-hidden className="hidden md:block absolute top-7 left-[8%] right-[8%] h-px" style={{ background: `linear-gradient(90deg, ${brand.primary}, ${brand.accent})` }} />
            {product.steps.map((s, i) => (
              <motion.li key={s.title} {...fadeUp(i * 0.12)} className="relative">
                <span className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center text-lg text-white" style={{ background: i === product.steps.length - 1 ? brand.accent : brand.primary, color: i === product.steps.length - 1 ? "#0B1033" : "#FFFFFF", fontFamily: "var(--font-syne)" }}>
                  {i + 1}
                </span>
                <h3 className="mt-6 text-2xl" style={{ color: "var(--white)" }}>{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed max-w-sm" style={{ color: "var(--gray)" }}>{s.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Benefits */}
      <section className="tone-light px-6 xl:px-10 py-24" style={{ background: heroBg }}>
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="max-w-3xl">
            <Kicker>Benefits</Kicker>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              What changes for <em className="serif-accent" style={{ color: brand.accent }}>your campus</em>
            </h2>
          </motion.div>
          <div className="mt-12 grid sm:grid-cols-2 gap-px rounded-2xl overflow-hidden" style={{ background: "rgba(246,247,251,0.12)" }}>
            {product.benefits.map((b, i) => (
              <motion.div key={b.title} {...fadeUp(i * 0.08)} className="p-8" style={{ background: "rgba(5,9,40,0.55)" }}>
                <Check size={20} style={{ color: brand.accent }} />
                <h3 className="mt-4 text-2xl" style={{ color: "var(--white)" }}>{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--gray2)" }}>{b.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="px-6 xl:px-10 py-24 scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Kicker>Modules</Kicker>
              <h2 className="section-title" style={{ color: "var(--white)" }}>
                Start with accreditation, <em className="serif-accent">grow</em> from there
              </h2>
            </div>
            <p className="max-w-sm text-sm" style={{ color: "var(--gray)" }}>Choose the modules you need — they all share one source of truth for your campus data.</p>
          </motion.div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {product.modules.map((m, i) => {
              const first = m.stage === "First";
              return (
                <motion.div
                  key={m.name}
                  {...fadeUp(i * 0.1)}
                  className="relative rounded-2xl p-7 flex flex-col gap-4 transition-transform duration-500 hover:-translate-y-1"
                  style={first ? { background: `linear-gradient(150deg, #0A1250, ${brand.primary})` } : { background: "var(--surface)", border: "1px solid var(--hairline)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="w-11 h-11 rounded-xl flex items-center justify-center" style={first ? { background: `${brand.accent}2E`, color: brand.accent } : { background: `${brand.primary}14`, color: brand.primary }}>
                      <m.icon size={20} />
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full" style={first ? { background: brand.accent, color: "#0B1033" } : { border: "1px solid var(--hairline)", color: "var(--gray)" }}>
                      {first ? "First module" : "Next"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl" style={{ color: first ? "#F6F7FB" : "var(--white)" }}>{m.name}</h3>
                    <p className="mt-1 text-sm font-medium" style={{ color: first ? brand.accent : brand.primary }}>{m.scope}</p>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: first ? "rgba(246,247,251,0.82)" : "var(--gray)" }}>{m.detail}</p>
                </motion.div>
              );
            })}
          </div>
          <motion.div {...fadeUp(0.3)} className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl px-6 py-5" style={{ border: "1px dashed var(--hairline)" }}>
            <span className="text-sm font-medium mr-2" style={{ color: "var(--white)" }}>On the roadmap:</span>
            {product.later.map((l) => (
              <span key={l.name} className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full" style={{ background: "var(--navy2)", color: "var(--gray2)" }}>
                <l.icon size={14} /> {l.name}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who it's for + platform */}
      <section id="audience" className="px-6 xl:px-10 py-24 scroll-mt-32" style={{ background: "var(--navy2)" }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          <motion.div {...fadeUp(0)}>
            <Kicker>Who it&rsquo;s for</Kicker>
            <h2 className="subsection-title" style={{ color: "var(--white)" }}>
              Built for Indian <em className="serif-accent">colleges &amp; universities</em>
            </h2>
            <ul className="mt-8 grid sm:grid-cols-2 gap-3">
              {product.audience.now.map((a) => (
                <li key={a} className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm" style={{ background: "var(--surface)", border: "1px solid var(--hairline)", color: "var(--white)" }}>
                  <Check size={16} style={{ color: brand.primary }} /> {a}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm" style={{ color: "var(--gray)" }}>Next: {product.audience.later}</p>
          </motion.div>
          <motion.div {...fadeUp(0.15)}>
            <Kicker>The platform</Kicker>
            <h2 className="subsection-title" style={{ color: "var(--white)" }}>
              One cloud platform, <em className="serif-accent">always current</em>
            </h2>
            <ul className="mt-8 flex flex-col">
              {product.platform.map((p) => (
                <li key={p.title} className="py-5" style={{ borderTop: "1px solid var(--hairline)" }}>
                  <h3 className="text-lg mb-1" style={{ color: "var(--white)" }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--gray)" }}>{p.text}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Screenshots (when added) */}
      {product.screenshots.length > 0 && (
        <section id="screenshots" className="px-6 xl:px-10 py-24 scroll-mt-32">
          <div className="max-w-7xl mx-auto">
            <Kicker>Screenshots</Kicker>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              Inside <em className="serif-accent">{product.name}</em>
            </h2>
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              {product.screenshots.map((s) => (
                <figure key={s.src} className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--hairline)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- product screenshots */}
                  <img src={s.src} alt={s.alt} loading="lazy" className="w-full h-auto" />
                  {s.caption && <figcaption className="px-5 py-3 text-sm" style={{ color: "var(--gray)" }}>{s.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Proof — delivered projects tagged with this product in the admin */}
      {projects.length > 0 && (
        <section id="proof" className="px-6 xl:px-10 py-24 scroll-mt-32">
          <div className="max-w-7xl mx-auto">
            <Kicker>Proof</Kicker>
            <h2 className="section-title mb-6" style={{ color: "var(--white)" }}>
              {product.name} <em className="serif-accent">in the field</em>
            </h2>
            {projects.map((p, i) => (
              <ProjectCard key={p.name + i} project={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Resources (when added) */}
      {product.resources.length > 0 && (
        <section id="resources" className="px-6 xl:px-10 py-24 scroll-mt-32" style={{ background: "var(--navy2)" }}>
          <div className="max-w-7xl mx-auto">
            <Kicker>Resources</Kicker>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              Documentation &amp; <em className="serif-accent">links</em>
            </h2>
            <ul className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {product.resources.map((r) => (
                <li key={r.href}>
                  <a href={r.href} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col gap-3 rounded-2xl p-6 transition-colors hover:border-[var(--blue)]" style={{ background: "var(--surface)", border: "1px solid var(--hairline)" }}>
                    <span className="flex items-center justify-between text-xs uppercase tracking-[0.14em]" style={{ color: "var(--gray)" }}>
                      <span className="flex items-center gap-2"><FileText size={14} /> {r.kind}</span>
                      <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                    <span className="text-lg" style={{ color: "var(--white)" }}>{r.title}</span>
                    {r.description && <span className="text-sm" style={{ color: "var(--gray)" }}>{r.description}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Pricing + demo / pilot */}
      <section id="pricing" className="tone-light px-6 xl:px-10 py-24 scroll-mt-32" style={{ background: heroBg }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <motion.div {...fadeUp(0)}>
            <Kicker>Pricing &amp; pilots</Kicker>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              See it with <em className="serif-accent" style={{ color: brand.accent }}>your own data</em>
            </h2>
            <p className="mt-6 text-lg leading-relaxed max-w-lg" style={{ color: "var(--gray2)" }}>{product.pricing.model}</p>
            <ul className="mt-8 flex flex-col gap-3 text-sm" style={{ color: "var(--gray2)" }}>
              {[product.pricing.pilot, "A walkthrough of the full workflow for your IQAC team", "Modules chosen to fit your institution"].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Check size={16} className="mt-0.5 shrink-0" style={{ color: brand.accent }} /> {t}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...fadeUp(0.15)} className="rounded-2xl p-7 sm:p-8" style={{ background: "#F6F7FB" }}>
            <ProductLeadForm productName={product.name} leadSource={product.leadSource} />
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 xl:px-10 py-24 scroll-mt-32">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <Kicker>Questions</Kicker>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              About <em className="serif-accent">{product.name}</em>
            </h2>
          </motion.div>
          <div className="flex flex-col" style={{ borderTop: "1px solid var(--ink)" }}>
            {product.faq.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} style={{ borderBottom: "1px solid var(--hairline)" }}>
                  <button
                    type="button"
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-4 text-left py-5 text-lg"
                    style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    {f.q}
                    <span className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ border: "1px solid var(--hairline)", color: brand.primary }}>
                      {open ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </button>
                  {open && <p className="pb-6 text-sm leading-relaxed" style={{ color: "var(--gray)" }}>{f.a}</p>}
                </div>
              );
            })}
          </div>
          <p className="mt-10 text-center text-sm" style={{ color: "var(--gray)" }}>
            Exploring other solutions?{" "}
            <Link href="/products" className="underline underline-offset-4" style={{ color: "var(--blue)" }}>
              See all products
            </Link>{" "}
            or{" "}
            <Link href="/work" className="underline underline-offset-4" style={{ color: "var(--blue)" }}>
              our completed work
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
