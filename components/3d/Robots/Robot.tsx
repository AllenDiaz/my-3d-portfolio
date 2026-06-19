'use client';

import { useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';
import type { Mesh, MeshStandardMaterial } from 'three';
import { Claws, Head, Legs, StatusLight, Torso, type RobotStatus } from './robotParts';
import type { RobotConfig } from './robotConfig';
import { useHoverFeedback } from '../useHoverFeedback';
import { useStore } from '@/store/useStore';

export interface RobotProps {
  config: RobotConfig;
}

/**
 * A single ambient service robot.
 *
 * Phase 3: static chassis at `config.home`, with a pulsing status light
 * (cheap useFrame sine on emissiveIntensity), hover outline + floating
 * designation label, and click → RobotModal. Patrol/serve motion arrives in
 * Phase 4 (the `status` stays 'idle' / green for now).
 */
export default function Robot({ config }: RobotProps) {
  const { hovered, hoverProps } = useHoverFeedback();
  const setShowRobotModal = useStore((s) => s.setShowRobotModal);
  const statusRef = useRef<Mesh>(null);

  // Phase 3: robots are idle. Phase 4 will derive this from the state machine.
  const status: RobotStatus = 'idle';

  // Pulse the status light's emissive intensity — one material write per frame.
  useFrame((state) => {
    const mat = statusRef.current?.material as MeshStandardMaterial | undefined;
    if (mat) mat.emissiveIntensity = 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.4;
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setShowRobotModal(true, config);
  };

  return (
    <Select enabled={hovered}>
      <group position={config.home} rotation={[0, config.homeYaw, 0]} onClick={handleClick} {...hoverProps}>
        <Legs />
        <Torso hovered={hovered} accent={config.accent} />
        <Claws />
        <Head hovered={hovered} accent={config.accent} />
        <StatusLight ref={statusRef} status={status} />

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
