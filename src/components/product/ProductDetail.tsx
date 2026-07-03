import Link from "next/link";
import type {
  Category,
  DetailContent,
  Mode,
  Product,
  TrustItem,
} from "@/data/types";
import { getCatalogue, getCategoryUrl, getProductUrl } from "@/lib/dataUtils";
import { BUSINESS_PHONE } from "@/lib/seoHelpers";
import {
  buildProductWhatsAppUrl,
  normalizeWhatsAppPhone,
} from "@/lib/whatsappUtils";
import { EnquiryActions } from "@/components/product/EnquiryActions";
import { ProductGallery } from "@/components/product/ProductGallery";
import { CompatibilityList } from "@/components/product/CompatibilityList";
import { TrustRow } from "@/components/product/TrustRow";
import { TechSpecs } from "@/components/product/TechSpecs";

interface ProductDetailProps {
  category: Category;
  content: DetailContent;
  mode: Mode;
  product: Product;
}

function formatStockStatus(status: Product["stockStatus"]) {
  switch (status) {
    case "ready-stock":
      return "Ready stock";
    case "available":
      return "Available";
    case "in-stock":
    default:
      return "In Stock";
  }
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function MetaPointIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 21s6-4.35 6-10.2A6 6 0 1 0 6 10.8C6 16.65 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.2" />
    </svg>
  );
}

function getCallPhone(mode: Mode) {
  const catalogue = getCatalogue();
  const modeContent = catalogue.modes[mode];
  return (
    modeContent.home.contactList.find((item) => item.label === "Call")?.value ||
    BUSINESS_PHONE
  );
}

function getWhatsAppPhone(mode: Mode) {
  const catalogue = getCatalogue();
  const modeContent = catalogue.modes[mode];
  return (
    modeContent.home.contactList.find((item) => item.label === "WhatsApp")
      ?.value || BUSINESS_PHONE
  );
}

function getTrustItems(mode: Mode, content: DetailContent): TrustItem[] {
  if (mode === "automobile") {
    return [
      {
        title: "Genuine OEM\nParts",
        subtitle: "",
        icon: "shield",
      },
      {
        title: "Fast Dispatch",
        subtitle: "",
        icon: "truck",
      },
      {
        title: "GST Invoice",
        subtitle: "",
        icon: "doc",
      },
    ];
  }

  return content.trust;
}

export function ProductDetail({
  category,
  content,
  mode,
  product,
}: ProductDetailProps) {
  const compatibleItems =
    mode === "automobile"
      ? product.compatibleVehicles || []
      : product.compatibleApplications || [];
  const callPhone = getCallPhone(mode);
  const whatsappPhone = getWhatsAppPhone(mode);
  const enquiryHref = buildProductWhatsAppUrl(whatsappPhone, product, mode);
  const callHref = `tel:${normalizeWhatsAppPhone(callPhone)}`;
  const pdfHref = `${getProductUrl(product, mode)}pdf/`;
  const trustItems = getTrustItems(mode, content);
  const productDescription = product.fullDescription || product.shortDescription;

  const specRows =
    product.technicalSpecs && Object.keys(product.technicalSpecs).length > 0
      ? Object.entries(product.technicalSpecs).map(([label, value]) => ({
          label,
          value,
        }))
      : product.availableSizes && product.availableSizes.length > 0
        ? [
            {
              label: "Available Size",
              value: product.availableSizes.join(", "),
            },
          ]
        : [];

  return (
    <div className="detail-grid">
      <div className="detail-sheet">
        <div className="detail-hero">
          <button
            aria-label="Save product"
            className="detail-favorite"
            type="button"
          >
            <HeartIcon />
          </button>
          <ProductGallery product={product} />
        </div>

        <div className="detail-body">
          <div className="detail-topbar">
            <h1>{product.name}</h1>
            <span className="stock-pill">
              {formatStockStatus(product.stockStatus)}
            </span>
          </div>

          {product.oemNumber || product.brand ? (
            <div className="detail-oem-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
              {product.oemNumber ? (
                <div className="oem-chip" style={{ marginTop: 0 }}>OEM: {product.oemNumber}</div>
              ) : null}
              {product.brand ? (
                <span className="brand-chip" style={{ minHeight: '30px', fontSize: '13px', borderRadius: '999px', padding: '0 10px', textTransform: 'uppercase' }}>{product.brand}</span>
              ) : null}
            </div>
          ) : null}

          <div className="detail-meta-row">
            {content.metaPoints.map((point) => {
              // Quick logic to match icons from screenshot
              const p = point.toLowerCase();
              let Icon = MetaPointIcon;
              if (p.includes('wholesale')) {
                Icon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
              } else if (p.includes('fast')) {
                Icon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#f05a1a" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
              } else if (p.includes('dealer') || p.includes('bangalore')) {
                Icon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#f05a1a" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
              }
              
              return (
                <span className="meta-point" key={point}>
                  <Icon />
                  <span>{point}</span>
                </span>
              );
            })}
          </div>

          {compatibleItems.length > 0 ? (
            <CompatibilityList
              emptyCopy={
                mode === "automobile"
                  ? "No compatible vehicles are listed for this product."
                  : "No suitable applications are listed for this product."
              }
              items={compatibleItems}
              title={content.compatTitle}
            />
          ) : null}

          {specRows.length > 0 ? (
            <TechSpecs rows={specRows} title={content.specTitle} />
          ) : null}

          {productDescription ? (
            <section className="detail-section">
              <h2>{content.descriptionTitle}</h2>
              <p className="desc">{productDescription}</p>
            </section>
          ) : null}

          <TrustRow items={trustItems} />

          <EnquiryActions
            callHref={callHref}
            pdfHref={pdfHref}
            pdfLabel="Download PDF"
            noteLabel={content.noteLabel}
            primaryHref={enquiryHref}
            primaryLabel={content.primaryLabel}
            secondaryLabel={content.secondaryLabel}
          />
        </div>
      </div>
    </div>
  );
}
