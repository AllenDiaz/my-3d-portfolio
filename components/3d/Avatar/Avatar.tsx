'use client';

import { Arms, Glasses, Hair, Head, Legs, Torso } from './avatarParts';

type Vec3 = [number, number, number];

export interface AvatarProps {
  /**
   * World position of the avatar root. The root's y = 0 is the floor, so place
   * it at floor level; the seated pose puts the hips at ~0.6 and the head at
   * ~1.45. Default seats Allen in front of the centered monitors.
   *
   * NOTE: the existing chair (`OfficeRoom.tsx`) sits at x = -2.5 facing away
   * from the desk, so it does not line up with the monitors at x = 0. This
   * default puts Allen at the desk; whether to also move the chair under him
   * is an Open Question (#1) to settle with an in-browser eyeball.
   */
  position?: Vec3;
  /** Y-rotation (radians). 0 = facing -z toward the monitors. */
  rotationY?: number;
}

/**
 * Procedural seated avatar of the portfolio owner (Allen Diaz), assembled from
 * primitive parts in `avatarParts.tsx`. Phase 1 is a static mesh only — the
 * upper body is given a slight forward lean for the "focused, hunched-toward-
 * the-monitors" read.
 *
 * Phase 2 will add: hover (useHoverFeedback + <Select>), click → AvatarModal,
 * idle-breathing scale, and the back-of-shirt "ALLEN DIAZ 02" CanvasTexture.
 */
export default function Avatar({ position = [-0.15, 0, -0.7], rotationY = 0 }: AvatarProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Lower body sits in the avatar root space (feet at the floor) */}
      <Legs />

      {/* Upper body pivots at the top of the hips with a slight forward lean */}
      <group position={[0, 0.62, 0]} rotation={[-0.14, 0, 0]}>
        <Torso />
        <Arms />

        {/* Head assembly — head + hair + glasses share this group's origin */}
        <group position={[0, 0.86, 0.02]}>
          <Head />
          <Hair />
          <Glasses />
        </group>
      </group>
    </group>
  );
}
