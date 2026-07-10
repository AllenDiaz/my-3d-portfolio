# 3D Office — Design & Layout Overhaul: Technical Design Document

**Author:** Tech Lead / Senior 3D Dev · **Status:** Design (no code) · **Target:** 60 fps @ 1080p, mid-range laptop GPU

> **Framing note.** The recent perf/SEO pass and visual-polish Part A already landed several wins this document would otherwise propose: ACES tone mapping, tier-gated soft + contact shadows, fog, DoF/chromatic-aberration tuning, `meshPhysicalMaterial` on the monitor chrome, a shared material library, and the `QUALITY_PRESETS` tiering. Where that's the case I mark it **[done — refine]** and propose the *next* increment rather than repeating it. The single biggest untouched lever is **spatial layout** — that's where this overhaul should start.
>
> **Committed art direction:** *Late-night dev studio.* Cool indigo ambient base, one warm amber key (desk lamp pool + faux-window spill), teal/green neon bleed from the BinaryWalls. Every lighting and material decision below serves that one story.

---

## 1. Spatial Layout & Proportions

### Current state
Reading `MainScene.tsx` / `OfficeRoom.tsx`: floor is a 20×20 plane centred at origin; back wall at `z=-5`, BinaryWalls at `x=±9.95` and `z=10` (no back binary wall — deliberate "void"). The interactive cluster lives in a shallow band at `z≈-1.3…-2`, while the camera rests at `[0, 1.5, 5]` looking at `[0, 1, 0]`.

Problems:
- **Dead space.** ~7 units of empty reflective floor sit between the camera (`z=5`) and the desk (`z=-2`). The room reads *empty*, not *lived-in*. The eye lands on floor, not content.
- **Off-axis third monitor.** Computer #3 at `[4, 0.65, -3]` is divorced from the two desk monitors (`±0.5, 0.8, -1.9`) and floats beside the side table (also `x=4`) — right side is cluttered, left side (bookshelf `x=-4`, chair `x=-2.5`) is sparse. The composition is unbalanced.
- **Inconsistent monitor heights** (`y=0.8` vs `0.65`) break the desk plane illusion.
- **Front BinaryWall at `z=10` is behind the camera** — invisible at rest, only ~⅓ of the shader work is ever seen.
- **Wall enclosure is loose.** Back wall at `z=-5` but floor extends to `z=-10`; reflective floor shows "nothing" behind the wall in reflections.

### Proposal
Adopt a **focused L-desk workstation** with intentional depth layering and a tightened camera box.

| Element | Current | Proposed | Reason |
|---|---|---|---|
| Primary desk | single, `z=-2` | L-desk: main run `z=-2`, return leg along `x=+1.6…2.4` | Gives the 3rd monitor a believable home; fills right-side void |
| Monitors | 2 @ `z=-1.9` + 1 @ `[4,…]` | Triple array on the desk plane, all `y=0.82`, angled inward (`±10°`, `0°`) | Unified sight line; "command centre" silhouette |
| Camera rest | `[0,1.5,5]` | `[0,1.45,3.6]`, target `[0,1.05,-1.9]` | Cuts dead floor; monitors fill ~60% of frame |
| Bookshelf | `[-4,0,-4.8]` | keep, add a floor rug + standing element near `x=-3` | Balances mass against the L-desk return |
| Negative space | undirected | Rug + lamp pool create a "stage" around the desk | Leads the eye to interactive objects |

**Sight-line goal (first 3 s):** after the intro settles, the frame should read *centre monitor (hero project) → flanking monitors → desk items in the warm pool → neon walls dissolving into fog at the edges.*

**Room enclosure:** pull the back wall to `z=-5.5` and **clamp the reflective floor plane to the enclosed area** (e.g. `~16×13` aligned to the walls) so reflections never sample the void. Add a simple skirting/baseboard box strip where walls meet floor — cheap, massively improves "built" feel.

**Implementation order (within section):** camera box retarget (trivial, huge) → monitor unification/height fix → L-desk geometry → rug + enclosure cleanup.

---

## 2. Lighting Design

### Current state **[done — refine]**
`SceneSetup.tsx` already runs a 6-light rig (ambient `0.3`, key directional `[5,8,5]` `0.8` w/ shadow bias, fill `[-5,5,-5]` `0.3`, warm desk point `#ffd89b` `0.6`, blue+purple accent points, ceiling spot), `Environment preset="city"`, `fogExp2`, and SoftShadows on the high tier. It's competent but **art-directionally muddy** — warm desk + blue + purple + green walls + neutral city IBL pull in five directions.

### Proposal — commit to the *late-night studio* palette
Layer with intent and **cut the colors that don't serve the story**:

