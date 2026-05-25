"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Catalogue, Mode, ModeContent } from "@/data/types";
import { useMode } from "@/context/ModeContext";
import { ModeToggle } from "@/components/home/ModeToggle";
import { BrandMarquee } from "@/components/home/BrandMarquee";

interface HeroSectionProps {
  modes: Catalogue["modes"];
  children?: ReactNode;
}

function splitTitle(title: string): {
  before: string;
  accent: string;
  after: string;
} {
  const match = title.match(/^(.*)<span>(.*)<\/span>(.*)$/);

  if (!match) {
    return { before: title, accent: "", after: "" };
  }

  return {
    before: match[1],
    accent: match[2],
    after: match[3],
  };
}

function renderTitle(content: ModeContent) {
  const title = splitTitle(content.home.title);

  return (
    <>
      {title.before}
      {title.accent ? <span>{title.accent}</span> : null}
      {title.after}
    </>
  );
}

function HeroPoint({ point, index }: { point: string; index: number }) {
  return (
    <div className="hero-point">
      <svg viewBox="0 0 24 24" className="hero-point-icon" fill="none">
        <circle cx="12" cy="12" r="11" fill="var(--orange)" />
        <path d="M8 12.5L11 15.5L16 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{point}</span>
    </div>
  );
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

  useEffect(() => {
    if (currentMode === "industrial") {
      setCurrentImageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentMode, sliderImages.length]);

  return (
    <section className="page active" id="page-home">
      <ModeToggle mode={currentMode} onModeChange={setMode} />
      <div className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-text-block">
              <h1 className="hero-title">{renderTitle(content)}</h1>
              
              <p className="hero-copy">{content.home.copy}</p>

              {content.home.points && content.home.points.length > 0 && (
                <div className="hero-points-list" aria-label="Business highlights">
                  {content.home.points.map((point, index) => (
                    <HeroPoint point={point} index={index} key={point} />
                  ))}
                </div>
              )}
              
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
              
              <div className="hero-machine-image-wrapper">
                <img 
                  src={sliderImages[currentImageIndex]} 
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
      </div>
      <BrandMarquee />
      {children}
    </section>
  );
}
