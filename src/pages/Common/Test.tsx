import Navbar from "@/components/Landing/navbar";
import Hero from "@/components/Landing/Hero";
// import InternationalSection from "@/components/Landing/InternationalSection";
import ScaleSection from "@/components/Landing/ScaleSection";
import AdaptSection from "@/components/Landing/AdaptSection";
import IntelligentSection from "@/components/Landing/IntelligentSection";
import DemoSection from "@/components/Landing/DemoSection";
import FAQSection from "@/components/Landing/FAQSection";
import ContactSection from "@/components/Landing/ContactSection";
import FooterSection from "@/components/Landing/FooterSection";

function Landing() {
  return (
    <div className="bg-white min-h-screen scroll-smooth">
      <Navbar />
      <div className="border mx-40 mt-18 border-neutral-300 relative z-0">
        <Hero />
        {/* <InternationalSection /> */}
        <IntelligentSection />
        <AdaptSection />
        <ScaleSection />
        <DemoSection />
        <FAQSection />
        <ContactSection />
        <FooterSection />
      </div>

      {/* <iframe
        src="https://embed-orcin.vercel.app/embed"
        className="fixed -bottom-72 right-4 w-80 h-96 rounded-lg shadow-lg  z-50"
        allow="microphone *; camera *; autoplay *; encrypted-media *; fullscreen *"
      ></iframe> */}
    </div>
  );
}

export default Landing;
