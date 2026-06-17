/**
 * Shared, reused material instances for static (non-interactive) scene objects.
 *
 * Many meshes in the office are identical (desk legs, walls), but each previously
 * constructed its own meshStandardMaterial. Sharing a single instance keeps the look
 * consistent and reduces GPU/GC churn. Do NOT use these for objects that mutate their
 * material on hover (chair, monitors, badges) — those need per-instance materials.
 */
import * as THREE from 'three';

/**
 * Procedural grayscale noise texture used as a roughness map to break up the
 * dead-flat look of large surfaces — no external texture files. Returns null
 * during SSR (no document); the material simply renders without the map.
 */
function makeNoiseTexture(size = 256): THREE.Texture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = 150 + Math.floor(Math.random() * 105); // 150–255
    img.data[i * 4] = v;
    img.data[i * 4 + 1] = v;
    img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 3);
  return tex;
}

const wallNoise = makeNoiseTexture();

export const MATERIALS = {
  /** Dark, shiny metal — desk legs, table leg. */
  darkMetal: new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.8,
    roughness: 0.2,
  }),
  /** Matte wall with subtle procedural roughness variation. */
  matteWall: new THREE.MeshStandardMaterial({
    color: '#0f0f0f',
    roughness: 0.9,
    roughnessMap: wallNoise ?? undefined,
  }),
} as const;
