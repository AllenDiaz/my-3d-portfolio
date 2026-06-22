'use client';

import type { RefObject } from 'react';
import type * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

/**
 * Presentational sub-meshes for the procedural avatar (Allen Diaz), built
 * entirely from primitives (no asset files). Bodies use RoundedBox so the
 * silhouette reads softer than raw boxes. Components are pure (no hooks);
 * posing/placement and the animation refs are driven from Avatar.tsx.
 *
 * Palette: warm medium-brown skin, midnight-navy shirt, near-black pants/hair —
 * native to the "late-night dev studio" indigo/amber/teal direction.
 *
 * Local-space convention: the avatar faces -z. "Forward" is -z, "up" is +y.
 */

/** Shared color constants so the body reads as one coherent figure. */
const SKIN = '#a9744a';
const SHIRT = '#121622';
const PANTS = '#0c0e13';
const HAIR = '#0b0b0d';
const SHOE = '#080809';
const FRAME = '#161616';
const LENS_TINT = '#173a3f';

/** Seated at the desk, or standing (e.g. by the chair). */
export type AvatarPose = 'seated' | 'standing';

/** Lower body — straight when standing, folded forward when seated. */
export function Legs({ pose }: { pose: AvatarPose }) {
  if (pose === 'standing') {
    return (
      <group>
        {/* Pelvis / hips */}
        <RoundedBox args={[0.36, 0.22, 0.26]} radius={0.05} smoothness={3} position={[0, 0.9, 0]} castShadow>
          <meshStandardMaterial color={PANTS} roughness={0.85} metalness={0.05} />
        </RoundedBox>

        {/* Thighs — straight down */}
        {[-0.1, 0.1].map((x) => (
          <RoundedBox key={`th-${x}`} args={[0.17, 0.44, 0.18]} radius={0.05} smoothness={3} position={[x, 0.66, 0]} castShadow>
            <meshStandardMaterial color={PANTS} roughness={0.85} metalness={0.05} />
          </RoundedBox>
        ))}

        {/* Shins */}
        {[-0.1, 0.1].map((x) => (
          <RoundedBox key={`sh-${x}`} args={[0.14, 0.42, 0.15]} radius={0.04} smoothness={3} position={[x, 0.24, 0.01]} castShadow>
            <meshStandardMaterial color={PANTS} roughness={0.85} metalness={0.05} />
          </RoundedBox>
        ))}

        {/* Shoes — rounded, toes forward (-z) */}
        {[-0.1, 0.1].map((x) => (
          <RoundedBox key={`ft-${x}`} args={[0.17, 0.09, 0.32]} radius={0.04} smoothness={3} position={[x, 0.045, -0.06]} castShadow>
            <meshStandardMaterial color={SHOE} roughness={0.55} metalness={0.15} />
          </RoundedBox>
        ))}
      </group>
    );
  }

  // Seated: thighs run forward under the desk, shins drop to the floor.
  return (
    <group>
      <RoundedBox args={[0.36, 0.2, 0.28]} radius={0.05} smoothness={3} position={[0, 0.6, 0]} castShadow>
        <meshStandardMaterial color={PANTS} roughness={0.85} metalness={0.05} />
      </RoundedBox>

      {[-0.1, 0.1].map((x) => (
        <RoundedBox key={`thigh-${x}`} args={[0.17, 0.16, 0.46]} radius={0.05} smoothness={3} position={[x, 0.58, -0.22]} castShadow>
          <meshStandardMaterial color={PANTS} roughness={0.85} metalness={0.05} />
        </RoundedBox>
      ))}

      {[-0.1, 0.1].map((x) => (
        <RoundedBox key={`shin-${x}`} args={[0.15, 0.5, 0.15]} radius={0.04} smoothness={3} position={[x, 0.3, -0.46]} castShadow>
          <meshStandardMaterial color={PANTS} roughness={0.85} metalness={0.05} />
        </RoundedBox>
      ))}

      {[-0.1, 0.1].map((x) => (
        <RoundedBox key={`foot-${x}`} args={[0.17, 0.09, 0.3]} radius={0.04} smoothness={3} position={[x, 0.05, -0.56]} castShadow>
          <meshStandardMaterial color={SHOE} roughness={0.55} metalness={0.15} />
        </RoundedBox>
      ))}
    </group>
  );
}

