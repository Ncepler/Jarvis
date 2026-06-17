import type { Metadata } from "next";
import {
  Inter,
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
      className={`${inter.variable} ${instrumentSerif.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
