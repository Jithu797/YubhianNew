import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrainingContent from "./TrainingContent";

export const metadata: Metadata = {
  alternates: { canonical: "/training" },
  title: "Training",
  description:
    "Skill training, workshops, Faculty Development Programmes (FDP), research and development, and internships with real-time AI projects for AICTE-approved colleges and universities, by Yubhian Technologies.",
};

export default function TrainingPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--navy)" }}>
        <TrainingContent />
      </main>
      <Footer />
    </>
  );
}