| Layer | Change | Value |
|---|---|---|
| Ambient base | cool, dim | `color #16213a`, `intensity 0.18` |
| Key (faux window) | one rectangular cool spill from camera-left, simulating a city window | `RectAreaLight`, `color #9db8ff`, `intensity ~3`, aimed at desk |
| Fill | keep, lower + cool | `0.2`, `#2a3a5e` |
| Practical 1 — desk lamp | warm amber **pool**, the emotional key | point/spot `#ffb066`, `intensity 0.9`, tight `distance 4` |
| Practical 2 — monitor glow | driven by screen emissive (already present) | retune to palette (see §3) |
| Accent — neon spill | replace separate blue+purple with **two teal/green** point lights co-located with BinaryWalls | `#22d3a0`, low intensity, large distance |
| IBL | swap `preset="city"` → `"night"` or `"apartment"`, lower `environmentIntensity ~0.4` | warmer, story-consistent reflections |

**RectAreaLight caveat:** needs `RectAreaLightUniformsLib` init and doesn't cast shadows. Mitigation: keep the existing directional as the shadow-caster (dimmed), use RectAreaLight purely for the soft window wash. This is the highest-impact lighting change.

**MeshReflectorMaterial** is currently `blur=[200,60]`, `resolution` tier-gated, `mixStrength 0.45`, `roughness 0.6`, `metalness 0.6`. Refinements:

```
roughnessMap: subtle noise texture (procedural) → break the perfect mirror
mixStrength: 0.45 → 0.35   (reflections currently slightly hot)
blur:        [200,60] → [300,90]  (softer, wet-floor look)
mixContrast: ~1.2          (deepen reflection falloff)
depthScale:  1.2 → 1.0
```
Add a **`distortion` via a low-freq normal map** so the floor reads as polished concrete, not glass.

**Order:** IBL swap + ambient/accent palette cleanup (cheap) → desk-lamp pool → RectAreaLight window → reflector refinement.

---

## 3. Material & Shader Quality

### Current state
- Walls: shared `matteWall` (`#0f0f0f`, rough `0.9`) — **flat, no texture, no variation.**
- Desk top: `meshStandardMaterial #2a2a2a` rough `0.4` metal `0.6` (now a RoundedBox).
- Monitor chrome: `meshPhysicalMaterial` clearcoat **[done]**.
- Screen: emissive canvas texture.
- Chair/books/plant: flat standard materials.
- BinaryWall: custom shader (green, flicker, scroll, noise).

### Proposal

**Procedural surface variation (no texture files).** Inject a tri-planar value-noise term into wall/desk roughness via `onBeforeCompile` (shader injection) — breaks the dead-flat look with zero asset cost. One shared helper applied to walls + ceiling + desk.

| Surface | Upgrade | Technique |
|---|---|---|
| Walls/ceiling | roughness break-up + faint large-scale AO gradient | `onBeforeCompile` noise into `roughnessFactor` |
| Desk top | lacquer | `meshPhysicalMaterial` `clearcoat 0.6`, `clearcoatRoughness 0.2` |
| Monitor glass (screen front) | add a **separate** thin glass plane | `meshPhysicalMaterial` `transmission 0.9`, `ior 1.45`, `thickness 0.02` over the emissive screen |
| Coffee cup | ceramic sheen | `meshPhysicalMaterial` `sheen 0.5`, `clearcoat 0.3` |
| Chair | fabric vs leather | `sheen` for cloth; keep emissive hover |

All physical-material upgrades must be **gated on `preset.physicalMaterials`** (already in `QUALITY_PRESETS`) → standard fallback on low tier.

**BinaryWall enhancement (pick ≥1, I recommend all three, cheap GLSL):**
1. **Depth-based fade** — multiply alpha by `smoothstep` on view distance so walls dissolve into the fog instead of hard-clipping. Ties walls to the §2 fog.
2. **Scanline + chromatic offset** — CRT scanline overlay and a 1px R/B channel split for a "monitor wall" read.
3. **Proximity color-temp shift** — pass camera distance as a uniform; shift hue from cool green (far) → warm teal (near) for life. Keeps the "alive" feel without new geometry.

**Order:** desk lacquer + cup/chair physical (small, high realism) → wall noise injection → monitor glass plane → BinaryWall shader pass.

---

## 4. Geometry & Detail

### Current state
Post Part-A, cylinders/spheres are 32–48 seg and desk/chair use `RoundedBox`. Still low-detail for close-ups: **monitor frames are plain boxes** (no bezel inset, no thickness chamfer), **keyboard is a slab**, **bookshelf books are flat boxes**.

### Proposal

**Detail-up (close-up offenders):**
| Object | Problem | Procedural fix |
|---|---|---|
| Monitor | single box bezel | Compound: bezel frame (4 thin rounded bars) + recessed screen + chamfered back + cable |
| Keyboard | featureless slab | Instanced key caps (`InstancedMesh`, ~60 keys) on a rounded base — one draw call |
| Bookshelf books | flat colored boxes | Vary depth/height, add spine inset + tiny emissive title strips |

