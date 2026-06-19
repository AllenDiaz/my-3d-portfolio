'use client';

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

/**
 * Lower body in a seated pose: pelvis, thighs running forward (-z) under the
 * desk, shins dropping to the floor, and feet. Rendered in the avatar root
 * space (y = 0 is the floor), so the figure rests its feet at ground level.
 */
export function Legs() {
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
export function Torso() {
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
    </group>
  );
}

/**
 * Both arms reaching down-and-forward toward the keyboard (calm coding pose).
 * Rendered inside the upper-body group alongside Torso so the arms lean with
 * the spine.
 */
export function Arms() {
  return (
    <group>
      {/* Upper arms — angled so the elbows come forward */}
      {[-0.27, 0.27].map((x) => (
        <mesh key={`upper-${x}`} position={[x, 0.42, -0.02]} rotation={[0.35, 0, 0]} castShadow>
          <boxGeometry args={[0.12, 0.3, 0.12]} />
          <meshStandardMaterial color={SHIRT} roughness={0.85} metalness={0.05} />
        </mesh>
      ))}

      {/* Forearms — near-horizontal, reaching toward the desk (skin, short sleeves) */}
      {[-0.24, 0.24].map((x) => (
        <mesh key={`fore-${x}`} position={[x, 0.24, -0.22]} rotation={[1.0, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.3, 0.1]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} metalness={0} />
        </mesh>
      ))}

      {/* Hands — flat, resting near the keyboard */}
      {[-0.22, 0.22].map((x) => (
        <mesh key={`hand-${x}`} position={[x, 0.16, -0.42]} castShadow>
          <boxGeometry args={[0.1, 0.05, 0.13]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} metalness={0} />
        </mesh>
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
