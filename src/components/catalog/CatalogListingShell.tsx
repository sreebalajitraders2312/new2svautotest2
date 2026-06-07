"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Mode, Product } from "@/data/types";
import type { ProductSort } from "@/lib/dataUtils";
import { filterProducts, sortProducts } from "@/lib/dataUtils";
import { ProductCard } from "@/components/catalog/ProductCard";
import { FilterPanel } from "@/components/catalog/FilterPanel";
import { SortDropdown } from "@/components/catalog/SortDropdown";
import {
  ViewToggle,
  type CatalogViewMode,
} from "@/components/catalog/ViewToggle";

interface CatalogListingShellProps {
  brandLabel: string;
  brandPlaceholder: string;
  categoryTitle: string;
  compatibilityLabel: string;
  compatibilityPlaceholder: string;
  filterPanelCopy: string;
  filterPanelTitle: string;
  mode: Mode;
  products: Product[];
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export function CatalogListingShell({
  brandLabel,
  brandPlaceholder,
  categoryTitle,
  compatibilityLabel,
  compatibilityPlaceholder,
  filterPanelCopy,
  filterPanelTitle,
  mode,
  products,
}: CatalogListingShellProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Dummy options
  const vehicleManufacturerOptions = ["Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "Volkswagen", "Hyundai", "Kia", "BMW", "Mercedes-Benz"];
  const vehicleModelOptions = ["Corolla", "Civic", "F-150", "Silverado", "Altima", "Jetta", "Elantra", "Optima", "3 Series", "C-Class"];
  const toolTypeOptions = ["Wrench", "Screwdriver", "Pliers", "Hammer", "Drill", "Saw", "Socket Set", "Allen Key", "Mallet", "Tape Measure"];
  const vehicleTypeOptions = ["Sedan", "SUV", "Truck", "Hatchback", "Coupe", "Convertible", "Minivan", "Wagon", "Van", "Pickup"];

  const [draftBrand, setDraftBrand] = useState("");
  const [draftVehicleManufacturer, setDraftVehicleManufacturer] = useState("");
  const [draftVehicleModel, setDraftVehicleModel] = useState("");
  const [draftToolType, setDraftToolType] = useState("");
  const [draftVehicleType, setDraftVehicleType] = useState("");

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedVehicleManufacturer, setSelectedVehicleManufacturer] = useState("");
  const [selectedVehicleModel, setSelectedVehicleModel] = useState("");
  const [selectedToolType, setSelectedToolType] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [sort, setSort] = useState<ProductSort>("popularity");
  const [viewMode, setViewMode] = useState<CatalogViewMode>("grid");

  const brandOptions = useMemo(
    () => uniqueSorted(products.map((product) => product.brand)),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(products, {
      brand: selectedBrand || undefined,
    });

    return sortProducts(filtered, sort);
  }, [products, selectedBrand, sort]);
  const hasProducts = products.length > 0;

  const activeFilterCount =
    (selectedBrand ? 1 : 0) + (selectedVehicleManufacturer ? 1 : 0) + (selectedVehicleModel ? 1 : 0) + (selectedToolType ? 1 : 0) + (selectedVehicleType ? 1 : 0);

  useEffect(() => {
    if (!isFilterOpen) {
      document.body.classList.remove("filter-open");
      return;
    }

    document.body.classList.add("filter-open");

    return () => {
      document.body.classList.remove("filter-open");
    };
  }, [isFilterOpen]);

