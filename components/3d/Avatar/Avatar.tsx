'use client';

import { useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';
import type { Group } from 'three';
import { Arms, Glasses, Hair, Head, Legs, Torso, type AvatarPose } from './avatarParts';
import { useShirtTexture } from './useShirtTexture';
import { useHoverFeedback } from '../useHoverFeedback';
import { useStore } from '@/store/useStore';
import { QUALITY_PRESETS } from '@/lib/deviceTier';

type Vec3 = [number, number, number];

export interface AvatarProps {
  /**
   * World position of the avatar root (y = 0 is the floor). Default seats Allen
   * close to the desk, facing the centered monitors. The existing chair sits at
   * x = -2.5 facing away, so it does not line up — Open Question #1.
   */
  position?: Vec3;
  /** Y-rotation (radians). 0 = facing -z toward the monitors. */
  rotationY?: number;
  /** Seated at the desk, or standing (e.g. by the chair). Default 'standing'. */
  pose?: AvatarPose;
  /** Name on the back of the shirt (rendered uppercase). */
  jerseyName?: string;
  /** Jersey number on the back of the shirt. */
  jerseyNumber?: string;
}

/**
 * Procedural seated avatar of the portfolio owner (Allen Diaz), assembled from
 * primitive parts in `avatarParts.tsx`.
 *
 * Phase 1: static seated mesh with a slight forward lean.
 * Phase 2: back-of-shirt "ALLEN DIAZ 02" CanvasTexture, hover outline
 * (useHoverFeedback + <Select>), click → AvatarModal, and idle-breathing.
 * Phase 5: breathing gated by `characterAnimation` (always on while hovered),
 * plus a high-tier-only ~2 Hz typing motion on the right hand.
 */
export default function Avatar({
  position = [-0.15, 0, -0.95],
  rotationY = 0,
  pose = 'standing',
  jerseyName = 'Allen Diaz',
  jerseyNumber = '02',
}: AvatarProps) {
  const upperBodyRef = useRef<Group>(null);
  const typingHandRef = useRef<Group>(null);
  const leftShoulderRef = useRef<Group>(null);
  const rightShoulderRef = useRef<Group>(null);
  const leftElbowRef = useRef<Group>(null);
  const rightElbowRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const { hovered, hoverProps } = useHoverFeedback();
  const setShowAvatarModal = useStore((s) => s.setShowAvatarModal);
  const qualityTier = useStore((s) => s.qualityTier);
  const characterAnimation = QUALITY_PRESETS[qualityTier].characterAnimation;
  // True whenever Allen is tuning up an agent — drives the "fixing" animation.
  const servicing = useStore((s) => s.servicingRobotId !== null);
  const backTexture = useShirtTexture({ name: jerseyName, number: jerseyNumber });

  // Standing: hips higher, near-upright with a slight head tilt (contemplative).
  // Seated: hips lower, more forward lean (hunched toward the monitors).
  const seated = pose === 'seated';
  const upperBodyY = seated ? 0.62 : 0.92;
  const lean = seated ? -0.14 : -0.05;
  const headRotation: [number, number, number] = seated ? [0, 0, 0] : [0.06, 0.18, 0.05];

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Breathing — a gentle Y-scale oscillation on the upper body. Runs as an
    // idle loop unless the tier disables it; always runs while hovered (cheap).
    if (upperBodyRef.current) {
      upperBodyRef.current.scale.y =
        characterAnimation !== 'none' || hovered ? 1 + Math.sin(t * 1.2) * 0.012 : 1;
    }

    // Typing motion — subtle ~2 Hz bob on the right hand, seated + high tier only.
    if (seated && characterAnimation === 'full' && typingHandRef.current) {
      typingHandRef.current.position.y = -0.32 + Math.abs(Math.sin(t * 12)) * 0.012;
    }

    // Fixing motion — while standing and servicing an agent, lift the WHOLE arms
    // forward and inward so both hands cradle the floating robot at center, with
    // a small ~7 Hz elbow wobble for tinkering; tilt the head down to look at it.
    // Everything eases back to the relaxed standing pose when idle.
    if (!seated) {
      const k = Math.min(1, delta * 8);
      const shoulderX = servicing ? 1.0 : 0.08; // swing upper arms forward
      const elbowX = servicing ? 0.55 + Math.sin(t * 7) * 0.1 : 0.16;

      if (leftShoulderRef.current) {
        leftShoulderRef.current.rotation.x += (shoulderX - leftShoulderRef.current.rotation.x) * k;
        const lz = servicing ? 0.35 : -0.07; // bring left arm inward toward center
        leftShoulderRef.current.rotation.z += (lz - leftShoulderRef.current.rotation.z) * k;
      }
      if (rightShoulderRef.current) {
        rightShoulderRef.current.rotation.x += (shoulderX - rightShoulderRef.current.rotation.x) * k;
        const rz = servicing ? -0.35 : 0.07; // bring right arm inward toward center
        rightShoulderRef.current.rotation.z += (rz - rightShoulderRef.current.rotation.z) * k;
      }
      if (leftElbowRef.current) {
        leftElbowRef.current.rotation.x += (elbowX - leftElbowRef.current.rotation.x) * k;
      }
      if (rightElbowRef.current) {
        rightElbowRef.current.rotation.x += (elbowX - rightElbowRef.current.rotation.x) * k;
      }
      if (headRef.current) {
        const headTarget = servicing ? 0.5 : headRotation[0];
        headRef.current.rotation.x += (headTarget - headRef.current.rotation.x) * Math.min(1, delta * 6);
      }
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setShowAvatarModal(true);
  };

  return (
    <Select enabled={hovered}>
      <group position={position} rotation={[0, rotationY, 0]} onClick={handleClick} {...hoverProps}>
        {/* Lower body sits in the avatar root space (feet at the floor) */}
        <Legs pose={pose} />

        {/* Upper body pivots at the top of the hips with a slight forward lean */}
        <group ref={upperBodyRef} position={[0, upperBodyY, 0]} rotation={[lean, 0, 0]}>
          <Torso backTexture={backTexture} />
          <Arms
            pose={pose}
            typingHandRef={typingHandRef}
            leftShoulderRef={leftShoulderRef}
            rightShoulderRef={rightShoulderRef}
            leftElbowRef={leftElbowRef}
            rightElbowRef={rightElbowRef}
          />

          {/* Head assembly — head + hair + glasses share this group's origin */}
          <group ref={headRef} position={[0, 0.86, 0.02]} rotation={headRotation}>
            <Head />
            <Hair />
            <Glasses />
          </group>
        </group>

        {/* Context box Allen hands to the agent while tuning it (front, above his hands) */}
        {servicing && (
          <Html position={[0, 1.4, -0.42]} center distanceFactor={3.5} zIndexRange={[40, 0]} style={{ pointerEvents: 'none', userSelect: 'none' }}>
            <div className="flex flex-col items-center gap-0.5 whitespace-nowrap rounded-lg border border-cyan-400/50 bg-black/85 px-2.5 py-1.5 font-mono text-cyan-200 shadow-lg backdrop-blur-sm">
              <span className="text-[10px] text-cyan-400/90">ctx ▸ uploading…</span>
              <span className="text-xs">“I am tuning you” ⚙</span>
            </div>
          </Html>
        )}
      </group>
    </Select>
  );
}
