import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Yubhian Technologies LLP uses cookies and how you can manage your preferences.",
};

const COOKIE_TYPES = [
  {
    title: "Necessary Cookies",
    body: "These cookies are essential for the website to function properly — for example, remembering your cookie preferences and keeping the site secure. They cannot be disabled.",
  },
  {
    title: "Analytics Cookies",
    body: "These cookies help us understand how visitors interact with our website, such as which pages are visited most often, so we can improve the site over time. You can opt out of these at any time.",
  },
  {
    title: "Marketing Cookies",
    body: "These cookies are used to deliver content and offers that are more relevant to you and your interests. You can opt out of these at any time without affecting core site functionality.",
  },
];

export default function CookiePolicyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 px-6 pb-24" style={{ background: "var(--navy)" }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium mb-3 uppercase tracking-widest" style={{ color: "var(--cyan)" }}>Legal</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
            Cookie Policy
          </h1>
          <p className="text-sm mb-14" style={{ color: "var(--gray)" }}>Last updated: July 2026</p>

          <div className="flex flex-col gap-10">
            <div>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
                What Are Cookies
              </h2>
              <p className="text-sm font-light leading-relaxed" style={{ color: "var(--gray2)" }}>
                Cookies are small text files placed on your device when you visit a website. They help the website
                remember information about your visit, which can make it easier to use the site and more useful
                to you.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
                Types of Cookies We Use
              </h2>
              <div className="flex flex-col gap-5">
                {COOKIE_TYPES.map((c) => (
                  <div key={c.title}>
                    <h3 className="text-sm font-semibold mb-1.5" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
                      {c.title}
                    </h3>
                    <p className="text-sm font-light leading-relaxed" style={{ color: "var(--gray2)" }}>{c.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
                Managing Your Preferences
              </h2>
              <p className="text-sm font-light leading-relaxed" style={{ color: "var(--gray2)" }}>
                You can accept all cookies, reject non-essential cookies, or customize your preferences at any time
                using the &quot;Cookie Settings&quot; link in our website footer.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
                Contact Us
              </h2>
              <p className="text-sm font-light leading-relaxed" style={{ color: "var(--gray2)" }}>
                If you have questions about this Cookie Policy, contact us at info@yubhiantechnologies.in.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
