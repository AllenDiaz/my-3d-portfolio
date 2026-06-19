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
 * Renders the ambient service robots, tier-gating both count and motion: the
 * fleet is sliced to `preset.robotCount`, and on high/medium each robot
 * patrols/serves while on low (`robotBehavior === false`) they stay static
 * props at their home positions.
 */
export default function RobotFleet({ configs = ROBOT_CONFIGS }: RobotFleetProps) {
  const qualityTier = useStore((s) => s.qualityTier);
  const preset = QUALITY_PRESETS[qualityTier];
  const visible = configs.slice(0, preset.robotCount);

  return (
    <group>
      {visible.map((config) => (
        <Robot key={config.id} config={config} animated={preset.robotBehavior} />
      ))}
    </group>
  );
}
