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
import { getStableCategoryImage } from "@/data/categoryProductImages";
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
  toolType?: string;
  query?: string;
  vehicleManufacturer?: string;
  vehicleModel?: string;
  vehicleType?: string;
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

function withStableProductImages(source: Catalogue): Catalogue {
  return {
    ...source,
    products: {
      automobile: Object.fromEntries(
        Object.entries(source.products.automobile).map(([categorySlug, products]) => [
          categorySlug,
          products.map((product, index) => ({
            ...product,
            image: getStableCategoryImage(product, index),
          })),
        ]),
      ),
      industrial: Object.fromEntries(
        Object.entries(source.products.industrial).map(([categorySlug, products]) => [
          categorySlug,
          products.map((product, index) => ({
            ...product,
            image: getStableCategoryImage(product, index),
          })),
        ]),
      ),
    },
  };
}

export const catalogue = withStableProductImages(
  catalogJson as unknown as Catalogue,
);

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
        imageUrl: firstProduct.image || firstProduct.imageUrl,
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

    if (
      filters.vehicleManufacturer &&
      product.technicalSpecs?.["Vehicle Manufacturer"] !== filters.vehicleManufacturer
    ) {
      return false;
    }

    if (
      filters.vehicleType &&
      product.technicalSpecs?.["Vehicle Type"] !== filters.vehicleType
    ) {
      return false;
    }

    if (
      filters.toolType &&
      product.technicalSpecs?.["Sub Category"] !== filters.toolType
    ) {
      return false;
    }

    if (filters.vehicleModel) {
      const models = [
        ...(product.compatibleVehicles || []),
        ...(product.compatibleApplications || []),
      ];

      if (!models.includes(filters.vehicleModel)) {
        return false;
      }
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

export function getCompatibleProductsForVehicle(entity: VehicleEntity): Array<{ product: Product; mode: Mode }> {
  const allProducts = getModes().flatMap((mode) => 
    getProductsByMode(mode).map((product) => ({ product, mode }))
  );
  
  const matched = new Set<string>();
  const results: Array<{ product: Product; mode: Mode }> = [];

  for (const part of entity.parts) {
    const partLower = part.toLowerCase();
    // Simple fuzzy match by part name in product name or category
    for (const item of allProducts) {
      if (!matched.has(item.product.id)) {
        const prodName = item.product.name.toLowerCase();
        const prodCat = item.product.category.toLowerCase();
        if (prodName.includes(partLower) || partLower.includes(prodCat) || prodCat.includes(partLower)) {
          results.push(item);
          matched.add(item.product.id);
        }
      }
    }
  }

  // Fallback to top products for the vehicle's mode if no direct match found
  if (results.length === 0) {
    const mode = "badge" in entity ? "industrial" : "automobile";
    return allProducts.filter(p => p.mode === mode).slice(0, 8);
  }

  return results.slice(0, 8);
}

export interface VehiclePartProductLink {
  part: string;
  product: Product;
  mode: Mode;
  href: string;
}

const PART_CATEGORY_KEYWORDS: Array<{
  pattern: RegExp;
  mode: Mode;
  categorySlug: string;
}> = [
  { pattern: /clutch|pressure plate|drive belt|chain|coupling|gear|cv joint/i, mode: "automobile", categorySlug: "transmission" },
  { pattern: /fuel filter|oil filter|air filter|filter assembly|air cleaner/i, mode: "automobile", categorySlug: "filters" },
  { pattern: /radiator|coolant|cooling|hose/i, mode: "automobile", categorySlug: "cooling" },
  { pattern: /hydraulic|pump|valve|seal kit/i, mode: "industrial", categorySlug: "hydraulic-hoses" },
  { pattern: /lamp|light|relay|starter|alternator|sensor|switch|battery|indicator/i, mode: "automobile", categorySlug: "electrical" },
  { pattern: /brake|disc pad|pad set|shoe|drum|caliper|master cylinder/i, mode: "automobile", categorySlug: "brake-parts" },
  { pattern: /steering|joint|mount|shock|spring|bush|bearing/i, mode: "automobile", categorySlug: "suspension" },
  { pattern: /head lamp|tail lamp|mirror|body|handle/i, mode: "automobile", categorySlug: "body-parts" },
  { pattern: /bearing|roller/i, mode: "industrial", categorySlug: "bearings" },
  { pattern: /motor|fan/i, mode: "industrial", categorySlug: "motors" },
];

function tokenizePartName(value: string): string[] {
  return slugify(value)
    .split("-")
    .filter((token) => token.length > 2 && !["and", "set", "kit", "assy", "unit"].includes(token));
}

function scoreProductForPart(part: string, product: Product, preferredCategory?: string) {
  const partTokens = tokenizePartName(part);
  const productTokens = tokenizePartName(
    `${product.name} ${product.category} ${product.shortDescription}`,
  );
  const productText = productTokens.join(" ");
  const matchedTokens = partTokens.filter((token) => productText.includes(token));
  let score = matchedTokens.length * 10;

  if (product.name.toLowerCase().includes(part.toLowerCase())) {
    score += 60;
  }

  if (preferredCategory && product.categorySlug === preferredCategory) {
    score += 35;
  }

  score -= product.popularityRank / 100;

  return score;
}

export function getVehiclePartProductLinks(
  entity: VehicleEntity,
): VehiclePartProductLink[] {
  const defaultMode: Mode = "badge" in entity ? "industrial" : "automobile";
  const allProducts = getModes().flatMap((mode) =>
    getProductsByMode(mode).map((product) => ({ product, mode })),
  );

  return entity.parts.map((part) => {
    const categoryHint = PART_CATEGORY_KEYWORDS.find((entry) =>
      entry.pattern.test(part),
    );
    const preferredMode = categoryHint?.mode || defaultMode;
    const preferredCategory = categoryHint?.categorySlug;
    const candidates = allProducts.filter(({ product, mode }) => {
      if (preferredCategory) {
        return mode === preferredMode && product.categorySlug === preferredCategory;
      }

      return mode === preferredMode;
    });
    const pool = candidates.length > 0 ? candidates : allProducts.filter(({ mode }) => mode === preferredMode);
    const best = [...pool].sort(
      (a, b) =>
        scoreProductForPart(part, b.product, preferredCategory) -
        scoreProductForPart(part, a.product, preferredCategory),
    )[0];

    return {
      part,
      product: best.product,
      mode: best.mode,
      href: getProductUrl(best.product, best.mode),
    };
  });
}
