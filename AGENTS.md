# Repository Guidelines

## Project Structure & Module Organization

The Next.js App Router lives in `src/app/`; reusable page sections and controls belong in `src/components/`, and product or affiliate configuration belongs in `src/lib/`. The original design references and product photos are in `interface/`. Import those files directly; keep the originals unchanged and do not duplicate screenshots as page content.

## Build, Test, and Development Commands

Use NVM with Node.js `24.22.2` from `.nvmrc` and pnpm `12.16.1`.

- `pnpm dev` starts the local Next.js server.
- `pnpm build` creates the optimized, statically rendered production build.
- `pnpm lint` runs Biome checks; `pnpm typecheck` runs TypeScript.
- `pnpm test:e2e` runs Playwright tests in `tests/e2e/`.

## Coding Style & Naming Conventions

Use TypeScript, two-space indentation, and the formatter and lint rules in `biome.json`. Keep App Router pages as server components unless browser state is required. Use semantic HTML, accessible names, Lucide icons, and `next/image` for local images. Prefer native browser interactions such as `<details>` for simple disclosure behavior.

## Testing Guidelines

Name browser tests `*.spec.ts`. Cover 320px, 375px, 768px, 1024px, desktop, and keyboard-accessible interactions. Run the build and Playwright checks after UI changes.

## Commits & Configuration

Use short imperative Conventional Commit subjects, such as `feat: add product comparison section`. Commercial CTAs must retain the authorized URL `https://meli.la/1REfxSi` exactly. Do not add prices, testimonials, seller claims, or analytics credentials without approved source data. Configure public analytics IDs and privacy details only through the documented environment variables; never commit `.env.local`.
