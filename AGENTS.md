# AGENTS.md — simple-marketplace

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- pnpm (required; lockfile is `pnpm-lock.yaml`)
- ESLint v9 with `eslint-config-next` (core-web-vitals + typescript)

## Commands
| Command | What it does |
|---------|-------------|
| `pnpm dev` | Start dev server (localhost:3000) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint (no args needed) |

No test framework is configured.

## Architecture
Marketplace app demonstrating **Next.js parallel routes + intercepting routes**:

```
app/
├── layout.tsx          ← has `modal` parallel route slot
├── page.tsx            ← product listing (links to /product/:id)
├── product/[id]/page.tsx ← full-page product detail
└── @modal/
    ├── default.tsx       ← returns null (no modal by default)
    └── (.)product/[id]/page.tsx   ← intercepted modal overlay
```

- Navigating from homepage → `/product/1` shows the **modal** (via `(..)` intercepting route)
- Navigating directly or refreshing `/product/1` shows the **full page**
- Modal uses `'use client'` and `router.back()` to close
- `searchParams` is `Promise` (Next.js 15+), must be awaited
- `@/*` path alias maps to repo root

## Tailwind v4 quirks
- Uses `@import "tailwindcss"` in CSS (not `@tailwind base/components/utilities`)
- Uses `@theme inline { ... }` for custom theme tokens
- PostCSS plugin is `@tailwindcss/postcss` (not the classic `tailwindcss` plugin)

## ESLint v9 quirks
- Config is `eslint.config.mjs` using the new flat config API
- Uses `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript` (modular imports)
- `.next/`, `out/`, `build/`, `next-env.d.ts` are globally ignored
