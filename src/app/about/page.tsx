import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story, mission, and people behind Yubhian Technologies LLP — an enterprise IT and product company based in Andhra Pradesh, India.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32" style={{ background: "var(--navy)" }}>
        <AboutContent />
      </main>
      <Footer />
    </>
  );
}
