'use client';

import type { RefObject } from 'react';
import type * as THREE from 'three';

/**
 * Presentational sub-meshes for the procedural seated avatar (Allen Diaz).
 *
 * Phase 1: static geometry only — built entirely from Three.js primitives
 * (no asset files). These components are pure (no hooks, no state); posing and
 * placement live in `Avatar.tsx`. Hover/click/breathing and the back-of-shirt
 * CanvasTexture arrive in Phase 2, at which point these gain a `hovered` prop.
 *
 * Palette: warm medium-brown skin, midnight-navy shirt, near-black pants/hair —
 * native to the "late-night dev studio" indigo/amber/teal direction (no bright
 * cartoon colors).
 *
 * Phase 2 adds the back-of-shirt jersey CanvasTexture (passed into Torso).
 *
 * Local-space convention: the avatar faces -z (toward the monitors). "Forward"
 * is -z, "up" is +y. Coordinates are tuned for an in-browser eyeball pass
 * (see 3D_CHARACTERS_FEATURE_GUIDE.md, Open Questions #1–#2).
 */

/** Shared color constants so the body reads as one coherent figure. */
const SKIN = '#9a6a45';
const SHIRT = '#11141d';
const PANTS = '#0c0e13';
const HAIR = '#0b0b0d';
const FRAME = '#161616';
const LENS_TINT = '#173a3f';

/** Seated at the desk, or standing (e.g. by the chair, thinking). */
export type AvatarPose = 'seated' | 'standing';

/**
 * Lower body in a seated pose: pelvis, thighs running forward (-z) under the
 * desk, shins dropping to the floor, and feet. Rendered in the avatar root
 * space (y = 0 is the floor), so the figure rests its feet at ground level.
 */
