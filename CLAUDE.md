# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build (also type-checks and validates route handlers)
npm run start    # Serve the production build
npm run lint     # ESLint (next core-web-vitals + typescript configs)
npx tsc --noEmit # Fast type-check without building (use this in the edit loop)
```

There is no test suite. Verification is manual: `npx tsc --noEmit` after each change, `npm run build` before pushing, and `npm run dev` to eyeball the 3D scene.

> Note: `lint` has pre-existing errors in older files (modals, ThemeProvider, etc.). Don't try to fix them all — just don't add new ones in files you touch.

## Working conventions (how we collaborate in this repo)

- **Commit granularly straight to `main`** — one focused commit per logical change, no feature branch. The owner wants a clean, readable public commit history.
- **Do NOT add a `Co-Authored-By: Claude` trailer** to commit messages.
- **Type-check (`npx tsc --noEmit`) after every change; `npm run build` before the final push.** Commit, then `git push origin main`.
- The 3D scene can't be verified headlessly here — for anything visual (lighting levels, framing, new geometry), state the values you chose and ask the owner to eyeball `npm run dev`. Lighting levers: `toneMappingExposure` and `environmentIntensity`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict, no `any`) · Tailwind CSS v4 · Zustand (state) · react-three-fiber + drei + postprocessing (3D) · framer-motion (2D animation) · GSAP (camera). Path alias `@/*` maps to the repo root.

## Architecture

A personal 3D portfolio. The centerpiece is an interactive 3D office rendered entirely with **procedural geometry** — there are no `.glb`/`.gltf` model files. Every object (desk, chair, monitors, walls, particles, desk clutter) is built from Three.js primitives and custom shaders in `components/3d/`. **All geometry must stay procedural.**

**Art direction: "late-night dev studio"** — cool indigo ambient base, a warm amber desk-lamp key, teal/green neon spill from the BinaryWalls. Keep lighting/material changes consistent with this.

### Routes (`app/`)
- `/` — landing page; 3D office as a background behind a 2D hero/links overlay.
- `/3d-office` — the full interactive 3D experience plus all overlay modals.
- `/about` — composed from `components/about/*` (experience timeline, skills, education).
- `/projects` and `/projects/[slug]` — 2D project listing and detail pages.
- Each route segment that needs SEO has a **server `layout.tsx`** that exports `metadata` / `generateMetadata` (the pages themselves are `'use client'` and can't). `app/sitemap.ts` and `app/robots.ts` are derived from `projectsData` + `lib/site.ts`.

### 3D rendering pipeline
The 3D tree is always loaded via `dynamic(..., { ssr: false })` because Three.js needs the browser. Nesting is fixed:

```
Scene3D.tsx          Canvas + ACES tone mapping (onCreated) + tier-driven dpr + Suspense
  └─ MainScene.tsx   composition hub, wrapped in <Selection> for hover outlines
       ├─ SceneSetup.tsx        lights, fog, OrbitControls, CinematicCamera, SoftShadows,
       │                        RectAreaLight window, desk-lamp spotlight, exposure-on-lightsOn
       ├─ OfficeRoom.tsx        room, L-desk, furniture, MeshReflectorMaterial floor, ContactShadows
       ├─ BinaryWall.tsx (×3)   custom-shader walls (depth fade + scanline)
       ├─ Computer.tsx (×3)     clickable monitors — triple array on the desk, hero centered
       ├─ DeskItem.tsx (×N)     clickable desk objects (keyboard is instanced; coffee, badge, phone, …)
       ├─ DeskTablet.tsx        opens the All Projects modal
       ├─ DeskClutter.tsx       non-interactive decor (sticky notes, USB hub)
       ├─ FloatingParticles, HolographicDisplay, AmbientSound  ambiance
       └─ PostProcessing.tsx    EffectComposer (Bloom, N8AO, DoF, Vignette, ChromaticAberration,
                                 Outline, Noise) — tier-gated
```

### Quality tiers — the central performance contract
`lib/deviceTier.ts` defines `detectDeviceTier()` and `QUALITY_PRESETS` (`high` / `medium` / `low`). The tier is detected once on mount in `Scene3D.tsx`, stored as `qualityTier` in the Zustand store, and read by `Scene3D` (dpr, shadow map type), `MainScene` (particle count), `PostProcessing` (effect set/off), `SceneSetup` (soft shadows), `OfficeRoom` (reflection resolution, contact shadows), and `Computer` (physical materials). `PerformanceOptimizer.tsx` (AdaptiveDpr/AdaptiveEvents/PerformanceMonitor) steps the tier *down* if FPS drops.

**Golden rule:** any expensive addition (soft/contact shadows, PBR maps, reflections, physical materials, post-FX) MUST be gated through `QUALITY_PRESETS` — add a field rather than hard-coding — so `low`/`medium` stay fast. Force a tier for testing with `?tier=low` (or `medium`/`high`). Target: 60 fps @ 1080p on a mid-range laptop GPU.

### State and interaction flow
`store/useStore.ts` (Zustand) is the single source of truth and the bridge between the 3D scene and the 2D DOM overlay. 3D objects do not render their own panels — clicking a 3D object sets a `show*Modal` flag, and a modal mounted in `app/3d-office/page.tsx` reads it and renders the DOM UI.

A typical "object → UI" feature touches three places:
1. The 3D component in `components/3d/` (wire `onClick`).
2. A `show*Modal` boolean + setter in `store/useStore.ts`.
3. A modal in `components/ui/` mounted in the page that consumes the flag.

Reusable UI primitives (use these, don't re-roll):
- **`components/ui/ModalShell.tsx`** — modal scaffold (backdrop, Escape-to-close, `role="dialog"`, focus ring). New modals build on it (e.g. `ContactModal`).
- **`components/ui/SceneLoader.tsx`** — branded loading screen driven by drei `useProgress`; used as the Suspense/dynamic fallback.
- **`components/3d/useHoverFeedback.ts`** — unified hover state + pointer cursor for clickable 3D objects. Interactive objects are also wrapped in `<Select enabled={hovered}>` so the tier-gated `<Outline>` highlights them.

Project data lives in `data/projects.ts` (`Project` interface + `projectsData`). The store derives `featuredProjects()`, category filters, search, and id lookup. `MainScene` shows the first three featured projects on the monitors. Add/edit portfolio content here.

### Shared modules (`lib/`)
- `lib/deviceTier.ts` — device detection + `QUALITY_PRESETS` (see above).
- `lib/materials.ts` — shared, reused `MeshStandardMaterial` instances for static objects (walls, desk legs) + a procedural noise roughness texture. Do NOT use these for objects that mutate their material on hover.
- `lib/site.ts` — centralized site/SEO config + `SITE_URL` (from `NEXT_PUBLIC_SITE_URL`, falls back to localhost).

### Theming
`next-themes` via `components/providers/ThemeProvider.tsx`, defaulting to dark (`storageKey="portfolio-theme"`, system disabled). The `lightsOn` store flag is separate — it controls in-scene light intensity *and* tone-mapping exposure (toggled by the desk lamp), not the site theme. `prefers-reduced-motion` is respected (cinematic intro + global CSS).

## Environment
Set `NEXT_PUBLIC_SITE_URL` to the production origin so canonical URLs, Open Graph, sitemap, and robots resolve correctly (falls back to `http://localhost:3000` in dev).

## Notes
- Root-level docs: `IMPROVEMENTS_ROADMAP.md` (perf/SEO work), `3D_VISUAL_POLISH_GUIDE.md` (visual upgrade guide), `3D_OFFICE_OVERHAUL_DESIGN.md` (the design doc whose first sprint + matrix are implemented). The older `*_SUMMARY.md` / `IMPLEMENTATION*.md` / `ARCHITECTURE.md` files are historical and lag the code — trust the source.
- Still deferred from the overhaul (need in-browser tuning, perf consideration): true `MeshTransmissionMaterial` monitor glass (currently a cheap clearcoat sheen). The RectAreaLight window, hover outline, and instanced keyboard are done.
- `reference/` contains the owner's personal career documents — not application code.
- `nodemailer` is still in `package.json` but there's no contact API route; the phone "Contact Me" object opens an info `ContactModal` (email/GitHub/LinkedIn), not a form.
