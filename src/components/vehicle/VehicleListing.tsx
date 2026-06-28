"use client";

import Link from "next/link";
import { useMode } from "@/context/ModeContext";
import { getCatalogue, getVehiclesForMode } from "@/lib/dataUtils";
import { VehicleCard } from "@/components/vehicle/VehicleCard";

export function VehicleListing() {
  const { mode } = useMode();
  const catalogue = getCatalogue();
  const content = catalogue.modes[mode].explore;
  const entities = getVehiclesForMode(mode);

  const badgeLabel = mode === "automobile" ? "BY VEHICLE" : "BY APPLICATION";

  return (
    <>
      <section
        className="section vehicle-listing-hero-section"
        aria-labelledby="vehicle-listing-title"
      >
        <div className="container">
          <div className="category-overview-shell">
            <nav className="category-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link><span aria-hidden="true">&gt;</span><span>{content.title}</span>
            </nav>

            <div className="category-overview-hero">
              <div className="overview-badge">
                <span className="overview-badge-dot" aria-hidden="true"></span>
                {badgeLabel}
              </div>
              <h1 id="vehicle-listing-title">
                {content.title.split(' ').map((word: string, i: number, arr: string[]) => (
                  <span key={i} className={word.toLowerCase() === 'vehicle' || word.toLowerCase() === 'application' ? 'overview-highlight' : ''}>
                    {word.toUpperCase()}{i < arr.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </h1>
              <p>{content.copy}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section vehicle-listing-grid-section">
        <div className="container">
          <div className="category-overview-shell">
            <div
              className="vehicle-type-list"
              aria-label={`${mode} vehicle and application types`}
            >
              {entities.map((entity) => (
                <VehicleCard entity={entity} key={entity.id} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
