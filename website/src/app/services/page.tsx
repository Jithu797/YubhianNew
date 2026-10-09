import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTABanner from "@/components/CTABanner";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import PageHero from "@/components/PageHero";
import PracticeIndex, { type Practice } from "@/components/PracticeIndex";
import { getAllServices, SERVICE_CATEGORIES } from "@/lib/services-data";

// Revalidate periodically so services added/edited in the admin CMS show up without a full redeploy.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services",
  description: "End-to-end technology services from Yubhian Technologies — AI & machine learning, generative AI, custom software, web and mobile development, cloud, DevOps, UI/UX, data analytics, blockchain, and IT consulting.",
};

// One line per practice for the sticky practice card.
const PRACTICE_BLURBS: Record<string, string> = {
  "AI & Automation": "Models, copilots and automations that do real work.",
  "Software Development": "Web, mobile, SaaS and enterprise products, end to end.",
  "Cloud & Infrastructure": "Cloud, DevOps and integrations that stay up.",
  "Design & Data": "Interfaces people enjoy and data leaders can act on.",
  "Blockchain & Consulting": "Web3 builds, strategy, and support after launch.",
};

export default async function ServicesPage() {
  const services = await getAllServices();
  const practices: Practice[] = SERVICE_CATEGORIES.map((name, i) => ({
    id: `practice-${i}`,
    name,
    blurb: PRACTICE_BLURBS[name] ?? "",
    count: services.filter((s) => s.category === name).length,
  })).filter((p) => p.count > 0);
  return (
    <>
      <Navbar />
      <PageHero
        kicker="What we do"
        title={<>Our <em className="serif-accent">services</em></>}
        subtitle={`${services.length} services across AI, software, cloud, design and consulting — from first prototype to production scale.`}
        page="services"
        ghost={<Layers size={380} strokeWidth={0.7} />}
      />
      <main className="px-6 pt-16 pb-8" style={{ background: "var(--navy)" }}>

        {/* Report-style index: a sticky practice card beside one ruled list per practice */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[300px_minmax(0,1fr)] gap-12 xl:gap-16 pb-20">
          <div className="hidden lg:block">
            <PracticeIndex practices={practices} />
          </div>
          <div className="flex flex-col gap-20 min-w-0">
          {SERVICE_CATEGORIES.map((category, ci) => {
            const items = services.filter((s) => s.category === category);
            if (items.length === 0) return null;
            return (
              <section key={category} id={`practice-${ci}`} aria-labelledby={`practice-${ci}-title`} style={{ scrollMarginTop: "calc(var(--nav-height) + 24px)" }}>
                <div className="flex items-end justify-between gap-4 pb-5" style={{ borderBottom: "1px solid var(--ink)" }}>
                  <h2 id={`practice-${ci}-title`} className="subsection-title" style={{ color: "var(--white)" }}>
                    {category}
                  </h2>
                  <span className="text-sm tabular-nums shrink-0" style={{ color: "var(--gray)" }}>
                    {String(ci + 1).padStart(2, "0")} · {items.length} {items.length === 1 ? "service" : "services"}
                  </span>
                </div>
                <ul>
                  {items.map((s) => {
                    return (
                      <li key={s.slug} style={{ borderBottom: "1px solid var(--hairline)" }}>
                        <Link
                          href={`/services/${s.slug}`}
                          className="group grid grid-cols-[72px_minmax(0,1fr)] sm:grid-cols-[96px_minmax(0,1fr)_auto] items-center gap-5 sm:gap-8 py-6 transition-colors hover:bg-[rgba(30,63,168,0.04)]"
                        >
                          <div className="relative aspect-[3/4] overflow-hidden" style={{ background: s.accent + "18" }}>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <s.icon size={28} style={{ color: s.accent }} />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-xl sm:text-2xl leading-snug transition-colors group-hover:text-[var(--blue)]" style={{ color: "var(--white)" }}>
                              {s.title}
                            </h3>
                            <p className="mt-1.5 text-sm sm:text-base" style={{ color: "var(--gray)" }}>{s.shortDesc}</p>
                            <p className="mt-2 text-xs" style={{ color: "var(--gray)" }}>{s.techStack.slice(0, 5).join(" · ")}</p>
                          </div>
                          <span
                            className="hidden sm:flex w-11 h-11 rounded-full items-center justify-center transition-all duration-300 group-hover:-rotate-45 group-hover:bg-[var(--lime)]"
                            style={{ border: "1px solid var(--hairline)", color: "var(--ink)" }}
                          >
                            <ArrowRight size={16} />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
          </div>
        </div>
      </main>
      <CTABanner standalone />
      <Footer />
    </>
  );
}