**New desk objects (reinforce the dev narrative, primitives only):**
1. **Mechanical-keyboard wrist + USB hub** with two faint LED dots (emissive) — instanced.
2. **Sticky-note cluster** on the monitor edge (3–4 thin rotated planes, warm colors) — implies an active task list. Strong "real developer" signal, ~negligible cost.

(Optional 3rd: a small succulent in a cube pot — softens the tech with life.)

**FloatingParticles — recommendation: MODIFY (keep, tame).**
Reasoning: dust motes support the "late-night, light-shafts" mood, and they're already tier-scaled + soft-sprited. But 300 full-room particles dilute focus. Change: **confine spawn volume to the desk-lamp pool + key-light shaft**, drop high-tier count `300→160`, reduce drift speed. They become *atmosphere in the light* rather than uniform noise. Remove entirely only if frame budget gets tight on low tier (already off-ish via count scaling).

**Order:** sticky notes (trivial, huge narrative ROI) → monitor compound bezel → instanced keyboard → USB hub → particle confinement.

---

## 5. Post-Processing Pipeline

### Current state **[done — refine]**
`PostProcessing.tsx` is already tier-gated: **full** = Bloom (`threshold 0.25`, mipmapBlur) + N8AO (`6/4/12`) + DoF (`focusDistance 0.035`, `focalLength 0.08`) + Vignette + ChromaticAberration (`0.0012`); **reduced** drops DoF + CA and lowers N8AO; **off** on low. Tone mapping = ACES in `Scene3D`. This is in good shape — the gaps are *film finish* and *DoF correctness*.

### Proposal
| Effect | Current | Proposed | Reason |
|---|---|---|---|
| Bloom | `0.5`, thr `0.25` | thr `0.22`, intensity `0.6`, add `radius 0.6` | Let monitor/neon emissives bloom more deliberately |
| N8AO | `6/4/12` | keep high; verify `aoRadius` ~`0.4` | Already good |
| DoF | static focus | **focus the desk via target distance**, `bokehScale 2.5` | Static `focusDistance` blurs unpredictably as user orbits |
| Vignette | `0.5/0.7` | `darkness 0.55`, `offset 0.35` | Frame the stage |
| **Add: Film grain/Noise** | — | `Noise` `opacity 0.025`, `premultiply` | Sells "cinematic late-night" |
| **Add: subtle SMAA** | relies on MSAA | optional on medium where MSAA is low | Edge quality when DPR drops |
| ToneMapping | ACES (exposure `1.1`) | tie exposure to `lightsOn` (mood) | Lights-off should *feel* darker |

**Graceful degradation:** the tier system already returns `null` on low and a reduced stack on medium — that's the correct architecture. Recommend adding **film grain only on high**, and making **DoF the first thing dropped** under sustained frame pressure (it's the most expensive). Wire a `postProcessing: 'minimal'` sub-step if needed (Bloom + Vignette only) between `reduced` and `off`.

**Order:** Bloom/Vignette retune (free) → film grain (high only) → DoF focus-distance fix → exposure-on-lightsOn.

---

## 6. Camera & Cinematic Intro

### Current state **[done — refine]**
`CinematicCamera.tsx`: GSAP from `[0,8,15]` → `[0,3,8]` → `[0,1.5,5]` + a positional shake; idle breathing in `useFrame`; now `prefers-reduced-motion` aware. Functional but the path is a **straight dolly** — little anticipation, and it ends at the dead-floor-heavy framing flagged in §1.

### Proposal — a 3-beat reveal with a parallax arc
| Beat | From → To | Look-at | Easing / dur |
|---|---|---|---|
| 1 — Establish | `[ -4, 4.5, 9 ]` → `[ -2.5, 2.2, 6 ]` | `[0,1.2,-1]` | `power2.out`, 1.8 s |
| 2 — Approach (arc right) | → `[ 1.5, 1.7, 4.4 ]` | `[0,1.1,-1.9]` | `power3.inOut`, 2.0 s |
| 3 — Settle | → `[ 0, 1.45, 3.6 ]` | `[0,1.05,-1.9]` | `power2.out`, 1.2 s |

Replace the jarring positional **shake** with a tiny **FOV punch** (`50→48→50`) on settle — more cinematic, less "earthquake". Curving the path (left-establish → right-arc → centre) creates parallax across the desk that a straight dolly can't.

**Idle life (post-intro):** keep breathing but **drive it from a single noise field** (Perlin on a 2D input) for X/Y/rotation instead of separate sines — less mechanical. Amplitude `~0.01` pos / `~0.004 rad`. Pause idle sway while a modal is open (read store) so DOM and 3D motion don't fight. Respect reduced-motion (already wired).