export interface TorsoProps {
  /** Back-of-shirt jersey CanvasTexture; rendered on the +z (back) face when present. */
  backTexture?: THREE.Texture | null;
}

/** Torso in the dark t-shirt plus the neck. Local y is the base of the spine. */
export function Torso({ backTexture = null }: TorsoProps) {
  return (
    <group>
      {/* Abdomen (tapered narrower than the chest) */}
      <RoundedBox args={[0.34, 0.26, 0.23]} radius={0.05} smoothness={3} position={[0, 0.13, 0]} castShadow>
        <meshStandardMaterial color={SHIRT} roughness={0.85} metalness={0.05} />
      </RoundedBox>

      {/* Chest */}
      <RoundedBox args={[0.42, 0.34, 0.26]} radius={0.06} smoothness={3} position={[0, 0.42, 0]} castShadow>
        <meshStandardMaterial color={SHIRT} roughness={0.85} metalness={0.05} />
      </RoundedBox>

      {/* Shoulders */}
      <RoundedBox args={[0.5, 0.17, 0.26]} radius={0.07} smoothness={3} position={[0, 0.6, 0]} castShadow>
        <meshStandardMaterial color={SHIRT} roughness={0.85} metalness={0.05} />
      </RoundedBox>

      {/* Crew-neck collar */}
      <mesh position={[0, 0.66, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.075, 0.018, 10, 24]} />
        <meshStandardMaterial color={SHIRT} roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.71, 0.01]} castShadow>
        <cylinderGeometry args={[0.07, 0.075, 0.12, 20]} />
        <meshStandardMaterial color={SKIN} roughness={0.7} metalness={0} />
      </mesh>

      {/* Back-of-shirt jersey panel — on the +z (back) face */}
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

export interface ArmsProps {
  pose: AvatarPose;
  /** Optional ref on the right hand group (seated only), for the typing motion. */
  typingHandRef?: RefObject<THREE.Group | null>;
  /** Optional refs on the standing shoulder + elbow groups, for Allen's
   *  "fixing" motion (the whole arm lifts forward, not just the forearm). */
  leftShoulderRef?: RefObject<THREE.Group | null>;
  rightShoulderRef?: RefObject<THREE.Group | null>;
  leftElbowRef?: RefObject<THREE.Group | null>;
  rightElbowRef?: RefObject<THREE.Group | null>;
}

