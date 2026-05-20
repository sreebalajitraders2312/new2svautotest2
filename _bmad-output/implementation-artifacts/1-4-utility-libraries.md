# Story 1.4: Utility Libraries

Status: review

## Story

As a developer,
I want all utility libraries created in `src/lib/`,
so that page components and components have consistent, reusable helper functions.

## Acceptance Criteria

1. `src/lib/slugUtils.ts` exports functions for slug generation, slug lookup, and custom override support matching PRD slug rules.
2. `src/lib/modeUtils.ts` exports functions for mode validation, default mode, and URL extraction.
3. `src/lib/whatsappUtils.ts` exports a function to build WhatsApp deep links with pre-filled product name and OEM/spec number.
4. `src/lib/dataUtils.ts` imports `src/data/catalog.json` and exports query helpers: `getProductBySlug`, `getCategoryProducts`, `getProductsByMode`, `filterProducts`, and `sortProducts`.
5. `src/lib/seoHelpers.ts` exports metadata helpers and JSON-LD builders for `LocalBusiness`, `BreadcrumbList`, `Product`, and `ItemList`.
6. All functions are properly typed with TypeScript and use interfaces from `src/data/types.ts`.
7. No page/component bypasses the utility layer to query catalogue data directly.
8. `npm run lint` and `npm run build` pass after utilities are added.

## Tasks / Subtasks

- [x] Create slug utilities. (AC: 1)
  - [x] Implement `slugify` using PRD rules: lowercase, replace `&` with `and`, replace non-alphanumeric with hyphens, trim leading/trailing hyphens.
  - [x] Implement custom override support for categories/products via `slugOverride`.
  - [x] Include helpers to compare generated slugs and explicit slugs safely.
- [x] Create mode utilities. (AC: 2)
  - [x] Define `DEFAULT_MODE = "automobile"`.
  - [x] Implement `isMode`, `getValidMode`, and URL/path-segment extraction helpers.
  - [x] Keep mode typing aligned with `src/data/types.ts`.
- [x] Create WhatsApp utilities. (AC: 3)
  - [x] Implement a message builder that includes product name, OEM/spec number, category, and mode context.
  - [x] Implement a `wa.me` URL builder with URL-encoded message text.
  - [x] Keep phone number/config inputs explicit; do not hardcode hidden credentials or external config.
- [x] Create JSON-backed data utilities. (AC: 4, 6, 7)
  - [x] Import `src/data/catalog.json`.
  - [x] Cast or validate the imported JSON as `Catalogue` from `src/data/types.ts`.
  - [x] Implement `getProductBySlug`, `getCategoryProducts`, `getProductsByMode`, `filterProducts`, and `sortProducts`.
  - [x] Add route/static helper functions from architecture where useful: `getCategories`, `getCategoryBySlug`, `getProducts`, `searchProducts`, `getStaticCategoryParams`, `getStaticProductParams`.
  - [x] Ensure helpers return stable empty arrays or `null` for not-found cases rather than throwing during normal lookup.
- [x] Create SEO helpers. (AC: 5, 6)
  - [x] Add page metadata helper functions that can be consumed by `generateMetadata`.
  - [x] Add JSON-LD builders for `LocalBusiness`, `BreadcrumbList`, `Product`, and `ItemList`.
  - [x] Keep returned JSON serializable and compatible with React script injection in later components.
- [x] Validate utilities. (AC: 1-8)
  - [x] Confirm imports use `@/data/types` and `@/data/catalog.json` or equivalent project aliases.
  - [x] Confirm no Firebase/database/auth/e-commerce utilities are introduced.
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.

## Dev Notes

### Dependency On Story 1.3

- Story 1.4 depends on `src/data/types.ts` and `src/data/catalog.json` from Story 1.3.
- If Story 1.3 is not implemented yet, implement Story 1.3 first. Do not create alternate data structures inside `src/lib/`.
- If this story is implemented in parallel, coordinate file ownership: Story 1.4 owns `src/lib/**`; Story 1.3 owns `src/data/**`.

### Architecture Data Flow

Required one-way flow:

```text
src/data/catalog.json
  -> src/data/types.ts
  -> src/lib/dataUtils.ts
  -> src/app/**/page.tsx
  -> src/components/**/*.tsx
```

No component should write to catalogue data. All catalogue reads should go through `dataUtils.ts`.

### Required Utility Files

```text
src/lib/slugUtils.ts
src/lib/modeUtils.ts
src/lib/whatsappUtils.ts
src/lib/dataUtils.ts
src/lib/seoHelpers.ts
```

### Slug Requirements

Implement PRD slug rules:

- Lowercase.
- Replace `&` with `and`.
- Replace non-alphanumeric characters with hyphens.
- Collapse repeated hyphens.
- Trim leading/trailing hyphens.
- Respect explicit `slug` or `slugOverride` fields when present.
- Support the Industrial Hydraulic Parts override to `hydraulic-hoses`.

### Query Helper Expectations

`dataUtils.ts` should expose, at minimum:

```typescript
getProductBySlug(mode, categorySlug, productSlug)
getCategoryProducts(mode, categorySlug)
getProductsByMode(mode)
filterProducts(products, filters)
sortProducts(products, sort)
```

Architecture also recommends:

```typescript
getModes()
getCategories(mode)
getCategoryBySlug(mode, categorySlug)
getProducts(mode)
searchProducts(query, mode?)
getStaticCategoryParams()
getStaticProductParams()
```

Use these names unless there is a strong TypeScript reason to split implementation internally.

### SEO Helper Expectations

`seoHelpers.ts` should prepare data for later pages/components, not render UI. Include:

- Metadata helper inputs/outputs compatible with Next.js `Metadata`.
- `buildLocalBusinessJsonLd`
- `buildBreadcrumbListJsonLd`
- `buildProductJsonLd`
- `buildItemListJsonLd`

### Architecture Guardrails

- Do not add Firebase, Firestore, Firebase Storage, Prisma, CMS, auth, cart, checkout, payment, or order utilities.
- Do not add route handlers or API endpoints for catalogue data.
- Keep functions deterministic and side-effect free.
- Keep returned data immutable from the caller's perspective where practical.

### Testing / Verification

Run:

```bash
npm run lint
npm run build
```

If practical within the existing project setup, add lightweight unit tests for slug and data helpers. If no test framework exists yet, do not add a framework solely for this story; rely on TypeScript build and lint until testing architecture is introduced.

## Project Structure Notes

Expected files created:

```text
src/lib/slugUtils.ts
src/lib/modeUtils.ts
src/lib/whatsappUtils.ts
src/lib/dataUtils.ts
src/lib/seoHelpers.ts
_bmad-output/implementation-artifacts/1-4-utility-libraries.md
_bmad-output/implementation-artifacts/sprint-status.yaml
```

Expected prerequisite files from Story 1.3:

```text
src/data/types.ts
src/data/catalog.json
```

## References

- [Source: _bmad-output/planning-artifacts/epics.md - Story 1.4]
- [Source: _bmad-output/planning-artifacts/architecture.md - Utility Layer, Data Flow, SEO Architecture]
- [Source: _bmad-output/planning-artifacts/prds/prd-new-sv-automobile-2026-05-20/prd.md - Slug Rules, SEO Infrastructure, Enquiry Actions]
- [Source: _bmad-output/implementation-artifacts/1-3-json-catalogue-and-typescript-data-types.md - data model prerequisite]
- [Source: reference/index.html - `getProductSlug`, metadata, JSON-LD, WhatsApp, and catalogue rendering logic]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Reviewed Next.js 16 metadata documentation in `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`.
- `node -e "<catalog prerequisite check>"` passed.
- `cmd /c npm run lint` passed.
- `cmd /c npm run build` passed.
- `rg -n "catalog\\.json|Firebase|Firestore|Prisma|checkout|payment|cart|auth" src` confirmed only `dataUtils.ts` imports catalogue JSON; remaining match was product text containing "cartridge".

### Completion Notes List

- Story context created from architecture, epics, PRD, reference implementation scan, and Story 1.3 dependency.
- Created slug utilities with PRD-compliant slug generation, override-aware slug resolution, slug comparison, and lookup helpers.
- Created mode utilities for default mode, mode validation, and pathname/path-segment extraction.
- Created WhatsApp utilities for explicit-phone `wa.me` deep links with pre-filled product enquiry context.
- Created JSON-backed data utilities that expose typed catalogue query, filtering, sorting, search, and static route parameter helpers.
- Created SEO helpers for Next.js-compatible metadata plus LocalBusiness, BreadcrumbList, Product, and ItemList JSON-LD builders.
- Confirmed no pages or components import `catalog.json` directly; catalogue access now goes through `src/lib/dataUtils.ts`.

### File List

- `_bmad-output/implementation-artifacts/1-4-utility-libraries.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/lib/slugUtils.ts`
- `src/lib/modeUtils.ts`
- `src/lib/whatsappUtils.ts`
- `src/lib/dataUtils.ts`
- `src/lib/seoHelpers.ts`

### Change Log

- 2026-05-20: Implemented utility layer for slugs, modes, WhatsApp links, JSON-backed catalogue queries, and SEO helpers.
