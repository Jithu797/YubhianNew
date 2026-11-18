"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, X, Minus, Plus, FileText, Phone, Mail, Maximize2 } from "lucide-react";
import { getProduct, type ProductScreenshot } from "@/lib/products";
import { getAllProjects, type Project } from "@/lib/projects-data";
import { fadeUp, EASE_OUT_QUART } from "@/lib/motion";
import ProjectCard from "@/components/products/ProjectCard";
import ProductLeadForm from "@/components/products/ProductLeadForm";

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="kicker mb-5">{children}</p>;
}

/** An app screen in a soft frame; opens full size in a new tab. */
function Screen({ shot, priority = false, className = "" }: { shot: ProductScreenshot; priority?: boolean; className?: string }) {
  return (
    <a
      href={shot.src}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${shot.title} — open full size`}
      className={`group relative block overflow-hidden rounded-2xl ${className}`}
      style={{ border: "1px solid rgba(43,57,144,0.14)", boxShadow: "0 24px 60px rgba(11,16,51,0.16)", background: "#FFFFFF" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised WebP screens with fixed sizes */}
      <img
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className="block w-full h-auto transition-transform duration-700 group-hover:scale-[1.015]"
      />
      <span className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "rgba(11,16,51,0.7)", color: "#fff" }}>
        <Maximize2 size={14} />
      </span>
    </a>
  );
}

/** Product page, structured like the product's brochure: hero with the real dashboard,
 *  three pillars, today-vs-with comparison, everything inside, how it works (with the
 *  faculty app), real screens, a year with the product, roles and trust, getting
 *  started, pricing and demo, FAQ. Optional sections render only when they have content. */
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
        { id: "overview", label: "Why " + product.name },
        { id: "features", label: "What's inside" },
        { id: "how", label: "How it works" },
        product.screenshots.length > 0 && { id: "screens", label: "Screens" },
        product.year && { id: "year", label: "A year with it" },
        product.roles && { id: "roles", label: "Who it's for" },
        product.onboarding && { id: "start", label: "Getting started" },
        projects.length > 0 && { id: "proof", label: "Proof" },
        { id: "pricing", label: "Pricing & demo" },
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
  // The logo goes to the product's own home page when it's live, else this page's top.
  const homeHref = product.liveUrl ?? "#top";
  const external = product.liveUrl ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const pillarColors = [brand.primary, "#0F766E", "#C2410C"];

  return (
    <>
      {/* Hero */}
      <section id="top" className="tone-light relative overflow-hidden" style={{ background: heroBg }}>
        <div aria-hidden className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #F6F7FB 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div aria-hidden className="page-hero-glow absolute -top-1/3 right-[-10%] w-[65vw] h-[65vw] rounded-full" style={{ background: `radial-gradient(closest-side, ${brand.accent}33, transparent)` }} />
        <div className="relative max-w-7xl mx-auto px-6 xl:px-10 pb-16 md:pb-24 grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-12 lg:gap-14 items-center" style={{ paddingTop: "calc(var(--nav-height) + 3.5rem)" }}>
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
              {/* The wordmark already includes the mark, so it stands alone. */}
              <a href={homeHref} {...external} aria-label={`${product.name} home`} className="inline-flex transition-opacity hover:opacity-85">
                {/* eslint-disable-next-line @next/next/no-img-element -- SVG wordmark */}
                <img src={product.logo.wordmarkLight} alt={product.name} className="h-11 sm:h-13 w-auto" />
              </a>
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="mt-7"
              style={{ color: "var(--white)", fontSize: "clamp(2.4rem, 4.8vw, 4.1rem)", lineHeight: 1.04, letterSpacing: "-0.04em", fontWeight: 400 }}
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
            <motion.ul {...fadeUp(0.18)} className="mt-6 flex flex-wrap gap-2">
              {product.coverage.map((c) => (
                <li key={c} className="rounded-full px-4 py-1.5 text-sm font-semibold" style={{ background: "rgba(246,247,251,0.12)", color: "#F6F7FB", border: "1px solid rgba(246,247,251,0.18)" }}>
                  {c}
                </li>
              ))}
            </motion.ul>
            <motion.div {...fadeUp(0.22)} className="mt-9 flex flex-wrap items-center gap-5">
              {/* A live product opens straight into the app; otherwise the demo form leads. */}
              <a
                href={product.liveUrl ?? "#pricing"}
                {...external}
                className="group flex items-center gap-3 pl-6 pr-2 py-2 rounded-full font-semibold transition-transform hover:-translate-y-0.5"
                style={{ background: "#FFFFFF", color: "#0B1033" }}
              >
                {product.liveUrl ? `Open ${product.name}` : "Request a demo"}
                <span className="w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:-rotate-45" style={{ background: brand.accent, color: "#0B1033" }}>
                  {product.liveUrl ? <ArrowUpRight size={16} /> : <ArrowRight size={16} />}
                </span>
              </a>
              {product.liveUrl && (
                <a href="#pricing" className="font-medium underline underline-offset-[6px] decoration-1" style={{ color: "var(--white)", textDecorationColor: "rgba(246,247,251,0.5)" }}>
                  Book a free demo
                </a>
              )}
              <a href="#how" className="font-medium underline underline-offset-[6px] decoration-1" style={{ color: "var(--white)", textDecorationColor: "rgba(246,247,251,0.5)" }}>
                See how it works
              </a>
            </motion.div>
          </div>

          {product.heroScreen && (
            <motion.div
              initial={reduceMotion ? false : { y: 40, rotate: 1.2 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: EASE_OUT_QUART }}
            >
              <Screen shot={product.heroScreen} priority />
              <p className="mt-3 text-xs text-right" style={{ color: "rgba(246,247,251,0.6)" }}>Screens show sample data</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Sticky section bar */}
      <nav aria-label={`${product.name} sections`} className="sticky top-0 z-30" style={{ background: "rgba(246,247,251,0.97)", borderBottom: "1px solid var(--hairline)" }}>
        <div className="max-w-7xl mx-auto px-6 xl:px-10 flex items-center gap-4">
          <a href={homeHref} {...external} aria-label={`${product.name} home`} className="shrink-0 hidden md:block">
            {/* eslint-disable-next-line @next/next/no-img-element -- product icon */}
            <img src={product.logo.icon} alt="" aria-hidden className="w-7 h-7 rounded-lg" />
          </a>
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
          {product.liveUrl ? (
            <a href={product.liveUrl} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white" style={{ background: brand.primary }}>
              Open {product.name} <ArrowUpRight size={14} />
            </a>
          ) : (
            <a href="#pricing" className="hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white" style={{ background: brand.primary }}>
              Request a demo <ArrowRight size={14} />
            </a>
          )}
        </div>
      </nav>

      {/* Three pillars */}
      <section className="px-6 xl:px-10 pt-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {product.pillars.map((p, i) => (
            <motion.div key={p.title} {...fadeUp(i * 0.08)} className="pt-5" style={{ borderTop: `3px solid ${pillarColors[i % 3]}` }}>
              <h2 className="text-2xl" style={{ color: "var(--white)" }}>{p.title}</h2>
              <p className="mt-2 text-base leading-relaxed" style={{ color: "var(--gray)" }}>{p.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why — today vs with the product */}
      <section id="overview" className="px-6 xl:px-10 pt-24 pb-20 scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="max-w-3xl">
            <Kicker>Why {product.name}</Kicker>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              Accreditation work, without the <em className="serif-accent">last-minute rush</em>
            </h2>
          </motion.div>
          {product.compare && (
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <motion.div {...fadeUp(0.05)} className="rounded-3xl p-8" style={{ background: "#FBF1EA" }}>
                <h3 className="text-xl font-semibold" style={{ color: "#9A3412", fontFamily: "var(--font-dm-sans)" }}>Today in many colleges</h3>
                <ul className="mt-6 flex flex-col gap-4">
                  {product.compare.before.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-base" style={{ color: "#3A3936" }}>
                      <X size={18} className="mt-0.5 shrink-0" style={{ color: "#C2410C" }} /> {t}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div {...fadeUp(0.12)} className="rounded-3xl p-8" style={{ background: "#E8EAF6" }}>
                <h3 className="text-xl font-semibold" style={{ color: brand.primary, fontFamily: "var(--font-dm-sans)" }}>With {product.name}</h3>
                <ul className="mt-6 flex flex-col gap-4">
                  {product.compare.after.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-base" style={{ color: "#1F2547" }}>
                      <Check size={18} className="mt-0.5 shrink-0" style={{ color: "#0F766E" }} /> {t}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* Everything inside */}
      <section id="features" className="px-6 xl:px-10 py-24 scroll-mt-32" style={{ background: "var(--navy2)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <Kicker>What&rsquo;s inside</Kicker>
              <h2 className="section-title" style={{ color: "var(--white)" }}>
                Everything in <em className="serif-accent">one platform</em>
              </h2>
            </div>
            <p className="max-w-sm text-sm" style={{ color: "var(--gray)" }}>Start with the modules you need today. Add more any time, on the same data.</p>
          </motion.div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {product.features.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp((i % 4) * 0.08)}
                className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(11,16,51,0.1)]"
                style={{ background: "var(--surface)", border: "1px solid var(--hairline)" }}
              >
                <span className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${brand.primary}14`, color: brand.primary }}>
                  <f.icon size={20} />
                </span>
                <h3 className="mt-5 text-lg leading-snug" style={{ color: "var(--white)" }}>{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--gray)" }}>{f.text}</p>
              </motion.div>
            ))}
          </div>
          {product.later.length > 0 && (
            <motion.div {...fadeUp(0.2)} className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl px-6 py-5" style={{ border: "1px dashed var(--hairline)" }}>
              <span className="text-sm font-medium mr-2" style={{ color: "var(--white)" }}>Coming next on the same platform:</span>
              {product.later.map((l) => (
                <span key={l.name} className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full" style={{ background: "#FDF3E3", color: "#7C4A03" }}>
                  <l.icon size={14} /> {l.name}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* How it works — with the faculty app */}
      <section id="how" className="px-6 xl:px-10 py-24 scroll-mt-32">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] gap-14 items-center">
          <div>
            <motion.div {...fadeUp(0)}>
              <Kicker>How it works</Kicker>
              <h2 className="section-title" style={{ color: "var(--white)" }}>
                Set up once, <em className="serif-accent">ready all year</em>
              </h2>
            </motion.div>
            <ol className="mt-12 flex flex-col gap-8">
              {product.steps.map((s, i) => (
                <motion.li key={s.title} {...fadeUp(i * 0.1)} className="flex gap-5">
                  <span className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-semibold text-white" style={{ background: brand.primary }}>
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-xl" style={{ color: "var(--white)" }}>{s.title}</span>
                    <span className="mt-1 block text-base leading-relaxed" style={{ color: "var(--gray)" }}>{s.text}</span>
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>
          {product.phoneScreen && (
            <motion.figure {...fadeUp(0.15)} className="mx-auto w-full max-w-[300px]">
              <Screen shot={product.phoneScreen} className="!rounded-[2.4rem]" />
              <figcaption className="mt-4 text-center text-sm" style={{ color: "var(--gray)" }}>{product.phoneScreen.caption}</figcaption>
            </motion.figure>
          )}
        </div>
      </section>

      {/* Real screens */}
      {product.screenshots.length > 0 && (
        <section id="screens" className="tone-light px-6 xl:px-10 py-24 scroll-mt-32" style={{ background: "#0B1033" }}>
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp(0)} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-3xl">
                <Kicker>See it in action</Kicker>
                <h2 className="section-title" style={{ color: "var(--white)" }}>
                  Real screens, designed for <em className="serif-accent" style={{ color: brand.accent }}>busy colleges</em>
                </h2>
              </div>
              <p className="max-w-sm text-sm" style={{ color: "var(--gray2)" }}>Select a screen to see it full size. Screens show sample data.</p>
            </motion.div>
            <div className="mt-12 grid md:grid-cols-2 gap-x-6 gap-y-10">
              {product.screenshots.map((s, i) => {
                const wide = s.width / s.height > 2.2;
                return (
                  <motion.figure key={s.src} {...fadeUp((i % 2) * 0.08)} className={wide ? "md:col-span-2" : ""}>
                    <Screen shot={s} />
                    <figcaption className="mt-4 text-base" style={{ color: "var(--gray2)" }}>
                      <strong className="font-semibold" style={{ color: "#F6F7FB" }}>{s.title}.</strong> {s.caption}
                    </figcaption>
                  </motion.figure>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* A year with the product + enter once, used everywhere */}
      {product.year && (
        <section id="year" className="px-6 xl:px-10 py-24 scroll-mt-32">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
            <div>
              <motion.div {...fadeUp(0)}>
                <Kicker>Always ready, not just at deadline time</Kicker>
                <h2 className="section-title" style={{ color: "var(--white)" }}>
                  A year with <em className="serif-accent">{product.name}</em>
                </h2>
              </motion.div>
              <ol className="mt-10 relative">
                <span aria-hidden className="absolute left-[2.6rem] top-4 bottom-4 w-px" style={{ borderLeft: "2px dashed var(--hairline)" }} />
                {product.year.map((y, i) => {
                  const edge = i === 0 || i === product.year!.length - 1;
                  const report = ["AQAR", "NIRF", "NBA SAR"].includes(y.title);
                  return (
                    <motion.li key={y.title} {...fadeUp(i * 0.06)} className="relative flex items-start gap-5 pb-6">
                      <span
                        className="relative z-10 shrink-0 w-[5.2rem] text-center rounded-full py-2 text-sm font-semibold"
                        style={edge ? { background: brand.primary, color: "#fff" } : report ? { background: "#FDF3E3", color: "#7C4A03" } : { background: "#E8EAF6", color: brand.primary }}
                      >
                        {y.when}
                      </span>
                      <span className="pt-1">
                        <span className="block text-lg" style={{ color: "var(--white)" }}>{y.title}</span>
                        <span className="block text-sm leading-relaxed" style={{ color: "var(--gray)" }}>{y.text}</span>
                      </span>
                    </motion.li>
                  );
                })}
              </ol>
              <p className="text-sm" style={{ color: "var(--gray)" }}>Months are an example. {product.name} follows your institution&rsquo;s own calendar.</p>
            </div>

            {product.reuse && (
              <motion.div {...fadeUp(0.15)} className="self-center rounded-3xl p-8 sm:p-10" style={{ background: "var(--navy2)", border: "1px solid var(--hairline)" }}>
                <h3 className="text-2xl" style={{ color: "var(--white)" }}>Enter once, used everywhere</h3>
                <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
                  <ul className="flex flex-col gap-3">
                    {product.reuse.outputs.slice(0, 2).map((o) => (
                      <li key={o} className="rounded-xl px-3 py-3 text-center text-sm font-semibold" style={{ background: "var(--surface)", border: "1px solid var(--hairline)", color: "var(--white)" }}>{o}</li>
                    ))}
                  </ul>
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center text-center px-3" style={{ background: brand.primary, boxShadow: `0 0 0 10px ${brand.primary}1F` }}>
                    <span className="text-base sm:text-lg font-semibold leading-tight text-white">{product.reuse.source}</span>
                    <span className="mt-1 text-[10px] sm:text-xs leading-snug" style={{ color: "rgba(255,255,255,0.75)" }}>{product.reuse.sourceDetail}</span>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {product.reuse.outputs.slice(2).map((o) => (
                      <li key={o} className="rounded-xl px-3 py-3 text-center text-sm font-semibold" style={{ background: "var(--surface)", border: "1px solid var(--hairline)", color: "var(--white)" }}>{o}</li>
                    ))}
                  </ul>
                </div>
                <p className="mt-8 text-base leading-relaxed" style={{ color: "var(--gray)" }}>{product.reuse.note}</p>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Who it's for — roles, institutions, trust */}
      {product.roles && (
        <section id="roles" className="px-6 xl:px-10 py-24 scroll-mt-32" style={{ background: "var(--navy2)" }}>
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp(0)} className="max-w-3xl">
              <Kicker>For everyone on campus</Kicker>
              <h2 className="section-title" style={{ color: "var(--white)" }}>
                Built for <em className="serif-accent">every role</em>
              </h2>
            </motion.div>
            <motion.dl {...fadeUp(0.08)} className="mt-10 rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--hairline)" }}>
              {product.roles.map((r, i) => (
                <div key={r.role} className="grid sm:grid-cols-[16rem_1fr] gap-1 sm:gap-6 px-6 py-5" style={{ borderTop: i ? "1px solid var(--hairline)" : undefined }}>
                  <dt className="font-semibold" style={{ color: brand.primary }}>{r.role}</dt>
                  <dd className="text-base" style={{ color: "var(--gray)" }}>{r.text}</dd>
                </div>
              ))}
            </motion.dl>

            <div className="mt-14 grid lg:grid-cols-2 gap-12">
              {product.trust && (
                <motion.div {...fadeUp(0)}>
                  <h3 className="subsection-title" style={{ color: "var(--white)" }}>Why colleges can trust it</h3>
                  <ul className="mt-6 grid sm:grid-cols-2 gap-3">
                    {product.trust.map((t) => (
                      <li key={t} className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium" style={{ background: "var(--surface)", border: "1px solid var(--hairline)", color: "var(--white)" }}>
                        <Check size={16} className="shrink-0" style={{ color: "#0F766E" }} /> {t}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
              <motion.div {...fadeUp(0.1)}>
                <h3 className="subsection-title" style={{ color: "var(--white)" }}>Made for Indian institutions</h3>
                <ul className="mt-6 grid sm:grid-cols-2 gap-3">
                  {product.audience.now.map((a) => (
                    <li key={a} className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm" style={{ background: "var(--surface)", border: "1px solid var(--hairline)", color: "var(--white)" }}>
                      <Check size={16} className="shrink-0" style={{ color: brand.primary }} /> {a}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm" style={{ color: "var(--gray)" }}>Next: {product.audience.later}</p>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Getting started */}
      {product.onboarding && (
        <section id="start" className="px-6 xl:px-10 py-24 scroll-mt-32">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp(0)} className="max-w-3xl">
              <Kicker>Getting started</Kicker>
              <h2 className="section-title" style={{ color: "var(--white)" }}>
                Up and running in <em className="serif-accent">about a month</em>
              </h2>
              <p className="mt-4 text-lg" style={{ color: "var(--gray)" }}>A typical onboarding plan, done fully online. We do the heavy lifting with your team.</p>
            </motion.div>
            <ol className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              <span aria-hidden className="hidden lg:block absolute top-6 left-12 right-12 h-px" style={{ background: "var(--hairline)" }} />
              {product.onboarding.steps.map((s, i) => (
                <motion.li key={s.when} {...fadeUp(i * 0.08)} className="relative">
                  <span className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold text-white" style={{ background: brand.primary }}>{i + 1}</span>
                  <p className="mt-5 text-sm font-semibold" style={{ color: "#C2410C" }}>{s.when}</p>
                  <h3 className="mt-1 text-xl" style={{ color: "var(--white)" }}>{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--gray)" }}>{s.text}</p>
                </motion.li>
              ))}
            </ol>

            <div className="mt-14 grid lg:grid-cols-2 gap-6">
              <motion.div {...fadeUp(0)} className="rounded-3xl p-8" style={{ border: "1px solid var(--hairline)", background: "var(--surface)" }}>
                <h3 className="text-xl font-semibold" style={{ color: "var(--white)", fontFamily: "var(--font-dm-sans)" }}>What we need from you</h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {product.onboarding.needs.map((n) => (
                    <li key={n} className="flex items-start gap-3 text-base" style={{ color: "var(--gray2)" }}>
                      <ArrowRight size={16} className="mt-1 shrink-0" style={{ color: brand.primary }} /> {n}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div {...fadeUp(0.08)} className="rounded-3xl p-8" style={{ border: "1px solid var(--hairline)", background: "var(--surface)" }}>
                <h3 className="text-xl font-semibold" style={{ color: "var(--white)", fontFamily: "var(--font-dm-sans)" }}>Works with what you use</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {product.onboarding.integrations.map((n) => (
                    <li key={n} className="rounded-full px-4 py-2 text-sm font-semibold" style={{ background: "#E8EAF6", color: brand.primary }}>{n}</li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <motion.div {...fadeUp(0.05)} className="mt-6 rounded-3xl p-8" style={{ background: "#DDF1EE" }}>
              <h3 className="text-xl font-semibold" style={{ color: "#0B4F49", fontFamily: "var(--font-dm-sans)" }}>Support that stays with you</h3>
              <ul className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {product.onboarding.support.map((s) => (
                  <li key={s.title} className="rounded-xl px-5 py-4" style={{ background: "#FFFFFF" }}>
                    <span className="block font-semibold" style={{ color: "#1F2547" }}>{s.title}</span>
                    <span className="block mt-0.5 text-sm" style={{ color: "#5E5C56" }}>{s.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
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

      {/* Pricing + demo */}
      <section id="pricing" className="tone-light px-6 xl:px-10 py-24 scroll-mt-32" style={{ background: heroBg }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-start">
          <motion.div {...fadeUp(0)}>
            <Kicker>Pricing &amp; demo</Kicker>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              See {product.name} in a <em className="serif-accent" style={{ color: brand.accent }}>short online demo</em>
            </h2>
            <p className="mt-6 text-lg leading-relaxed max-w-lg" style={{ color: "var(--gray2)" }}>{product.pricing.model}</p>
            {product.demo && (
              <>
                <p className="mt-4 text-base leading-relaxed max-w-lg" style={{ color: "var(--gray2)" }}>{product.demo.note}</p>
                <ol className="mt-8 grid sm:grid-cols-3 gap-3">
                  {product.demo.steps.map((s, i) => (
                    <li key={s} className="rounded-xl px-4 py-3" style={{ background: "rgba(246,247,251,0.1)", border: "1px solid rgba(246,247,251,0.16)" }}>
                      <span className="block text-xs font-semibold" style={{ color: "#F9C9A4" }}>Step {i + 1}</span>
                      <span className="block mt-1 text-sm font-semibold" style={{ color: "#F6F7FB" }}>{s}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                  <a href={`tel:${product.demo.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-2 font-medium" style={{ color: "#F6F7FB" }}>
                    <Phone size={15} style={{ color: brand.accent }} /> {product.demo.phone}
                  </a>
                  <a href={`mailto:${product.demo.email}`} className="inline-flex items-center gap-2 font-medium" style={{ color: "#F6F7FB" }}>
                    <Mail size={15} style={{ color: brand.accent }} /> {product.demo.email}
                  </a>
                </div>
                <blockquote className="mt-10 max-w-lg text-xl leading-snug" style={{ color: "#F6F7FB", fontFamily: "var(--font-syne)" }}>
                  &ldquo;{product.demo.promise}&rdquo;
                </blockquote>
              </>
            )}
          </motion.div>
          <motion.div {...fadeUp(0.15)} className="rounded-2xl p-7 sm:p-8" style={{ background: "#F6F7FB" }}>
            <ProductLeadForm productName={product.name} leadSource={product.leadSource} />
            {product.resources.map((r) => (
              <a key={r.href} href={r.href} target="_blank" rel="noopener noreferrer" className="group mt-6 flex items-start gap-4 rounded-xl p-4 transition-colors" style={{ background: "#FFFFFF", border: "1px solid #E4E1D8" }}>
                <span className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center" style={{ background: `${brand.primary}14`, color: brand.primary }}>
                  <FileText size={18} />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 font-semibold" style={{ color: "#1F2547" }}>
                    Download the {r.title.toLowerCase().replace(product.name.toLowerCase() + " ", "")} <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                  <span className="block text-xs mt-0.5" style={{ color: "#5E5C56" }}>{r.kind} · {r.description}</span>
                </span>
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 xl:px-10 py-24 scroll-mt-32">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <Kicker>Good questions</Kicker>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              What colleges <em className="serif-accent">usually ask us</em>
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
                  {open && <p className="pb-6 text-base leading-relaxed" style={{ color: "var(--gray)" }}>{f.a}</p>}
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
          {product.disclaimer && (
            <p className="mt-8 text-center text-xs leading-relaxed" style={{ color: "var(--gray)" }}>{product.disclaimer}</p>
          )}
        </div>
      </section>
    </>
  );
}
