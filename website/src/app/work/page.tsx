import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTABanner from "@/components/CTABanner";
import WorkContent from "./WorkContent";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Clients Yubhian Technologies has built for and projects we've delivered — AI, web, mobile and cloud work from Andhra Pradesh, India.",
};

export default function WorkPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--navy)" }}>
        <WorkContent />
        <div className="pt-24">
          <CTABanner standalone />
        </div>
      </main>
      <Footer />
    </>
  );
}
