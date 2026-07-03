"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { Category, Mode, Product } from "@/data/types";
import { useMode } from "@/context/ModeContext";
import {
  getAssetPath,
  getFallbackInitials,
} from "@/components/catalog/cardUtils";
import { getCatalogue, getCategoryUrl } from "@/lib/dataUtils";
import { BUSINESS_PHONE } from "@/lib/seoHelpers";
import { normalizeWhatsAppPhone } from "@/lib/whatsappUtils";

interface ProductPdfViewProps {
  category: Category;
  mode: Mode;
  product: Product;
}

export function ProductPdfView({
  category,
  mode,
  product,
}: ProductPdfViewProps) {
  const { setMode } = useMode();
  const catalogue = getCatalogue();
  const modeContent = catalogue.modes[mode];
  const imagePath = getAssetPath(product.imageUrl);
  const callPhone =
    modeContent.home.contactList.find((item) => item.label === "Call")?.value ||
    BUSINESS_PHONE;
  const whatsappPhone =
    modeContent.home.contactList.find((item) => item.label === "WhatsApp")
      ?.value || BUSINESS_PHONE;
  const compatibilityItems =
    mode === "automobile"
      ? product.compatibleVehicles || []
      : product.compatibleApplications || [];
  const productDescription = product.fullDescription || product.shortDescription;
  const technicalItems = product.technicalSpecs
    ? Object.entries(product.technicalSpecs)
    : [];

  useEffect(() => {
    const previousMode = document.body.dataset.homeMode;

    document.body.dataset.pdfView = "true";
    setMode(mode);

    const timer = window.setTimeout(() => {
      window.print();
    }, 300);

    return () => {
      window.clearTimeout(timer);
      if (previousMode) {
        document.body.dataset.homeMode = previousMode;
      } else {
        delete document.body.dataset.homeMode;
      }
      delete document.body.dataset.pdfView;
    };
  }, [mode, setMode]);

  return (
    <section
      className="section compact product-pdf-page"
      aria-labelledby="product-pdf-title"
    >
      <div className="container page-shell">
        <article className="product-pdf-sheet">
          <header className="product-pdf-header">
            <div>
              <span className="kicker">Product Sheet</span>
              <h1 id="product-pdf-title">{product.name}</h1>
              <p>{modeContent.contactPage.subtitle}</p>
            </div>
            <div className="product-pdf-brand">
              <span className="brand-mark">SV</span>
              <span>
                <strong>SV Enterprises</strong>
                <small>{modeContent.brandSub}</small>
              </span>
            </div>
          </header>

          <div className="product-pdf-grid">
            <div className="product-pdf-visual">
              {imagePath ? (
                <Image
                  className="product-pdf-image"
                  src={imagePath}
                  alt={product.name}
                  width={360}
                  height={270}
                  priority
                />
              ) : (
                <span className="product-pdf-fallback">
                  {product.imageFallbackInitials ||
                    getFallbackInitials(product.name)}
                </span>
              )}

              <div className="product-pdf-contact">
                <span className="kicker">Company Info</span>
                <strong>{modeContent.contactPage.title}</strong>
                <p>{modeContent.contactPage.address}</p>
                <p>
                  Call:{" "}
                  <a href={`tel:${normalizeWhatsAppPhone(callPhone)}`}>
                    {callPhone}
                  </a>
                </p>
                <p>
                  WhatsApp:{" "}
                  <a
                    href={`https://wa.me/${normalizeWhatsAppPhone(whatsappPhone)}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {whatsappPhone}
                  </a>
                </p>
              </div>
            </div>

            <div className="product-pdf-content">
              <div className="product-pdf-meta">
                <div>
                  <small>Category</small>
                  <strong>{category.title}</strong>
                </div>
                <div>
                  <small>Brand</small>
                  <strong>{product.brand}</strong>
                </div>
                {product.oemNumber ? (
                  <div>
                    <small>OEM / Spec</small>
                    <strong>{product.oemNumber}</strong>
                  </div>
                ) : null}
                <div>
                  <small>Stock</small>
                  <strong>{product.stockStatus.replace(/-/g, " ")}</strong>
                </div>
              </div>

              {productDescription ? (
                <section className="product-pdf-section">
                  <h2>Description</h2>
                  <p>{productDescription}</p>
                </section>
              ) : null}

              {compatibilityItems.length > 0 ? (
                <section className="product-pdf-section">
                  <h2>Compatibility</h2>
                  <ul>
                    {compatibilityItems.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </section>
              ) : null}

              {technicalItems.length > 0 ||
              (product.availableSizes && product.availableSizes.length > 0) ? (
                <section className="product-pdf-section">
                  <h2>Technical Details</h2>
                  <ul>
                    {technicalItems.length > 0
                      ? technicalItems.map(([label, value]) => (
                          <li key={label}>
                            <strong>{label}:</strong> {value}
                          </li>
                        ))
                      : product.availableSizes?.map((size) => (
                          <li key={size}>{size}</li>
                        ))}
                  </ul>
                </section>
              ) : null}

              <footer className="product-pdf-footer">
                <span>{getCategoryUrl(category, mode)}</span>
                <span>Contact: {callPhone}</span>
              </footer>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
