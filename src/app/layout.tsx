import type { Metadata } from "next";
import { Barlow, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { GlobalStoreLocation } from "@/components/layout/GlobalStoreLocation";
import { Header } from "@/components/layout/Header";
import { SeoJsonLd } from "@/components/shared/SeoJsonLd";
import { ModeProvider } from "@/context/ModeContext";
import { getCatalogue } from "@/lib/dataUtils";
import { buildLocalBusinessJsonLd } from "@/lib/seoHelpers";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-barlow",
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
    <html lang="en" className={`${manrope.variable} ${barlow.variable}`}>
      <body>
        <ModeProvider>
          <div className="app">
            <Header modes={catalogue.modes} />
            <SeoJsonLd data={buildLocalBusinessJsonLd()} />
            {children}
            <GlobalStoreLocation />
            <Footer catalogue={catalogue} />
            <FloatingWhatsApp />
          </div>
        </ModeProvider>
        <Analytics />
      </body>
    </html>
  );
}

