'use client';

import { useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Select } from '@react-three/postprocessing';
import type { Group } from 'three';
import { Arms, Glasses, Hair, Head, Legs, Torso } from './avatarParts';
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
  jerseyName = 'Allen Diaz',
  jerseyNumber = '02',
}: AvatarProps) {
  const upperBodyRef = useRef<Group>(null);
  const typingHandRef = useRef<Group>(null);
  const { hovered, hoverProps } = useHoverFeedback();
  const setShowAvatarModal = useStore((s) => s.setShowAvatarModal);
  const qualityTier = useStore((s) => s.qualityTier);
  const characterAnimation = QUALITY_PRESETS[qualityTier].characterAnimation;
  const backTexture = useShirtTexture({ name: jerseyName, number: jerseyNumber });

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Breathing — a gentle Y-scale oscillation on the upper body. Runs as an
    // idle loop unless the tier disables it; always runs while hovered (cheap).
    if (upperBodyRef.current) {
      upperBodyRef.current.scale.y =
        characterAnimation !== 'none' || hovered ? 1 + Math.sin(t * 1.2) * 0.012 : 1;
    }

    // Typing motion — subtle ~2 Hz bob on the right hand, high tier only.
    if (characterAnimation === 'full' && typingHandRef.current) {
      typingHandRef.current.position.y = -0.32 + Math.abs(Math.sin(t * 12)) * 0.012;
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
        <Legs />

        {/* Upper body pivots at the top of the hips with a slight forward lean */}
        <group ref={upperBodyRef} position={[0, 0.62, 0]} rotation={[-0.14, 0, 0]}>
          <Torso backTexture={backTexture} />
          <Arms typingHandRef={typingHandRef} />

          {/* Head assembly — head + hair + glasses share this group's origin */}
          <group position={[0, 0.86, 0.02]}>
            <Head />
            <Hair />
            <Glasses />
          </group>
        </group>
      </group>
    </Select>
  );
}
