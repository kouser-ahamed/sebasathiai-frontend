
import FeaturesSection from "@/components/homepage/FeaturesSection";
import HeroSection from "@/components/homepage/HeroSection";
import PatientReviewsSection from "@/components/homepage/PatientReviewsSection";
import TopRatedDoctors from "@/components/homepage/TopRatedDoctors";


export default function Home() {
  return (
    <div>
      <HeroSection />
      <TopRatedDoctors />
      <FeaturesSection />
      
      <PatientReviewsSection />
    </div>
  );
}
