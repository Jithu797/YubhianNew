import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, MapPin, Briefcase, Check } from "lucide-react";
import { getCareerBySlugRemote } from "@/lib/careers-data";
import CareerApplyForm from "@/components/CareerApplyForm";

// No static list to seed from — open positions are Firestore-only and change often,
// so every slug renders on demand (dynamicParams defaults to true) rather than at build time.
export const revalidate = 60;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const career = await getCareerBySlugRemote(slug);
  if (!career) return {};
  return {
    title: career.title,
    description: career.description,
  };
}

export default async function CareerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const career = await getCareerBySlugRemote(slug);
  if (!career) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-32 px-6 pb-24" style={{ background: "var(--navy)" }}>
        <div className="max-w-5xl mx-auto">
          <Link href="/careers" className="inline-flex items-center gap-2 text-sm font-medium mb-8" style={{ color: "var(--gray)" }}>
            <ArrowLeft size={15} /> Back to Careers
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
            {/* Job details */}
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
                  {career.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm" style={{ color: "var(--gray)" }}>
                  {career.department && (
                    <span className="flex items-center gap-1.5"><Briefcase size={13} /> {career.department}</span>
                  )}
                  {career.location && (
                    <span className="flex items-center gap-1.5"><MapPin size={13} /> {career.location}</span>
                  )}
                  <span className="px-2.5 py-1 rounded-full text-xs" style={{ background: "rgba(37,99,235,0.15)", color: "var(--blue2)" }}>{career.type}</span>
                </div>
              </div>

              <p className="text-sm leading-relaxed font-light whitespace-pre-wrap" style={{ color: "var(--gray2)" }}>
                {career.description}
              </p>

              {career.requirements.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>What we&apos;re looking for</h2>
                  <div className="flex flex-col gap-3">
                    {career.requirements.map((req) => (
                      <div key={req} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(6,182,212,0.15)" }}>
                          <Check size={11} style={{ color: "var(--cyan)" }} />
                        </span>
                        <p className="text-sm font-light" style={{ color: "var(--gray2)" }}>{req}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Apply form */}
            <div className="rounded-2xl p-6 lg:p-8 h-max" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <h2 className="text-lg font-bold mb-6" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>Apply for this role</h2>
              <CareerApplyForm careerSlug={career.slug} careerTitle={career.title} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
