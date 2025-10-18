import PreviewHeader from "../../components/preview/PreviewHeader";
import Footer from "../../components/Footer";
import HeroSection from "../../components/preview/HeroSection";
import AboutSection from "../../components/preview/AboutSection";
import HowSection from "../../components/preview/HowSection";
import FeaturesSection from "../../components/preview/FeaturesSection";
import TrustSection from "../../components/preview/TrustSection";
import TechSection from "../../components/preview/TechSection";
import UseCasesSection from "../../components/preview/UseCasesSection";
import RoadmapSection from "../../components/preview/RoadmapSection";
import FAQSection from "../../components/preview/FAQSection";
import CTASection from "../../components/preview/CTASection";

export default function PreviewPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <PreviewHeader />
      <main className="flex-1 w-full">
        <HeroSection />
        <AboutSection />
        <HowSection />
        <FeaturesSection />
        <TrustSection />
        <TechSection />
        <UseCasesSection />
        <RoadmapSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
