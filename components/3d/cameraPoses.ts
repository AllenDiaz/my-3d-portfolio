// Per-object camera framings for the click-to-focus system. Positions are
// authored against the current MainScene layout; refine live with ?debug=camera
// (SceneSetup logs position/target while orbiting).

export type FocusId =
  | 'monitor-center'
  | 'monitor-left'
  | 'monitor-right'
  | 'tablet'
  | 'keyboard'
  | 'notebook'
  | 'badge'
  | 'certificate'
  | 'phone'
  | 'coffee'
  | 'avatar'
  | 'chair'
  | 'binary-wall'
  | 'window';

export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
  /** Optional per-pose FOV (default 50, restored on return). */
  fov?: number;
}

// Monitor screens sit 0.3 above their group origin (groups at y=0.8, z≈-2);
// flanking monitors are yawed ±0.18 rad inward, so their close-ups pull back
// along the rotated screen normal. Desk items sit on the desktop at y≈0.82
// and read best from a high three-quarter angle.
export const CAMERA_POSES: Record<FocusId, CameraPose> = {
  'monitor-center': { position: [0, 1.18, -1.05], target: [0, 1.1, -1.98] },
  'monitor-left': { position: [-0.63, 1.18, -0.98], target: [-0.8, 1.1, -1.9] },
  'monitor-right': { position: [0.63, 1.18, -0.98], target: [0.8, 1.1, -1.9] },
  tablet: { position: [0.3, 1.55, -0.55], target: [0.3, 0.84, -1.25] },
  keyboard: { position: [-0.8, 1.5, -0.75], target: [-0.8, 0.84, -1.5] },
  notebook: { position: [0.9, 1.45, -0.6], target: [0.9, 0.84, -1.3] },
  badge: { position: [1.3, 1.35, -1.05], target: [1.3, 0.84, -1.7] },
  certificate: { position: [-1.3, 1.35, -0.65], target: [-1.3, 0.84, -1.3] },
  phone: { position: [-1.1, 1.35, -1.05], target: [-1.1, 0.84, -1.7] },
  coffee: { position: [1.35, 1.25, -1.15], target: [1.1, 0.9, -1.8] },
  avatar: { position: [-1.85, 1.55, 0.9], target: [-1.9, 1.45, -0.6] },
  chair: { position: [-1.35, 1.35, -0.35], target: [-2.5, 0.7, -1.5] },
  'binary-wall': { position: [-5.5, 2.2, 0], target: [-9.95, 2.6, 0] },
  window: { position: [0, 1.7, -0.5], target: [0, 2.4, -4.8] },
};
