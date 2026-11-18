import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductsContent from "./ProductsContent";

export const metadata: Metadata = {
  alternates: { canonical: "/products" },
  title: "Products",
  description: "Software products built by Yubhian Technologies — YuCampus, which keeps Indian colleges accreditation-ready for NAAC, NBA and NIRF all year round, and YuProof, tamper-proof certificates verified in seconds.",
};

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--navy)" }}>
        <ProductsContent />
      </main>
      <Footer />
    </>
  );
}
