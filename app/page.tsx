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
  // decided server-side so the service role key never reaches the client;
  // without both vars the form falls back to single-step mailto (§6.7)
  const hasBackend = Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
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
        <Contact hasBackend={hasBackend} />
      </main>
      <Footer />
    </>
  );
}
