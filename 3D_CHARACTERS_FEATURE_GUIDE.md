# 3D Characters Feature Guide — Procedural Avatar & Service Robots

> **Status:** Plan / implementation guide. No code written yet.
> **Scope:** Add a procedural seated avatar of the portfolio owner (Allen Diaz) and 2–3 ambient service robots to the existing react-three-fiber office, plus five tie-in enhancements.
> **Hard rule (from `CLAUDE.md`):** every piece of geometry is built from Three.js primitives, `BufferGeometry`, custom shaders, or `CanvasTexture`. **Zero `.glb`/`.gltf`/`.fbx`.** Every expensive behavior is gated through `QUALITY_PRESETS` in `lib/deviceTier.ts`.

This guide is grounded in the real codebase as of this writing. Anchor facts used throughout:

| Fact | Source | Value |
|---|---|---|
| Desk base group | `OfficeRoom.tsx:153` | `position={[0,0,-2]}`, desktop top at **y ≈ 0.80** |
| Monitors plane | `MainScene.tsx:74–82` | `z = -2.0`, hero centered at `[0, 0.8, -2.0]` |
| Chair | `OfficeRoom.tsx:186` | `position={[-2.5,0,-1.5]}`, `rotation={[0,π/4,0]}`, seat top **y ≈ 0.55** |
| Floor | `OfficeRoom.tsx:34` | 20×20 plane centered at origin, **y = 0** |
| Room bounds | `OfficeRoom.tsx` / `MainScene.tsx` | walls `x = ±10`, back wall `z = -5`, front wall `z = 10`; BinaryWalls at `x = ±9.95`, `z = 10` |
| Hover pattern | `useHoverFeedback.ts`, `DeskItem.tsx:281` | `const {hovered, hoverProps} = useHoverFeedback()` → wrap in `<Select enabled={hovered}>` |
| Modal pattern | `CLAUDE.md` "State and interaction flow" | 3D `onClick` → `show*Modal` flag in `store/useStore.ts` → modal in `components/ui/` mounted in `app/3d-office/page.tsx` |
| `CanvasTexture` precedent | `lib/materials.ts:16` | `makeNoiseTexture()` — SSR-guarded `typeof document === 'undefined'` |
| Billboard / hologram precedent | `HolographicDisplay.tsx` | `ShaderMaterial` (additive blend) created in `useMemo`, **disposed on unmount** via `useEffect` cleanup |
| Shared materials | `lib/materials.ts:39` | `MATERIALS.darkMetal` (metalness 0.8, rough 0.2), `MATERIALS.matteWall` |
| Palette anchors | `CLAUDE.md` art direction | indigo ambient · amber key (`toneMappingExposure`) · teal/cyan neon `#00ffff` |

---

## 1. Overview & Goals

### What this adds
The office today is full of *objects* but has no *presence*. Adding Allen as a seated procedural character turns the scene from "a developer's desk" into "a developer at work," and the roaming service robots dramatize the portfolio's core theme — **an AI/LLM engineer whose agents are made physical**. Together they give the late-night studio life and motion without breaking the procedural, no-asset constraint.

### Goals
1. **A recognizable seated avatar of Allen** at the desk — slim-solid proportions, dark tee with a jersey-style **"ALLEN DIAZ 02"** on the back (CanvasTexture), thin rectangular glasses, dark hair, warm medium-brown skin. Clickable → "About Allen" card.
2. **2–3 ambient service robots** patrolling the floor on a waypoint loop, periodically "serving" Allen, each clickable → flavor card. Teal-accented matte-metal chassis cohesive with the BinaryWall neon.
3. **Strict adherence to the perf contract:** every animation/path-following/expensive material is gated by a new `QUALITY_PRESETS` field. `low` tier shows static props only. Target **60 fps @ 1080p on a mid-range laptop GPU**.
4. **Native art direction:** no bright cartoon colors — everything sits in the indigo/amber/teal palette.

### Non-goals
- No skinned/rigged animation, no morph targets, no inverse kinematics. All motion is **transform animation** (`group.position` / `rotation` / `scale` driven by `useFrame`). This keeps us inside the "primitives only" rule and the perf budget.
- No real pathfinding/obstacle avoidance — waypoint loops are hand-authored and pre-validated to avoid the desk footprint.

---

