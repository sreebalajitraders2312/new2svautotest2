# Story 1.3: JSON Catalogue & TypeScript Data Types

Status: review

## Story

As a developer,
I want TypeScript interfaces and a single JSON catalogue defined in `src/data/`,
so that every component has strongly typed, consistent data to render.

## Acceptance Criteria

1. `src/data/types.ts` is created with interfaces for Product, Category, Brand, Vehicle, Application, Mode, and the full catalogue schema.
2. Interfaces use `camelCase` field names and match the architecture's JSON source-of-truth model.
3. `src/data/catalog.json` is created as the only editable catalogue data source.
4. `catalog.json.categories` defines all 14 categories: 8 automobile and 6 industrial, each with slugs.
5. `catalog.json.brands` defines brand lists per mode.
6. `catalog.json.modes` defines mode-specific content for hero, advantages, contact, homepage labels, search copy, and footer copy.
7. `catalog.json.vehicles` defines 6 vehicle types.
8. `catalog.json.applications` defines 6 industrial applications.
9. `catalog.json.products.automobile` contains product data for all 8 automobile categories.
10. `catalog.json.products.industrial` contains product data for all 6 industrial categories.
11. All data matches the content structure from `reference/index.html`'s `siteModes` and `categoryCatalog` objects.
12. No duplicate category/product/brand/mode data is created in separate `.ts` files.
13. `npm run lint` and `npm run build` pass after the data files are added.

## Tasks / Subtasks

- [x] Create the typed data model. (AC: 1, 2)
  - [x] Create `src/data/types.ts`.
  - [x] Include reusable `Mode = "automobile" | "industrial"` and stock status types.
  - [x] Include interfaces for `Product`, `Category`, `Brand`, `VehicleType`, `ApplicationType`, `ModeContent`, and `Catalogue`.
  - [x] Ensure product fields support both automobile OEM data and industrial spec/product-number data.
- [x] Create the JSON catalogue file. (AC: 3-12)
  - [x] Create `src/data/catalog.json`.
  - [x] Populate from `reference/index.html` data objects, especially `siteModes` and `categoryCatalog`.
  - [x] Keep a single JSON source for categories, products, brands, modes, vehicles, and applications.
  - [x] Do not create `categories.ts`, `brands.ts`, `modes.ts`, `vehicles.ts`, `applications.ts`, or `products/**` data files.
- [x] Preserve SEO and routing requirements in data. (AC: 4, 9, 10, 11)
  - [x] Include category slugs matching PRD examples and architecture rules.
  - [x] Include product slugs or enough data for deterministic slug generation.
  - [x] Add `slugOverride` where the PRD requires SEO overrides, including Industrial "Hydraulic Parts" -> `hydraulic-hoses`.
  - [x] Keep automobile and industrial products grouped by mode and category.
- [x] Validate data completeness and build compatibility. (AC: 1-13)
  - [x] Confirm all 14 categories are present.
  - [x] Confirm all 12 mode-specific brand names per mode are present.
  - [x] Confirm all 6 vehicle types and all 6 application types are present.
  - [x] Confirm each category has products.
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.

## Dev Notes

### Current Workspace State

- Story 1.1 initialized the Next.js project and is in review.
- Story 1.2 extracted the reference CSS and is in review.
- Current app has no `src/data/` directory yet.
- `tsconfig.json` already has `resolveJsonModule: true`, so Story 1.4 can import `catalog.json` from TypeScript.

### Reference Data Sources

- `reference/index.html` contains both older and current data structures.
- Prefer the later `siteModes` object because it contains the richer active dataset for both modes.
- `categoryCatalog` exists earlier in the file and can be used as supporting context only if data is missing from `siteModes`.
- Important reference anchors:
  - `const siteModes = { ... }`
  - `catalog` nested inside `siteModes.automobile` and `siteModes.industrial`
  - `brands`, `brandsPage`, `contact`, `search`, `vehiclePage`, `footerCopy`, and mode-specific homepage fields
  - vehicle/application maps under each mode

### Required Category Coverage

Automobile categories:

- Engine Parts
- Brake Parts
- Suspension
- Electrical
- Filters
- Transmission
- Cooling
- Body Parts

