import type { Metadata } from "next";
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
    <html lang="en">
      <body>
        <ModeProvider>
          <div className="app">
            <Header modes={catalogue.modes} />
            <SeoJsonLd data={buildLocalBusinessJsonLd()} />
            {children}
            <GlobalStoreLocation />
            <Footer modeContent={catalogue.modes.automobile} />
            <FloatingWhatsApp />
          </div>
        </ModeProvider>
        <Analytics />
      </body>
    </html>
  );
}

