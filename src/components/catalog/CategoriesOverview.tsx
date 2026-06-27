"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMode } from "@/context/ModeContext";
import { getCatalogue, getCategories } from "@/lib/dataUtils";

import { CategoryCard } from "@/components/catalog/CategoryCard";
import { CustomDropdown } from "@/components/catalog/CustomDropdown";
import { SearchInput } from "@/components/search/SearchInput";

function sanitizeQuery(value: string): string {
  return value.replace(/[<>]/g, "").trim();
}

export function CategoriesOverview() {
  const { mode } = useMode();
  const catalogue = getCatalogue();
  const categories = getCategories(mode);
  const content = catalogue.modes[mode].categoriesOverview;
  const [query, setQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftCategory, setDraftCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredCategories = useMemo(() => {
    const cleanedQuery = sanitizeQuery(query).toLowerCase();

    return categories.filter((category) => {
      if (selectedCategory && category.title !== selectedCategory) {
        return false;
      }

      if (!cleanedQuery) {
        return true;
      }

      return [
        category.title,
        category.description,
        category.count,
        category.catalogueCopy,
      ]
        .join(" ")
        .toLowerCase()
        .includes(cleanedQuery);
    });
  }, [categories, query, selectedCategory]);

  const activeFilterCount = selectedCategory ? 1 : 0;
  const categoryOptions = categories.map((category) => category.title);

  const openFilterPanel = () => {
    setDraftCategory(selectedCategory);
    setIsFilterOpen(true);
  };

  const applyFilters = () => {
    setSelectedCategory(draftCategory);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setDraftCategory("");
    setSelectedCategory("");
    setQuery("");
    setIsFilterOpen(false);
  };

  return (
    <>
      <section
        className="section"
        style={{ paddingTop: '16px', paddingBottom: '24px', backgroundColor: '#ffffff' }}
        aria-labelledby="categories-overview-title"
      >
        <div className="container">
          <div className="category-overview-shell">
            <nav className="category-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link><span aria-hidden="true">&gt;</span><span>Categories</span>
            </nav>

            <div className="category-overview-hero">
              <div className="overview-badge">
                <span className="overview-badge-dot" aria-hidden="true"></span>
                {mode === "automobile" ? "ALL CATEGORIES" : "INDUSTRIAL CATEGORIES"}
              </div>
              <h1 id="categories-overview-title">
                {content.title.split(' ').map((word: string, i: number, arr: string[]) => (
                  <span key={i} className={word.toLowerCase() === 'all' || word.toLowerCase() === 'industrial' ? 'overview-highlight' : ''}>
                    {word.toUpperCase()}{i < arr.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </h1>

              <p id="categories-overview-copy">{content.copy}</p>
              <div className="category-overview-search">
                <SearchInput
                  activeFilterCount={activeFilterCount}
                  onChange={setQuery}
                  onFilterClick={openFilterPanel}
                  onSubmit={() => setQuery((current) => sanitizeQuery(current))}
                  value={query}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {isFilterOpen ? (
        <>
          <button
            aria-label="Close category filters"
            className="filter-backdrop open"
            type="button"
            onClick={() => setIsFilterOpen(false)}
          />
          <div
            aria-labelledby="category-filter-title"
            aria-modal="true"
            className="filter-sheet open"
            role="dialog"
          >
            <div className="filter-head">
              <div>
                <h2 className="filter-title" id="category-filter-title">
                  Filter <span>Categories</span>
                </h2>
                <p className="filter-copy">
                  Narrow the category list before choosing a product family.
                </p>
              </div>
              <button
                aria-label="Close category filters"
                className="close-btn"
                type="button"
                onClick={() => setIsFilterOpen(false)}
              >
                x
              </button>
            </div>

            <form
              className="filter-form"
              onSubmit={(event) => {
                event.preventDefault();
                applyFilters();
              }}
            >
              <label className="filter-field">
                <span>Category</span>
                <CustomDropdown
                  onChange={setDraftCategory}
                  options={categoryOptions}
                  placeholder="All Categories"
                  value={draftCategory}
                />
              </label>

              <div className="filter-actions">
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={resetFilters}
                >
                  Reset
                </button>
                <button className="btn btn-primary" type="submit">
                  Apply Filters
                </button>
              </div>
            </form>
          </div>
        </>
      ) : null}
      <section className="section" style={{ paddingTop: '24px' }}>
        <div className="container">
          <div className="category-overview-shell">
            <div
              className="category-overview-grid"
              aria-label={`${mode} categories`}
            >
              {filteredCategories.map((category) => (
                <CategoryCard
                  category={category}
                  mode={mode}
                  variant="strip"
                  key={category.id}
                />
              ))}
              {filteredCategories.length === 0 ? (
                <div className="catalog-empty category-overview-empty" role="status">
                  <h3>No categories match your search</h3>
                  <p>Try another OEM number, part name, brand, or product family.</p>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={resetFilters}
                  >
                    Clear search
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

