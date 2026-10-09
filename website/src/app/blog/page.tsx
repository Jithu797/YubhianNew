import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { PenLine } from "lucide-react";
import BlogListing from "./BlogListing";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description: "Insights on AI, web development, and building technology products — from the Yubhian Technologies team.",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <PageHero
        kicker="Insights"
        title={<>From the Yubhian <em className="serif-accent">blog</em></>}
        subtitle="Notes on AI, web development, and building technology products from Andhra Pradesh."
        page="blog"
        ghost={<PenLine size={380} strokeWidth={0.7} />}
      />
      <main className="px-6 pt-16 pb-24" style={{ background: "var(--navy)" }}>
        <BlogListing />
      </main>
      <Footer />
    </>
  );
}
