'use client';

import Robot from './Robot';
import { ROBOT_CONFIGS, type RobotConfig } from './robotConfig';

export interface RobotFleetProps {
  /** Defaults to all ROBOT_CONFIGS. */
  configs?: readonly RobotConfig[];
}

/**
 * Renders the ambient service robots.
 *
 * Phase 3: every configured robot is a static prop at its home position.
 * Phase 5 will slice `configs` to `preset.robotCount` and gate patrol motion
 * via `preset.robotBehavior`.
 */
export default function RobotFleet({ configs = ROBOT_CONFIGS }: RobotFleetProps) {
  return (
    <group>
      {configs.map((config) => (
        <Robot key={config.id} config={config} />
      ))}
    </group>
  );
}
