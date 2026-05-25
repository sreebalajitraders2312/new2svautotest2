"use client";

import type { ProductSort } from "@/lib/dataUtils";
import { useState, useRef, useEffect } from "react";

interface SortOption {
  label: string;
  value: ProductSort;
}

interface SortDropdownProps {
  onChange: (sort: ProductSort) => void;
  options?: SortOption[];
  value: ProductSort;
}

const DEFAULT_OPTIONS: SortOption[] = [
  { label: "Sort by: Popular", value: "popularity" },
  { label: "Sort by: Name A-Z", value: "name-ascending" },
  { label: "Sort by: OEM Number", value: "oem-ascending" },
];

export function SortDropdown({
  onChange,
  options = DEFAULT_OPTIONS,
  value,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? options[0].label;

  return (
    <div className="custom-dropdown" ref={containerRef}>
      <button
        type="button"
        className="custom-dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Sort products"
      >
        <span className="custom-dropdown-value">{selectedLabel}</span>
        <svg
          className={`custom-dropdown-icon ${isOpen ? "open" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="custom-dropdown-menu">
          <ul className="custom-dropdown-list">
            {options.map((option) => (
              <li
                key={option.value}
                className={`custom-dropdown-item ${value === option.value ? "selected" : ""}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