export function Legs({ pose }: { pose: AvatarPose }) {
  if (pose === 'standing') {
    return (
      <group>
        {/* Pelvis / hips */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[0.36, 0.22, 0.26]} />
          <meshStandardMaterial color={PANTS} roughness={0.85} metalness={0.05} />
        </mesh>

        {/* Thighs — straight down */}
        {[-0.1, 0.1].map((x) => (
          <mesh key={`th-${x}`} position={[x, 0.66, 0]} castShadow>
            <boxGeometry args={[0.17, 0.44, 0.18]} />
            <meshStandardMaterial color={PANTS} roughness={0.85} metalness={0.05} />
          </mesh>
        ))}

        {/* Shins */}
        {[-0.1, 0.1].map((x) => (
          <mesh key={`sh-${x}`} position={[x, 0.24, 0.01]} castShadow>
            <boxGeometry args={[0.14, 0.42, 0.15]} />
            <meshStandardMaterial color={PANTS} roughness={0.85} metalness={0.05} />
          </mesh>
        ))}

        {/* Feet — toes point forward (-z, the way the avatar faces) */}
        {[-0.1, 0.1].map((x) => (
          <mesh key={`ft-${x}`} position={[x, 0.04, -0.06]} castShadow>
            <boxGeometry args={[0.16, 0.08, 0.28]} />
            <meshStandardMaterial color="#070708" roughness={0.7} metalness={0.1} />
          </mesh>
        ))}
      </group>
    );
  }

  // Seated: thighs run forward under the desk, shins drop to the floor.
  return (
    <group>
      {/* Pelvis / hips */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.36, 0.2, 0.28]} />
        <meshStandardMaterial color={PANTS} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Thighs — horizontal, extending forward under the desk */}
      {[-0.1, 0.1].map((x) => (
        <mesh key={`thigh-${x}`} position={[x, 0.58, -0.22]} castShadow>
          <boxGeometry args={[0.17, 0.16, 0.46]} />
          <meshStandardMaterial color={PANTS} roughness={0.85} metalness={0.05} />
        </mesh>
      ))}

      {/* Shins — vertical, from knee down to the floor */}
      {[-0.1, 0.1].map((x) => (
        <mesh key={`shin-${x}`} position={[x, 0.3, -0.46]} castShadow>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color={PANTS} roughness={0.85} metalness={0.05} />
        </mesh>
      ))}

      {/* Feet */}
      {[-0.1, 0.1].map((x) => (
        <mesh key={`foot-${x}`} position={[x, 0.04, -0.55]} castShadow>
          <boxGeometry args={[0.16, 0.07, 0.28]} />
          <meshStandardMaterial color="#070708" roughness={0.7} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Torso in the dark t-shirt plus the neck. Rendered inside the (slightly
 * forward-leaned) upper-body group in Avatar.tsx, so local y is measured from
 * the base of the spine.
 */
export interface TorsoProps {
  /** Back-of-shirt jersey CanvasTexture; when present, rendered on the +z (back) face. */
  backTexture?: THREE.Texture | null;
}

export function Torso({ backTexture = null }: TorsoProps) {
  return (
    <group>
      {/* Abdomen */}
      <mesh position={[0, 0.13, 0]} castShadow>
        <boxGeometry args={[0.36, 0.26, 0.24]} />
        <meshStandardMaterial color={SHIRT} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Chest */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[0.42, 0.34, 0.26]} />
        <meshStandardMaterial color={SHIRT} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Shoulders */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.5, 0.16, 0.26]} />
        <meshStandardMaterial color={SHIRT} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.71, 0.01]} castShadow>
        <cylinderGeometry args={[0.07, 0.075, 0.12, 20]} />
        <meshStandardMaterial color={SKIN} roughness={0.7} metalness={0} />
      </mesh>

      {/* Back-of-shirt jersey panel — on the +z face (Allen's back, toward the
          orbiting camera). The plane's default normal is +z, so it faces out. */}
      {backTexture && (
        <mesh position={[0, 0.42, 0.131]} castShadow>
          <planeGeometry args={[0.34, 0.4]} />
          <meshStandardMaterial
            map={backTexture}
            emissive="#22d3ee"
            emissiveMap={backTexture}
            emissiveIntensity={0.35}
            roughness={0.85}
            metalness={0.05}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * Both arms reaching down-and-forward toward the keyboard (calm coding pose).
 * Rendered inside the upper-body group alongside Torso so the arms lean with
 * the spine.
 */
export interface ArmsProps {
  pose: AvatarPose;
  /** Optional ref on the right hand group (seated only), for the typing motion. */
  typingHandRef?: RefObject<THREE.Group | null>;
}

export function Arms({ pose, typingHandRef }: ArmsProps) {
  // Both poses build a connected joint chain per side (shoulder → upper arm →
  // elbow → forearm → hand) with nested groups, so segments stay attached
  // however the angles are tuned. See 3D_CHARACTERS_FEATURE_GUIDE.md §10.
  if (pose === 'standing') {
    // Relaxed at the sides with a slight outward tilt and a soft elbow bend.
    return (
      <group>
        {[-1, 1].map((side) => (
          <group key={side} position={[0.26 * side, 0.56, 0]} rotation={[0.08, 0, 0.07 * side]}>
            <mesh position={[0, -0.15, 0]} castShadow>
              <boxGeometry args={[0.11, 0.3, 0.11]} />
              <meshStandardMaterial color={SHIRT} roughness={0.85} metalness={0.05} />
            </mesh>
            <group position={[0, -0.3, 0]} rotation={[0.16, 0, 0]}>
              <mesh position={[0, -0.15, 0]} castShadow>
                <boxGeometry args={[0.09, 0.3, 0.09]} />
                <meshStandardMaterial color={SKIN} roughness={0.7} metalness={0} />
              </mesh>
              {/* Hand at the side */}
              <mesh position={[0, -0.34, 0]} castShadow>
                <boxGeometry args={[0.1, 0.13, 0.06]} />
                <meshStandardMaterial color={SKIN} roughness={0.7} metalness={0} />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    );
  }

  // Seated: hands rest flat on the desktop over the keyboard.
  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={side} position={[0.27 * side, 0.56, 0]} rotation={[0.45, 0, 0]}>
          {/* Upper arm (short-sleeve shirt) — extends down/forward from shoulder */}
          <mesh position={[0, -0.14, 0]} castShadow>
            <boxGeometry args={[0.11, 0.28, 0.11]} />
            <meshStandardMaterial color={SHIRT} roughness={0.85} metalness={0.05} />
          </mesh>

          {/* Elbow → forearm (skin) — bends forward toward the desk */}
          <group position={[0, -0.28, 0]} rotation={[1.0, 0, 0]}>
            <mesh position={[0, -0.15, 0]} castShadow>
              <boxGeometry args={[0.09, 0.3, 0.09]} />
              <meshStandardMaterial color={SKIN} roughness={0.7} metalness={0} />
            </mesh>

            {/* Hand — counter-rotated so it lies flat on the desktop.
                The right hand (side === 1) carries the typing-animation ref. */}
            <group
              ref={side === 1 ? typingHandRef : undefined}
              position={[0, -0.32, 0]}
              rotation={[-1.45, 0, 0]}
            >
              <mesh castShadow>
                <boxGeometry args={[0.1, 0.05, 0.14]} />
                <meshStandardMaterial color={SKIN} roughness={0.7} metalness={0} />
              </mesh>
            </group>
          </group>
        </group>
      ))}
    </group>
  );
}

/**
 * The bare head (skin only). Hair and Glasses are sibling components placed by
 * Avatar inside the same head group, so local origin is the head's center.
 */
export function Head() {
  return (
    <mesh castShadow scale={[0.92, 1.05, 0.95]}>
      <sphereGeometry args={[0.16, 24, 24]} />
      <meshStandardMaterial color={SKIN} roughness={0.7} metalness={0} />
    </mesh>
  );
}

/**
 * Simple dark procedural hair: a top cap (open hemisphere) plus a thin back
 * block to cover the nape. Local origin matches the head's center.
 */
export function Hair() {
  return (
    <group>
      {/* Top cap — open hemisphere sitting over the crown */}
      <mesh position={[0, 0.02, -0.01]} castShadow>
        <sphereGeometry args={[0.172, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        <meshStandardMaterial color={HAIR} roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Back block — covers the nape behind the head (+z is behind, since the face looks -z) */}
      <mesh position={[0, -0.02, 0.11]} castShadow>
        <boxGeometry args={[0.26, 0.2, 0.1]} />
        <meshStandardMaterial color={HAIR} roughness={0.9} metalness={0.05} />
      </mesh>
    </group>
  );
}

/**
 * Thin-frame rectangular eyeglasses: two slightly-flattened torus lenses, a
 * bridge, and temple arms. Lenses get a faint teal tint (subtle, semi-
 * transparent) consistent with the office neon. Local origin matches the head's
 * center; the assembly sits just in front of the face (the avatar looks -z, so
 * "front" is -z and the temple arms run backward toward +z).
 */
export function Glasses() {
  return (
    <group position={[0, -0.01, -0.15]}>
      {/* Lens frames — flattened toruses read as rectangular-ish thin frames */}
      {[-0.062, 0.062].map((x) => (
        <mesh key={`frame-${x}`} position={[x, 0, 0]} scale={[1.25, 0.9, 1]} castShadow>
          <torusGeometry args={[0.045, 0.007, 10, 28]} />
          <meshStandardMaterial color={FRAME} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}

      {/* Tinted lenses — faint teal, semi-transparent */}
      {[-0.062, 0.062].map((x) => (
        <mesh key={`lens-${x}`} position={[x, 0, -0.002]} scale={[1.25, 0.9, 1]}>
          <circleGeometry args={[0.044, 24]} />
          <meshStandardMaterial
            color={LENS_TINT}
            transparent
            opacity={0.32}
            roughness={0.1}
            metalness={0}
            emissive={LENS_TINT}
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}

      {/* Bridge between the lenses */}
      <mesh position={[0, 0.004, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.005, 0.005, 0.04, 8]} />
        <meshStandardMaterial color={FRAME} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Temple arms — run backward (+z) toward the ears */}
      {[-0.108, 0.108].map((x) => (
        <mesh key={`temple-${x}`} position={[x, 0.005, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.14, 8]} />
          <meshStandardMaterial color={FRAME} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}
