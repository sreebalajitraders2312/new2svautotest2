"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Catalogue, ModeContent } from "@/data/types";
import { useMode } from "@/context/ModeContext";
import { getModeFromPathname } from "@/lib/modeUtils";

interface FooterProps {
  catalogue: Catalogue;
}

function getFooterNavItems(nav: ModeContent["nav"]) {
  return [
    { href: "/", label: "Home" },
    { href: "/categories", label: "Products" },
    { href: "/vehicle", label: nav.explore },
    { href: "/brands", label: "Brands" },
    { href: "/search", label: nav.search },
    { href: "/contact", label: "Contact" },
  ];
}

function getMapHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function FooterArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

export function Footer({ catalogue }: FooterProps) {
  const pathname = usePathname();
  const { mode } = useMode();
  const routeMode = getModeFromPathname(pathname);
  const currentMode = routeMode || mode;
  const modeContent = catalogue.modes[currentMode];
  const contactPage = modeContent.contactPage;
  const productCategories = catalogue.categories[currentMode].slice(0, 8);
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-shell">
        <div className="footer-directory">
          <nav className="footer-col" aria-label="Footer product links">
            <h2>Products</h2>
            <ul className="footer-link-list">
              {productCategories.map((category) => (
                <li key={category.id}>
                  <Link href={`/${currentMode}/${category.slug}`}>
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-col" aria-label="Footer division links">
            <h2>Divisions</h2>
            <ul className="footer-link-list">
              <li>
                <Link href="/automobile/engine-parts">Automobile Spare Parts</Link>
              </li>
              <li>
                <Link href="/industrial/bearings">Industrial Products</Link>
              </li>
              <li>
                <Link href="/vehicle">{modeContent.nav.explore}</Link>
              </li>
              <li>
                <Link href="/categories">All Categories</Link>
              </li>
            </ul>
          </nav>

          <nav className="footer-col" aria-label="Footer company links">
            <h2>Company</h2>
            <ul className="footer-link-list">
              {getFooterNavItems(modeContent.nav).map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col footer-visit">
            <h2>Visit</h2>
            <address className="footer-address">
              <strong>SV Enterprises</strong>
              <span>{contactPage.subtitle}</span>
              <p>{contactPage.address}</p>
              <p>
                {contactPage.hoursCopy.split("<br>").map((line, index) => (
                  <span key={line}>
                    {index > 0 ? <br /> : null}
                    {line}
                  </span>
                ))}
              </p>
            </address>
            <a
              className="footer-map-link"
              href={getMapHref(contactPage.address)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Maps
              <FooterArrowIcon />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>Copyright {year} SV Enterprises. All rights reserved.</span>
          <span>Bangalore wholesale supplier for automobile spare parts and industrial products.</span>
        </div>
      </div>
    </footer>
  );
}
