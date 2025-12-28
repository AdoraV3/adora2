import CTASection from "@/features/landing/CTASection";
import FeaturesSection from "@/features/landing/Feature";
import HeroSection from "@/features/landing/Hero";
import HowAdoraWorks from "@/features/landing/HowAdoraWorks";
import SupportAreasSection from "@/features/landing/SupportAreasSection";
import VideoTutorialSection from "@/features/landing/VideoTutorialSection";

export default function HomePage () {
    return (
        <>
          <HeroSection/>
          <FeaturesSection/>
          <HowAdoraWorks/>
          <SupportAreasSection/>
          <CTASection/>
          <VideoTutorialSection/>
        </>
    )
}