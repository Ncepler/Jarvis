import type { Metadata } from "next";
import {
  Inter,
  Inter_Tight,
  Syne,
  Fraunces,
  Oswald,
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

// Studio display face — section titles + closing CTA on the main Vilas site.
const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
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

// Demo display serif — florist + bakery header type (SKILL §13a/§13b). Demo-only.
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

// Demo condensed display — barber signage type (SKILL §13c). Demo-only.
const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
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
  title: `${SITE.name} — web design studio for small businesses`,
  description: `A small, fully remote web design studio. We build websites for businesses that look like they cost as much as a villa.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${syne.variable} ${fraunces.variable} ${oswald.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
