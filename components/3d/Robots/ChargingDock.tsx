'use client';

import type { ColorRepresentation } from 'three';

type Vec3 = [number, number, number];

export interface ChargingDockProps {
  position?: Vec3;
  rotationY?: number;
  /** Teal/cyan LED accent (matches the robot it serves). */
  accent?: ColorRepresentation;
}

const METAL = '#1c1f24';

/**
 * A small floor-mounted charging bay: matte-metal base pad, back wall and side
 * walls forming a recess, with teal LED strips. A docking robot returns here to
 * "charge" between patrols (its idle status light pulses slowly). All
 * primitives, no asset files.
 */
export default function ChargingDock({
  position = [0, 0, 0],
  rotationY = 0,
  accent = '#22d3ee',
}: ChargingDockProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Base pad */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.04, 0.45]} />
        <meshStandardMaterial color={METAL} roughness={0.7} metalness={0.8} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 0.3, -0.2]} castShadow>
        <boxGeometry args={[0.5, 0.55, 0.06]} />
        <meshStandardMaterial color={METAL} roughness={0.7} metalness={0.8} />
      </mesh>

      {/* Side walls forming the recess */}
      {[-0.22, 0.22].map((x) => (
        <mesh key={x} position={[x, 0.22, -0.05]} castShadow>
          <boxGeometry args={[0.06, 0.4, 0.34]} />
          <meshStandardMaterial color={METAL} roughness={0.7} metalness={0.8} />
        </mesh>
      ))}

      {/* Teal LED strips up the back wall */}
      {[0.12, 0.3, 0.48].map((y) => (
        <mesh key={y} position={[0, y, -0.168]}>
          <boxGeometry args={[0.4, 0.02, 0.01]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      ))}

      {/* Base glow strip across the front lip */}
      <mesh position={[0, 0.045, 0.18]}>
        <boxGeometry args={[0.44, 0.01, 0.03]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
    </group>
  );
}