## 2. File Map

### New files

| File | Purpose |
|---|---|
| `components/3d/Avatar/Avatar.tsx` | Root seated-avatar component: composes body parts, wires hover + click, idle-breathing animation. |
| `components/3d/Avatar/avatarParts.tsx` | Pure presentational sub-meshes (`Head`, `Torso`, `Arms`, `Legs`, `Glasses`, `Hair`) — primitive geometry only, no hooks. |
| `components/3d/Avatar/useShirtTexture.ts` | Hook that builds & memoizes the back-of-shirt `CanvasTexture` ("ALLEN DIAZ 02"); disposes on unmount. |
| `components/3d/Avatar/NameTagBillboard.tsx` | Enhancement #1 — floating "Allen Diaz · AI Engineer" holographic ID badge (CanvasTexture + gentle bob). |
| `components/3d/Avatar/CoffeeSteam.tsx` | Enhancement #3 — instanced rising steam sprites placed above the coffee mug. |
| `components/3d/Robots/Robot.tsx` | Single robot: chassis composition, status light, hover label, click, drives itself from the `useRobotBehavior` state machine. |
| `components/3d/Robots/robotParts.tsx` | Presentational chassis sub-meshes (`Torso`, `Visor`, `Legs`, `Claws`, `AccentStrips`). |
| `components/3d/Robots/useRobotBehavior.ts` | The patrol/serve state machine + per-frame waypoint interpolation (returns transform + status). |
| `components/3d/Robots/RobotFleet.tsx` | Maps `ROBOT_CONFIGS` → `<Robot>` instances; tier-gates static-vs-animated; renders dock + debug overlay. |
| `components/3d/Robots/robotConfig.ts` | Typed `ROBOT_CONFIGS` array (designation, waypoints, accent color, home dock, personality copy). |
| `components/3d/Robots/ChargingDock.tsx` | Enhancement #2 — floor-mounted recessed bay with teal LED strips. |
| `components/3d/Robots/PatrolDebugOverlay.tsx` | Enhancement #5 — dev-only `<Line>` rendering of each patrol path (`?debug=robots`). |
| `components/ui/AvatarModal.tsx` | "About Allen" DOM card, built on `ModalShell`. |
| `components/ui/RobotModal.tsx` | Robot flavor card (designation / task / uptime), built on `ModalShell`. |

> **Folder convention note:** existing 3D components are flat in `components/3d/`. This guide groups the new multi-file features into `Avatar/` and `Robots/` subfolders for cohesion. If the owner prefers the flat convention, drop the subfolders and prefix filenames (`AvatarParts.tsx`, `RobotFleet.tsx`, …) — see Open Questions.

### Modified files

