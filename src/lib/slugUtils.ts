export interface SlugSource {
  name?: string;
  title?: string;
  slug?: string;
  slugOverride?: string;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getPreferredSlug(source: SlugSource | string): string {
  if (typeof source === "string") {
    return slugify(source);
  }

  return (
    source.slugOverride ||
    source.slug ||
    slugify(source.title || source.name || "")
  );
}

export function slugsMatch(source: SlugSource | string, slug: string): boolean {
  const expectedSlug = getPreferredSlug(source);
  const normalizedSlug = slugify(slug);

  return expectedSlug === slug || expectedSlug === normalizedSlug;
}

export function findBySlug<T extends SlugSource>(
  items: readonly T[],
  slug: string,
): T | null {
  return items.find((item) => slugsMatch(item, slug)) || null;
}

export function getCategorySlug(category: SlugSource | string): string {
  return getPreferredSlug(category);
}

export function getProductSlug(product: SlugSource | string): string {
  return getPreferredSlug(product);
}
