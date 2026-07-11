'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { QUALITY_PRESETS } from '@/lib/deviceTier';

/**
 * Procedural night-city skyline rendered behind the back-wall window. A single far
 * backdrop plane (sky gradient + stars + moon + distant skyline) reads on every tier;
 * the high tier adds two nearer translucent silhouette layers for parallax depth plus a
 * subtle window twinkle. All meshes set fog={false} so the global exp2 fog (which would
 * otherwise swallow anything past ~z=-10) doesn't black out the view.
 */

const WARM = ['#ffd9a0', '#ffcf87', '#ffe3b8'];
const COOL = ['#aee3ff', '#cfeeff', '#9fd2ff'];

function buildingRow(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  baseY: number,
  maxHeight: number,
  fill: string,
  litChance: number,
) {
  let x = 0;
  while (x < w) {
    const bw = 30 + Math.random() * 90;
    const bh = 40 + Math.random() * maxHeight;
    const top = baseY - bh;
    ctx.fillStyle = fill;
    ctx.fillRect(x, top, bw, bh);

    // Windows grid
    const cols = Math.max(1, Math.floor(bw / 16));
    const rows = Math.max(1, Math.floor(bh / 18));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > litChance) continue;
        const warm = Math.random() > 0.5;
        ctx.fillStyle = (warm ? WARM : COOL)[Math.floor(Math.random() * 3)];
        ctx.fillRect(x + 5 + c * 16, top + 6 + r * 18, 6, 8);
      }
    }
    x += bw + 6 + Math.random() * 14;
  }
}

function makeSkyTexture(size: number): THREE.CanvasTexture {
  const w = size;
  const h = Math.round(size / 2);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Night sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#070b1e');
  sky.addColorStop(0.45, '#14203f');
  sky.addColorStop(0.78, '#2a2350');
  sky.addColorStop(1, '#3a2f3a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Stars (upper region)
  for (let i = 0; i < w / 4; i++) {
    const sx = Math.random() * w;
    const sy = Math.random() * h * 0.6;
    ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.7})`;
    ctx.fillRect(sx, sy, Math.random() > 0.85 ? 2 : 1, 1);
  }

  // Moon with soft halo
  const mx = w * 0.74;
  const my = h * 0.26;
  const halo = ctx.createRadialGradient(mx, my, 0, mx, my, h * 0.18);
  halo.addColorStop(0, 'rgba(220,230,255,0.55)');
  halo.addColorStop(1, 'rgba(220,230,255,0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(mx, my, h * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#eef3ff';
  ctx.beginPath();
  ctx.arc(mx, my, h * 0.05, 0, Math.PI * 2);
  ctx.fill();

  // Warm horizon glow
  const glow = ctx.createLinearGradient(0, h * 0.7, 0, h);
  glow.addColorStop(0, 'rgba(80,50,70,0)');
  glow.addColorStop(1, 'rgba(150,90,80,0.35)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, h * 0.7, w, h * 0.3);

  // Distant skyline (two faint rows)
  buildingRow(ctx, w, h, h, h * 0.32, '#0a1024', 0.12);
  buildingRow(ctx, w, h, h, h * 0.45, '#070b1a', 0.18);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Soft transparent cloud blobs that drift across the upper sky (high tier). */
function makeCloudTexture(size: number): THREE.CanvasTexture {
  const w = size;
  const h = Math.round(size / 4);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < 10; i++) {
    const cx = Math.random() * w;
    const cy = h * (0.15 + Math.random() * 0.5);
    const r = h * (0.25 + Math.random() * 0.35);
    const blob = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    blob.addColorStop(0, 'rgba(180,195,230,0.16)');
    blob.addColorStop(1, 'rgba(180,195,230,0)');
    ctx.fillStyle = blob;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeSilhouetteTexture(size: number, maxH: number, litChance: number, fill: string): THREE.CanvasTexture {
  const w = size;
  const h = Math.round(size / 2);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, w, h); // transparent background
  buildingRow(ctx, w, h, h, maxH, fill, litChance);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function CityscapeBackdrop() {
  const qualityTier = useStore((state) => state.qualityTier);
  const preset = QUALITY_PRESETS[qualityTier];
  const size = preset.sceneryTextureSize;

  const skyTex = useMemo(() => makeSkyTexture(size), [size]);
  const nearTex = useMemo(
    () => (preset.cityParallax ? makeSilhouetteTexture(size, size * 0.22, 0.28, '#0c1330') : null),
    [size, preset.cityParallax],
  );
  const midTex = useMemo(
    () => (preset.cityParallax ? makeSilhouetteTexture(size, size * 0.16, 0.22, '#0a0f24') : null),
    [size, preset.cityParallax],
  );
  const cloudTex = useMemo(
    () => (preset.cityParallax ? makeCloudTexture(size) : null),
    [size, preset.cityParallax],
  );

  const nearRef = useRef<THREE.MeshBasicMaterial>(null);

  // Subtle twinkle on the nearest layer + slow cloud drift (high tier only)
  useFrame((state) => {
    if (nearRef.current) {
      nearRef.current.opacity = 0.9 + Math.sin(state.clock.elapsedTime * 1.5) * 0.06;
    }
    if (cloudTex) {
      cloudTex.offset.x = state.clock.elapsedTime * 0.004;
    }
  });

  return (
    <group>
      {/* Far backdrop: sky + stars + moon + distant skyline */}
      <mesh position={[0, 5, -28]}>
        <planeGeometry args={[90, 45]} />
        <meshBasicMaterial map={skyTex} fog={false} toneMapped={false} />
      </mesh>

      {/* Drifting clouds between the sky and the mid skyline (high tier) */}
      {cloudTex && (
        <mesh position={[0, 10, -26]}>
          <planeGeometry args={[90, 18]} />
          <meshBasicMaterial
            map={cloudTex}
            transparent
            opacity={0.5}
            fog={false}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Parallax silhouette layers (high tier) */}
      {midTex && (
        <mesh position={[0, 2.5, -19]}>
          <planeGeometry args={[64, 32]} />
          <meshBasicMaterial map={midTex} transparent fog={false} toneMapped={false} />
        </mesh>
      )}
      {nearTex && (
        <mesh position={[0, 1.5, -13]}>
          <planeGeometry args={[48, 24]} />
          <meshBasicMaterial ref={nearRef} map={nearTex} transparent fog={false} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}
