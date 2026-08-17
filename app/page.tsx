import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/Marquee";
import { PinnedLogo } from "@/components/PinnedLogo";
import { SmoothScroll } from "@/components/SmoothScroll";
import { StickyStartButton } from "@/components/StickyStartButton";
import { About } from "@/components/sections/About";
import { AllSites } from "@/components/sections/AllSites";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Contact } from "@/components/sections/Contact";
import { DoTheMath } from "@/components/sections/DoTheMath";
import { Faq } from "@/components/sections/Faq";
import { FullBleed } from "@/components/sections/FullBleed";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Services } from "@/components/sections/Services";

export default function Home() {
  // decided server-side so the service role key never reaches the client;
  // without both vars the form falls back to single-step mailto (§6.7)
  const hasBackend = Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
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
        <FullBleed />
        <HowItWorks />
        <DoTheMath />
        <AllSites />
        <About />
        <Faq />
        <ClosingCta />
        <Contact hasBackend={hasBackend} />
      </main>
      <Footer />
    </>
  );
}
