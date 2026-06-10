import { Logo } from "@/components/Logo";
import { SITE } from "@/lib/site";

// Scaffold placeholder — the real page shell lands in build step 2.
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <Logo size={36} />
      <h1 className="font-display text-display">{SITE.name}</h1>
      <p className="text-muted">{SITE.region}</p>
    </main>
  );
}
