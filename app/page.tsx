import { Footer } from "@/components/Footer";
import { PinnedLogo } from "@/components/PinnedLogo";
import { SmoothScroll } from "@/components/SmoothScroll";
import { About } from "@/components/sections/About";
import { AllSites } from "@/components/sections/AllSites";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Services } from "@/components/sections/Services";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <PinnedLogo />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <Gallery />
        <AllSites />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
