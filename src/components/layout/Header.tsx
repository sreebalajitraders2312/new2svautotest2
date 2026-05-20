"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Catalogue, ModeContent } from "@/data/types";
import { useMode } from "@/context/ModeContext";
import { getModeFromPathname } from "@/lib/modeUtils";
import { MobileDrawer, type NavItem } from "@/components/layout/MobileDrawer";

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
  const { mode } = useMode();
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
                data-page={item.page}
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
