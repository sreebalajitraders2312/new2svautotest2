import catalogJson from "@/data/catalog.json";
import type {
  ApplicationType,
  Catalogue,
  Category,
  Mode,
  Product,
  VehicleEntity,
  VehicleType,
} from "@/data/types";
import { DEFAULT_MODE, getValidMode } from "@/lib/modeUtils";
import {
  findBySlug,
  getProductSlug,
  slugsMatch,
  slugify,
} from "@/lib/slugUtils";

export type ProductSort =
  | "popularity"
  | "name-ascending"
  | "name-descending"
  | "brand-ascending"
  | "oem-ascending";

export interface ProductFilters {
  categorySlug?: string;
  brand?: string;
  stockStatus?: Product["stockStatus"];
  compatibleWith?: string;
  query?: string;
}

export interface StaticCategoryParam {
  mode: Mode;
  categorySlug: string;
}

export interface StaticProductParam extends StaticCategoryParam {
  productSlug: string;
}

export interface ProductSubcategory {
  id: string;
  title: string;
  slug: string;
  description: string;
  count: string;
  imageUrl?: string;
}

export const catalogue = catalogJson as Catalogue;

export function getCatalogue(): Catalogue {
  return catalogue;
}

export function getModes(): Mode[] {
  return ["automobile", "industrial"];
}

export function getCategories(mode: Mode = DEFAULT_MODE): Category[] {
  return [...catalogue.categories[getValidMode(mode)]];
}

export function getCategoryBySlug(
  mode: Mode,
  categorySlug: string,
): Category | null {
  return findBySlug(getCategories(mode), categorySlug);
}

export function getProductsByMode(mode: Mode = DEFAULT_MODE): Product[] {
  const modeProducts = catalogue.products[getValidMode(mode)];

  return Object.values(modeProducts).flat();
}

export const getProducts = getProductsByMode;

export function getCategoryProducts(
  mode: Mode,
  categorySlug: string,
): Product[] {
  const category = getCategoryBySlug(mode, categorySlug);

  if (!category) {
    return [];
  }

  return [...(catalogue.products[mode][category.slug] || [])];
}

export function getProductBySlug(
  mode: Mode,
  categorySlug: string,
  productSlug: string,
): Product | null {
  return (
    getCategoryProducts(mode, categorySlug).find((product) =>
      slugsMatch(product, productSlug),
    ) || null
  );
}

export function getCategorySubcategories(
  mode: Mode,
  categorySlug: string,
): ProductSubcategory[] {
  const products = getCategoryProducts(mode, categorySlug);
  const grouped = new Map<string, Product[]>();

  products.forEach((product) => {
    const key = product.brand || "General";
    grouped.set(key, [...(grouped.get(key) || []), product]);
  });

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([brand, brandProducts]) => {
      const firstProduct = brandProducts[0];
      const count = brandProducts.length;

      return {
        id: `${firstProduct.categorySlug}-${slugify(brand)}`,
        title: brand,
        slug: slugify(brand),
        description: `${count} ${count === 1 ? "product" : "products"} available in ${firstProduct.category}.`,
        count: `${count} ${count === 1 ? "item" : "items"}`,
        imageUrl: firstProduct.imageUrl,
      };
    });
}

export function getCategorySubcategoryBySlug(
  mode: Mode,
  categorySlug: string,
  subcategorySlug: string,
): ProductSubcategory | null {
  return (
    getCategorySubcategories(mode, categorySlug).find(
      (subcategory) => subcategory.slug === subcategorySlug,
    ) || null
  );
}

export function getSubcategoryProducts(
  mode: Mode,
  categorySlug: string,
  subcategorySlug: string,
): Product[] {
  const subcategory = getCategorySubcategoryBySlug(
    mode,
    categorySlug,
    subcategorySlug,
  );

  if (!subcategory) {
    return [];
  }

  return getCategoryProducts(mode, categorySlug).filter(
    (product) => slugify(product.brand || "General") === subcategory.slug,
  );
}

