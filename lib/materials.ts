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

// Finer-grained noise for the desk top (tighter repeat than the walls so the
// variation reads at arm's-length camera distances).
const deskNoise = makeNoiseTexture();
deskNoise?.repeat.set(3, 2);

/**
 * Low-frequency blurred noise for the reflective floor's distortion map —
 * soft blobs (not per-pixel grain) so reflections wobble like polished
 * concrete instead of shimmering. SSR-safe null like the helpers above.
 */
function makeBlurredNoiseTexture(size = 128): THREE.Texture | null {
  if (typeof document === 'undefined') return null;
  const source = document.createElement('canvas');
  source.width = source.height = size;
  const sctx = source.getContext('2d');
  if (!sctx) return null;
  const img = sctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = Math.floor(Math.random() * 255);
    img.data[i * 4] = v;
    img.data[i * 4 + 1] = v;
    img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  sctx.putImageData(img, 0, 0);

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.filter = 'blur(6px)';
  ctx.drawImage(source, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  return tex;
}

/** Distortion map for the floor's MeshReflectorMaterial (null during SSR). */
export const floorDistortionMap = makeBlurredNoiseTexture();

export const MATERIALS = {
  /** Dark, shiny metal — desk legs, table leg. */
  darkMetal: new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.8,
    roughness: 0.2,
  }),
  /** Matte wall with subtle procedural roughness variation. */
  matteWall: new THREE.MeshStandardMaterial({
    color: '#10141f',
    roughness: 0.9,
    roughnessMap: wallNoise ?? undefined,
  }),
  /** Lacquered desk top — clearcoat over noisy roughness (physical tiers). */
  deskLacquer: new THREE.MeshPhysicalMaterial({
    color: '#232323',
    roughness: 0.35,
    roughnessMap: deskNoise ?? undefined,
    metalness: 0.15,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
  }),
  /** Plain desk top fallback for tiers without physical materials. */
  deskPlain: new THREE.MeshStandardMaterial({
    color: '#2a2a2a',
    roughness: 0.4,
    metalness: 0.3,
  }),
} as const;
