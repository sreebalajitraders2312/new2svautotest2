"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Catalogue, Mode, ModeContent } from "@/data/types";
import { useMode } from "@/context/ModeContext";
import { getModeFromPathname } from "@/lib/modeUtils";
import { MobileDrawer, type NavItem } from "@/components/layout/MobileDrawer";

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 16V9l2-3h10l2 3v7" />
      <path d="M7 16h10" />
      <path d="M6 13h12" />
      <circle cx="7.5" cy="17.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="17.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IndustrialIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 12H5a2 2 0 0 0-2 2v5h18v-2l-3-6h-6z" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="17" cy="19" r="2" />
      <path d="M8 12V6h4v6" />
    </svg>
  );
}

function ModeTabs({ mode, onModeChange }: { mode: Mode; onModeChange: (m: Mode) => void }) {
  return (
    <div className="mode-tabs-wrap">
      <div className="mode-tabs-strip" role="tablist" aria-label="Choose product type">
        <button
          className={`mode-tab-btn${mode === "automobile" ? " active" : ""}`}
          type="button"
          role="tab"
          aria-selected={mode === "automobile"}
          onClick={() => onModeChange("automobile")}
          id="tab-automobile"
        >
          <CarIcon />
          <span>Auto Spare Parts</span>
        </button>
        <button
          className={`mode-tab-btn${mode === "industrial" ? " active" : ""}`}
          type="button"
          role="tab"
          aria-selected={mode === "industrial"}
          onClick={() => onModeChange("industrial")}
          id="tab-industrial"
        >
          <IndustrialIcon />
          <span>Industrial Parts</span>
        </button>
      </div>
    </div>
  );
}

interface HeaderProps {
  modes: Catalogue["modes"];
}

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/categories") {
    return (
      pathname === href ||
      pathname.startsWith("/automobile/") ||
      pathname.startsWith("/industrial/")
    );
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function getNavItems(pathname: string, nav: ModeContent["nav"]): NavItem[] {
  return [
    { href: "/", label: "Home", page: "home" },
    { href: "/categories", label: "Products", page: "categories" },
    { href: "/vehicle", label: nav.explore, page: "vehicle" },
    { href: "/brands", label: "Brands", page: "brands" },
    { href: "/contact", label: "Contact", page: "contact" },
  ].map((item) => ({
    ...item,
    active: isActivePath(pathname, item.href),
  }));
}

export function Header({ modes }: HeaderProps) {
  const pathname = usePathname();
  const { mode, setMode } = useMode();
  const routeMode = getModeFromPathname(pathname);
  const currentMode = routeMode || mode;
  const modeContent = modes[currentMode];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navItems = useMemo(
    () => getNavItems(pathname, modeContent.nav),
    [pathname, modeContent.nav],
  );

  useEffect(() => {
    document.body.classList.toggle("nav-open", drawerOpen);
    return () => document.body.classList.remove("nav-open");
  }, [drawerOpen]);

  return (
    <>
      <header className="site-header">
        {/* Row 1: Logo + Actions */}
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label="Go to home">
            <span className="brand-mark">SV</span>
            <span>
              <span className="brand-name">SV Enterprises</span>
              <span className="brand-sub">{modeContent.brandSub}</span>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link
                className={`nav-link${item.active ? " active" : ""}`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <Link className="btn btn-secondary" href="/search">
              {modeContent.nav.search}
            </Link>
            <Link className="btn btn-primary" href="/contact">
              {modeContent.nav.quote}
            </Link>
            <button
              className="icon-btn"
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
            >
              <span />
            </button>
          </div>
        </div>

        {/* Row 2: Full-width mode tabs (Home page only) */}
        {pathname === "/" && <ModeTabs mode={currentMode} onModeChange={setMode} />}
      </header>

      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        brandSub={modeContent.brandSub}
        nav={modeContent.nav}
        navItems={navItems}
      />
    </>
  );
}
