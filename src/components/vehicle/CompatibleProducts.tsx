import type { Mode, Product } from "@/data/types";
import { ProductCard } from "@/components/catalog/ProductCard";

interface CompatibleProductsProps {
  products: Array<{ product: Product; mode: Mode }>;
}

export function CompatibleProducts({ products }: CompatibleProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: "48px" }}>
      <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "24px", fontFamily: "var(--display)" }}>
        Compatible Products
      </h2>
      <div className="catalog-grid grid-view" aria-label="Compatible products">
        {products.map(({ product, mode }) => (
          <ProductCard
            key={`${mode}-${product.id}`}
            mode={mode}
            product={product}
            variant="grid"
          />
        ))}
      </div>
    </div>
  );
}
