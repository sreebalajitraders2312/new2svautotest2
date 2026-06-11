"use client";

import Link from "next/link";
import Image from "next/image";
import type { Category, Mode } from "@/data/types";
import { getCategoryUrl } from "@/lib/dataUtils";
import {
  getAssetPath,
  getFallbackInitials,
} from "@/components/catalog/cardUtils";

interface CategoryCardProps {
  category: Category;
  mode: Mode;
  variant?: "strip" | "overview";
}

export function CategoryCard({
  category,
  mode,
  variant = "strip",
}: CategoryCardProps) {
  const imagePath = getAssetPath(category.imageUrl);
  const isOverview = variant === "overview";
  const className = isOverview ? "category-overview-card" : "category-card category-card-clean";

  return (
    <Link className={className} href={getCategoryUrl(category, mode)}>
      <div className="cat-visual">
          {imagePath ? (
          <Image
            src={imagePath}
            alt={isOverview ? category.title : ""}
            aria-hidden={isOverview ? undefined : "true"}
            width={130}
            height={112}
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
          />
        ) : null}
        <span className="cat-icon" aria-hidden="true">
          {getFallbackInitials(category.title)}
        </span>
      </div>
      <h3>{category.title}</h3>
      {isOverview && (
        <div className="category-overview-meta">
          <span className="category-overview-count">{category.count}</span>
          <span className="category-overview-link">View products</span>
        </div>
      )}
    </Link>
  );
}
