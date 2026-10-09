import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Yubhian Technologies LLP collects, uses, and protects your personal data.",
};

const SECTIONS = [
  {
    title: "Information We Collect",
    body: "We collect information you provide directly to us, such as your name, email address, phone number, and company details when you fill out a contact form, join our waitlist, or subscribe to our newsletter. We also collect limited technical information automatically, such as your browser type, device information, and pages visited, to help us understand how our website is used.",
  },
  {
    title: "How We Use Your Information",
    body: "We use the information we collect to respond to your inquiries, provide the services you request, improve our website and offerings, send you updates you've opted into, and comply with legal obligations. We do not sell your personal data to third parties.",
  },
  {
    title: "Cookies",
    body: "Our website uses cookies to keep the site secure, remember your preferences, and understand how visitors use our site. You can manage your cookie preferences at any time — see our Cookie Policy for details. When you make a cookie consent choice, we record that choice together with your IP address, browser user-agent, country, a randomly generated first-party visitor ID, and the version of this policy you agreed to. This is kept as proof that consent was obtained, as required for compliance. If you accept analytics cookies we also record limited context about that visit — the page you consented on, the referring site, your browser language, approximate region/city, timezone and screen size. If you decline, none of that additional context is stored. The visitor ID is random, is not derived from any personal information, is never shared with third parties, and cannot be used to track you across other websites. These records are readable only by our administrators and are never sold or used for advertising.",
  },
  {
    title: "Data Sharing",
    body: "We may share your information with trusted service providers who help us operate our website and deliver our services (for example, hosting and email delivery providers), under agreements that require them to protect your data. We do not share your information with third parties for their own marketing purposes.",
  },
  {
    title: "Data Security",
    body: "We take reasonable technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
  },
  {
    title: "Your Rights",
    body: "You may request access to, correction of, or deletion of your personal data at any time by contacting us at info@yubhiantechnologies.in. You may also withdraw consent for optional data processing, such as newsletter communications, at any time.",
  },
  {
    title: "Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.",
  },
  {
    title: "Contact Us",
    body: "If you have questions about this Privacy Policy or how we handle your data, contact us at info@yubhiantechnologies.in or write to us at Kaikaluru, Andhra Pradesh, India.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="page-top px-6 pb-24" style={{ background: "var(--navy)" }}>
        <div className="max-w-3xl mx-auto">
          <p className="kicker mb-5">Legal</p>
          <h1 className="page-title mb-5" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
            Privacy Policy
          </h1>
          <p className="text-sm mb-14" style={{ color: "var(--gray)" }}>Last updated: July 2026</p>

          <div className="flex flex-col gap-10">
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
                  {s.title}
                </h2>
                <p className="text-sm font-normal leading-relaxed" style={{ color: "var(--gray2)" }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