export function Arms({
  pose,
  typingHandRef,
  leftShoulderRef,
  rightShoulderRef,
  leftElbowRef,
  rightElbowRef,
}: ArmsProps) {
  // Connected joint chain per side (shoulder → upper arm → elbow → forearm →
  // hand) via nested groups, so segments stay attached as angles are tuned.
  if (pose === 'standing') {
    return (
      <group>
        {[-1, 1].map((side) => (
          <group
            key={side}
            ref={side === -1 ? leftShoulderRef : rightShoulderRef}
            position={[0.26 * side, 0.56, 0]}
          >
            <RoundedBox args={[0.11, 0.3, 0.11]} radius={0.045} smoothness={3} position={[0, -0.15, 0]} castShadow>
              <meshStandardMaterial color={SHIRT} roughness={0.85} metalness={0.05} />
            </RoundedBox>
            {/* Rotation is driven entirely by Avatar's useFrame (rest + fixing),
                seeded once in a layout effect — no static rotation prop here, so
                re-renders don't fight the imperative easing. */}
            <group
              ref={side === -1 ? leftElbowRef : rightElbowRef}
              position={[0, -0.3, 0]}
            >
              <RoundedBox args={[0.09, 0.3, 0.09]} radius={0.035} smoothness={3} position={[0, -0.15, 0]} castShadow>
                <meshStandardMaterial color={SKIN} roughness={0.7} metalness={0} />
              </RoundedBox>
              {/* Hand */}
              <RoundedBox args={[0.1, 0.13, 0.06]} radius={0.028} smoothness={3} position={[0, -0.34, 0]} castShadow>
                <meshStandardMaterial color={SKIN} roughness={0.7} metalness={0} />
              </RoundedBox>
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
          <RoundedBox args={[0.11, 0.28, 0.11]} radius={0.045} smoothness={3} position={[0, -0.14, 0]} castShadow>
            <meshStandardMaterial color={SHIRT} roughness={0.85} metalness={0.05} />
          </RoundedBox>

          <group position={[0, -0.28, 0]} rotation={[1.0, 0, 0]}>
            <RoundedBox args={[0.09, 0.3, 0.09]} radius={0.035} smoothness={3} position={[0, -0.15, 0]} castShadow>
              <meshStandardMaterial color={SKIN} roughness={0.7} metalness={0} />
            </RoundedBox>

            {/* Hand — flat on the desktop; right hand (side 1) carries the typing ref. */}
            <group ref={side === 1 ? typingHandRef : undefined} position={[0, -0.32, 0]} rotation={[-1.45, 0, 0]}>
              <RoundedBox args={[0.1, 0.05, 0.14]} radius={0.02} smoothness={3} castShadow>
                <meshStandardMaterial color={SKIN} roughness={0.7} metalness={0} />
              </RoundedBox>
            </group>
          </group>
        </group>
      ))}
    </group>
  );
}

/** The head (skin) with ears. Hair and Glasses are siblings placed by Avatar. */
export function Head() {
  return (
    <group>
      <mesh castShadow scale={[0.92, 1.05, 0.95]}>
        <sphereGeometry args={[0.16, 28, 28]} />
        <meshStandardMaterial color={SKIN} roughness={0.7} metalness={0} />
      </mesh>

      {/* Ears */}
      {[-0.15, 0.15].map((x) => (
        <mesh key={x} position={[x, -0.02, 0.01]} scale={[0.55, 1, 0.7]} castShadow>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

/** Dark procedural hair: crown cap, nape/side wrap, and a front fringe sweep. */
export function Hair() {
  return (
    <group>
      {/* Crown cap */}
      <mesh position={[0, 0.03, 0]} castShadow>
        <sphereGeometry args={[0.178, 28, 28, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color={HAIR} roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Back & nape wrap */}
      <RoundedBox args={[0.27, 0.22, 0.12]} radius={0.05} smoothness={3} position={[0, -0.01, 0.1]} castShadow>
        <meshStandardMaterial color={HAIR} roughness={0.95} metalness={0.05} />
      </RoundedBox>

      {/* Front fringe sweep (over the forehead, -z) */}
      <RoundedBox args={[0.3, 0.07, 0.08]} radius={0.03} smoothness={3} position={[0, 0.085, -0.12]} rotation={[0.35, 0, 0]} castShadow>
        <meshStandardMaterial color={HAIR} roughness={0.95} metalness={0.05} />
      </RoundedBox>
    </group>
  );
}

/**
 * Thin-frame rectangular eyeglasses (flattened-torus lenses, bridge, temples)
 * with a faint teal tint. Local origin is the head center; the face looks -z.
 */
export function Glasses() {
  return (
    <group position={[0, -0.01, -0.15]}>
      {[-0.062, 0.062].map((x) => (
        <mesh key={`frame-${x}`} position={[x, 0, 0]} scale={[1.25, 0.9, 1]} castShadow>
          <torusGeometry args={[0.045, 0.007, 10, 28]} />
          <meshStandardMaterial color={FRAME} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}

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

      <mesh position={[0, 0.004, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.005, 0.005, 0.04, 8]} />
        <meshStandardMaterial color={FRAME} metalness={0.6} roughness={0.3} />
      </mesh>

      {[-0.108, 0.108].map((x) => (
        <mesh key={`temple-${x}`} position={[x, 0.005, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.14, 8]} />
          <meshStandardMaterial color={FRAME} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}
