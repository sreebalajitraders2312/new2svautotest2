"use client";

import { useMode } from "@/context/ModeContext";
import { getCatalogue } from "@/lib/dataUtils";

export function BrandMarquee() {
  const { mode } = useMode();

  // Extract brands from the filter panel data for the current mode
  const modeData = getCatalogue().modes[mode];
  const brandField = modeData.filterPanel.fields.find(f => f.label === "Brand");
  const brands = brandField ? brandField.options : [];

  // Repeat to ensure smooth infinite scroll
  const repeated = [...brands, ...brands, ...brands, ...brands, ...brands];

  return (
    <div className="brand-marquee-section" aria-label="Authorised Distributor Brands">
      <div className="brand-marquee-card">
        {/* Header: orange rule — label — orange rule */}
        <div className="brand-marquee-header">
          <div className="brand-marquee-rule" aria-hidden="true" />
          <span className="brand-marquee-label">Authorised Distributor For</span>
          <div className="brand-marquee-rule" aria-hidden="true" />
        </div>

        {/* Scrolling ticker */}
        <div className="brand-marquee-track-container">
          <div className="brand-marquee-track">
            {repeated.map((brand, index) => (
              <span className="brand-marquee-item" key={`${brand}-${index}`}>
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
