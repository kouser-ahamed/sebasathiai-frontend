import FeaturesSection from "@/components/homepage/FeaturesSection";
import HeroSection from "@/components/homepage/HeroSection";
import TopRatedDoctors from "@/components/homepage/TopRatedDoctors";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <TopRatedDoctors />
      <FeaturesSection />
    </div>
  );
}
