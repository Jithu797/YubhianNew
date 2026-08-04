import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogListing from "./BlogListing";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description: "Insights on AI, web development, and building technology products — from the Yubhian Technologies team.",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 px-6 pb-24" style={{ background: "var(--navy)" }}>
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-sm font-medium mb-3 uppercase tracking-widest" style={{ color: "var(--cyan)" }}>Insights</p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-5" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
            From the Yubhian blog
          </h1>
          <p className="text-lg font-light" style={{ color: "var(--gray)" }}>
            Thoughts on AI, web development, and building technology products from Andhra Pradesh.
          </p>
        </div>
        <BlogListing />
      </main>
      <Footer />
    </>
  );
}