Industrial categories:

- Bearings
- Hydraulic Parts
- Motors
- Gearboxes
- Pneumatic Parts
- Seals and Couplings

Use slugs that satisfy PRD URL rules: lowercase, hyphenated, no hash routing, no query-only canonical content. Use `hydraulic-hoses` for Industrial Hydraulic Parts.

### Product Field Guidance

Use architecture's `Product` shape as the minimum:

```typescript
export interface Product {
  id: string;
  name: string;
  slug: string;
  oemNumber: string;
  shortDescription: string;
  fullDescription?: string;
  brand: string;
  category: string;
  categorySlug: string;
  compatibleVehicles?: string[];
  compatibleApplications?: string[];
  technicalSpecs?: Record<string, string>;
  availableSizes?: string[];
  stockStatus: "in-stock" | "ready-stock" | "available";
  popularityRank: number;
  imageUrl?: string;
  imageFallbackInitials: string;
}
```

Mapping from reference product fields:

- `oem` -> `oemNumber`
- `desc` -> `shortDescription`
- `fallback` -> `imageFallbackInitials`
- `popularity` -> `popularityRank`
- `compatibility` -> `compatibleVehicles` or `compatibleApplications` depending on mode
- `specs` string array can become `technicalSpecs` entries or a typed array if the interface includes both
- `description` -> `fullDescription`

### Architecture Guardrails

- `src/data/catalog.json` is the only editable data source.
- Do not add Firebase, Firestore, Firebase Storage, Prisma, CMS, database SDKs, auth, cart, checkout, payment, or order features.
- Do not create duplicate TypeScript data files. TypeScript files in `src/data/` are for types only in this story.
- Components and pages should not import raw JSON directly; Story 1.4 will create `dataUtils.ts` as the query layer.

### Testing / Verification

Run:

```bash
npm run lint
npm run build
```

This story does not need UI tests because it introduces data files and types only. The build must pass with strict TypeScript.

## Project Structure Notes

Expected files created:

```text
src/data/types.ts
src/data/catalog.json
_bmad-output/implementation-artifacts/1-3-json-catalogue-and-typescript-data-types.md
_bmad-output/implementation-artifacts/sprint-status.yaml
```

Do not create:

```text
src/data/categories.ts
src/data/brands.ts
src/data/modes.ts
src/data/vehicles.ts
src/data/applications.ts
src/data/products/**
```

## References

- [Source: _bmad-output/planning-artifacts/epics.md - Story 1.3]
- [Source: _bmad-output/planning-artifacts/architecture.md - Data Architecture and Implementation Rules]
- [Source: _bmad-output/planning-artifacts/prds/prd-new-sv-automobile-2026-05-20/prd.md - Product Data Requirements and URL Rules]
- [Source: reference/index.html - `siteModes` and `categoryCatalog` data]
- [Source: _bmad-output/implementation-artifacts/1-1-nextjs-project-initialization-and-configuration.md - project setup notes]
- [Source: _bmad-output/implementation-artifacts/1-2-css-design-system-extraction.md - design system state]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `node -e "<catalog completeness validation>"` passed.
- `cmd /c npm run lint` passed.
- `cmd /c npm run build` passed.

### Completion Notes List

- Story context created from architecture, epics, PRD, reference data scan, and previous Story 1.1/1.2 status.
- Created `src/data/types.ts` with typed catalogue, mode, product, category, brand, vehicle, application, search, contact, detail, and footer structures.
- Created `src/data/catalog.json` as the only editable catalogue source, populated from `reference/index.html` using `siteModes` as primary data and `categoryCatalog` as fallback for automobile Cooling and Body Parts.
- Preserved required SEO slugs and overrides, including Industrial Hydraulic Parts as `hydraulic-hoses` and Deep Groove Bearing as `skf-6205`.
- Validated 14 categories, 12 brands per mode, 6 vehicle types, 6 industrial applications, and products in every category.

### File List

- `_bmad-output/implementation-artifacts/1-3-json-catalogue-and-typescript-data-types.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/data/types.ts`
- `src/data/catalog.json`

### Change Log

- 2026-05-20: Implemented JSON catalogue and TypeScript data schema for Story 1.3.
