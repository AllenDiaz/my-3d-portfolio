# 3D Visual & UI Polish Guide

A concrete, step-by-step checklist for making the 3D office **look** dramatically
better — both the in-canvas render and the 2D overlay UI. Steps are ordered
**quick-wins-first**. Each step lists the file(s), a before→after snippet, effort
(S / M / L), and a **Tier note** describing how it should behave across the device
quality tiers defined in `lib/deviceTier.ts`.

> **Golden rule — don't regress mobile.** The previous round added device-tier scaling
> (`QUALITY_PRESETS` in `lib/deviceTier.ts`, read through the Zustand `qualityTier`).
> Every expensive technique below (soft shadows, contact shadows, PBR maps, higher
> reflector resolution, custom HDRI) must be **gated by tier** so `low`/`medium` devices
> stay fast. Where useful, add a new field to `QualityPreset` rather than hard-coding.

---

## Priority table

| # | Step | Area | Effort | Impact |
|---|------|------|--------|--------|
| A1 | ACES tone mapping + color management | Render | S | ★★★★★ |
| A2 | Soft shadows + shadow bias | Lighting | S | ★★★★☆ |
| A3 | Contact shadows (grounding) | Lighting | S | ★★★★☆ |
| A4 | Smoother geometry (segments + rounded edges) | Geometry | M | ★★★★☆ |
| A5 | Post-FX tuning (DoF focus, chromatic aberration) | Post-FX | S | ★★★☆☆ |
| A6 | Shared material library | Materials | M | ★★★☆☆ (+perf) |
| A7 | PBR texture maps (normal/roughness/AO) | Materials | L | ★★★★★ |
| A8 | Physical materials (clearcoat) on hero objects | Materials | M | ★★★☆☆ |
| A9 | Floor reflection upgrade | Materials | S | ★★★☆☆ |
| A10 | Custom HDRI + fog | Atmosphere | M | ★★★★☆ |
| A11 | Emissive/bloom palette cohesion | Atmosphere | M | ★★★☆☆ |
| A12 | Particle sprite polish | Atmosphere | S | ★★☆☆☆ |
| B1 | Shared `ModalShell` component | UI | M | ★★★☆☆ |
| B2 | Deliberate typography system | UI | S | ★★★☆☆ |
| B3 | Micro-interactions (stagger, press states) | UI | M | ★★★★☆ |
| B4 | Branded loading progress bar | UI | S | ★★★★☆ |
| B5 | Collapsible legend / instructions | UI | M | ★★★☆☆ |
| B6 | `prefers-reduced-motion` + focus rings | UI/a11y | S | ★★★☆☆ |

---

# Part A — 3D scene appearance

## A1. ACES Filmic tone mapping + color management — `components/3d/Scene3D.tsx`

**Why:** The renderer currently uses Three.js defaults (`NoToneMapping`), so colors are
flat and the Bloom pass can blow out bright pixels into ugly white clipping. ACES Filmic
tone mapping is the single highest-impact "this looks professional now" change — it rolls
off highlights cinematically and deepens contrast. This is what most polished R3F scenes
are doing that this one isn't.

**Before** (`<Canvas>` `gl` prop):
```tsx
gl={{
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance',
  stencil: false,
  depth: true
}}
```

**After:**
```tsx
import * as THREE from 'three';
// ...
gl={{
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance',
  stencil: false,
  depth: true,
}}
onCreated={({ gl }) => {
  gl.toneMapping = THREE.ACESFilmicToneMapping;
  gl.toneMappingExposure = 1.1;          // tune 0.8–1.4 to taste
  gl.outputColorSpace = THREE.SRGBColorSpace; // explicit (default, but make intent clear)
}}
```

**Mood bonus:** drive exposure from the `lightsOn` store flag so the "lights off" state
feels genuinely darker:
```tsx
gl.toneMappingExposure = useStore.getState().lightsOn ? 1.1 : 0.7;
```
(For a live toggle, set `gl.toneMappingExposure` inside a small `useThree`/`useEffect`
component that reads `lightsOn`, since `onCreated` runs once.)

**Effort:** S **Tier note:** free on all tiers — apply unconditionally.

---

## A2. Soft shadows + shadow bias — `components/3d/SceneSetup.tsx` (+ Scene3D)

**Why:** `<Canvas shadows>` defaults to hard-edged PCF shadows; the main key light at
`position={[5, 8, 5]}` casts crisp, slightly aliased shadows with no bias tuning (risking
shadow acne on the desk). Soft shadows read as far more realistic.

