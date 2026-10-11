"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Boxes, Wrench } from "lucide-react";
import PageHero from "@/components/PageHero";
import { PRODUCTS } from "@/lib/products";
import { fadeUp } from "@/lib/motion";

/** Product catalogue, Zoho-style: one large card per product (icon, category, status,
 *  modules) leading to its full product page, plus a route to custom builds and proof. */
export default function ProductsContent() {
  return (
    <>
      <PageHero
        kicker="Products"
        title={<>Software built by <em className="serif-accent">Yubhian</em></>}
        subtitle="Our own products, built on what we've learned delivering software for businesses and institutions across India."
        page="products"
        ghost={<Boxes size={380} strokeWidth={0.7} />}
      />

      <section className="px-6 xl:px-10 pt-16 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 pb-5" style={{ borderBottom: "1px solid var(--ink)" }}>
            <h2 className="subsection-title" style={{ color: "var(--white)" }}>All products</h2>
            <span className="text-sm tabular-nums" style={{ color: "var(--gray)" }}>
              {PRODUCTS.length} {PRODUCTS.length === 1 ? "product" : "products"}
            </span>
          </div>

          <ul className="mt-10 grid gap-8">
            {PRODUCTS.map((p, i) => (
              <motion.li key={p.slug} {...fadeUp(i * 0.08)}>
                <Link
                  href={`/products/${p.slug}`}
                  className="group grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] overflow-hidden rounded-3xl transition-shadow duration-500 hover:shadow-[0_30px_80px_rgba(11,16,51,0.18)]"
                  style={{ border: "1px solid var(--hairline)", background: "var(--surface)" }}
                >
                  <div className="p-8 sm:p-10 flex flex-col">
                    <div className="flex items-center gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element -- product icon */}
                      <img src={p.logo.icon} alt="" aria-hidden className="w-16 h-16 rounded-2xl shadow-lg" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.14em]" style={{ color: "var(--gray)" }}>{p.category}</p>
                        <span className="mt-1.5 inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: `${p.brand.accent}26`, color: "#0B4F49" }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.brand.accent }} />
                          {p.status}
                        </span>
                      </div>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element -- SVG wordmark */}
                    <img src={p.logo.wordmark} alt={p.name} className="mt-8 h-10 w-auto self-start" />
                    <h3 className="mt-5 text-3xl leading-tight" style={{ color: "var(--white)" }}>{p.tagline}</h3>
                    <p className="mt-3 text-base leading-relaxed max-w-xl" style={{ color: "var(--gray)" }}>{p.summary}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {p.modules.map((m) => (
                        <span key={m.name} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ background: "var(--navy2)", color: "var(--gray2)" }}>
                          <m.icon size={13} /> {m.name} · {m.scope}
                        </span>
                      ))}
                    </div>
                    <span className="mt-auto pt-8 inline-flex items-center gap-2 font-medium" style={{ color: p.brand.primary }}>
                      Explore {p.name}
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                  {/* Feature highlights on the product's brand colours */}
                  <div className="tone-light relative p-8 sm:p-10 overflow-hidden" style={{ background: `radial-gradient(ellipse 80% 80% at 80% 10%, ${p.brand.primary} 0%, #121B5C 50%, #050A2E 100%)` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- product icon */}
                    <img src={p.logo.icon} alt="" aria-hidden className="absolute -right-12 -bottom-12 w-64 h-64 opacity-[0.12] rotate-12 transition-transform duration-700 group-hover:rotate-6 group-hover:scale-105" />
                    <p className="relative text-xs uppercase tracking-[0.16em]" style={{ color: p.brand.accent }}>What it does</p>
                    <ul className="relative mt-5 flex flex-col gap-4">
                      {p.features.slice(0, 5).map((f) => (
                        <li key={f.title} className="flex items-start gap-3">
                          <span className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center" style={{ background: "rgba(246,247,251,0.08)", color: p.brand.accent }}>
                            <f.icon size={17} />
                          </span>
                          <span>
                            <span className="block text-sm font-medium" style={{ color: "#F6F7FB" }}>{f.title}</span>
                            <span className="block text-xs mt-0.5 leading-relaxed" style={{ color: "rgba(246,247,251,0.7)" }}>{f.text}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>

          {/* Beyond the catalogue */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <motion.div {...fadeUp(0.1)}>
              <Link href="/services" className="group flex h-full items-start gap-5 rounded-3xl p-8 transition-colors hover:border-[var(--blue)]" style={{ border: "1px solid var(--hairline)", background: "var(--surface)" }}>
                <span className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center" style={{ background: "rgba(30,63,168,0.1)", color: "var(--blue)" }}>
                  <Wrench size={22} />
                </span>
                <span>
                  <span className="block text-xl" style={{ color: "var(--white)", fontFamily: "var(--font-syne)" }}>Need something built for you?</span>
                  <span className="block mt-2 text-sm leading-relaxed" style={{ color: "var(--gray)" }}>We design and build custom software, AI and cloud platforms around how your organisation works.</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--blue)" }}>
                    Explore services <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            </motion.div>
            <motion.div {...fadeUp(0.18)}>
              <Link href="/work" className="group flex h-full items-start gap-5 rounded-3xl p-8 transition-colors hover:border-[var(--blue)]" style={{ border: "1px solid var(--hairline)", background: "var(--surface)" }}>
                <span className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center" style={{ background: "rgba(30,63,168,0.1)", color: "var(--blue)" }}>
                  <ArrowUpRight size={22} />
                </span>
                <span>
                  <span className="block text-xl" style={{ color: "var(--white)", fontFamily: "var(--font-syne)" }}>See our completed work</span>
                  <span className="block mt-2 text-sm leading-relaxed" style={{ color: "var(--gray)" }}>Clients we&rsquo;ve built for, with screenshots, live links and project details.</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--blue)" }}>
                    View our work <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
