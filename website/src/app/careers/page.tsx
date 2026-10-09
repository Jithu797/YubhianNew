import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { ArrowRight, MapPin, Briefcase, Users } from "lucide-react";
import { getAllCareers } from "@/lib/careers-data";

// Revalidate periodically so postings added/edited in the admin CMS show up without a full redeploy.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Careers",
  description: "Open positions at Yubhian Technologies LLP — join our team building AI, web, mobile, and blockchain products.",
};

export default async function CareersPage() {
  const careers = await getAllCareers();
  return (
    <>
      <Navbar />
      <PageHero
        kicker="Join us"
        title={<>Build what&rsquo;s <em className="serif-accent">next</em> with us</>}
        subtitle="Work on real products with a small, senior team that ships — from Kaikaluru, Andhra Pradesh."
        page="careers"
        ghost={<Users size={380} strokeWidth={0.7} />}
      />
      <main className="px-6 pt-16 pb-24 min-h-[40vh]" style={{ background: "var(--navy)" }}>

        {careers.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center rounded-2xl p-12" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-sm" style={{ color: "var(--gray)" }}>
              No open positions right now. Check back soon, or reach out via our{" "}
              <Link href="/contact" className="underline" style={{ color: "var(--cyan)" }}>contact page</Link> to introduce yourself.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {careers.map((c) => (
              <Link
                key={c.slug}
                href={`/careers/${c.slug}`}
                className="group flex items-center justify-between gap-4 rounded-2xl p-6 transition-colors duration-300"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div>
                  <h2 className="text-lg font-bold mb-1.5" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>{c.title}</h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: "var(--gray)" }}>
                    {c.department && (
                      <span className="flex items-center gap-1.5"><Briefcase size={12} /> {c.department}</span>
                    )}
                    {c.location && (
                      <span className="flex items-center gap-1.5"><MapPin size={12} /> {c.location}</span>
                    )}
                    <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(30,63,168,0.15)", color: "var(--blue2)" }}>{c.type}</span>
                  </div>
                </div>
                <ArrowRight size={18} className="shrink-0 transition-transform group-hover:translate-x-1" style={{ color: "var(--cyan)" }} />
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
