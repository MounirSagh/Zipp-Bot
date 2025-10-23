import Navbar from "@/components/Landing/navbar";
import Hero from "@/components/Landing/Hero";
import InternationalSection from "@/components/Landing/InternationalSection";
import ScaleSection from "@/components/Landing/ScaleSection";
import AdaptSection from "@/components/Landing/AdaptSection";
import IntelligentSection from "@/components/Landing/IntelligentSection";
import DemoSection from "@/components/Landing/DemoSection";
import FAQSection from "@/components/Landing/FAQSection";
import ContactSection from "@/components/Landing/ContactSection";
import FooterSection from "@/components/Landing/FooterSection";

function Landing() {
  return (
    <div className="bg-black min-h-screen scroll-smooth">
      <Navbar />
      <Hero />
      <InternationalSection />
      <ScaleSection />
      <AdaptSection />
      <IntelligentSection />
      <DemoSection />
      <FAQSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
}

export default Landing;
