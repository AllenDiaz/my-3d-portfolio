'use client';

import { forwardRef } from 'react';
import type { Mesh } from 'three';

/**
 * Presentational chassis sub-meshes for a service robot, built entirely from
 * primitives (no asset files). Compact, ~knee-height, chunky-industrial: a boxy
 * matte-metal torso, a dome head with a wide glowing teal visor, short
 * cylindrical legs, small claw arms, emissive accent strips, and a pulsing
 * status light.
 *
 * Palette: matte dark metal (roughness ~0.7, metalness ~0.8) with teal/cyan
 * emissive accents matching the BinaryWall neon — native to the office.
 */

const CHASSIS = '#1c1f24';

export interface RobotPartProps {
  /** Hover lifts the chassis emissive slightly. */
  hovered: boolean;
  /** Teal/cyan accent for strips and the visor. */
  accent: string;
}

export type RobotStatus = 'idle' | 'busy';

/** Boxy torso + emissive accent strips. */
export function Torso({ hovered, accent }: RobotPartProps) {
  return (
    <group>
      {/* Main chassis block */}
      <mesh position={[0, 0.34, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.32, 0.24]} />
        <meshStandardMaterial
          color={CHASSIS}
          roughness={0.7}
          metalness={0.8}
          emissive={accent}
          emissiveIntensity={hovered ? 0.18 : 0.05}
        />
      </mesh>

      {/* Teal accent strips down the sides */}
      {[-0.155, 0.155].map((x) => (
        <mesh key={`strip-${x}`} position={[x, 0.34, 0]}>
          <boxGeometry args={[0.012, 0.22, 0.16]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Dome head with a wide semi-transparent emissive visor. */
export function Head({ accent }: RobotPartProps) {
  return (
    <group position={[0, 0.58, 0]}>
      {/* Dome — upper hemisphere */}
      <mesh castShadow>
        <sphereGeometry args={[0.13, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={CHASSIS} roughness={0.7} metalness={0.8} />
      </mesh>

      {/* Neck collar joining head to torso */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.12, 0.13, 0.06, 20]} />
        <meshStandardMaterial color={CHASSIS} roughness={0.7} metalness={0.8} />
      </mesh>

      {/* Wide visor — semi-transparent, glows softly */}
      <mesh position={[0, 0.02, 0.105]}>
        <boxGeometry args={[0.2, 0.06, 0.04]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.6}
          transparent
          opacity={0.7}
          roughness={0.2}
          metalness={0.1}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** Two short cylindrical legs + feet pads. */
export function Legs() {
  return (
    <group>
      {[-0.09, 0.09].map((x) => (
        <group key={`leg-${x}`} position={[x, 0, 0]}>
          <mesh position={[0, 0.12, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.05, 0.24, 16]} />
            <meshStandardMaterial color={CHASSIS} roughness={0.7} metalness={0.8} />
          </mesh>
          {/* Foot pad */}
          <mesh position={[0, 0.02, 0.01]} castShadow>
            <boxGeometry args={[0.11, 0.04, 0.16]} />
            <meshStandardMaterial color="#0e1013" roughness={0.6} metalness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Small claw arms on each side of the torso. */
export function Claws() {
  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={side} position={[0.17 * side, 0.36, 0.02]}>
          {/* Upper arm */}
          <mesh position={[0, -0.02, 0]} rotation={[0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.05, 0.16, 0.05]} />
            <meshStandardMaterial color={CHASSIS} roughness={0.7} metalness={0.8} />
          </mesh>
          {/* Claw prongs */}
          {[-0.018, 0.018].map((px) => (
            <mesh key={`prong-${px}`} position={[px, -0.13, 0.03]} rotation={[0.5, 0, 0]} castShadow>
              <boxGeometry args={[0.014, 0.06, 0.014]} />
              <meshStandardMaterial color="#0e1013" roughness={0.6} metalness={0.85} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

export interface StatusLightProps {
  /** Green when idle, amber when busy (serving/returning). */
  status: RobotStatus;
}

/** Small status sphere on the torso. Parent drives the emissive pulse via ref. */
export const StatusLight = forwardRef<Mesh, StatusLightProps>(function StatusLight({ status }, ref) {
  const color = status === 'busy' ? '#fbbf24' : '#34d399';
  return (
    <mesh ref={ref} position={[0, 0.4, 0.125]}>
      <sphereGeometry args={[0.022, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} toneMapped={false} />
    </mesh>
  );
});
