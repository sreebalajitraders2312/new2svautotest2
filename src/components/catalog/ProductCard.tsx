"use client";

import Link from "next/link";
import Image from "next/image";
import type { Mode, Product } from "@/data/types";
import { getProductUrl } from "@/lib/dataUtils";
import {
  getAssetPath,
  getFallbackInitials,
} from "@/components/catalog/cardUtils";

interface ProductCardProps {
  mode: Mode;
  product: Product;
  variant?: "grid" | "list";
}

export function ProductCard({
  mode,
  product,
  variant = "grid",
}: ProductCardProps) {
  const imagePath = getAssetPath(product.imageUrl);
  const productUrl = getProductUrl(product, mode);

  return (
    <Link className={`catalog-card catalog-card--${variant}`} href={productUrl}>
      <div className="catalog-card-visual">
        {imagePath ? (
          <Image src={imagePath} alt={product.name} width={240} height={170} />
        ) : (
          <span className="catalog-visual-fallback">
            {product.imageFallbackInitials || getFallbackInitials(product.name)}
          </span>
        )}
      </div>
      <div className="catalog-card-content">
        <h3>{product.name}</h3>
        {product.oemNumber ? (
          <div className="catalog-oem">OEM: {product.oemNumber}</div>
        ) : null}
        {product.shortDescription ? (
          <div className="catalog-desc">{product.shortDescription}</div>
        ) : null}
        <div className="catalog-card-footer">
          <span className="catalog-view-details">
            View Details
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
