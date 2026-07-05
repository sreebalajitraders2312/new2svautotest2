import type { Product } from "@/data/types";

export function getAssetPath(path?: string): string {
  if (!path) {
    return "";
  }

  if (path.startsWith("http") || path.startsWith("/")) {
    return path;
  }

  return `/${path}`;
}

export function getProductImagePath(product: Product): string {
  return getAssetPath(product.image || product.imageUrl);
}

export function getFallbackInitials(title: string): string {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
