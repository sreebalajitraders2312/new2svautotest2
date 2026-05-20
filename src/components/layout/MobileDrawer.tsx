"use client";

import Link from "next/link";
import type { ModeContent } from "@/data/types";

export interface NavItem {
  href: string;
  label: string;
  page: string;
  active: boolean;
}

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brandSub: string;
  navItems: NavItem[];
  nav: ModeContent["nav"];
}

export function MobileDrawer({
  isOpen,
  onClose,
  brandSub,
  navItems,
  nav,
}: MobileDrawerProps) {
  return (
    <>
      <button
        className={`nav-backdrop${isOpen ? " open" : ""}`}
        type="button"
        aria-label="Close menu"
        onClick={onClose}
      />
      <aside
        className={`mobile-nav${isOpen ? " open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        <div className="mobile-nav-head">
          <span className="brand">
            <span className="brand-mark">SV</span>
            <span>
              <span className="brand-name">SV Enterprises</span>
              <span className="brand-sub">{brandSub}</span>
            </span>
          </span>
          <button
            className="close-btn"
            type="button"
            onClick={onClose}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>
        <div className="mobile-nav-list">
          {navItems.map((item) => (
            <Link
              className={`mobile-link${item.active ? " active" : ""}`}
              data-page={item.page}
              href={item.href}
              key={item.href}
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
          <Link
            className="mobile-link"
            data-page="search"
            href="/search"
            onClick={onClose}
          >
            {nav.mobileSearch}
          </Link>
        </div>
        <Link
          className="btn btn-primary mobile-cta"
          href="/contact"
          onClick={onClose}
        >
          {nav.quote}
        </Link>
      </aside>
    </>
  );
}
