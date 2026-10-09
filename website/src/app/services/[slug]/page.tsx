import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { ArrowRight, Check } from "lucide-react";
import { SERVICES, getServiceBySlugRemote } from "@/lib/services-data";

// Revalidate periodically so services added/edited in the admin CMS show up without a
// full redeploy. Static params below are just build-time hints — Next.js still renders
// any other slug on demand (dynamicParams defaults to true).
export const revalidate = 60;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlugRemote(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.longDesc,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlugRemote(slug);
  if (!service) notFound();

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--navy)" }}>
        <PageHero
          kicker={service.category}
          title={service.title}
          subtitle={service.shortDesc}
          page={`service-${service.slug}`}
          ghost={<service.icon size={380} strokeWidth={0.7} />}
        />

        {/* Overview — the long description as an editorial lead */}
        <section className="px-6 pt-20 pb-16">
          <p
            className="max-w-4xl mx-auto"
            style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.3rem, 2.4vw, 1.9rem)", lineHeight: 1.4, color: "var(--white)" }}
          >
            {service.longDesc}
          </p>
        </section>

        {/* Process */}
        <section className="px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="subsection-title mb-10 text-center" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
              Our Process
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {service.process.map((step, i) => (
                <div key={step} className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mb-3"
                    style={{ background: service.accent + "20", color: service.accent, fontFamily: "var(--font-syne)" }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm font-medium leading-snug" style={{ color: "var(--white)" }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech stack */}
        <section className="px-6 pb-20" style={{ background: "var(--navy2)" }}>
          <div className="max-w-4xl mx-auto py-16 text-center">
            <h2 className="subsection-title mb-8" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
              Technology We Use
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {service.techStack.map((t) => (
                <span
                  key={t}
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{ background: service.accent + "15", color: service.accent, border: `1px solid ${service.accent}30` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Why choose us for this */}
        <section className="px-6 pb-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="subsection-title mb-8 text-center" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
              Why Yubhian for {service.title}
            </h2>
            <div className="flex flex-col gap-4">
              {[
                "Full-stack team under one roof — no handoffs, no delays.",
                "Fixed-scope pricing with no surprise invoices.",
                "3 months of free post-launch support on every engagement.",
                "Direct access to the engineers building your product.",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: service.accent + "20" }}>
                    <Check size={13} style={{ color: service.accent }} />
                  </span>
                  <p className="text-sm font-normal" style={{ color: "var(--gray2)" }}>{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-24 text-center">
          <Link
            href="/contact"
            className="btn-shine inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-medium transition-all duration-300 hover:-translate-y-1"
            style={{ background: "var(--grad)", boxShadow: "0 4px 24px rgba(30,63,168,0.35)" }}
          >
            Start Your {service.title} Project <ArrowRight size={16} />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
