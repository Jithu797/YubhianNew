import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductContent from "./ProductContent";

export const metadata: Metadata = {
  title: "YuCampus — accreditation-ready, all year round",
  description: "YuCampus by Yubhian helps Indian colleges and universities stay ready for NAAC, NBA and NIRF all year — faculty upload evidence, YuCampus organises it by criteria and generates SSR, AQAR and SAR reports. Free pilots for early colleges.",
};

export default function ProductPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--navy)" }}>
        <ProductContent />
      </main>
      <Footer />
    </>
  );
}
