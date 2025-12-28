import Adora3HeroBanner from "@/components/Adora3HeroBanner";
import MainContactSection from "@/features/contact/ContactSection";
import SupportContactSection from "@/features/contact/SupportContactSection";

export default function ContactPage () {
    return (
        <>
          <SupportContactSection />
          <MainContactSection/>
          <Adora3HeroBanner />
        </>
    )
}