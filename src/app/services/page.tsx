import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTABanner from "@/components/CTABanner";
import TiltServiceCard from "@/components/TiltServiceCard";
import { getAllServices } from "@/lib/services-data";

// Revalidate periodically so services added/edited in the admin CMS show up without a full redeploy.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services",
  description: "End-to-end technology services from Yubhian Technologies — AI & machine learning, generative AI, custom software, web and mobile development, cloud, DevOps, UI/UX, data analytics, blockchain, and IT consulting.",
};

export default async function ServicesPage() {
  const services = await getAllServices();
  return (
    <>
      <Navbar />
      <main className="pt-32 px-6 pb-8" style={{ background: "var(--navy)" }}>
        <div className="max-w-4xl mx-auto text-center mb-16">
          <p className="text-sm font-medium mb-3 uppercase tracking-widest" style={{ color: "var(--cyan)" }}>What We Do</p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-5" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
            Our Services
          </h1>
          <p className="text-lg font-light" style={{ color: "var(--gray)" }}>
            End-to-end technology services built for modern enterprises — from first prototype to production scale.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pb-16">
          {services.map((s) => (
            <TiltServiceCard
              key={s.slug}
              slug={s.slug}
              title={s.title}
              longDesc={s.longDesc}
              techStack={s.techStack}
              accent={s.accent}
              icon={<s.icon size={26} style={{ color: s.accent }} />}
            />
          ))}
        </div>
      </main>
      <CTABanner />
      <Footer />
    </>
  );
}