export function filterProducts(
  products: readonly Product[],
  filters: ProductFilters = {},
): Product[] {
  const normalizedQuery = filters.query?.trim().toLowerCase();
  const normalizedCompatible = filters.compatibleWith?.trim().toLowerCase();

  return products.filter((product) => {
    if (filters.categorySlug && product.categorySlug !== filters.categorySlug) {
      return false;
    }

    if (filters.brand && product.brand !== filters.brand) {
      return false;
    }

    if (filters.stockStatus && product.stockStatus !== filters.stockStatus) {
      return false;
    }

    if (normalizedCompatible) {
      const compatibility = [
        ...(product.compatibleVehicles || []),
        ...(product.compatibleApplications || []),
      ].map((item) => item.toLowerCase());

      if (!compatibility.some((item) => item.includes(normalizedCompatible))) {
        return false;
      }
    }

    if (normalizedQuery) {
      const searchable = [
        product.name,
        product.oemNumber,
        product.shortDescription,
        product.fullDescription,
        product.brand,
        product.category,
        ...(product.compatibleVehicles || []),
        ...(product.compatibleApplications || []),
        ...Object.values(product.technicalSpecs || {}),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    }

    return true;
  });
}

export function sortProducts(
  products: readonly Product[],
  sort: ProductSort = "popularity",
): Product[] {
  const sortedProducts = [...products];

  switch (sort) {
    case "name-ascending":
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case "name-descending":
      return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    case "brand-ascending":
      return sortedProducts.sort((a, b) => a.brand.localeCompare(b.brand));
    case "oem-ascending":
      return sortedProducts.sort((a, b) =>
        a.oemNumber.localeCompare(b.oemNumber, undefined, {
          numeric: true,
          sensitivity: "base",
        }),
      );
    case "popularity":
    default:
      return sortedProducts.sort((a, b) => a.popularityRank - b.popularityRank);
  }
}

export function searchProducts(query: string, mode?: Mode): Product[] {
  const products = mode
    ? getProductsByMode(mode)
    : getModes().flatMap(getProductsByMode);

  return filterProducts(products, { query });
}

export function getStaticCategoryParams(): StaticCategoryParam[] {
  return getModes().flatMap((mode) =>
    getCategories(mode).map((category) => ({
      mode,
      categorySlug: category.slug,
    })),
  );
}

export function getStaticProductParams(): StaticProductParam[] {
  return getModes().flatMap((mode) =>
    getProductsByMode(mode).map((product) => ({
      mode,
      categorySlug: product.categorySlug,
      productSlug: getProductSlug(product),
    })),
  );
}

export function getStaticSubcategoryParams(): Array<
  StaticCategoryParam & { subcategorySlug: string }
> {
  return getStaticCategoryParams().flatMap(({ mode, categorySlug }) =>
    getCategorySubcategories(mode, categorySlug).map((subcategory) => ({
      mode,
      categorySlug,
      subcategorySlug: subcategory.slug,
    })),
  );
}

export function getProductUrl(product: Product, mode: Mode): string {
  return `/${mode}/${product.categorySlug}/${getProductSlug(product)}/`;
}

export function getCategoryUrl(category: Category, mode: Mode): string {
  return `/${mode}/${category.slug}/`;
}

export function getBrands(mode: Mode) {
  return [...catalogue.brands[getValidMode(mode)]];
}

export function getVehicles() {
  return [...catalogue.vehicles];
}

export function getApplications() {
  return [...catalogue.applications];
}

export function getVehiclesForMode(mode: Mode): VehicleEntity[] {
  return mode === "industrial" ? getApplications() : getVehicles();
}

export function getVehicleBySlug(slug: string): VehicleType | null {
  return findBySlug(getVehicles(), slug);
}

export function getApplicationBySlug(slug: string): ApplicationType | null {
  return findBySlug(getApplications(), slug);
}

export function getVehicleEntityBySlug(slug: string): VehicleEntity | null {
  return getVehicleBySlug(slug) || getApplicationBySlug(slug);
}

export function getStaticVehicleParams(): Array<{ type: string }> {
  return [
    ...getVehicles().map((entity) => ({ type: entity.slug })),
    ...getApplications().map((entity) => ({ type: entity.slug })),
  ];
}

export function getVehicleEntityUrl(entity: VehicleEntity): string {
  return `/vehicle/${entity.slug}/`;
}

export function normalizeSearchQuery(query: string): string {
  return slugify(query).replace(/-/g, " ");
}
