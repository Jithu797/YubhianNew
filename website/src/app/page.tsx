import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ProcessSection from "@/components/ProcessSection";
import Stats from "@/components/Stats";
import StackSection from "@/components/StackSection";
import ProductSpotlight from "@/components/ProductSpotlight";
import WhyUs from "@/components/WhyUs";
import SolutionsByUseCase from "@/components/SolutionsByUseCase";
import Testimonials from "@/components/Testimonials";
import ClientsShowcase from "@/components/ClientsShowcase";
import BlogPreview from "@/components/BlogPreview";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";
import ChapterIndex from "@/components/ChapterIndex";
import ScrollStage from "@/components/ScrollStage";
import Chapter from "@/components/Chapter";

// The homepage is told as a scroll story: ScrollStage paints a cinematic world behind
// the page, and each <Chapter> (transparent) opens with a giant title over its world
// before its content floats past on a paper panel. Sections outside chapters are
// opaque "interludes" that cover the stage. ChapterIndex is the report-style tab bar.
export default function Home() {
  return (
    <>
      <ScrollStage />
      <Navbar />
      <main className="relative z-[1]">
        <Hero />

        <Chapter world="services" title={<>What we <em className="serif-accent">build</em></>} subtitle="AI, software & cloud — end to end">
          <Services />
        </Chapter>

        <Chapter world="process" title={<>How we <em className="serif-accent">work</em></>} subtitle="Idea → design → build → launch → support">
          <ProcessSection />
        </Chapter>

        <Chapter world="numbers" id="numbers" titlePlacement="top" title={<>By the <em className="serif-accent">numbers</em></>} subtitle="Our first year, measured">
          <Stats />
        </Chapter>

        <StackSection />

        <div className="relative" style={{ background: "var(--navy)" }}>
          <ProductSpotlight />
        </div>

        <Chapter world="why-us" titlePlacement="top" title={<>Why <em className="serif-accent">Yubhian</em></>} subtitle="Built in Andhra Pradesh, for the world">
          <WhyUs />
        </Chapter>

        <div className="relative" style={{ background: "var(--navy)" }}>
          <SolutionsByUseCase />
          <Testimonials />
          <ClientsShowcase />
          <BlogPreview />
        </div>

        <CTABanner />
      </main>
      <div className="relative z-[1] md:pb-14" style={{ background: "var(--navy)" }}>
        <Footer />
      </div>
      <ChapterIndex />
    </>
  );
}
