"use client";

import Link from "next/link";
import { useMode } from "@/context/ModeContext";
import { getBrands, getCatalogue } from "@/lib/dataUtils";
import { BrandCard } from "@/components/brands/BrandCard";

function renderBrandsTitle(title: string) {
  const highlightWords = new Set(["automobile", "industrial", "brands"]);

  return title.split(" ").map((word, index, words) => (
    <span
      className={highlightWords.has(word.toLowerCase()) ? "overview-highlight" : undefined}
      key={`${word}-${index}`}
    >
      {word.toUpperCase()}
      {index < words.length - 1 ? " " : ""}
    </span>
  ));
}

export function BrandsListing() {
  const { mode } = useMode();
  const catalogue = getCatalogue();
  const content = catalogue.modes[mode].brandsPage;
  const brands = getBrands(mode);

  return (
    <>
      <section
        aria-labelledby="brands-overview-title"
        className="section brands-header-section"
      >
        <div className="container">
          <div className="category-overview-shell">
            <nav className="category-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">&gt;</span>
              <span>Brands</span>
            </nav>

            <div className="category-overview-hero">
              <div className="overview-badge">
                <span className="overview-badge-dot" aria-hidden="true"></span>
                {mode === "automobile" ? "ALL BRANDS" : "INDUSTRIAL BRANDS"}
              </div>
              <h1 id="brands-overview-title">{renderBrandsTitle(content.title)}</h1>
              <p>{content.copy}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section brands-list-section">
        <div className="container">
          <div className="category-overview-shell">
            <div className="brands-grid" aria-label={`${mode} brands`}>
              {brands.map((brand, index) => (
                <BrandCard
                  key={brand.id}
                  index={index}
                  mode={mode}
                  name={brand.name}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
