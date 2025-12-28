import Adora3HeroBanner from "@/components/Adora3HeroBanner";
import FAQSection from "@/features/pricing/FAQSection";
import PricingHeroSection from "@/features/pricing/PricingHeroSection";
import PricingPlansSection from "@/features/pricing/PricingPlansSection";

export default function PricingPage () {
    return (
        <>
          <PricingHeroSection/>
          <PricingPlansSection/>
          <FAQSection/>
          <Adora3HeroBanner/>
        </>
    )
}