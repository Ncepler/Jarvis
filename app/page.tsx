import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/Marquee";
import { PinnedLogo } from "@/components/PinnedLogo";
import { SmoothScroll } from "@/components/SmoothScroll";
import { StickyStartButton } from "@/components/StickyStartButton";
import { About } from "@/components/sections/About";
import { ClientSites } from "@/components/sections/ClientSites";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { DoTheMath } from "@/components/sections/DoTheMath";
import { Faq } from "@/components/sections/Faq";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";
import { Services } from "@/components/sections/Services";
import { WorkNote } from "@/components/sections/WorkNote";
import { listClientSites } from "@/lib/clientSites";

// A server component so the "Out in the world" gallery can read real client
// sites out of Supabase at request time (Noah adds rows by hand — no
// redeploy needed for them to show up).
export default async function Home() {
  const clientSites = await listClientSites();

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
        <ClientSites sites={clientSites} />
        <HowItWorks />
        <DoTheMath />
        <Pricing />
        <About />
        <Faq />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
