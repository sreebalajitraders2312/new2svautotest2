import type { Mode } from "@/data/types";

interface BrandCardProps {
  index: number;
  mode: Mode;
  name: string;
}

const BRAND_DETAILS: Record<
  Mode,
  {
    subtitle: string;
    primaryTags: string[];
    segmentTags: string[];
    featureTags: string[];
    stockLabel: string;
  }
> = {
  automobile: {
    subtitle: "Sealants, adhesives & gaskets",
    primaryTags: ["Sealants", "Adhesives", "Gasket Makers"],
    segmentTags: ["Passenger", "Utility", "Commercial"],
    featureTags: [
      "OEM Approved",
      "Export Ready",
      "ISO 9001",
      "Fast Cure",
      "Top Rated",
      "High Demand",
      "Eco Formula",
      "EV Safe",
      "Pro Favorite",
      "Fleet Ready",
    ],
    stockLabel: "In Stock",
  },
  industrial: {
    subtitle: "Bearings, motors & industrial supply",
    primaryTags: ["Bearings", "Motors", "Hydraulics"],
    segmentTags: ["MRO", "OEM", "Factory"],
    featureTags: [
      "OEM Approved",
      "Export Ready",
      "ISO 9001",
      "Fast Supply",
      "Top Rated",
      "High Demand",
      "Eco Ready",
      "Machine Safe",
      "Pro Favorite",
      "Bulk Ready",
    ],
    stockLabel: "In Stock",
  },
};

function getBrandInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getPartsCount(index: number): string {
  return `${(1240 + index * 75).toLocaleString("en-IN")}+ parts`;
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M12 3 14.4 5.4 17.8 5.1 18.1 8.5 20.5 11 18.1 13.5 17.8 16.9 14.4 16.6 12 19 9.6 16.6 6.2 16.9 5.9 13.5 3.5 11 5.9 8.5 6.2 5.1 9.6 5.4 12 3Z" />
      <path d="m9 11 2 2 4-5" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 21s6-4.35 6-10.2A6 6 0 1 0 6 10.8C6 16.65 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m21 8-9-5-9 5 9 5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}

function WarrantyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M9 12 7 21l5-3 5 3-2-9" />
    </svg>
  );
}

function FeatureIcon({ index }: { index: number }) {
  const icons = [VerifiedIcon, PinIcon, WarrantyIcon, ArrowIcon, BoxIcon, TruckIcon];
  const Icon = icons[index % icons.length];

  return <Icon />;
}

export function BrandCard({ index, mode, name }: BrandCardProps) {
  const details = BRAND_DETAILS[mode];

  return (
    <article className="brand-card">
      <div className="brand-card-head">
        <div className="brand-card-mark" aria-hidden="true">
          {getBrandInitials(name)}
        </div>
        <div className="brand-card-title">
          <div className="brand-card-name-row">
            <h2>{name}</h2>
            <span className="brand-verified" aria-label="Verified brand">
              <VerifiedIcon />
            </span>
          </div>
          <p>{details.subtitle}</p>
        </div>
        <span className="brand-stock-pill">
          <i aria-hidden="true" />
          {details.stockLabel}
        </span>
      </div>

      <div className="brand-card-meta" aria-label="Brand availability">
        <span>
          <PinIcon /> India
        </span>
        <span>Est. 1972</span>
        <span>4.7 (3.2k)</span>
      </div>

      <div className="brand-card-tags brand-card-tags-primary" aria-label="Brand categories">
        {details.primaryTags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="brand-card-tags brand-card-tags-segment" aria-label="Supported segments">
        {details.segmentTags.map((tag) => (
          <span key={tag}>
            <TruckIcon />
            {tag}
          </span>
        ))}
      </div>

      <div className="brand-card-signals" aria-label="Supply strengths">
        {details.featureTags.map((feature, featureIndex) => (
          <span key={feature}>
            <FeatureIcon index={featureIndex} />
            {feature}
          </span>
        ))}
      </div>

      <div className="brand-card-footer">
        <strong>
          <BoxIcon />
          {getPartsCount(index)}
        </strong>
        <em>
          <WarrantyIcon />
          12 mo warranty
        </em>

      </div>
    </article>
  );
}



