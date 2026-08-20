import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductContent from "./ProductContent";

export const metadata: Metadata = {
  title: "Our Product",
  description: "Yubhian Technologies is building its own flagship product — designed to solve a real problem for businesses across India. Join the waitlist.",
};

export default function ProductPage() {
  return (
    <>
      <Navbar />
      <main className="page-top" style={{ background: "var(--navy)" }}>
        <ProductContent />
      </main>
      <Footer />
    </>
  );
}