**Order:** keyframe + look-at retarget (must align with §1 camera box) → FOV-punch replacing shake → noise-driven idle.

---

## 7. Interactivity & Feedback

### Current state
Hover feedback is **inconsistent**: Computers float + emissive pulse + add a point light; DeskItems rotate/bob + show a label; the chair shifts color/emissive; DeskTablet has its own. There's **no unified system** and **no outline**. Critically, per `CLAUDE.md` and `MainScene.tsx`, the **phone DeskItem has label "Contact Me" but no `onClick`** — a dead affordance. The mouse item is also inert.

### Proposal — unified hover/click feedback
Build one small reusable interaction primitive (a hook + optional wrapper) all clickables use:

| Signal | Spec |
|---|---|
| Hover scale | `1.0 → 1.04` spring (consistent everywhere) |
| Emissive lift | `+0.25` intensity toward the object's accent color |
| Outline | drei `<Outline>` (postprocessing `Selection`/`Outline`) on hover — **tier-gated** (high/medium only) |
| Cursor | `pointer` on enter, `auto` on leave (centralize; some objects already do, some don't) |
| Click | quick `0.96` scale dip + emissive flash, then trigger store flag |
| Label | unified drei `<Html>` chip, mono font, consistent offset |

This replaces the ad-hoc per-object logic and guarantees every interactive object *reads* as interactive.

**Missing interactivity / store flags:**
| Object | Today | Proposal |
|---|---|---|
| Phone | label, **no handler** | Add `showContactModal` flag + `ContactModal` (follows the 3-file pattern). Wire the existing "Contact Me" label. |
| Mouse | inert | Either make it a subtle cursor/tooltip Easter egg or remove the label to avoid a false affordance |
| Window (faux) | static | Optional: click → toggle day/night lighting mood (ties to §2) |

> **Contract preserved:** all new interactive objects follow `3D component → store flag → DOM modal in app/3d-office/page.tsx`. No `any` types — the interaction hook is generic over a callback and an accent color.

**Order:** wire the dead phone (small, fixes a visible bug) → unified hover/click hook → tier-gated outline → optional window day/night.

---

## Priority Matrix

Ranked by impact-to-effort. **Do the top block first.**

| # | Proposed change | Visual Impact | Impl. Effort | Risk |
|---|---|---|---|---|
| 1 | Camera box retarget + 3-beat intro (§1/§6) | **High** | **Low** | Low |
| 2 | Wire dead phone → ContactModal (§7) | Medium | **Low** | Low |
| 3 | Unify monitor heights + inward angle (§1) | **High** | Low | Low |
| 4 | IBL swap + palette cleanup to one art direction (§2) | **High** | Low | Low |
| 5 | Bloom/Vignette retune + film grain (high) (§5) | Medium | **Low** | Low |
| 6 | Sticky notes + USB hub desk objects (§4) | Medium | Low | Low |
| 7 | Desk-lamp warm pool practical (§2) | **High** | Medium | Low |
| 8 | Unified hover/click feedback hook (§7) | **High** | Medium | Medium |
| 9 | L-desk geometry + 3rd monitor rehome (§1) | **High** | Medium | Medium |
| 10 | Reflector refinement + procedural roughness (§2/§3) | Medium | Medium | Medium |
| 11 | DoF focus-distance fix + exposure-on-lightsOn (§5) | Medium | Medium | Medium |
| 12 | Wall/desk noise shader injection (§3) | Medium | Medium | Medium |
| 13 | Monitor compound bezel + instanced keyboard (§4) | **High** | **High** | Medium |
| 14 | RectAreaLight faux-window key (§2) | **High** | Medium | **High** (uniforms init, no shadows) |
| 15 | Monitor transmission glass plane (§3) | Medium | Medium | **High** (transmission cost) |
| 16 | BinaryWall shader: fade + scanline + proximity hue (§3) | Medium | Medium | Medium |
| 17 | Tier-gated `<Outline>` selection (§7) | Medium | Medium | Medium |
| 18 | FloatingParticles confine-to-light (§4) | Low | Low | Low |

**Recommended first sprint (max ROI, low risk):** #1–6 — they're mostly parameter/coordinate changes that re-compose the scene and fix the dead phone, delivering a visibly more "senior" result before any heavy geometry or high-risk lighting work.

**Performance guardrails carried throughout:** every physical-material, outline, and post-effect addition is gated on the existing `QUALITY_PRESETS`; `AdaptiveDpr`/`AdaptiveEvents` stay in place; DoF and film grain are the designated first-to-drop under load; instancing is mandated for any repeated geometry (keys, books). No proposal adds an unbounded per-frame cost.
