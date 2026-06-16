# Improvements Roadmap

A living roadmap for hardening the 3D portfolio. Phase 1 (Performance/Mobile) and
Phase 2 (SEO/Discoverability) are **implemented**. The Backlog captures deferred work.

---

## Phase 1 — Performance & Mobile ✅ (implemented)

**Problem:** the 3D office rendered at full quality on every device (300 particles,
five stacked post-processing effects, `dpr=[1,2]`), so mid-range phones dropped frames.
There was no device detection, and `PerformanceOptimizer` held a `dpr` state that was
never applied. Two components leaked GPU memory.

**What changed:**

1. **Device-tier detection** — `lib/deviceTier.ts` adds `detectDeviceTier()`
   (uses `pointer: coarse`, viewport size, `hardwareConcurrency`, `deviceMemory`,
   plus a `?tier=` debug override) and a single `QUALITY_PRESETS` map for
   `high` / `medium` / `low`.
2. **Global quality tier** — `qualityTier` lives in the Zustand store
   (`store/useStore.ts`); detection runs once in `Scene3D.tsx` (client-only, lazy
   init so the first render is already correct) and publishes the tier.
3. **Tier applied across the scene:**
   - `Scene3D.tsx` — `dpr` clamp from the preset (`2` / `1.5` / `1`).
   - `MainScene.tsx` — particle count from the preset (`300` / `150` / `60`).
   - `PostProcessing.tsx` — `off` renders nothing; `reduced` drops Depth-of-Field +
     Chromatic Aberration and lowers N8AO samples + MSAA; `full` is unchanged.
   - `PerformanceOptimizer.tsx` — removed the dead `dpr` state; `PerformanceMonitor`
     now steps the tier down if a device that passed detection still struggles.
4. **GPU leak fixes** — `HolographicDisplay.tsx` memoizes its `ShaderMaterial` (was
   recreated every render) and disposes it on unmount; `BinaryWall.tsx` disposes its
   `CanvasTexture` and shader material on unmount.
5. **Viewport** — `app/layout.tsx` exports a proper `viewport` (device-width, theme color).

**Net effect:** desktop is visually unchanged; phones/tablets get fewer particles,
lighter (or no) post-processing, and a clamped DPR.

---

## Phase 2 — SEO & Discoverability ✅ (implemented)

**Problem:** only a single global title/description existed. Every route was
`'use client'`, so no page could export metadata. No Open Graph/Twitter cards, no
sitemap, no robots, no structured data, empty `next.config.ts`, raw `<img>` in Hero.

**What changed:**

1. **Shared site config** — `lib/site.ts` centralizes `SITE_URL` (from
   `NEXT_PUBLIC_SITE_URL`), name, description, keywords, and default OG image.
2. **Rich global metadata** — `app/layout.tsx` adds `metadataBase`, title template,
   Open Graph, Twitter `summary_large_image`, keywords, canonical, robots, and a
   JSON-LD `Person` + `WebSite` graph.
3. **Per-page metadata via server layouts** (pages stay client components):
   - `app/about/layout.tsx`, `app/projects/layout.tsx` — static metadata.
   - `app/projects/[slug]/layout.tsx` — `generateMetadata()` builds per-project title,
     description, and OG image from `data/projects.ts`.
4. **Sitemap & robots** — `app/sitemap.ts` (static routes + every project) and
   `app/robots.ts`, both driven by `SITE_URL`.
5. **Image optimization** — `next.config.ts` enables AVIF/WebP + `deviceSizes` and
   `reactStrictMode`; Hero profile photo now uses `next/image` with `priority`.

### Action required
Set **`NEXT_PUBLIC_SITE_URL`** to the production origin (e.g. in Vercel project
settings). Until then, canonical/OG/sitemap URLs fall back to `http://localhost:3000`.
Consider adding a dedicated 1200×630 `app/opengraph-image.png` for richer social cards.

---

## Backlog — Future (not yet implemented)

| Item | Why | Notes |
| --- | --- | --- |
| **Contact functionality** | "Contact Me" phone desk item is a no-op; `#contact` nav link is dead; `nodemailer` is installed but unused. | Decide: API route (needs SMTP creds), hosted form service, or `mailto`. |
| **Accessibility** | 3D objects aren't keyboard/screen-reader accessible; modals lack focus traps and `role="dialog"`. | `@react-three/a11y` is already a dependency. |
| **Repo hygiene** | ~8 unused deps (`locomotive-scroll`, `gltf-pipeline`, `@react-three/rapier`, `@react-three/gltfjsx`, `stats.js`, `leva`, `@react-three/a11y` until used, `nodemailer` until contact ships); empty `README.md`; many historical `*.md` files at root. | Archive docs under `docs/`, write a real README, prune deps. |
| **Error boundary** | The 3D Canvas (client-only) can fail silently. | Add `app/error.tsx` and a Three.js fallback. |
| **Tests + CI** | No test suite or CI. | Vitest/RTL for UI, Playwright for 3D interactions, GitHub Actions for lint+build. |
| **Hardcoded project images** | `app/projects/[slug]/page.tsx` hardcodes image arrays per id. | Move to an `images?: string[]` field on `Project` in `data/projects.ts`. |
| **Skills typo** | "Azuer" → "Azure" in `components/about/SkillsSection.tsx`. | Quick fix. |

---

## Verification

- `npm run lint` and `npm run build` pass.
- Desktop renders unchanged; `?tier=low` (or mobile emulation) reduces particles,
  drops post-processing, and clamps DPR.
- `/sitemap.xml` and `/robots.txt` resolve; page source shows OG/Twitter tags and
  JSON-LD; `/projects/<id>` pages carry per-project titles.
