import type { Metadata } from "next";
import {
  Inter,
  Inter_Tight,
  Instrument_Serif,
  Space_Grotesk,
  Space_Mono,
} from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-instrument-serif",
});

// Wordmark face — variable (300 dim helpers / 700 bright core in the reveal).
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-grotesk",
});

// Demo sites only — a neutral grotesque for the dark Axel's/Sallem-style
// contractor demos (components/demos/*). Kept separate from the Vilas brand
// faces so the demos never read like the studio's own wordmark.
const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-tight",
});

// Utility/mono — ".studio" and small UI labels.
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-space-mono",
});

// TODO(name): real OG image + favicon now that the name is Vilas
export const metadata: Metadata = {
  title: `${SITE.name} — web design studio, Long Island, NY`,
  description: `A small web design studio on ${SITE.region}. We build websites for local businesses that look like they cost 10x more.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${instrumentSerif.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
