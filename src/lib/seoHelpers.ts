import type { Metadata } from "next";
import type { Category, Mode, Product } from "@/data/types";
import {
  getCategoryProducts,
  getCategoryUrl,
  getProductUrl,
} from "@/lib/dataUtils";

export const DEFAULT_SITE_URL = "https://new-sv-auto-test.web.app";
export const BUSINESS_NAME = "SV Enterprises";
export const BUSINESS_PHONE = "+91 80 2345 6789";

export interface SeoMetadataInput {
  title: string;
  description: string;
  path?: string;
  siteUrl?: string;
  keywords?: string[];
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

export type JsonLdObject = { [key: string]: JsonLdValue };

export function absoluteUrl(
  path = "/",
  siteUrl = DEFAULT_SITE_URL,
): string {
  const normalizedSiteUrl = siteUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedSiteUrl}${normalizedPath}`;
}

export function buildMetadata(input: SeoMetadataInput): Metadata {
  const url = absoluteUrl(input.path || "/", input.siteUrl);

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: BUSINESS_NAME,
      type: "website",
    },
  };
}

export function buildHomeMetadata(mode: Mode, description: string): Metadata {
  const title =
    mode === "industrial"
      ? "SV Enterprises - Industrial Products Wholesale Dealer Bangalore"
      : "SV Enterprises - Automobile Spare Parts Bangalore";

  return buildMetadata({
    title,
    description,
    path: "/",
    keywords: [
      BUSINESS_NAME,
      mode === "industrial"
        ? "industrial products Bangalore"
        : "automobile spare parts Bangalore",
    ],
  });
}

export function buildCategoryMetadata(
  mode: Mode,
  category: Category,
): Metadata {
  const seoTitle =
    mode === "industrial" && category.title === "Hydraulic Parts"
      ? "Hydraulic Hoses & Hydraulic Parts"
      : category.title;
  const productLabel =
    mode === "industrial" ? "industrial products" : "automobile spare parts";

  return buildMetadata({
    title: `${seoTitle} Wholesale Dealer in Bangalore | ${BUSINESS_NAME}`,
    description: `${category.catalogueCopy} Available from ${BUSINESS_NAME}, Bangalore wholesale dealer for ${productLabel}.`,
    path: getCategoryUrl(category, mode),
    keywords: [category.title, productLabel, BUSINESS_NAME],
  });
}

export function buildProductMetadata(
  mode: Mode,
  product: Product,
): Metadata {
  return buildMetadata({
    title: `${product.name} ${product.oemNumber} | ${product.category} Bangalore | ${BUSINESS_NAME}`,
    description: `Enquire for ${product.name} (${product.oemNumber || "standard specification"}) from ${BUSINESS_NAME}, Bangalore wholesale dealer for ${product.category.toLowerCase()}.`,
    path: getProductUrl(product, mode),
    keywords: [
      product.name,
      product.oemNumber,
      product.category,
      product.brand,
      BUSINESS_NAME,
    ],
  });
}

export function buildLocalBusinessJsonLd(
  siteUrl = DEFAULT_SITE_URL,
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${absoluteUrl("/", siteUrl)}#business`,
    name: BUSINESS_NAME,
    url: absoluteUrl("/", siteUrl),
    telephone: BUSINESS_PHONE,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
  };
}

export function buildBreadcrumbListJsonLd(
  items: readonly BreadcrumbItem[],
  siteUrl = DEFAULT_SITE_URL,
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, siteUrl),
    })),
  };
}

export function buildProductJsonLd(
  product: Product,
  mode: Mode,
  siteUrl = DEFAULT_SITE_URL,
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: {
      "@type": "Brand",
      name: product.brand || BUSINESS_NAME,
    },
    sku: product.oemNumber,
    description: product.fullDescription || product.shortDescription,
    category: product.category,
    url: absoluteUrl(getProductUrl(product, mode), siteUrl),
  };
}

export function buildItemListJsonLd(
  mode: Mode,
  category: Category,
  products = getCategoryProducts(mode, category.slug),
  siteUrl = DEFAULT_SITE_URL,
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.title} products`,
    url: absoluteUrl(getCategoryUrl(category, mode), siteUrl),
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: absoluteUrl(getProductUrl(product, mode), siteUrl),
    })),
  };
}
