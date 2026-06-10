import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
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

// TODO(name): finalize title/description/OG once the brand name exists
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
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