  useEffect(() => {
    if (!isFilterOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFilterOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isFilterOpen]);

  const openFilterPanel = () => {
    setDraftBrand(selectedBrand);
    setDraftVehicleManufacturer(selectedVehicleManufacturer);
    setDraftVehicleModel(selectedVehicleModel);
    setDraftToolType(selectedToolType);
    setDraftVehicleType(selectedVehicleType);
    setIsFilterOpen(true);
  };

  const applyFilters = () => {
    setSelectedBrand(draftBrand);
    setSelectedVehicleManufacturer(draftVehicleManufacturer);
    setSelectedVehicleModel(draftVehicleModel);
    setSelectedToolType(draftToolType);
    setSelectedVehicleType(draftVehicleType);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setDraftBrand("");
    setDraftVehicleManufacturer("");
    setDraftVehicleModel("");
    setDraftToolType("");
    setDraftVehicleType("");
    setSelectedBrand("");
    setSelectedVehicleManufacturer("");
    setSelectedVehicleModel("");
    setSelectedToolType("");
    setSelectedVehicleType("");
    setIsFilterOpen(false);
  };

  const clearBrand = () => {
    setSelectedBrand("");
    setDraftBrand("");
  };

  const clearVehicleManufacturer = () => {
    setSelectedVehicleManufacturer("");
    setDraftVehicleManufacturer("");
  };

  const clearVehicleModel = () => {
    setSelectedVehicleModel("");
    setDraftVehicleModel("");
  };

  const clearToolType = () => {
    setSelectedToolType("");
    setDraftToolType("");
  };

  const clearVehicleType = () => {
    setSelectedVehicleType("");
    setDraftVehicleType("");
  };

  return (
    <div className="catalog-listing-shell">
      {hasProducts ? (
        <>
          <div
            className="catalog-toolbar"
            aria-label={`${categoryTitle} listing controls`}
          >
            <button
              aria-expanded={isFilterOpen}
              aria-haspopup="dialog"
              className="catalog-filter-btn"
              type="button"
              onClick={openFilterPanel}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              <span>Filter</span>
              {activeFilterCount > 0 ? (
                <span className="catalog-filter-badge">{activeFilterCount}</span>
              ) : null}
            </button>

            <SortDropdown onChange={setSort} value={sort} />
          </div>

          <div className="catalog-subbar">
            <div className="catalog-count">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "Product" : "Products"} Found
            </div>

            <ViewToggle onChange={setViewMode} value={viewMode} />
          </div>
        </>
      ) : null}

      {hasProducts && filteredProducts.length > 0 ? (
        <div
          className={`category-grid${viewMode === "list" ? " category-grid--list" : ""}`}
          aria-label={`${categoryTitle} products`}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              mode={mode}
              product={product}
              variant={viewMode}
            />
          ))}
        </div>
      ) : hasProducts ? (
        <div className="catalog-empty" role="status">
          <h3>No products match these filters</h3>
          <p>
            Clear one or more filters to see the available parts in this
            category.
          </p>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={resetFilters}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="catalog-empty" role="status">
          <h3>{categoryTitle} products are available on enquiry</h3>
          <p>
            This category is active, but individual products are not listed
            online yet. Contact the team for current availability, brands, and
            bulk pricing.
          </p>
          <div className="catalog-empty-actions">
            <Link className="btn btn-primary" href="/contact">
              Enquire now
            </Link>
            <Link className="btn btn-secondary" href="/categories">
              Browse categories
            </Link>
          </div>
        </div>
      )}

      {hasProducts ? (
        <FilterPanel
          brandOptions={brandOptions}
          brandValue={draftBrand}
          copy={filterPanelCopy}
          onApply={applyFilters}
          onBrandChange={setDraftBrand}
          onClose={() => setIsFilterOpen(false)}
          onReset={resetFilters}
          onToolTypeChange={setDraftToolType}
          onVehicleManufacturerChange={setDraftVehicleManufacturer}
          onVehicleModelChange={setDraftVehicleModel}
          onVehicleTypeChange={setDraftVehicleType}
          open={isFilterOpen}
          title={filterPanelTitle}
          toolTypeOptions={toolTypeOptions}
          toolTypeValue={draftToolType}
          vehicleManufacturerOptions={vehicleManufacturerOptions}
          vehicleManufacturerValue={draftVehicleManufacturer}
          vehicleModelOptions={vehicleModelOptions}
          vehicleModelValue={draftVehicleModel}
          vehicleTypeOptions={vehicleTypeOptions}
          vehicleTypeValue={draftVehicleType}
        />
      ) : null}
    </div>
  );
}
