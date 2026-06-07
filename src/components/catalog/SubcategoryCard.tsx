"use client";

import Image from "next/image";
import Link from "next/link";
import type { Mode } from "@/data/types";
import type { ProductSubcategory } from "@/lib/dataUtils";
import { getAssetPath, getFallbackInitials } from "@/components/catalog/cardUtils";

interface SubcategoryCardProps {
  categorySlug: string;
  mode: Mode;
  subcategory: ProductSubcategory;
}

export function SubcategoryCard({
  categorySlug,
  mode,
  subcategory,
}: SubcategoryCardProps) {
  const imagePath = getAssetPath(subcategory.imageUrl);

  return (
    <Link
      className="category-card category-card-clean subcategory-card"
      href={`/${mode}/${categorySlug}/sub/${subcategory.slug}/`}
    >
      <div className="cat-visual">
        {imagePath ? (
          <Image
            src={imagePath}
            alt=""
            aria-hidden="true"
            width={130}
            height={112}
          />
        ) : null}
        <span className="cat-icon" aria-hidden="true">
          {getFallbackInitials(subcategory.title)}
        </span>
      </div>
      <h3>{subcategory.title}</h3>
    </Link>
  );
}
