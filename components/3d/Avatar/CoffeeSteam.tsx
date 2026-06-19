'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { InstancedMesh } from 'three';

type Vec3 = [number, number, number];

export interface CoffeeSteamProps {
  /** World position of the steam base (just above the mug rim). */
  position?: Vec3;
  /** Number of steam sprites (= preset.steamParticles). */
  count?: number;
  /** When false (or count 0), renders nothing. */
  enabled?: boolean;
}

/**
 * A few slow-rising translucent steam wisps above the coffee mug, drawn as a
 * single InstancedMesh (one draw call). Each sprite loops up the rise height,
 * growing in and shrinking out, with a gentle horizontal sway — reinforcing the
 * late-night-grind aesthetic. Tier-gated via `steamParticles` (off on low).
 */
export default function CoffeeSteam({
  position = [1.1, 0.95, -1.8],
  count = 6,
  enabled = true,
}: CoffeeSteamProps) {
  const ref = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const phases = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        offset: i / count, // stagger sprites along the rise cycle
        sway: (i % 2 === 0 ? 1 : -1) * 0.02,
        speed: 0.18 + (i % 3) * 0.02,
      })),
    [count],
  );

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const RISE = 0.42;
    for (let i = 0; i < count; i++) {
      const p = phases[i];
      const prog = (t * p.speed + p.offset) % 1; // 0..1 loop
      const env = Math.sin(prog * Math.PI); // grow in, shrink out
      dummy.position.set(Math.sin(t * 1.5 + i) * p.sway, prog * RISE, 0);
      dummy.scale.setScalar(Math.max(0.0001, 0.015 + env * 0.05));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  if (!enabled || count <= 0) return null;

  return (
    <group position={position}>
      <instancedMesh ref={ref} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          color="#cfe8ff"
          transparent
          opacity={0.22}
          depthWrite={false}
          roughness={1}
          metalness={0}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}
