"use client";

import type { Mode } from "@/data/types";

interface ModeToggleProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="hero-mode-switch" aria-label="Choose product type">
      <button
        className={`hero-mode-btn${mode === "automobile" ? " active" : ""}`}
        type="button"
        onClick={() => onModeChange("automobile")}
        aria-pressed={mode === "automobile"}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 16V9l2-3h10l2 3v7" />
          <path d="M7 16h10" />
          <path d="M6 13h12" />
          <circle
            cx="7.5"
            cy="17.5"
            r="1.5"
            fill="currentColor"
            stroke="none"
          />
          <circle
            cx="16.5"
            cy="17.5"
            r="1.5"
            fill="currentColor"
            stroke="none"
          />
        </svg>
        <span>Auto Spare parts</span>
      </button>
      <button
        className={`hero-mode-btn${mode === "industrial" ? " active" : ""}`}
        type="button"
        onClick={() => onModeChange("industrial")}
        aria-pressed={mode === "industrial"}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 12H5a2 2 0 0 0-2 2v5h18v-2l-3-6h-6z" />
          <circle cx="7" cy="19" r="2" />
          <circle cx="17" cy="19" r="2" />
          <path d="M8 12V6h4v6" />
        </svg>
        <span>Industrial Parts</span>
      </button>
    </div>
  );
}
