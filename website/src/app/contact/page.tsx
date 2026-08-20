import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Yubhian Technologies LLP — tell us about your project and we'll get back to you within 24 hours.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="page-top px-6 pb-24" style={{ background: "var(--navy)" }}>
        <div className="max-w-6xl mx-auto text-center lg:text-right mb-16">
          <p className="text-sm font-medium mb-3 uppercase tracking-widest" style={{ color: "var(--cyan)" }}>Get in Touch</p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-5" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
            Let&apos;s build something great
          </h1>
          <p className="text-lg font-normal max-w-xl mx-auto lg:ml-auto lg:mr-0" style={{ color: "var(--gray)" }}>
            Tell us about your project and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left — info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="rounded-2xl p-6 flex items-start gap-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(37,99,235,0.15)" }}>
                <Mail size={18} style={{ color: "var(--blue)" }} />
              </div>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>Email</p>
                <a href="mailto:info@yubhiantechnologies.in" className="text-sm hover:text-[var(--white)] transition-colors" style={{ color: "var(--gray)" }}>
                  info@yubhiantechnologies.in
                </a>
              </div>
            </div>

            <div className="rounded-2xl p-6 flex items-start gap-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(6,182,212,0.15)" }}>
                <MapPin size={18} style={{ color: "var(--cyan)" }} />
              </div>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>Location</p>
                <p className="text-sm" style={{ color: "var(--gray)" }}>Kaikaluru, Andhra Pradesh, India</p>
              </div>
            </div>

            <div className="rounded-2xl p-6 flex items-start gap-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(245,158,11,0.15)" }}>
                <Clock size={18} style={{ color: "var(--gold)" }} />
              </div>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>Response Time</p>
                <p className="text-sm" style={{ color: "var(--gray)" }}>Within 24 hours, Mon–Sat</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", minHeight: 240 }}>
              <iframe
                title="Yubhian Technologies location — Kaikaluru, Andhra Pradesh"
                src="https://www.google.com/maps?q=Kaikaluru,+Andhra+Pradesh,+India&output=embed"
                width="100%"
                height="240"
                style={{ border: 0, filter: "grayscale(0.15) contrast(0.95)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3 rounded-2xl p-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
