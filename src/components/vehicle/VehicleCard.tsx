"use client";

import Link from "next/link";
import type { VehicleEntity } from "@/data/types";
import { getVehicleEntityUrl } from "@/lib/dataUtils";
import { getFallbackInitials } from "@/components/catalog/cardUtils";

interface VehicleCardProps {
  entity: VehicleEntity;
}

function TractorIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M8 29V17h8l5 12h13l-3-9h-8" />
      <path d="M25 20v-7h7v7M12 17v-5h6" />
      <circle cx="14" cy="34" r="6" />
      <circle cx="35" cy="34" r="5" />
      <path d="M4 34h4M20 34h10M40 34h4" />
    </svg>
  );
}

function BusIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="6" y="13" width="34" height="21" rx="4" />
      <path d="M11 19h7M22 19h7M33 19h3M10 27h26" />
      <circle cx="14" cy="36" r="4" />
      <circle cx="33" cy="36" r="4" />
    </svg>
  );
}

function ConstructionIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M7 33h17V19h-8L7 33Z" />
      <path d="M24 33h10l8-12M16 19V8h12M28 8l-6 11" />
      <path d="M8 33v5h30v-5" />
      <circle cx="14" cy="38" r="4" />
      <circle cx="31" cy="38" r="4" />
    </svg>
  );
}

function AutoIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M8 31V18h19l7 8v5" />
      <path d="M27 18v13M10 22h11M34 26h6v5h-6" />
      <circle cx="14" cy="35" r="4" />
      <circle cx="31" cy="35" r="4" />
    </svg>
  );
}

function BikeIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="11" cy="35" r="6" />
      <circle cx="37" cy="35" r="6" />
      <path d="M17 35h9l7-13h-8M20 21h7l-4 14M28 17h5M9 29l6-7h7" />
    </svg>
  );
}

function ForkliftIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M12 34V14h7v20" />
      <path d="M19 30h11l7-15M37 15v19M9 34h30" />
      <circle cx="15" cy="38" r="4" />
      <circle cx="31" cy="38" r="4" />
      <path d="M37 14h5M37 20h5M37 26h5" />
    </svg>
  );
}

function IndustrialIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M8 34h32M12 34V20l9-6 9 6v14M30 22h6v12" />
      <path d="M16 34v-8h10v8M15 18v-5h6v2" />
      <circle cx="36" cy="17" r="3" />
    </svg>
  );
}

function EntityIcon({ entity }: { entity: VehicleEntity }) {
  switch (entity.slug) {
    case "tractors":
      return <TractorIcon />;
    case "bus-trailers":
      return <BusIcon />;
    case "construction":
      return <ConstructionIcon />;
    case "three-wheeler":
      return <AutoIcon />;
    case "two-wheeler":
      return <BikeIcon />;
    case "forklift":
      return <ForkliftIcon />;
    default:
      return "badge" in entity ? (
        <IndustrialIcon />
      ) : (
        <span>{getFallbackInitials(entity.title)}</span>
      );
  }
}

export function VehicleCard({ entity }: VehicleCardProps) {
  const countLabel = `${entity.parts.length} parts`;
  const previewParts = entity.parts.slice(0, 3);
  const moreCount = Math.max(entity.parts.length - previewParts.length, 0);
  const segmentLabel =
    entity.slug === "tractors"
      ? "Field & Farm"
      : "badge" in entity
        ? "Industrial"
        : "Vehicle segment";

  return (
    <Link className="vehicle-type-card" href={getVehicleEntityUrl(entity)}>
      <span className="vehicle-watermark" aria-hidden="true">
        <EntityIcon entity={entity} />
      </span>

      <span className="vehicle-card-top">
        <span className="vehicle-type-icon" aria-hidden="true">
          <EntityIcon entity={entity} />
        </span>
        <span className="vehicle-card-meta">
          <span className="vehicle-type-count">{countLabel}</span>
          <span className="vehicle-segment-label">{segmentLabel}</span>
        </span>
      </span>

      <span className="vehicle-type-copy">
        <strong>{entity.title}</strong>
        <small>{entity.description}</small>
        <span className="vehicle-parts-preview" aria-label="Common parts">
          {previewParts.map((part) => (
            <span key={part}>{part}</span>
          ))}
          {moreCount > 0 && <span>+{moreCount} more</span>}
        </span>
      </span>

      <span className="vehicle-card-bottom">
        <span className="vehicle-type-action">
          View parts
          <svg viewBox="0 0 24 24">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </span>
      </span>
    </Link>
  );
}
