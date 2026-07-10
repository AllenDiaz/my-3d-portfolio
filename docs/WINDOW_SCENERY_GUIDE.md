# Window & Night-City Scenery Guide

How the back-wall window and the night-city skyline behind it are built, and how to
tune or extend them. Implemented entirely with procedural geometry + a canvas texture —
no asset files — and tier-gated through `QUALITY_PRESETS`.

## What it does

The back wall (z=-5) — directly in the camera's settled sightline behind the monitors —
has a real **window opening** looking out onto a **procedural night city**: gradient
sky, stars, a haloed moon, and lit-window skyscraper silhouettes. A cool `RectAreaLight`
at the window spills city light into the room, so the view is the *motivated* light
source for the "late-night dev studio" mood.

## Pieces & files

| Piece | File | Notes |
|---|---|---|
| Wall opening + window frame/glass | `components/3d/OfficeRoom.tsx` | Back wall rebuilt as 4 panels around a `6 × 2.8` opening (`x:[-3,3]`, `y:[1.6,4.4]`); frame/mullions reuse `MATERIALS.darkMetal`; glass is tinted + `meshPhysicalMaterial` clearcoat on capable tiers |
| Scenery | `components/3d/CityscapeBackdrop.tsx` | Far backdrop plane (`z=-28`) always; two parallax silhouette layers (`z=-19`, `z=-13`) + twinkle on the high tier |
| Mount + holo relocation | `components/3d/MainScene.tsx` | Renders `<CityscapeBackdrop />`; `HolographicDisplay` moved to `[3.4,1.5,-4.6]` so it doesn't float in the opening |
| Window light | `components/3d/SceneSetup.tsx` | `RectAreaLight` at `[0,3,-4.8]`, `lookAt(0,1.2,2)`, color `#9db8ff` |
| Tier flags | `lib/deviceTier.ts` | `cityParallax` (high only) and `sceneryTextureSize` (2048 high/med, 1024 low) |

## How the scenery is drawn

`CityscapeBackdrop.tsx` follows the project's `CanvasTexture` pattern (same as
`Computer.tsx` / `BinaryWall.tsx`):

- `makeSkyTexture(size)` — vertical night gradient, scattered stars, a radial-halo moon,
  a warm horizon glow, and two faint distant building rows. Mapped onto the far plane.
- `makeSilhouetteTexture(...)` — transparent background with one row of darker buildings
  and brighter lit windows; used for the nearer parallax layers (high tier).
- `buildingRow(...)` — shared helper that lays down variable-width/height blocks and
  sprinkles warm/cool lit window rects.

Materials are `meshBasicMaterial` (unlit — the backdrop shouldn't be lit by room lights)
with **`fog={false}`** and **`toneMapped={false}`**. Bright window/moon pixels exceed the
Bloom luminance threshold, so they glow through the existing post stack.

### Why `fog={false}` is essential
The scene uses `fogExp2` at density `0.03`; anything past ~z=-10 would fade to the fog
color (`#0a0a0a`). The scenery sits at z=-13…-28, so every scenery mesh disables fog and
relies on its own baked gradient/haze instead.

## Tier behavior

| Tier | Backdrop | Parallax layers | Twinkle | Texture | Glass |
|---|---|---|---|---|---|
| high | yes | yes (2 layers) | yes | 2048 | physical clearcoat |
| medium | yes | no | no | 2048 | physical clearcoat |
| low | yes | no | no | 1024 | plain standard |

Force a tier while testing with `?tier=low` / `?tier=medium` / `?tier=high`.

## Tuning levers

- **Window framing** — opening bounds are the 4 wall panels + the window group in
  `OfficeRoom.tsx`. Change the opening by editing the panel sizes/positions together
  with the `<group position={[0,3,-4.96]}>` frame/glass.
- **City mood** — the gradient stops and `WARM`/`COOL` window palettes in
  `CityscapeBackdrop.tsx`. Lower stops = lighter sky.
- **Skyline density/height** — the `buildingRow` calls (`maxHeight`, `litChance`, fill).
- **Light spill** — `RectAreaLight` `intensity` / `color` in `SceneSetup.tsx`
  (RectAreaLight casts no shadows by design).
- **Backdrop fit** — far plane `position`/`planeGeometry` size in `CityscapeBackdrop.tsx`;
  enlarge if the plane edge ever peeks through the window at extreme orbit angles.

## Extending

- Drifting clouds: a wide semi-transparent layer with a slow `offset` on its texture.
- Rain on the glass: an animated normal/streak texture on the glass plane (gate to high).
- True parallax depth: swap the silhouette planes for tier-gated `InstancedMesh` building
  boxes between z=-8 and z=-16 (heavier — keep high-tier only).

## Verification

- `npx tsc --noEmit` + `npm run build` pass.
- `npm run dev`: from the settled camera the city reads through the window behind the
  monitors; windows/moon bloom; glass is clear (not a mirror); no void/gap around the
  opening; no z-fighting between glass and wall.
- `?tier=low` stays smooth and shows the flat backdrop only; `?tier=high` adds parallax +
  twinkle. Orbit within the constrained controls — the backdrop fills the window throughout.
