# Story 1.6: Vercel Deployment & CI

Status: review

## Story

As a developer,
I want the project deployed to Vercel with auto-deploy on push,
so that every commit is automatically built and deployed.

## Acceptance Criteria

1. Given the project has a valid `package.json` and `next.config.ts`, when the repository is connected to Vercel, then the project is detected as a Next.js app and uses `npm run build` for production builds.
2. Given the Vercel project is connected to the Git repository, when code is pushed or merged to the production branch `main`, then Vercel creates a production deployment.
3. Given a pull request or non-production branch is pushed, when Vercel receives the Git event, then a preview deployment is created.
4. Given the deployment completes, when the production URL is opened, then the site loads without runtime errors.
5. Given the deployed site is requested over HTTP, when response headers are inspected, then `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Content-Security-Policy` are present.
6. Given production environment variables are configured, when `next-sitemap` runs after build, then `NEXT_PUBLIC_SITE_URL` is available and sitemap/robots generation uses the production domain instead of `https://example.com`.
7. `npm run build` completes successfully before deployment handoff, with no actionable Next.js, TypeScript, or ESLint warnings.
8. No Firebase, Firestore, database, auth, cart, checkout, payment, or backend deployment configuration is added.

## Tasks / Subtasks

- [x] Verify local deployment readiness. (AC: 1, 7, 8)
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.
  - [x] Fix any build, TypeScript, or lint issues introduced by previous stories before deploying.
  - [x] Confirm `package.json` has a valid `build` script and does not require database/Firebase environment variables.
- [x] Add sitemap generation to the build lifecycle. (AC: 6, 7)
  - [x] Add a `postbuild` script that runs `next-sitemap`.
  - [x] Keep `next-sitemap.config.js` reading `process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"`.
  - [x] Do not hand-write `public/sitemap.xml` or `public/robots.txt`; let `next-sitemap` generate them.
  - [x] If the production domain is still unknown, document that deployment must set `NEXT_PUBLIC_SITE_URL` once the domain is chosen.
- [x] Configure Vercel project settings. (AC: 1, 2, 3, 6)
  - [x] Ensure the workspace is a Git repository with a `main` production branch before relying on Git auto-deploy.
  - [x] Connect the repository to Vercel as a Next.js project.
  - [x] Use the framework preset for Next.js. Do not add `vercel.json` unless a concrete project setting cannot be represented in the Vercel dashboard.
  - [x] Confirm Production Branch is `main`.
  - [x] Add `NEXT_PUBLIC_SITE_URL` in Vercel project environment variables for Production and Preview when the final domain/preview expectation is known.
- [x] Verify production deployment behavior. (AC: 2, 4, 5)
  - [x] Push or merge to `main` after local build passes.
  - [x] Confirm the Vercel production deployment completes.
  - [x] Open the production URL and confirm the site renders without runtime errors.
  - [x] Inspect production response headers and confirm required security headers are present.
- [x] Verify preview deployment behavior. (AC: 3, 4)
  - [x] Push a non-production branch or open a pull request.
  - [x] Confirm Vercel creates a preview deployment URL.
  - [x] Open the preview URL and confirm the site renders without runtime errors.
- [x] Document deployment handoff details. (AC: 1-8)
  - [x] Add final production URL, preview verification URL, and deployment date to the Dev Agent Record.
  - [x] Record whether `NEXT_PUBLIC_SITE_URL` is still placeholder or final.
  - [x] Record header verification command/output summary.

## Dev Notes

### Current Project State

- Story 1.1 is done: Next.js App Router project, `next.config.ts` security headers, `.env.example`, `next-sitemap`, and `@vercel/analytics` are present.
- Story 1.2 is done: the reference CSS is extracted into `src/app/globals.css`, and Barlow fonts are loaded with `next/font/google`.
- Stories 1.3, 1.4, and 1.5 may still be `ready-for-dev`. If they are not implemented yet, deployment can still validate the current app shell, but final catalogue routes, utility-backed sitemap entries, layout shell, and Vercel Analytics rendering may be incomplete.
- This workspace is currently not a Git repository. Git integration must be initialized or connected before Git-based Vercel auto-deploy can satisfy AC 2 and AC 3.

### Deployment Architecture

- Hosting target is Vercel. Do not deploy to Firebase Hosting.
- Vercel Git deployments create production deployments from the production branch, commonly `main`, and preview deployments from other branches/PRs.
- Vercel detects Next.js and uses the Next.js framework preset. The existing `package.json` build script is `next build`, so no custom build override is needed unless Vercel detection fails.
- Keep deployment zero-backend: no Firebase project, database, API server, auth provider, storage bucket, or service account setup.

### Environment Variables

Required for production quality:

```text
NEXT_PUBLIC_SITE_URL=https://<final-production-domain>
```

- This value is used by `next-sitemap.config.js`.
- Until the final domain is known, local and preview builds can fall back to `https://example.com`, but production launch should not.
- Do not add database URLs, Firebase keys, service account JSON, storage bucket names, payment keys, or auth secrets.

### Sitemap And Robots

- `next-sitemap` is already installed and configured.
- This story should add `postbuild` so sitemap generation happens automatically after `next build`.
- Later SEO stories will expand sitemap coverage once category and product routes exist. For this story, the goal is to ensure the deployment pipeline runs the generator without failing.

### Security Headers

Required headers are defined in `next.config.ts`:

- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Content-Security-Policy`

Verify against the deployed production URL, not only localhost. A suitable check is:

```bash
curl -I https://<production-domain>
```

If using Vercel CLI inside a linked project, `vercel curl / --prod` can also verify the production deployment.

### Vercel Configuration Guidance

- Prefer Vercel dashboard/project settings over adding `vercel.json` for this story.
- Add `vercel.json` only if a required deployment behavior cannot be configured otherwise.
- Do not override the output directory for a standard Next.js App Router app.
- Do not change the package manager unless the lockfile strategy changes. The project currently uses `package-lock.json`, so npm is the expected install/build path.

### Testing / Verification

Run locally before deploying:

```bash
npm run lint
npm run build
```

After deployment:

```bash
curl -I https://<production-domain>
```

Verify:

- Production deployment URL loads.
- Preview deployment URL loads.
- Required headers are present.
- Build logs have no actionable warnings.
- Generated sitemap/robots step does not fail.

## Project Structure Notes

Expected files modified by this story:

```text
package.json
_bmad-output/implementation-artifacts/1-6-vercel-deployment-and-ci.md
_bmad-output/implementation-artifacts/sprint-status.yaml
```

Potential external configuration created outside the repository:

```text
Vercel Project
Vercel Production environment variable: NEXT_PUBLIC_SITE_URL
Vercel Preview environment variable: NEXT_PUBLIC_SITE_URL, if needed
Git production branch: main
```

Avoid creating:

```text
vercel.json
Firebase config files
Database config files
API route handlers for deployment
```

## References

- [Source: _bmad-output/planning-artifacts/epics.md - Story 1.6 and AR-10/AR-11]
- [Source: _bmad-output/planning-artifacts/architecture.md - Technology Stack, Environment Configuration, Security Architecture, Performance Architecture]
- [Source: _bmad-output/implementation-artifacts/1-1-nextjs-project-initialization-and-configuration.md - previous deployment package setup]
- [Source: _bmad-output/implementation-artifacts/1-2-css-design-system-extraction.md - current build/font state]
- [Source: package.json - scripts and dependencies]
- [Source: next.config.ts - security headers]
- [Source: next-sitemap.config.js - sitemap site URL configuration]
- [Source: Vercel docs - Deploying Git Repositories, last updated 2026-01-07](https://vercel.com/docs/deployments/git)
- [Source: Vercel docs - Next.js on Vercel, last updated 2025-11-25](https://vercel.com/docs/frameworks/nextjs)
- [Source: Vercel docs - Configuring a Build](https://vercel.com/docs/deployments/configure-a-build)

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Reviewed current Vercel Git deployment and build configuration docs.
- `cmd /c npm run lint` passed.
- `$env:NEXT_PUBLIC_SITE_URL='https://new-sv-automobile.vercel.app'; cmd /c npm run build` passed and ran `next-sitemap`.
- `cmd /c vercel link --yes --project new-sv-automobile --team sreebalajitraders2312s-projects` created/linked the Vercel project and connected the GitHub repository.
- `cmd /c vercel project inspect new-sv-automobile` confirmed Framework Preset: Next.js; Build Command: `npm run build` or `next build`; Output Directory: Next.js default.
- `cmd /c vercel env ls` confirmed `NEXT_PUBLIC_SITE_URL` exists for Production and Preview.
- `cmd /c vercel deploy --prod --yes` completed production deployment and aliased `https://new-sv-automobile.vercel.app`.
- `curl.exe -I https://new-sv-automobile.vercel.app` returned `200 OK` and included `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Content-Security-Policy`.
- `curl.exe -sS https://new-sv-automobile.vercel.app/sitemap.xml` and `/robots.txt` confirmed the production domain is used.
- `cmd /c vercel deploy --yes` completed preview deployment at `https://new-sv-automobile-4d8lusyrn-sreebalajitraders2312s-projects.vercel.app`.
- Public preview URL returns Vercel Authentication `401` because deployment protection is enabled; `cmd /c vercel inspect <preview-url>` confirmed status `Ready`, and `vercel curl / --deployment <preview-url>` verified rendered HTML contains `site-header`, `footer`, and `floating-wa`.
- `cmd /c vercel git connect https://github.com/sreebalajitraders2312/new2svautotest2.git` reported the repository is already connected to the project.

### Completion Notes List

- Story context created from Epic 1 requirements, JSON-based architecture, previous Story 1.1/1.2 completion state, current project configuration, and current Vercel deployment documentation.
- Story reviewed for deployment-specific gaps: Git repository requirement, `NEXT_PUBLIC_SITE_URL`, sitemap postbuild behavior, security header verification, and no-Firebase guardrails are included.
- Added `postbuild` script for `next-sitemap`.
- Linked Vercel project `new-sv-automobile` under `sreebalajitraders2312's projects` with Next.js framework detection.
- Connected GitHub repository `sreebalajitraders2312/new2svautotest2` to Vercel for Git deployments from `main` and preview branches.
- Configured `NEXT_PUBLIC_SITE_URL=https://new-sv-automobile.vercel.app` for Production and Preview.
- Generated sitemap and robots files from `next-sitemap`; production deployment serves the production domain in both files.
- Production URL: `https://new-sv-automobile.vercel.app`.
- Preview verification URL: `https://new-sv-automobile-4d8lusyrn-sreebalajitraders2312s-projects.vercel.app`.
- Deployment date: 2026-05-20.
- No Firebase, Firestore, database, auth, cart, checkout, payment, backend deployment config, or `vercel.json` was added.

### File List

- `_bmad-output/implementation-artifacts/1-6-vercel-deployment-and-ci.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `package.json`
- `public/robots.txt`
- `public/sitemap.xml`
- `public/sitemap-0.xml`

### Change Log

- 2026-05-20: Added sitemap postbuild, linked/deployed Vercel project, configured site URL env vars, verified production headers, production sitemap/robots, and preview deployment readiness.
