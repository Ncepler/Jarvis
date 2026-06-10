import { Footer } from "@/components/Footer";
import { PinnedLogo } from "@/components/PinnedLogo";
import { SmoothScroll } from "@/components/SmoothScroll";
import { About } from "@/components/sections/About";
import { AllSites } from "@/components/sections/AllSites";
import { Contact } from "@/components/sections/Contact";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <PinnedLogo />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <AllSites />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
