import AIHealthAssistantSection from "@/components/homepage/AIHealthAssistantSection";
import FAQSection from "@/components/homepage/FAQSection";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import HealthcareStatsSection from "@/components/homepage/HealthcareStatsSection";
import HeroSection from "@/components/homepage/HeroSection";
import HowItWorksSection from "@/components/homepage/HowItWorksSection";
import PatientReviewsSection from "@/components/homepage/PatientReviewsSection";
import TopRatedDoctors from "@/components/homepage/TopRatedDoctors";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <TopRatedDoctors />

      <AIHealthAssistantSection />

      <FeaturesSection />

      <HowItWorksSection />

      <HealthcareStatsSection />

      <PatientReviewsSection />

      <FAQSection />
    </div>
  );
}
