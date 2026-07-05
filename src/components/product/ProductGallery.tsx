import Image from "next/image";
import type { Product } from "@/data/types";
import {
  getFallbackInitials,
  getProductImagePath,
} from "@/components/catalog/cardUtils";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const imagePath = getProductImagePath(product);

  return (
    <div className="detail-gallery">
      <div className="detail-visual">
        {imagePath ? (
          <Image
            className="detail-image"
            src={imagePath}
            alt={product.name}
            width={360}
            height={270}
            priority
          />
        ) : (
          <span className="detail-fallback">
            {product.imageFallbackInitials || getFallbackInitials(product.name)}
          </span>
        )}
      </div>
    </div>
  );
}