| File | Change |
|---|---|
| `lib/deviceTier.ts` | Add `characterAnimation`, `robotBehavior`, `robotCount`, `steamParticles` fields to `QualityPreset` + all three presets (see §6). |
| `store/useStore.ts` | Add `showAvatarModal`, `showRobotModal`, `selectedRobot` slices + setters (see §5). |
| `components/3d/MainScene.tsx` | Mount `<Avatar/>`, `<RobotFleet/>`, `<NameTagBillboard/>`; pass `<CoffeeSteam/>` near the coffee `DeskItem`. |
| `app/3d-office/page.tsx` | Mount `<AvatarModal/>` and `<RobotModal/>`; read their flags from the store. |
| `components/3d/DeskItem.tsx` *(optional)* | If steam is colocated with the mug, render `<CoffeeSteam/>` inside the `coffee` case instead of in `MainScene` (see Enhancement #3). |

---

## 3. Implementation Phases

Each phase ends with `npx tsc --noEmit` clean and a `npm run dev` eyeball checkpoint (the scene can't be verified headlessly — see `CLAUDE.md`). Commit granularly straight to `main`, one focused commit per phase step, **no `Co-Authored-By` trailer**.

### Phase 1 — Avatar static mesh
- Build `avatarParts.tsx`: head, torso, upper/lower arms, hands, hips, thighs, shins, hair cap, glasses. All primitive geometry.
- Assemble in `Avatar.tsx` in a **seated pose** (thighs horizontal, shins vertical, torso slightly pitched forward ~8–12°, one hand forward toward keyboard).
- Place the group at the chair (`~[-2.5, 0, -1.5]`, facing −z toward the monitors). Confirm seat contact and framing in `dev`.
- Materials: skin (`MeshStandardMaterial`, warm brown, rough ~0.7), shirt (deep charcoal/midnight navy), pants (near-black), hair (matte near-black).
- **Checkpoint:** silhouette reads as a seated person at the desk; no clipping into desk/chair.

### Phase 2 — Avatar identity + interaction
- Implement `useShirtTexture.ts` and apply the CanvasTexture to the **back** torso face only (see §7).
- Add glasses tint (faint teal/amber, slight transparency).
- Wire hover (`useHoverFeedback` + `<Select enabled={hovered}>`) and click → `setShowAvatarModal(true)`.
- Implement the **idle breathing** scale oscillation on the torso group (cheap, runs on all tiers).
- Build `AvatarModal.tsx` (name, role "AI/LLM Engineer", tagline) and mount it in the page.
- **Checkpoint:** clicking Allen opens the card; hover outlines him and breathing reads subtle.

### Phase 3 — Robot chassis (static)
- Build `robotParts.tsx` + `Robot.tsx` with a **static** robot (no movement): torso, dome/visor head, two cylindrical legs, two small claw arms, emissive teal accent strips, pulsing status sphere.
- Build `robotConfig.ts` with 2–3 entries and `RobotFleet.tsx` that renders them at their `home` positions.
- Wire hover label (`<Html>` or billboard) + click → `setShowRobotModal(robot)`.
- Build `RobotModal.tsx` and mount it.
- **Checkpoint:** robots stand around the floor, status light pulses, hover shows "Agent-01" label, click opens flavor card.

### Phase 4 — Robot behavior (motion)
- Implement `useRobotBehavior.ts`: the `idle → walking → serving → returning → idle` state machine with waypoint lerp (see §8).
- Gate via `preset.robotBehavior`: when `false` (low tier), `Robot` skips the `useFrame` loop and stays at `home`.
- Add facing (yaw toward direction of travel) and the small "serving" bob.
- **Checkpoint:** robots patrol smoothly, periodically divert to Allen's chair, bob, and return. No desk-clipping.

### Phase 5 — Enhancements, polish & tier gating
- Enhancement #1 `NameTagBillboard` above the desk.
- Enhancement #2 `ChargingDock` + one robot's `returning` target = dock.
- Enhancement #3 `CoffeeSteam` above the mug (gated by `steamParticles`).
- Enhancement #4 typing-hand micro-animation (high tier only, `characterAnimation === 'full'`).
- Enhancement #5 `PatrolDebugOverlay` behind `?debug=robots`.
- Final sweep: verify all five tier knobs; force `?tier=low`/`medium`/`high` and confirm budgets; `npm run build`.
- **Checkpoint:** 60 fps @ 1080p on mid-range laptop at `high`; `low` is static and cheap.

---

## 4. Component API Specs

All props use strict types — **no `any`**. Shared vector type: `type Vec3 = [number, number, number];`

```ts
// components/3d/Avatar/Avatar.tsx
export interface AvatarProps {
  /** World position of the avatar root (defaults to the chair seat). */
  position?: Vec3;
  /** Y-rotation in radians so Allen faces the monitors (defaults to face -z). */
  rotationY?: number;
  /** Pre-built jersey label; defaults to "ALLEN DIAZ" + number "02". */
  jerseyName?: string;
  jerseyNumber?: string;
}

// components/3d/Avatar/avatarParts.tsx  (presentational — no hooks, no state)
export interface AvatarPartProps {
  /** Hover state lifts emissive/scale; passed down from Avatar. */
  hovered: boolean;
}
export interface TorsoProps extends AvatarPartProps {
  /** CanvasTexture applied to the back face of the shirt. */
  backTexture: THREE.Texture | null;
  /** Breathing scale (1.0 rest) driven by Avatar's useFrame. */
  breathScale: number;
}
export interface GlassesProps {
  /** Lens tint; faint teal or blue-light amber. */
  tint: THREE.ColorRepresentation;
  opacity: number;
}

// components/3d/Avatar/useShirtTexture.ts
export interface ShirtTextureOptions {
  name: string;       // "ALLEN DIAZ"
  number: string;     // "02"
  glow?: string;      // neon-teal glow color, default "#22d3ee"
  bg?: string;        // shirt base, default "#10131c"
}
export function useShirtTexture(opts: ShirtTextureOptions): THREE.CanvasTexture | null;

// components/3d/Avatar/NameTagBillboard.tsx
export interface NameTagBillboardProps {
  position?: Vec3;            // above desk, e.g. [0, 2.1, -2.4]
  primary?: string;          // "Allen Diaz"
  secondary?: string;        // "AI Engineer"
  bobAmplitude?: number;     // default 0.04
}

// components/3d/Avatar/CoffeeSteam.tsx
export interface CoffeeSteamProps {
  position?: Vec3;           // mug rim, e.g. world pos of coffee DeskItem + y offset
  enabled: boolean;          // = preset.steamParticles
  count?: number;            // default 6
}
```

```ts
// components/3d/Robots/robotConfig.ts
export type RobotStatus = 'idle' | 'busy';
export interface RobotConfig {
  id: string;                // "agent-01"
  designation: string;       // "Agent-01"
  home: Vec3;                // static-tier position + patrol start
  waypoints: Vec3[];         // closed loop (last connects to first); avoids desk
  accent: THREE.ColorRepresentation; // teal/cyan variant
  task: string;              // flavor: "Indexing repo embeddings…"
  serveTarget: Vec3;         // point near Allen's chair
  usesDock?: boolean;        // if true, returning target = dock bay
  speed?: number;            // units/sec along path, default 0.6
  serveEveryMs?: [number, number]; // random interval window, default [12000, 24000]
}
export const ROBOT_CONFIGS: readonly RobotConfig[];

// components/3d/Robots/Robot.tsx
export interface RobotProps {
  config: RobotConfig;
  /** Tier flag: when false the robot is a static prop (no useFrame path). */
  animated: boolean;
}

// components/3d/Robots/robotParts.tsx
export interface RobotPartProps { hovered: boolean; accent: THREE.ColorRepresentation; }
export interface StatusLightProps {
  status: RobotStatus;       // green when idle, amber when busy
  /** emissiveIntensity, driven by parent useFrame sine. */
  intensity: number;
}

// components/3d/Robots/useRobotBehavior.ts
export type RobotPhase = 'idle' | 'walking' | 'serving' | 'returning';
export interface RobotBehaviorState {
  position: THREE.Vector3;
  yaw: number;               // facing along travel direction
  bobOffset: number;         // y bob during serving
  status: RobotStatus;       // 'busy' while serving/returning, else 'idle'
  phase: RobotPhase;
}
/** Stateful hook owning the per-robot machine; advanced inside Robot's useFrame. */
export function useRobotBehavior(config: RobotConfig, animated: boolean): {
  ref: React.MutableRefObject<THREE.Group | null>;
  status: RobotStatus;
  advance: (delta: number, elapsed: number) => void; // call from useFrame
};

// components/3d/Robots/RobotFleet.tsx
export interface RobotFleetProps {
  /** Defaults to ROBOT_CONFIGS sliced to preset.robotCount. */
  configs?: readonly RobotConfig[];
}

// components/3d/Robots/ChargingDock.tsx
export interface ChargingDockProps { position?: Vec3; rotationY?: number; }

// components/3d/Robots/PatrolDebugOverlay.tsx
export interface PatrolDebugOverlayProps { configs: readonly RobotConfig[]; }
```

```ts
// components/ui/AvatarModal.tsx & RobotModal.tsx — follow the ContactModal shape
export interface AvatarModalProps { isOpen: boolean; onClose: () => void; }
export interface RobotModalProps {
  isOpen: boolean;
  onClose: () => void;
  robot: RobotConfig | null;   // = selectedRobot from store
}
```

---

## 5. Zustand store additions

Add to `StoreState` in `store/useStore.ts` (mirrors the existing `show*Modal` slices). `RobotConfig` is imported as a type — keep the store free of geometry imports.

```ts
import type { RobotConfig } from '@/components/3d/Robots/robotConfig';

// --- in StoreState interface ---
// Avatar ("About Allen") modal
showAvatarModal: boolean;
setShowAvatarModal: (show: boolean) => void;

// Robot flavor modal + which robot was clicked
showRobotModal: boolean;
selectedRobot: RobotConfig | null;
/** Pass the robot to open its card; pass null/false to close. */
setShowRobotModal: (show: boolean, robot?: RobotConfig | null) => void;

// --- in create<StoreState>(...) ---
showAvatarModal: false,
setShowAvatarModal: (show) => set({ showAvatarModal: show }),

showRobotModal: false,
selectedRobot: null,
setShowRobotModal: (show, robot) =>
  set({ showRobotModal: show, selectedRobot: show ? (robot ?? null) : null }),
```

> There is already an unused `showCharacter` / `setShowCharacter` slice (`useStore.ts:71`). It is **not** the avatar modal flag — leave it as-is (or repurpose it only after confirming nothing reads it). The avatar gets its own dedicated `showAvatarModal` for clarity.

Page wiring (`app/3d-office/page.tsx`):

```tsx
const showAvatarModal = useStore((s) => s.showAvatarModal);
const setShowAvatarModal = useStore((s) => s.setShowAvatarModal);
const showRobotModal = useStore((s) => s.showRobotModal);
const setShowRobotModal = useStore((s) => s.setShowRobotModal);
const selectedRobot = useStore((s) => s.selectedRobot);
// …
<AvatarModal isOpen={showAvatarModal} onClose={() => setShowAvatarModal(false)} />
<RobotModal isOpen={showRobotModal} onClose={() => setShowRobotModal(false)} robot={selectedRobot} />
```

---

## 6. Quality tier additions

Add four fields to `QualityPreset` in `lib/deviceTier.ts` and fill all three presets. Follow the existing JSDoc-per-field style.

```ts
export interface QualityPreset {
  // …existing fields…

  /** Avatar motion budget: 'full' = breathing + typing-hand loop, 'breath' = breathing only, 'none' = static. */
  characterAnimation: 'full' | 'breath' | 'none';
  /** Whether robots run the patrol/serve state machine (false = static props at `home`). */
  robotBehavior: boolean;
  /** How many robots from ROBOT_CONFIGS to render. */
  robotCount: number;
  /** Number of coffee-steam sprites (0 disables the steam system). */
  steamParticles: number;
}
```

| Field | `high` | `medium` | `low` | Rationale |
|---|---|---|---|---|
| `characterAnimation` | `'full'` | `'breath'` | `'none'` | Breathing is a single scale write (cheap) — but `low` already drops `useFrame` elsewhere, so keep the avatar fully static there. Typing-hand loop is high-only. |
| `robotBehavior` | `true` | `true` | `false` | Path-following is N robots × per-frame vector math; acceptable on high/medium, dropped on low. |
| `robotCount` | `3` | `2` | `2` | Fewer moving parts + draw calls on weaker GPUs (low robots are static, so 2 is fine). |
| `steamParticles` | `6` | `4` | `0` | Translucent overdraw is the cost; off on low. |

> **Note on the hover-breathing exception.** The brief says hover breathing runs "regardless of quality tier." Reconcile it like this: the **idle** breathing loop obeys `characterAnimation` (off on `low`), but the **hover** lift (a one-shot emissive/scale nudge on the hovered frame) is always on, because hover only fires on devices with a fine pointer and is effectively free. If the owner wants idle breathing on `low` too, flip `low.characterAnimation` to `'breath'` — it's one scale write per frame and likely affordable. Flagged in Open Questions.

Consumption sites:
- `MainScene.tsx` reads `preset.robotCount` / `preset.steamParticles` and passes down.
- `Avatar.tsx` reads `preset.characterAnimation`.
- `RobotFleet.tsx` reads `preset.robotBehavior` and `preset.robotCount`.

---

## 7. `CanvasTexture` recipe — back-of-shirt "ALLEN DIAZ 02"

Pattern mirrors `lib/materials.ts:makeNoiseTexture()` — **SSR-guarded**, built once, memoized, disposed on unmount. The texture is applied to the **back face** of the shirt only. Since `BoxGeometry`/cylinder shirt UVs map the whole surface, the cleanest approach is a **dedicated thin "panel" mesh** parented to the torso back (a `planeGeometry` flush against the back), textured with this canvas — this avoids fighting per-face UV assignment. (Alternative: a 6-element material array on a `BoxGeometry` shirt with the texture on the `+z`/`-z` index. The separate panel is simpler and recommended.)

```ts
// useShirtTexture.ts — outline
function buildShirtCanvas({ name, number, glow = '#22d3ee', bg = '#10131c' }: ShirtTextureOptions) {
  if (typeof document === 'undefined') return null;        // SSR guard (matches materials.ts)
  const W = 512, H = 512;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // 1. Shirt base fill (matches the deep charcoal/navy material so the panel blends).
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 2. Monospace, centered. Big jersey number, name arched above.
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 3. Name line — top third.
  ctx.font = '700 64px "JetBrains Mono", ui-monospace, monospace';
  ctx.shadowColor = glow;          // neon-teal glow
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#e6fbff';       // near-white teal-tinted ink
  ctx.fillText(name.toUpperCase(), W / 2, H * 0.30);

  // 4. Jersey number — dominant, lower-center (the "02").
  ctx.font = '800 240px "JetBrains Mono", ui-monospace, monospace';
  ctx.shadowBlur = 32;
  ctx.fillStyle = '#bdf4ff';
  ctx.fillText(number, W / 2, H * 0.62);

  // 5. Optional: thin teal stroke outline on the number for crispness over glow.
  ctx.shadowBlur = 0;
  ctx.lineWidth = 4;
  ctx.strokeStyle = glow;
  ctx.strokeText(number, W / 2, H * 0.62);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;   // correct gamma for color canvases
  tex.anisotropy = 4;                       // crisp at grazing angles
  return tex;
}
```

```ts
// hook body
export function useShirtTexture(opts: ShirtTextureOptions) {
  const tex = useMemo(() => buildShirtCanvas(opts), [opts.name, opts.number, opts.glow, opts.bg]);
  useEffect(() => () => { tex?.dispose(); }, [tex]);   // dispose like HolographicDisplay does
  return tex;
}
```

Applying it (in `Torso`):

```tsx
{/* Back panel — flush against the torso back, faces -z (toward the back wall) */}
<mesh position={[0, 0.04, -0.13]} rotation={[0, Math.PI, 0]}>
  <planeGeometry args={[0.42, 0.5]} />
  <meshStandardMaterial
    map={backTexture}
    emissive="#22d3ee"
    emissiveMap={backTexture ?? undefined}  // glow follows the inked pixels
    emissiveIntensity={0.35}
    roughness={0.85}
    toneMapped={false}                       // let the neon read against ACES tone mapping
  />
</mesh>
```

> **Font caveat:** canvas text uses whatever fonts the browser has loaded. `JetBrains Mono`/`ui-monospace` is requested with safe fallbacks; if a webfont is desired for exactness, await `document.fonts.ready` before drawing and rebuild the texture. Chosen font is an Open Question.

---

## 8. Robot state machine

States and transitions (`RobotPhase`):

```
        ┌─────────────────────────────────────────────┐
        │                                             │
        ▼                                             │
   ┌─────────┐  patrol loop   ┌──────────┐  serve?   ┌──────────┐
   │  idle   │──────────────▶ │ walking  │──────────▶│ serving  │
   │ (green) │ ◀───────────── │ (busy/teal)         │ (amber)  │
   └─────────┘   arrive home  └──────────┘           └────┬─────┘
        ▲                          ▲                      │ bob done
        │       arrive             │                      ▼
        │       ┌──────────────────┴──────┐         ┌───────────┐
        └────────│      returning          │◀────────│ (go back) │
                 │  (to dock OR patrol)    │         └───────────┘
                 └─────────────────────────┘
```

| Phase | Status light | Motion | Transition out |
|---|---|---|---|
| `idle` | green | none (or slow rotate-in-place) | after a random dwell → `walking` |
| `walking` | green | lerp along `waypoints` loop | random "serve roll" succeeds → `serving`; else continue |
| `serving` | amber | move to `serveTarget`, stop, bob ±0.04 for ~2.5 s | bob timer done → `returning` |
| `returning` | amber | lerp to dock bay (if `usesDock`) or nearest waypoint | arrive → `idle` |

`useFrame` loop pseudocode (inside `useRobotBehavior.advance`):

```ts
// state kept in refs (no React re-render per frame)
function advance(delta: number, elapsed: number) {
  if (!animated || !ref.current) return;           // low tier: never called

  switch (phase.current) {
    case 'idle': {
      dwell.current -= delta;
      if (dwell.current <= 0) phase.current = 'walking';
      break;
    }
    case 'walking': {
      stepToward(targetWaypoint(), config.speed * delta);  // lerp + set yaw
      if (reached(targetWaypoint())) advanceWaypointIndex();
      // random, low-probability serve trigger, throttled by serveEveryMs window
      if (elapsed > nextServeAt.current) {
        phase.current = 'serving'; bobT.current = 0; nextServeAt.current = Infinity;
      }
      break;
    }
    case 'serving': {
      if (!reached(config.serveTarget)) {
        stepToward(config.serveTarget, config.speed * delta);
      } else {
        bobT.current += delta;
        bob.current = Math.sin(bobT.current * 6) * 0.04;   // gentle bob
        if (bobT.current > 2.5) { bob.current = 0; phase.current = 'returning'; }
      }
      break;
    }
    case 'returning': {
      const dest = config.usesDock ? DOCK_BAY : nearestWaypoint();
      stepToward(dest, config.speed * delta);
      if (reached(dest)) {
        phase.current = 'idle';
        dwell.current = randDwell();                       // see note on Math.random
        scheduleNextServe(elapsed);                        // elapsed + rand(serveEveryMs)
      }
      break;
    }
  }

  // commit transform once per frame
  ref.current.position.copy(pos.current).setY(BASE_Y + bob.current);
  ref.current.rotation.y = yaw.current;
}
```

`stepToward(dest, maxStep)` = move `pos.current` toward `dest` by at most `maxStep`, set `yaw.current = atan2(dx, dz)` so the robot faces travel direction, return whether it arrived (within an epsilon). `status` is derived: `phase === 'serving' || phase === 'returning' ? 'busy' : 'idle'`.

> **Randomness caveat (matters here):** `Math.random()` is fine in app runtime but is **unavailable inside Workflow scripts** — not a concern for shipped components. For *deterministic-looking* variety without true randomness you can seed per-robot offsets from the config index (e.g. `nextServeAt = elapsed + base + index * 3.1`). Either approach is acceptable in the live app; pick one in Open Questions.

The status light pulse is independent of the machine — a sine on `emissiveIntensity` keyed by `status` color (green `#34d399` idle / amber `#fbbf24` busy), exactly like the brief.

---

## 9. Performance budget

Targets: **60 fps @ 1080p, mid-range laptop GPU**, `high` tier. The office already runs reflections, contact shadows, and full post-FX, so the character/robot additions must be lean.

### Draw-call & geometry estimate (high tier)

| Element | Meshes (draw calls) | Tris (approx) | Notes |
|---|---|---|---|
| Avatar body | ~12 (head, torso, 2×upper-arm, 2×forearm, 2×hand, hips, 2×thigh, 2×shin) | ~4–6k | Low-poly primitives; spheres at 16–24 segments. |
| Avatar hair + glasses | ~4 (hair cap, 2 lens rings, bridge+arms) | ~1.5k | Glasses use `RingGeometry`/thin torus. |
| Shirt back panel | 1 | ~2 | Single textured plane. |
| **Avatar total** | **~17** | **~7k** | One clickable group. |
| Robot (each) | ~9 (torso, visor, head dome, 2 legs, 2 claws, accent strip, status sphere) | ~2.5k | |
| Robots ×3 | ~27 | ~7.5k | See instancing note. |
| Name-tag billboard | 2 (panel + glow) | ~4 | |
| Coffee steam | 1 (InstancedMesh, 6 sprites) | ~12 | One draw call. |
| Charging dock | ~5 | ~1k | |
| **Feature total (high)** | **~52 draw calls, ~16k tris** | | Negligible next to the existing room/reflections. |

### Instancing opportunities
- **Robot chassis parts that repeat across robots** (identical leg cylinders, claws, accent strips) are candidates for `InstancedMesh` if all robots share geometry+material. *However*, robots move independently and need per-robot transforms + a per-robot accent color, so instancing only pays off if we (a) keep one shared geometry and (b) write per-instance matrices each frame. **Recommendation:** ship Phase 3/4 as plain meshes (≤27 draw calls is trivial); revisit instancing only if a profiler flags it. Document the decision rather than prematurely instancing.
- **Coffee steam** is already instanced (one `InstancedMesh`, matrices updated in `useFrame`) — the right call for many small identical sprites.
- The existing **keyboard** (`DeskItem.tsx:12`) is the in-repo precedent for `InstancedMesh` — match its pattern if instancing robots later.

### Per-frame CPU cost
- Avatar: 1 scale write (breathing) + optionally 1 hand transform (high only). Trivial.
- Robots: per robot, a handful of vector ops + 1 `Math.atan2`. 3 robots ≈ negligible.
- Steam: 6 matrix updates. Negligible.
- **Material reuse:** share a single `MeshStandardMaterial` for the robot chassis across all robots (à la `MATERIALS.darkMetal`) — but **not** for anything that mutates on hover (per `materials.ts` warning, hovered robots need their own material instance, like the chair).

### Tier degradation summary
- `medium`: 2 robots, steam 4, breathing only (no typing hand).
- `low`: 2 **static** robots (no `useFrame`), no steam, no avatar animation. The avatar and robots become pure static geometry — same draw calls, zero per-frame cost.

---

## 10. Open questions / deferred items (need in-browser tuning or owner input)

The scene can't be verified headlessly (`CLAUDE.md`), so these need an owner eyeball in `npm run dev`:

1. **Avatar seat placement & facing.** The chair sits at `x = -2.5` (left of desk center `x = 0`) with a π/4 yaw, while monitors are centered at `x = 0, z = -2`. Allen may need a small position/rotation tweak (or the chair itself nudged) so he reads as centered on the monitors. **Needs eyeball.**
2. **Seated proportions & forward hunch.** Exact joint angles (torso pitch, thigh/shin bend, forward-reaching hand near keyboard at `~[-0.8, 0.82, -1.5]`) to avoid clipping the desktop (`y ≈ 0.80`) and chair. Tune live.
3. **Shirt font.** `JetBrains Mono` vs another monospace; whether to `await document.fonts.ready` for an exact webfont. Owner preference.
4. **Patrol waypoints.** Real `Vector3` loops per robot that cover the open floor (roughly `x ∈ [-8, 8]`, `z ∈ [-4.5, 9]`) while **avoiding the desk/chair footprint** (`x ∈ [-3, 2]`, `z ∈ [-3, -0.2]`). Must be drawn and tuned with the `?debug=robots` overlay (Enhancement #5).
5. **Robot personality names & flavor copy.** "Agent-01/02/03" designations, per-robot `task` strings, uptime gimmick. Owner's voice.
6. **Serve cadence & determinism.** `serveEveryMs` window and whether to use `Math.random()` or index-seeded offsets (see §8 caveat).
7. **Charging dock placement.** Which wall/floor spot for the dock and which robot uses it (`usesDock`). Should sit against a wall, clear of patrol noise.
8. **Idle-breathing on `low`.** Whether to enable cheap breathing on `low` (`characterAnimation: 'breath'`) — see §6 note. Owner perf call.
9. **Glasses tint direction.** Faint teal (cohesion) vs warm blue-light amber (realism). Quick A/B in `dev`.
10. **Folder convention.** Subfolders (`Avatar/`, `Robots/`) vs the existing flat `components/3d/` layout (see §2 note).
11. **Robot accent vs BinaryWall neon.** Match the exact emissive teal to the BinaryWall shader color so they read as one palette; confirm against bloom levels in `PostProcessing.tsx`.

---

### Appendix — conventions checklist (do not skip)
- [ ] `'use client'` at the top of every new `components/3d/*` and `components/ui/*` file.
- [ ] Strict TS, **no `any`**; props typed per §4.
- [ ] Hover = `useHoverFeedback()` + `<Select enabled={hovered}>` (don't re-roll).
- [ ] Modals build on `ModalShell`, mounted in `app/3d-office/page.tsx`, driven by store flags.
- [ ] Every `ShaderMaterial`/`CanvasTexture` created in `useMemo` and **disposed** in a `useEffect` cleanup (per `HolographicDisplay.tsx`).
- [ ] Every per-frame/expensive feature gated through `QUALITY_PRESETS` — add a field, don't hard-code.
- [ ] Palette stays indigo/amber/teal — no bright cartoon colors.
- [ ] `npx tsc --noEmit` after each change; `npm run build` before push; commit granularly to `main`, **no `Co-Authored-By` trailer**.
