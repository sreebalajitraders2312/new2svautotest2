"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Catalogue, ContactItem, Mode, ModeContent } from "@/data/types";
import { useMode } from "@/context/ModeContext";
import { getModeFromPathname } from "@/lib/modeUtils";
import { buildWhatsAppUrl, normalizeWhatsAppPhone } from "@/lib/whatsappUtils";

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

function getContactHref(
  item: ContactItem,
  mode: Mode,
  whatsappPhone: string,
  contactCopy: string,
) {
  if (item.label === "WhatsApp") {
    return buildWhatsAppUrl(
      whatsappPhone,
      `Hello SV Enterprises, I want to enquire about ${mode} products.\n${contactCopy}`,
    );
  }

  if (item.label === "Call") {
    return `tel:${normalizeWhatsAppPhone(item.value)}`;
  }

  if (item.label === "Email") {
    return `mailto:${item.value}`;
  }

  return "#";
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

function FooterContactIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 7 7l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
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
  const whatsappPhone =
    modeContent.home.contactList.find((item) => item.label === "WhatsApp")
      ?.value || "+91 98765 43210";
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-shell">
        <div className="footer-primary">
          <section className="footer-brand-panel" aria-label="SV Enterprises">
            <Link className="brand footer-brand" href="/" aria-label="SV Enterprises home">
              <span className="brand-mark">SV</span>
              <span>
                <span className="brand-name">SV Enterprises</span>
                <span className="brand-sub">{modeContent.brandSub}</span>
              </span>
            </Link>
            <p>{modeContent.footer.copy}</p>
            <div className="footer-badges" aria-label="Service highlights">
              <span>OEM Matching</span>
              <span>Wholesale Supply</span>
              <span>Bangalore Pickup</span>
            </div>
          </section>

          <section className="footer-contact-card" aria-labelledby="footer-contact-title">
            <span className="footer-kicker">Need assistance?</span>
            <h2 id="footer-contact-title">{modeContent.nav.quote}</h2>
            <p>{contactPage.copy}</p>
            <div className="footer-contact-actions">
              {modeContent.home.contactList.slice(0, 2).map((item) => (
                <a
                  className={item.label === "WhatsApp" ? "footer-action-primary" : undefined}
                  href={getContactHref(
                    item,
                    currentMode,
                    whatsappPhone,
                    contactPage.copy,
                  )}
                  key={item.label}
                  target={item.label === "WhatsApp" ? "_blank" : undefined}
                  rel={item.label === "WhatsApp" ? "noopener noreferrer" : undefined}
                >
                  <FooterContactIcon />
                  {item.label}
                </a>
              ))}
            </div>
          </section>
        </div>

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