**Option 1 — drei `<SoftShadows>` (PCSS, easiest):** add once inside the scene tree
(e.g. top of `SceneSetup`'s returned fragment):
```tsx
import { SoftShadows } from '@react-three/drei';
// ...
<SoftShadows size={25} samples={16} focus={0.5} />
```

**Option 2 — global soft shadow map** in `Scene3D.tsx` `onCreated`:
```tsx
gl.shadowMap.type = THREE.PCFSoftShadowMap;
```

**Always add bias** to the shadow-casting key light to kill acne:
```tsx
<directionalLight
  position={[5, 8, 5]}
  intensity={lightsOn ? 0.8 : 0.1}
  castShadow
  shadow-mapSize-width={2048}
  shadow-mapSize-height={2048}
  shadow-bias={-0.0001}          // ADD
  shadow-normalBias={0.02}       // ADD — helps thin geometry
  shadow-camera-far={50}
  /* ...existing frustum... */
/>
```

**Effort:** S
**Tier note:** `<SoftShadows>` (PCSS) is GPU-heavy. Gate it: render it only when
`qualityTier === 'high'`; for `medium` use the cheaper `PCFSoftShadowMap`; for `low`
keep default hard shadows (or disable shadow casting entirely). Consider a
`softShadows: boolean` and `shadowMapSize: number` field on `QualityPreset`.

---

## A3. Contact shadows for grounding — `components/3d/OfficeRoom.tsx` or `MainScene.tsx`

**Why:** Furniture currently looks slightly "floaty" because only the directional light
grounds it. drei `<ContactShadows>` bakes a soft blob shadow under the desk/chair that
sells contact with the floor — cheap and very effective.

```tsx
import { ContactShadows } from '@react-three/drei';
// place just above the floor (y slightly > 0):
<ContactShadows
  position={[0, 0.01, -1.5]}
  scale={12}
  resolution={1024}
  blur={2.5}
  opacity={0.6}
  far={4}
  color="#000000"
/>
```

**Effort:** S
**Tier note:** drop `resolution` to 512 on `medium`, omit entirely on `low`.

---

## A4. Smoother geometry — `OfficeRoom.tsx`, `DeskItem.tsx`, `DeskLamp.tsx`

**Why:** Several primitives are visibly faceted: the plant uses `sphereGeometry args={[0.15, 8, 8]}`
(an octahedron, basically), cylinders fall back to the default 8 segments, and the desk/chair
are hard-edged boxes. Higher segment counts + rounded edges instantly modernize the look.

**Spheres / cylinders** — bump segments:
```tsx
// before
<sphereGeometry args={[0.15, 8, 8]} />
<cylinderGeometry args={[0.3, 0.3, 0.05]} />   // defaults to 8 radial segments
// after
<sphereGeometry args={[0.15, 32, 32]} />
<cylinderGeometry args={[0.3, 0.3, 0.05, 48]} />
```

**Rounded edges** — swap hard boxes for drei `<RoundedBox>` on the desktop, chair seat,
and backrest:
```tsx
import { RoundedBox } from '@react-three/drei';
// before: <boxGeometry args={[3, 0.1, 1.5]} /> inside a <mesh>
<RoundedBox args={[3, 0.1, 1.5]} radius={0.02} smoothness={4} castShadow receiveShadow>
  <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.6} />
</RoundedBox>
```

**Effort:** M (touch several meshes)
**Tier note:** keep segment bumps modest; very high segment counts on `low` aren't worth
it. Reasonable mid values (32) are fine everywhere — no separate gating needed.

---

## A5. Post-FX tuning — `components/3d/PostProcessing.tsx`

**Why:** Two existing effects are mistuned. `DepthOfField` uses `focusDistance={0.01}`
(focal plane almost on the lens) which can blur the whole desk; `ChromaticAberration`
at `offset={[0.0005, 0.0005]}` is essentially invisible.

```tsx
// DepthOfField — pull the focal plane onto the desk and soften aperture
<DepthOfField
  focusDistance={0.035}   // was 0.01
  focalLength={0.08}      // was 0.2 (lower = wider depth in focus)
  bokehScale={lightsOn ? 2 : 3}
  height={480}
/>

// ChromaticAberration — make it perceptible (subtle, not garish)
<ChromaticAberration offset={[0.0012, 0.0012]} />   // was [0.0005, 0.0005]
```

> Tune `focusDistance` live by temporarily mounting drei's `<Perf>` or Leva controls
> (Leva is already a dependency) and watching the desk sharpen.

**Effort:** S
**Tier note:** unchanged — these effects already only run on `full` (high) /`reduced`
(medium) per the existing tier gating; `low` skips post-FX entirely.

---

## A6. Shared material library — new `lib/materials.ts`

**Why:** Every mesh constructs its own `meshStandardMaterial`, and many are identical
(desk legs all `color="#1a1a1a" metalness={0.8} roughness={0.2}`; books, walls repeat).
Centralizing into memoized shared instances improves consistency and reduces GC/VRAM —
a visual *and* perf win that complements the tier work.

```ts
// lib/materials.ts
import * as THREE from 'three';

export const MATERIALS = {
  darkMetal: new THREE.MeshStandardMaterial({ color: '#1a1a1a', metalness: 0.8, roughness: 0.2 }),
  matteWall: new THREE.MeshStandardMaterial({ color: '#0f0f0f', roughness: 0.9 }),
  deskTop:   new THREE.MeshStandardMaterial({ color: '#2a2a2a', metalness: 0.6, roughness: 0.4 }),
};
```
```tsx
// usage in OfficeRoom.tsx — replace inline <meshStandardMaterial .../> with:
<mesh geometry={...} material={MATERIALS.darkMetal} castShadow />
```
> Note: a shared material can't be hover-mutated per-instance. Keep per-mesh materials for
> interactive objects (chair, monitors, badges) that change `emissive` on hover; share only
> the static ones.

**Effort:** M **Tier note:** neutral (helps all tiers).

---

## A7. PBR texture maps — `OfficeRoom.tsx` (floor, walls)

**Why:** The biggest realism gap. Every surface is a flat albedo + single scalar roughness;
there are **no normal, roughness, or AO maps** anywhere, so large surfaces (floor, walls)
look dimensionless. Adding tiling PBR maps gives them micro-detail under the lights.

1. Download a CC0 material set (concrete/plaster for walls, polished concrete for floor)
   from **Poly Haven** or **ambientCG** — grab `*_diff`, `*_nor_gl`, `*_rough`, `*_ao`
   at 1K (2K only for `high`). Put them under `public/textures/<material>/`.
2. Load with drei `useTexture` and set tiling:
```tsx
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const props = useTexture({
  map: '/textures/concrete/diff.jpg',
  normalMap: '/textures/concrete/nor_gl.jpg',
  roughnessMap: '/textures/concrete/rough.jpg',
  aoMap: '/textures/concrete/ao.jpg',
});
Object.values(props).forEach((t) => {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(4, 4);
});
// wall:
<mesh position={[0, 3, -5]} receiveShadow>
  <planeGeometry args={[20, 6]} />
  <meshStandardMaterial {...props} />
</mesh>
```
> `aoMap` requires a second UV set (`uv2`). For a plane, copy `uv` → `uv2` on the geometry,
> or skip `aoMap` on simple planes and rely on N8AO (already in the post stack).

**Effort:** L (sourcing + wiring + UV2)
**Tier note:** load **1K** maps on `medium`, **2K** on `high`, and on `low` skip the maps
entirely (plain colored material) — texture memory is the main mobile cost. Add a
`textureSize: 0 | 1024 | 2048` field to `QualityPreset`.

---

## A8. Physical materials on hero objects — `Computer.tsx`, `OfficeRoom.tsx` (desk)

**Why:** Monitor glass and a lacquered desk read better with a clearcoat layer than plain
`meshStandardMaterial`. Use `meshPhysicalMaterial` selectively (it's more expensive — only
on a few hero surfaces).

```tsx
// monitor screen glass / frame
<meshPhysicalMaterial
  color="#0a0a0a"
  metalness={0.9}
  roughness={0.15}
  clearcoat={1}
  clearcoatRoughness={0.1}
  envMapIntensity={1.5}
/>
```

**Effort:** M
**Tier note:** fall back to the existing `meshStandardMaterial` on `low` (clearcoat adds
shader cost); only the handful of hero objects should ever use physical materials.

---

## A9. Floor reflection upgrade — `OfficeRoom.tsx`

**Why:** The reflective floor (`MeshReflectorMaterial`) runs at `resolution={512}`, which
is soft on desktop. A higher resolution and slightly tuned blend make reflections crisper.

```tsx
// before: resolution={512} mixStrength={0.3} blur={[300, 100]}
<MeshReflectorMaterial
  blur={[200, 60]}
  resolution={1024}      // tier-gated, see note
  mixBlur={1}
  mixStrength={0.45}
  roughness={0.6}
  depthScale={1.2}
  minDepthThreshold={0.4}
  maxDepthThreshold={1.4}
  color="#1a1a1a"
  metalness={0.6}
/>
```

**Effort:** S
**Tier note:** `MeshReflectorMaterial` renders the scene to an offscreen target every frame —
this is one of the heaviest costs. Use `resolution` `1024` (high) / `512` (medium) /
**disable reflections** on `low` (swap to a plain dark `meshStandardMaterial`). Drive it
from `qualityTier`.

---

## A10. Custom HDRI + fog — `SceneSetup.tsx`

**Why:** `<Environment preset="city" />` is generic. A mood-matched HDRI (cool/tech, or a
dim interior) unifies reflections and ambient color. Subtle fog adds depth separation
between the desk and the binary walls.

```tsx
// custom HDRI (place file in /public): warmer or cooler to set the mood
<Environment files="/hdri/studio_small_dim_1k.hdr" environmentIntensity={0.6} />

// fog — add inside the scene (or as a prop on <Canvas scene>)
<fogExp2 attach="fog" args={['#0a0a0a', 0.045]} />
```
> Match the fog color to the canvas background (`#0a0a0a`) so the room dissolves into the
> void rather than into a visible wall.

**Effort:** M
**Tier note:** use a `1k` HDRI on `medium`/`low`, `2k` on `high`. Fog is free everywhere.

---

## A11. Emissive & bloom palette cohesion — `Computer.tsx`, `DeskItem.tsx`, `PostProcessing.tsx`

**Why:** Emissive accents are scattered across blue (`#4a90e2`), purple (`#8b5cf6`),
amber (`#fbbf24`), green. Pulling them toward a deliberate 2–3 color palette makes the
glow feel art-directed rather than random, and lets you tighten the Bloom threshold so only
intended elements bloom.

- Pick a primary (e.g. cyan `#00e5ff`) + secondary (violet `#8b5cf6`) + one warm accent.
- Apply consistently to monitor screens, the holographic display, and hover lights.
- Then raise `luminanceThreshold` slightly (e.g. `0.2 → 0.25`) in `PostProcessing.tsx` so
  mid-tone surfaces stop blooming.

**Effort:** M **Tier note:** neutral.

---

## A12. Particle sprite polish — `components/3d/FloatingParticles.tsx`

**Why:** The atmospheric particles use a default square `pointsMaterial`. A soft circular
sprite + `depthWrite={false}` makes them read as dust motes/bokeh rather than squares.

```tsx
// generate a soft radial sprite once (useMemo) via a small canvas, then:
<pointsMaterial
  map={softCircleTexture}
  size={0.05}
  transparent
  depthWrite={false}
  blending={THREE.AdditiveBlending}
  sizeAttenuation
  opacity={0.6}
/>
```

**Effort:** S
**Tier note:** particle **count** is already tier-driven (`preset.particleCount`); the
sprite change is free.

---

# Part B — 2D overlay UI

## B1. Shared `ModalShell` component — new `components/ui/ModalShell.tsx`

**Why:** `ProjectPanel.tsx` and the `*Modal.tsx` files each re-implement the same
glassmorphism container (gradient bg, `backdrop-blur`, border, close button, AnimatePresence).
A single shell removes drift and makes future restyling one-file.

```tsx
// components/ui/ModalShell.tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function ModalShell({ isOpen, onClose, title, children }: {
  isOpen: boolean; onClose: () => void; title?: string; children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div role="dialog" aria-modal="true" aria-label={title}
            className="relative w-full max-w-3xl rounded-2xl border border-white/10
                       bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl"
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <button onClick={onClose} aria-label="Close"
              className="absolute right-4 top-4 rounded-full border border-white/20
                         bg-black/50 p-2 hover:bg-black/70 focus:outline-none
                         focus-visible:ring-2 focus-visible:ring-blue-400">
              <X className="h-5 w-5 text-white" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```
Migrate one modal at a time; the store flags (`showSkillsModal`, etc.) stay as-is.

**Effort:** M **Impact:** consistency + faster future changes.

---

## B2. Deliberate typography system — `app/globals.css` / Tailwind usage

**Why:** Geist Sans and **Geist Mono** are already loaded in `app/layout.tsx` but the mono
face is underused. The sci-fi/terminal surfaces (`SystemNotification`, object legend, code
prompts) should lean on mono for character; body copy on sans. Define a small scale.

- Use `font-mono` (maps to `--font-geist-mono`) on terminal-style panels and badges.
- Establish a type scale: display `text-3xl/4xl font-bold`, section `text-xl font-semibold`,
  body `text-base text-gray-300`, meta `text-xs uppercase tracking-wide text-gray-500`.

**Effort:** S **Impact:** cohesion.

---

## B3. Micro-interactions — `ProjectPanel.tsx`, `AllProjectsModal.tsx`, modals

**Why:** Lists (tech tags, project grid, skills) pop in all at once. Staggered reveals and
real press/hover states make the UI feel responsive and premium.

```tsx
const list = { show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

<motion.ul variants={list} initial="hidden" animate="show">
  {technologies.map((t) => (
    <motion.li key={t} variants={item}>{t}</motion.li>
  ))}
</motion.ul>
```
Add `whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}` to primary buttons/cards.

**Effort:** M **Impact:** ★★★★☆ for perceived quality.

---

## B4. Branded loading progress — `app/page.tsx`, `app/3d-office/page.tsx`

**Why:** The Suspense fallback is plain "Loading 3D Scene…". drei's `useProgress` exposes
real asset-load percentage — show a branded bar so the wait feels intentional.

```tsx
'use client';
import { useProgress } from '@react-three/drei';

function SceneLoader() {
  const { progress, active } = useProgress();
  if (!active) return null;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-black">
      <div className="font-mono text-sm text-gray-400">Booting workspace… {Math.round(progress)}%</div>
      <div className="h-1 w-64 overflow-hidden rounded bg-white/10">
        <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all"
             style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
```
Use as the Suspense `fallback` (and/or alongside the existing drei `<Loader>` in `Scene3D`).

**Effort:** S **Impact:** ★★★★☆.

---

## B5. Collapsible legend / instructions — `app/3d-office/page.tsx`

**Why:** The object-ID legend (Tablet → projects, ID Card → experience, …) is a static
always-on block that competes with the scene. Make it a collapsible, icon-led panel that
starts open once then remembers collapse, and align it visually with the bottom hint bar.

- Wrap the legend in a `motion` panel with a header toggle (chevron) and `AnimatePresence`
  for the body.
- Persist collapsed state in `localStorage` (or a store flag).
- Use the same glass tokens as `ModalShell` for consistency.

**Effort:** M **Impact:** less clutter, more polish.

---

## B6. `prefers-reduced-motion` + focus rings — global

**Why:** The cinematic camera intro (`CinematicCamera.tsx`, GSAP) and the heavy Framer
transitions can be uncomfortable for motion-sensitive users, and overlay controls lack
visible keyboard focus. Both are quick, high-credibility polish.

- Reduced motion:
```tsx
import { useReducedMotion } from 'framer-motion';
const reduce = useReducedMotion();
// skip/shorten the GSAP intro and snap the camera to the rest position when `reduce`
```
- Add `focus-visible:ring-2 focus-visible:ring-blue-400 focus:outline-none` to buttons,
  close controls, and links across the overlay (the `ModalShell` snippet already does).

**Effort:** S **Impact:** accessibility + perceived craft.

---

# Performance & tier guidance

Map each addition to `QUALITY_PRESETS` (`lib/deviceTier.ts`). Suggested extensions to the
`QualityPreset` interface:

| Field | high | medium | low |
|-------|------|--------|-----|
| `softShadows` | PCSS (`<SoftShadows>`) | `PCFSoftShadowMap` | hard / off |
| `shadowMapSize` | 2048 | 1024 | 1024 or no cast |
| `contactShadows` | 1024 | 512 | off |
| `textureSize` | 2048 | 1024 | 0 (no PBR maps) |
| `reflections` | 1024 | 512 | off (plain floor) |
| `physicalMaterials` | yes | yes | no (standard) |
| `envHdriSize` | 2k | 1k | 1k |

Tone mapping (A1), fog (A10), geometry (A4), post-FX tuning (A5), and all of Part B are
effectively free and apply on every tier.

---

# Verification (when implementing any step)

1. `npm run dev` and compare the affected area before/after — ideally screenshot both.
2. After each visual change, confirm `npm run build` still passes (type-check + routes).
3. Check performance hasn't regressed on constrained devices: load with `?tier=low` and
   `?tier=medium` (the override in `lib/deviceTier.ts`) and confirm gated effects are off
   and the scene still hits a smooth frame rate (Chrome DevTools → Performance / FPS meter).
4. Re-enter and leave `/3d-office` a few times and watch the console for Three.js
   context-loss or "too many textures" warnings (especially after A7 PBR maps).
5. Test `prefers-reduced-motion` (DevTools → Rendering → "Emulate prefers-reduced-motion")
   after B6.
