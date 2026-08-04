import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ProcessSection from "@/components/ProcessSection";
import Stats from "@/components/Stats";
import ProductSpotlight from "@/components/ProductSpotlight";
import WhyUs from "@/components/WhyUs";
import SolutionsByUseCase from "@/components/SolutionsByUseCase";
import Testimonials from "@/components/Testimonials";
import ClientsShowcase from "@/components/ClientsShowcase";
import BlogPreview from "@/components/BlogPreview";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <ProcessSection />
        <Stats />
        <ProductSpotlight />
        <WhyUs />
        <SolutionsByUseCase />
        <Testimonials />
        <ClientsShowcase />
        <BlogPreview />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
