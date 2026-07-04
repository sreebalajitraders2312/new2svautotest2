"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Catalogue, Mode } from "@/data/types";
import { useMode } from "@/context/ModeContext";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { ModeToggle } from "@/components/home/ModeToggle";

interface HeroSectionProps {
  modes: Catalogue["modes"];
  children?: ReactNode;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
    </svg>
  );
}

export function HeroSection({ modes, children }: HeroSectionProps) {
  const { mode, setMode } = useMode();
  const currentMode: Mode = mode;
  const content = modes[currentMode];

  const sliderImages = currentMode === "industrial"
    ? ["/assets/industry-image1.png", "/assets/industry-image2.png"]
    : ["/assets/backhoe-diagram.png", "/assets/diagram2.png"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const displayedImageIndex = currentMode === "industrial" ? 0 : currentImageIndex;

  useEffect(() => {
    if (currentMode === "industrial") {
      return;
    }
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentMode, sliderImages.length]);

  return (
    <section className="page active" id="page-home">
      <div className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-text-block">
              <div className="hero-mode-toggle-desktop">
                <ModeToggle mode={currentMode} onModeChange={setMode} />
              </div>

              {currentMode === "automobile" && (
                <div className="hero-shipping-badge">
                  <span className="pulsing-dot"></span>
                  Shipping to 40+ Countries Worldwide
                </div>
              )}
              <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: content.home.title }} />
              
              <p className="hero-copy" dangerouslySetInnerHTML={{ __html: content.home.copy }} />
              
              <div className="hero-actions" aria-label="Hero actions">
                <Link className="hero-cta primary" href="/search">
                  <SearchIcon />
                  <span>{content.nav.search}</span>
                </Link>
                <Link className="hero-cta secondary" href="/categories">
                  <GridIcon />
                  <span>Browse by Category</span>
                </Link>
              </div>
            </div>

            <div className="hero-machine-image-wrapper">
              <img
                src={sliderImages[displayedImageIndex]}
                alt="Machine Parts Diagram"
                className="hero-machine-image fade-transition"
              />

              <div className="hero-trust-cards">
                <div className="trust-card">
                  <span className="trust-card-value">5K+</span>
                  <span className="trust-card-label">PRODUCTS</span>
                </div>
                <div className="trust-card-divider"></div>
                <div className="trust-card">
                  <span className="trust-card-value">50+</span>
                  <span className="trust-card-label">BRANDS</span>
                </div>
                <div className="trust-card-divider"></div>
                <div className="trust-card">
                  <span className="trust-card-value">15Y+</span>
                  <span className="trust-card-label">EXPERIENCE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BrandMarquee />
      {children}
    </section>
  );
}

