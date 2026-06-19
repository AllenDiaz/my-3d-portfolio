'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { Group } from 'three';

type Vec3 = [number, number, number];

export interface NameTagBillboardProps {
  /** World position of the badge (its y is the bob center). */
  position?: Vec3;
  primary?: string;
  secondary?: string;
  /** Vertical bob amplitude in world units. */
  bobAmplitude?: number;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function buildBadge(primary: string, secondary: string): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null; // SSR guard

  const W = 512;
  const H = 160;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Translucent dark panel with a glowing teal border.
  ctx.fillStyle = 'rgba(8,14,18,0.78)';
  roundRect(ctx, 8, 8, W - 16, H - 16, 28);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#22d3ee';
  ctx.shadowColor = '#22d3ee';
  ctx.shadowBlur = 16;
  roundRect(ctx, 8, 8, W - 16, H - 16, 28);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.shadowBlur = 12;
  ctx.fillStyle = '#e6fbff';
  ctx.font = '700 56px "JetBrains Mono", ui-monospace, monospace';
  ctx.fillText(primary, W / 2, H * 0.4);

  ctx.shadowBlur = 8;
  ctx.fillStyle = '#7fe9f5';
  ctx.font = '500 30px "JetBrains Mono", ui-monospace, monospace';
  ctx.fillText(secondary, W / 2, H * 0.72);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/**
 * Holographic ID badge that floats above the desk, gently bobbing and always
 * facing the camera (drei Billboard). The label is a procedural CanvasTexture
 * with a soft teal glow — ties into the HolographicDisplay precedent. No assets.
 */
export default function NameTagBillboard({
  position = [0, 2.2, -2.4],
  primary = 'Allen Diaz',
  secondary = 'AI Engineer',
  bobAmplitude = 0.04,
}: NameTagBillboardProps) {
  const groupRef = useRef<Group>(null);
  const tex = useMemo(() => buildBadge(primary, secondary), [primary, secondary]);

  useEffect(() => () => tex?.dispose(), [tex]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * bobAmplitude;
    }
  });

  if (!tex) return null;

  return (
    <group ref={groupRef} position={position}>
      <Billboard>
        <mesh>
          {/* Panel aspect 512:160 → 3.2:1 */}
          <planeGeometry args={[0.9, 0.281]} />
          <meshStandardMaterial
            map={tex}
            emissive="#22d3ee"
            emissiveMap={tex}
            emissiveIntensity={0.5}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </Billboard>
    </group>
  );
}
