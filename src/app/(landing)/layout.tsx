import LandingHeader from "@/components/navigation/header/LandingHeader"
import Footer from "@/features/landing/Footer";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="">
        <LandingHeader/>
         <div>{children}</div>
        <Footer/>
    </div>
  );
}