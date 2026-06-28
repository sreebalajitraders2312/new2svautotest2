import Image from "next/image";
import Link from "next/link";
import type { Mode, Product, VehicleEntity } from "@/data/types";
import {
  getAssetPath,
  getFallbackInitials,
} from "@/components/catalog/cardUtils";
import { getProductUrl } from "@/lib/dataUtils";
import { getVehicleEntityKicker } from "@/lib/vehicleUtils";

interface VehicleDetailProps {
  entity: VehicleEntity;
  partLinks: Array<{
    part: string;
    product: Product;
    mode: Mode;
    href: string;
  }>;
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function formatStockStatus(status: Product["stockStatus"]) {
  switch (status) {
    case "ready-stock":
      return "Ready stock";
    case "available":
      return "Available";
    case "in-stock":
    default:
      return "In stock";
  }
}

export function VehicleDetail({ entity, partLinks }: VehicleDetailProps) {
  const imagePath = getAssetPath(entity.imageUrl);
  const kicker = getVehicleEntityKicker(entity);
  const partsTitle =
    "badge" in entity
      ? `Matched products for ${entity.title}`
      : `${entity.title} parts`;

  return (
    <div className="vd-shell">
      <div className="vd-header">
        <div className="vd-title-block">
          <span className="vd-kicker">
            <span className="vd-kicker-dot" aria-hidden="true"></span>
            {kicker}
          </span>
          <h1 className="vd-title">{entity.title}</h1>
          <p className="vd-summary">{entity.description}</p>
        </div>
      </div>

      <div className="vd-image-wrap">
        {imagePath ? (
          <Image
            src={imagePath}
            alt={entity.title}
            width={820}
            height={460}
            priority
            className="vd-image"
          />
        ) : (
          <div className="vd-image-fallback">
            <span>{getFallbackInitials(entity.title)}</span>
          </div>
        )}
        <div className="vd-image-glow" aria-hidden="true" />
      </div>

      <div className="vd-parts-section">
        <div className="vd-parts-head">
          <span className="vd-section-kicker">Parts below this vehicle</span>
          <h2 className="vd-parts-title">{partsTitle}</h2>
        </div>

        <ol className="vd-parts-list">
          {partLinks.map(({ part, product, mode, href }, index) => (
            <li key={part} className="vd-part-item">
              <Link
                className="vd-part-row"
                href={`${href || getProductUrl(product, mode)}?fromVehicle=${entity.slug}`}
              >
                <span className="vd-part-num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="vd-part-copy">
                  <span className="vd-part-name">{part}</span>
                  <span className="vd-part-match">
                    {product.name} · {product.brand}
                  </span>
                </span>
                <span className="vd-part-stock">
                  {formatStockStatus(product.stockStatus)}
                </span>
                <span className="vd-part-arrow" aria-hidden="true">
                  <ArrowIcon />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
