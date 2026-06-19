'use client';

import Robot from './Robot';
import { ROBOT_CONFIGS, type RobotConfig } from './robotConfig';
import { useStore } from '@/store/useStore';
import { QUALITY_PRESETS } from '@/lib/deviceTier';

export interface RobotFleetProps {
  /** Defaults to all ROBOT_CONFIGS. */
  configs?: readonly RobotConfig[];
}

/**
 * Renders the ambient service robots, tier-gating their motion: on high/medium
 * each robot patrols/serves; on low (`robotBehavior === false`) they stay
 * static props at their home positions.
 *
 * Phase 5 will additionally slice `configs` to `preset.robotCount`.
 */
export default function RobotFleet({ configs = ROBOT_CONFIGS }: RobotFleetProps) {
  const qualityTier = useStore((s) => s.qualityTier);
  const animated = QUALITY_PRESETS[qualityTier].robotBehavior;

  return (
    <group>
      {configs.map((config) => (
        <Robot key={config.id} config={config} animated={animated} />
      ))}
    </group>
  );
}
