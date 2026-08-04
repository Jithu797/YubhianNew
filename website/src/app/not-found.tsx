import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden"
        style={{ background: "var(--navy)" }}
      >
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.18) 0%, transparent 70%)" }}
        />
        <div className="relative">
          <p
            className="text-[80px] sm:text-[120px] md:text-[180px] font-medium leading-none grad-text"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            404
          </p>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 -mt-4" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
            Page not found
          </h1>
          <p className="text-sm font-light mb-8 max-w-sm mx-auto" style={{ color: "var(--gray)" }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="btn-shine inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "var(--grad)", boxShadow: "0 4px 24px rgba(37,99,235,0.35)" }}
          >
            <ArrowLeft size={15} /> Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
