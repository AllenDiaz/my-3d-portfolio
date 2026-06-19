'use client';

import { useState } from 'react';
import { Line } from '@react-three/drei';
import { ROBOT_CONFIGS, type RobotConfig } from './robotConfig';

export interface PatrolDebugOverlayProps {
  configs?: readonly RobotConfig[];
}

/**
 * Dev-only visualization of each robot's patrol loop, drawn as a closed Line
 * just above the floor in the robot's accent color. Self-gates on the
 * `?debug=robots` URL param, so it renders nothing in normal use. Handy for
 * tuning waypoints in-browser.
 */
export default function PatrolDebugOverlay({ configs = ROBOT_CONFIGS }: PatrolDebugOverlayProps) {
  // Computed once on mount; this component renders client-only (ssr: false).
  const [show] = useState(
    () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === 'robots',
  );

  if (!show) return null;

  return (
    <group>
      {configs.map((config) => {
        const points: [number, number, number][] = [...config.waypoints, config.waypoints[0]].map(
          ([x, , z]) => [x, 0.05, z],
        );
        return <Line key={config.id} points={points} color={config.accent} lineWidth={2} />;
      })}
    </group>
  );
}
