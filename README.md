# Allen Diaz — 3D Portfolio

An interactive 3D portfolio built with Next.js and React Three Fiber. The centerpiece
is an explorable 3D office where every object — desk, monitors, books, tablet, ID badge —
is clickable and opens projects, skills, experience, certifications, and more. The entire
scene is **procedurally generated** from Three.js primitives and custom shaders (no
external 3D model files).

## Features

- **Interactive 3D office** — orbit, zoom, and click objects to explore content.
- **Adaptive quality** — detects the device tier and scales particles, post-processing,
  shadows, reflections, and DPR so it stays smooth on phones and low-end hardware.
- **Cinematic rendering** — ACES Filmic tone mapping, soft shadows, contact shadows,
  bloom, ambient occlusion, depth of field, and fog.
- **2D project pages** — a searchable/filterable project gallery and per-project detail
  pages, sharing a single data source with the 3D scene.
- **SEO ready** — per-page metadata, Open Graph/Twitter cards, JSON-LD, `sitemap.xml`,
  and `robots.txt`.
- **Accessible & responsive** — respects `prefers-reduced-motion`, keyboard focus rings,
  dialog semantics, and mobile layouts.

## Tech stack

- **Framework:** Next.js 16 (App Router) · React 19 · TypeScript (strict)
- **3D:** `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- **State:** Zustand
- **Styling/animation:** Tailwind CSS v4, Framer Motion, GSAP (camera intro)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (also type-checks and validates routes) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

### Environment

Set `NEXT_PUBLIC_SITE_URL` to your production origin so canonical URLs, Open Graph
images, the sitemap, and robots point at the right host. It falls back to
`http://localhost:3000` in development.

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Project structure

```
app/                  App Router routes
  page.tsx            Landing page (3D office as background)
  3d-office/          Full interactive 3D experience + overlay modals
  about/  projects/   2D pages (per-segment server layouts add SEO metadata)
  sitemap.ts robots.ts
components/
  3d/                 The 3D scene (Scene3D → MainScene → office objects)
  ui/                 Overlay UI: ProjectPanel, modals, ModalShell, SceneLoader
  about/              About-page sections
data/projects.ts      Single source of truth for all projects
lib/
  deviceTier.ts       Device detection + QUALITY_PRESETS
  materials.ts        Shared material instances
  site.ts             Centralized site/SEO config
store/useStore.ts     Zustand store (UI flags, quality tier, project getters)
```

### How it fits together

The 3D tree is always loaded client-side (`dynamic(..., { ssr: false })`):
`Scene3D` (Canvas + renderer config) → `MainScene` (composition) → office objects.
3D objects don't render their own panels — clicking an object flips a flag in the
Zustand store, and a DOM modal in the page reads that flag and renders the UI. Add or
edit portfolio content in `data/projects.ts`.

Rendering cost is governed by `lib/deviceTier.ts`: a tier (`high` / `medium` / `low`)
is detected on mount and stored, and `QUALITY_PRESETS` maps it to concrete settings
consumed by `Scene3D`, `MainScene`, `PostProcessing`, `SceneSetup`, and `OfficeRoom`.
You can force a tier for testing with `?tier=low` (or `medium` / `high`).

## Documentation

- `CLAUDE.md` — architecture guide for the codebase.
- `IMPROVEMENTS_ROADMAP.md` — performance/mobile + SEO work and backlog.
- `3D_VISUAL_POLISH_GUIDE.md` — step-by-step guide for improving the 3D look and UI.

## Deployment

Optimized for Vercel (zero-config Next.js). Remember to set `NEXT_PUBLIC_SITE_URL` in
the project's environment variables.
