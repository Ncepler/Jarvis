import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/Marquee";
import { PinnedLogo } from "@/components/PinnedLogo";
import { SmoothScroll } from "@/components/SmoothScroll";
import { StickyStartButton } from "@/components/StickyStartButton";
import { About } from "@/components/sections/About";
import { AllSites } from "@/components/sections/AllSites";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { DoTheMath } from "@/components/sections/DoTheMath";
import { Faq } from "@/components/sections/Faq";
import { FullBleed } from "@/components/sections/FullBleed";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";
import { Services } from "@/components/sections/Services";
import { TemplateVsPersonalized } from "@/components/sections/TemplateVsPersonalized";
import { WorkNote } from "@/components/sections/WorkNote";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <PinnedLogo />
      <StickyStartButton />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Gallery />
        <WorkNote />
        <TemplateVsPersonalized />
        <FullBleed />
        <HowItWorks />
        <DoTheMath />
        <AllSites />
        <Pricing />
        <About />
        <Faq />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
