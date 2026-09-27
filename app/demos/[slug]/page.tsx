import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { demos } from "@/components/demos";
import { DemoRoute } from "@/components/demos/DemoRoute";
import { templateByKey } from "@/lib/templates";

// Scoped to /demos/* only (the root layout sets no viewport of its own, so
// this doesn't override anything main-site-facing). viewport-fit=cover lets
// a demo's fixed chrome (the mobile sticky CTA, the shell pill) paint edge to
// edge on notched phones; env(safe-area-inset-*) is 0px without it
// (mobile-native/GUIDE.md). Each demo's own --d-bg supplies its status-bar
// color, so this can't hardcode one value for both schemes — themeColor is
// left to the browser's default (matching page background) rather than
// guessing a color that's wrong on half the demos.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// A template on its own page, so a client filling in /start can keep the one
// they picked open in a second tab and look at the section they're being asked
// about. The gallery only opens a demo inside the homepage, which is no use as
// a reference.
//
// noindex: these are sample brands with invented businesses on them (§7). They
// have no business turning up in a search for a real florist.
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(demos).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tpl = templateByKey(slug);
  return {
    title: tpl ? `${tpl.name} style` : "Style",
    robots: { index: false, follow: false },
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!demos[slug]) notFound();
  return <DemoRoute slug={slug} />;
}
