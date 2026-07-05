"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FeaturedProductReference, Mode, Product } from "@/data/types";
import { useMode } from "@/context/ModeContext";
import { getCatalogue, getProductUrl } from "@/lib/dataUtils";
import { getProductImagePath } from "@/components/catalog/cardUtils";
import { findBySlug } from "@/lib/slugUtils";
import { buildProductWhatsAppUrl } from "@/lib/whatsappUtils";

function resolveFeaturedProduct(
  mode: Mode,
  reference: FeaturedProductReference,
): { product: Product; code: string } | null {
  const catalogue = getCatalogue();
  const category = catalogue.categories[mode].find(
    (item) => item.title === reference.category,
  );

  if (!category) {
    return null;
  }

  const product = findBySlug(
    catalogue.products[mode][category.slug] || [],
    reference.product,
  );

  if (!product) {
    return null;
  }

  return {
    product,
    code: reference.code,
  };
}

function ProductImage({ product, code }: { product: Product; code: string }) {
  const imagePath = getProductImagePath(product);

  if (!imagePath) {
    return <span aria-hidden="true">{code}</span>;
  }

  return (
    <Image
      className="featured-product-image"
      src={imagePath}
      alt=""
      aria-hidden="true"
      width={380}
      height={260}
    />
  );
}

export function FeaturedProducts() {
  const { mode } = useMode();
  const catalogue = getCatalogue();
  const content = catalogue.modes[mode];
  const references = content.home.featured;
  const whatsappPhone =
    content.home.contactList.find((item) => item.label === "WhatsApp")?.value ||
    "+91 98765 43210";
  const products = references
    .map((reference) => resolveFeaturedProduct(mode, reference))
    .filter(
      (item): item is { product: Product; code: string } => item !== null,
    );

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (products.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIndex = (prev + 1) % products.length;
        if (scrollRef.current) {
          const container = scrollRef.current;
          const item = container.children[nextIndex] as HTMLElement;
          if (item) {
            const scrollLeft = item.offsetLeft - (container.clientWidth / 2) + (item.clientWidth / 2);
            container.scrollTo({ left: scrollLeft, behavior: "smooth" });
          }
        }
        return nextIndex;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [products.length]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="section" aria-labelledby="home-featured-title">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="kicker">Popular</div>
            <h2 className="section-title" id="home-featured-title">
              {content.home.featuredTitle}
            </h2>
          </div>
        </div>
        <div className="product-strip product-carousel" ref={scrollRef} aria-label={`${mode} featured products`}>
          {products.map(({ product, code }, index) => {
            const productUrl = getProductUrl(product, mode);
            const enquireUrl = buildProductWhatsAppUrl(
              whatsappPhone,
              product,
              mode,
            );
            const isActive = index === activeIndex;

            return (
              <article className={`product-tile ${isActive ? 'active' : ''}`} key={product.id}>
                <Link href={productUrl}>
                  <div className="product-img-wrapper">
                    <div className="badge-bestseller">BESTSELLER</div>
                    <div className="product-img">
                      <ProductImage code={code} product={product} />
                    </div>
                    <div className="badge-stock">
                      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#22c55e" strokeWidth="2">
                        <path d="M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0Z"/>
                        <path d="m5 8 2 2 4-4"/>
                      </svg>
                      In Stock
                    </div>
                  </div>
                  <div className="product-body">
                    <div className="brand-text">{product.brand}</div>
                    <h3>{product.name}</h3>
                    {product.oemNumber ? (
                      <div className="meta">OEM: {product.oemNumber}</div>
                    ) : null}
                    <div className="product-highlights">
                      <span className="highlight-pill">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="var(--orange)" strokeWidth="2"><path d="M5 18c0 .6.4 1 1 1h12c.6 0 1-.4 1-1v-2H5v2Z"/><path d="M4 14h16l-2-6H6l-2 6Z"/><circle cx="7" cy="14" r="1"/><circle cx="17" cy="14" r="1"/></svg> Cars & SUVs
                      </span>
                      <span className="highlight-pill">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="var(--orange)" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> OEM Fit
                      </span>
                      <span className="highlight-pill">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="var(--orange)" strokeWidth="2"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v5h-3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg> Same Day
                      </span>
                      <span className="highlight-pill">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="var(--orange)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/></svg> GST Invoice
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="product-actions">
                  <button
                    className="enquire-btn-full"
                    type="button"
                    onClick={() => {
                      window.open(enquireUrl, "_blank", "noopener,noreferrer");
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> Enquire Now
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
