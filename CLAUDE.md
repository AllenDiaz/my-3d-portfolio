# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # ESLint (next core-web-vitals + typescript configs)
```

There is no test suite. Verification is manual via `npm run dev`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Zustand (state) · react-three-fiber + drei + postprocessing (3D) · framer-motion (2D animation) · GSAP (camera). Path alias `@/*` maps to the repo root.

## Architecture

This is a personal 3D portfolio. The centerpiece is an interactive 3D office rendered entirely with **procedural geometry** — there are no `.glb`/`.gltf` model files. Every object (desk, chair, monitors, walls, particles) is built from Three.js primitives and custom shaders in `components/3d/`.

### Routes (`app/`)
- `/` — landing page; renders the 3D office as a background behind a 2D hero/links overlay.
- `/3d-office` — the full interactive 3D experience plus all the overlay modals.
- `/about` — composed from `components/about/*` (experience timeline, skills, education).
- `/projects` and `/projects/[slug]` — 2D project listing and detail pages.

### 3D rendering pipeline
The 3D tree is always loaded via `dynamic(..., { ssr: false })` because Three.js requires the browser. The nesting is fixed:

```
Scene3D.tsx          Canvas + WebGL/DPR config + Suspense loader
  └─ MainScene.tsx   composition hub — instantiates every scene element
       ├─ SceneSetup.tsx        lights, OrbitControls, CinematicCamera (GSAP intro)
       ├─ OfficeRoom.tsx        room, desk, furniture (MeshReflectorMaterial floor)
       ├─ BinaryWall.tsx (×3)   custom-shader flickering walls
       ├─ Computer.tsx (×3)     clickable monitors, one per featured project
       ├─ DeskItem.tsx (×N)     clickable desk objects (keyboard, coffee, badge, …)
       ├─ DeskTablet.tsx        opens the All Projects modal
       ├─ FloatingParticles, HolographicDisplay, AmbientSound  ambiance
       └─ PostProcessing.tsx    EffectComposer (Bloom, SSAO, DoF, Vignette)
```

`PerformanceOptimizer.tsx` (AdaptiveDpr / AdaptiveEvents / PerformanceMonitor) scales pixel ratio with measured FPS.

### State and interaction flow
`store/useStore.ts` (Zustand) is the single source of truth and the bridge between the 3D scene and the 2D DOM overlay. 3D objects do not render their own panels — clicking a 3D object sets a flag in the store, and a modal component mounted in the page (`app/3d-office/page.tsx`) reads that flag and renders the DOM UI. Example: clicking the keyboard calls `setShowSkillsModal(true)`; `SkillsModal` in the page reads `showSkillsModal` and opens.

So a typical "object → UI" feature touches three places:
1. The 3D component in `components/3d/` (wire the `onClick`).
2. A `show*Modal` boolean + setter in `store/useStore.ts`.
3. A modal in `components/ui/` mounted in the page that consumes the flag.

Project data lives in `data/projects.ts` (the `Project` interface + `projectsData` array). The store derives `featuredProjects()`, category filters, search, and id lookup from it. `MainScene` shows the first three featured projects on the monitors. Add or edit portfolio projects here.

### Theming
`next-themes` via `components/providers/ThemeProvider.tsx` in `app/layout.tsx`, defaulting to dark (`storageKey="portfolio-theme"`, system disabled). The `lightsOn` store flag is separate — it controls in-scene light intensity (toggled by the desk lamp), not the site theme.

## Notes
- The numerous root-level `*.md` files (`ARCHITECTURE.md`, `FINAL_SUMMARY.md`, `IMPLEMENTATION*.md`, `THEME_AND_BINARY_WALL.md`, etc.) are historical design notes and may lag the actual code — trust the source over them. `ARCHITECTURE.md` in particular predates several components (e.g. `DeskTablet`, the modal suite).
- `reference/` contains the author's personal career documents (cover letters, case studies) — not application code.
- `nodemailer` is in `package.json` but no contact API route is wired up yet; the phone "Contact Me" desk item has no handler.
