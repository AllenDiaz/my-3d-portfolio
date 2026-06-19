'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { Group } from 'three';

type Vec3 = [number, number, number];

export interface ThoughtBubbleProps {
  /** World position of the cloud center (its y is the bob center). */
  position?: Vec3;
  /** Vertical bob amplitude. */
  bobAmplitude?: number;
}

interface Line {
  text: string;
  color: string;
  font: string;
  align: CanvasTextAlign;
  /** Vertical advance after this line, in px. */
  gap: number;
}

const FAMILY = '"JetBrains Mono", ui-monospace, monospace';

// Allen's current train of thought — edit freely.
const LINES: Line[] = [
  { text: 'thinking…', color: '#7fe9f5', font: `italic 600 30px ${FAMILY}`, align: 'center', gap: 56 },
  { text: 'Next agent →', color: '#22d3ee', font: `700 30px ${FAMILY}`, align: 'left', gap: 44 },
  { text: 'a self-improving', color: '#e6fbff', font: `500 28px ${FAMILY}`, align: 'left', gap: 38 },
  { text: 'code-review agent', color: '#e6fbff', font: `500 28px ${FAMILY}`, align: 'left', gap: 52 },
  { text: 'Level it up:', color: '#22d3ee', font: `700 28px ${FAMILY}`, align: 'left', gap: 42 },
  { text: '• persistent memory', color: '#cfe8ff', font: `500 26px ${FAMILY}`, align: 'left', gap: 36 },
  { text: '• eval + self-critique loop', color: '#cfe8ff', font: `500 26px ${FAMILY}`, align: 'left', gap: 36 },
  { text: '• multi-step tool planning', color: '#cfe8ff', font: `500 26px ${FAMILY}`, align: 'left', gap: 36 },
];

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

function buildThought(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null; // SSR guard

  const W = 540;
  const H = 448;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Soft, very-rounded cloud panel with a glowing teal border.
  ctx.fillStyle = 'rgba(8,14,18,0.82)';
  roundRect(ctx, 10, 10, W - 20, H - 20, 60);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#22d3ee';
  ctx.shadowColor = '#22d3ee';
  ctx.shadowBlur = 18;
  roundRect(ctx, 10, 10, W - 20, H - 20, 60);
  ctx.stroke();

  ctx.textBaseline = 'alphabetic';
  ctx.shadowBlur = 8;

  const leftX = 56;
  let y = 70;
  for (const line of LINES) {
    ctx.font = line.font;
    ctx.fillStyle = line.color;
    ctx.shadowColor = line.color;
    ctx.textAlign = line.align;
    const x = line.align === 'center' ? W / 2 : leftX;
    ctx.fillText(line.text, x, y);
    y += line.gap;
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/**
 * A comic-style "thought bubble" floating above Allen: a billboarded
 * CanvasTexture cloud with his current train of thought (what agent to build
 * next + how to improve it), plus a few 3D trail bubbles leading down toward his
 * head. Gently bobs. All procedural — no asset files.
 */
export default function ThoughtBubble({
  position = [-1.95, 2.55, -0.5],
  bobAmplitude = 0.05,
}: ThoughtBubbleProps) {
  const groupRef = useRef<Group>(null);
  const tex = useMemo(() => buildThought(), []);

  useEffect(() => () => tex?.dispose(), [tex]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2) * bobAmplitude;
    }
  });

  if (!tex) return null;

  return (
    <group ref={groupRef} position={position}>
      <Billboard>
        <mesh>
          {/* Panel aspect 540:448 ≈ 1.2:1 */}
          <planeGeometry args={[1.0, 0.83]} />
          <meshStandardMaterial
            map={tex}
            emissive="#22d3ee"
            emissiveMap={tex}
            emissiveIntensity={0.45}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </Billboard>

      {/* Trail bubbles leading down toward Allen's head */}
      {[
        { p: [-0.2, -0.55, -0.05] as Vec3, r: 0.05 },
        { p: [-0.34, -0.78, -0.08] as Vec3, r: 0.035 },
        { p: [-0.45, -0.96, -0.1] as Vec3, r: 0.024 },
      ].map(({ p, r }, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[r, 16, 16]} />
          <meshStandardMaterial
            color="#0e1418"
            emissive="#22d3ee"
            emissiveIntensity={0.5}
            transparent
            opacity={0.85}
            roughness={0.6}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
