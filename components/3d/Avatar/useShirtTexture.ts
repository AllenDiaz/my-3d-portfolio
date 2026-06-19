'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

/**
 * Builds the back-of-shirt jersey label ("ALLEN DIAZ 02") as a procedural
 * CanvasTexture — no asset files. Pattern mirrors lib/materials.ts:
 * SSR-guarded, built once via useMemo, and disposed on unmount (as
 * HolographicDisplay disposes its GPU resources).
 */
export interface ShirtTextureOptions {
  /** Name line, e.g. "Allen Diaz" (rendered uppercase). */
  name: string;
  /** Jersey number, e.g. "02". */
  number: string;
  /** Neon-teal glow color for the text. */
  glow?: string;
  /** Shirt base fill so the panel blends with the shirt material. */
  bg?: string;
}

function buildShirtCanvas({
  name,
  number,
  glow = '#22d3ee',
  bg = '#11141d',
}: ShirtTextureOptions): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null; // SSR guard (matches materials.ts)

  const W = 512;
  const H = 512;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Shirt base fill.
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Name line — arched across the upper back.
  ctx.font = '700 58px "JetBrains Mono", ui-monospace, monospace';
  ctx.shadowColor = glow;
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#e6fbff';
  ctx.fillText(name.toUpperCase(), W / 2, H * 0.28);

  // Jersey number — dominant, lower-center.
  ctx.font = '800 240px "JetBrains Mono", ui-monospace, monospace';
  ctx.shadowBlur = 34;
  ctx.fillStyle = '#bdf4ff';
  ctx.fillText(number, W / 2, H * 0.62);

  // Crisp teal outline on the number over the glow.
  ctx.shadowBlur = 0;
  ctx.lineWidth = 4;
  ctx.strokeStyle = glow;
  ctx.strokeText(number, W / 2, H * 0.62);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

export function useShirtTexture({
  name,
  number,
  glow,
  bg,
}: ShirtTextureOptions): THREE.CanvasTexture | null {
  const tex = useMemo(
    () => buildShirtCanvas({ name, number, glow, bg }),
    [name, number, glow, bg],
  );

  useEffect(() => () => tex?.dispose(), [tex]);

  return tex;
}
