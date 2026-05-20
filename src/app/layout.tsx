import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ModeProvider } from "@/context/ModeContext";
import { getCatalogue } from "@/lib/dataUtils";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SV Enterprises - Automobile Spare Parts Bangalore",
  description:
    "SV Enterprises is a Bangalore wholesale supplier for automobile spare parts and industrial products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const catalogue = getCatalogue();

  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body>
        <ModeProvider>
          <div className="app">
            <Header modes={catalogue.modes} />
            {children}
            <Footer modeContent={catalogue.modes.automobile} />
            <FloatingWhatsApp />
          </div>
        </ModeProvider>
        <Analytics />
      </body>
    </html>
  );
}
