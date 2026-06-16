/**
 * Shared, reused material instances for static (non-interactive) scene objects.
 *
 * Many meshes in the office are identical (desk legs, walls), but each previously
 * constructed its own meshStandardMaterial. Sharing a single instance keeps the look
 * consistent and reduces GPU/GC churn. Do NOT use these for objects that mutate their
 * material on hover (chair, monitors, badges) — those need per-instance materials.
 */
import * as THREE from 'three';

export const MATERIALS = {
  /** Dark, shiny metal — desk legs, table leg. */
  darkMetal: new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.8,
    roughness: 0.2,
  }),
  /** Flat matte surface — walls. */
  matteWall: new THREE.MeshStandardMaterial({
    color: '#0f0f0f',
    roughness: 0.9,
  }),
} as const;
