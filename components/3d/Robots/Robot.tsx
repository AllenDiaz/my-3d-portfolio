'use client';

import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';
import { Claws, Head, Legs, StatusLight, Torso } from './robotParts';
import type { RobotConfig } from './robotConfig';
import { useRobotBehavior } from './useRobotBehavior';
import { useHoverFeedback } from '../useHoverFeedback';
import { useStore } from '@/store/useStore';

export interface RobotProps {
  config: RobotConfig;
  /** When false (low tier) the robot is a static prop at home — no useFrame loop. */
  animated: boolean;
}

/**
 * A single ambient service robot.
 *
 * Phase 4: when `animated`, the patrol/serve state machine (useRobotBehavior)
 * drives the group transform and status light each frame. When not animated
 * (low tier), the robot is a static prop at `config.home` with a steady green
 * status light. Hover shows an outline + designation label; click opens the
 * RobotModal.
 */
export default function Robot({ config, animated }: RobotProps) {
  const { hovered, hoverProps } = useHoverFeedback();
  const setShowRobotModal = useStore((s) => s.setShowRobotModal);
  const { groupRef, statusRef, advance } = useRobotBehavior(config, animated);

  useFrame((state, delta) => {
    if (animated) advance(delta, state.clock.elapsedTime);
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setShowRobotModal(true, config);
  };

  // Static placement when not animated; the hook drives the transform otherwise.
  const placement = animated
    ? {}
    : { position: config.home, rotation: [0, config.homeYaw, 0] as [number, number, number] };

  return (
    <Select enabled={hovered}>
      <group ref={groupRef} {...placement} onClick={handleClick} {...hoverProps}>
        <Legs />
        <Torso hovered={hovered} accent={config.accent} />
        <Claws />
        <Head hovered={hovered} accent={config.accent} />
        <StatusLight ref={statusRef} status="idle" />

        {hovered && (
          <Html position={[0, 0.78, 0]} center distanceFactor={3} style={{ pointerEvents: 'none', userSelect: 'none' }}>
            <div className="whitespace-nowrap rounded border border-teal-500/40 bg-black/90 px-2 py-1 font-mono text-xs text-teal-200 backdrop-blur-sm">
              {config.designation}
            </div>
          </Html>
        )}
      </group>
    </Select>
  );
}
