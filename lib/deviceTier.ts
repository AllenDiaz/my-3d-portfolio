/**
 * Device-tier detection and quality presets for the 3D scene.
 *
 * The 3D office renders at full quality on every device by default, which
 * overwhelms mid-range phones. `detectDeviceTier()` classifies the current
 * device once on mount, and `QUALITY_PRESETS` maps that tier to concrete
 * rendering knobs consumed by Scene3D / MainScene / PostProcessing.
 */

export type QualityTier = 'high' | 'medium' | 'low';

export interface QualityPreset {
  /** Number of atmospheric particles to render. */
  particleCount: number;
  /** How much post-processing to run. */
  postProcessing: 'full' | 'reduced' | 'off';
  /** Upper bound for the canvas device-pixel-ratio. */
  dprMax: number;
  /** EffectComposer MSAA sample count (0 disables). */
  multisampling: number;
  /** Shadow softness technique: PCSS (drei SoftShadows), soft PCF, or hard PCF. */
  softShadows: 'pcss' | 'pcf' | 'hard';
  /** Contact-shadow render resolution beneath furniture (0 disables). */
  contactShadowResolution: number;
  /** Floor reflection render resolution (0 = plain non-reflective floor). */
  reflectionResolution: number;
  /** Whether hero objects may use the costlier meshPhysicalMaterial (clearcoat). */
  physicalMaterials: boolean;
}

export const QUALITY_PRESETS: Record<QualityTier, QualityPreset> = {
  high: {
    particleCount: 160,
    postProcessing: 'full',
    dprMax: 2,
    multisampling: 8,
    softShadows: 'pcss',
    contactShadowResolution: 1024,
    reflectionResolution: 1024,
    physicalMaterials: true,
  },
  medium: {
    particleCount: 90,
    postProcessing: 'reduced',
    dprMax: 1.5,
    multisampling: 4,
    softShadows: 'pcf',
    contactShadowResolution: 512,
    reflectionResolution: 512,
    physicalMaterials: true,
  },
  low: {
    particleCount: 60,
    postProcessing: 'off',
    dprMax: 1,
    multisampling: 0,
    softShadows: 'hard',
    contactShadowResolution: 0,
    reflectionResolution: 0,
    physicalMaterials: false,
  },
};

/**
 * Classify the current device into a quality tier using cheap, widely
 * supported signals. Safe to call only in the browser — returns 'high' if
 * called during SSR (where `window` is undefined).
 */
export function detectDeviceTier(): QualityTier {
  if (typeof window === 'undefined') return 'high';

  // Allow a manual override for testing/debugging, e.g. ?tier=low
  const override = new URLSearchParams(window.location.search).get('tier');
  if (override === 'high' || override === 'medium' || override === 'low') {
    return override;
  }

  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const smallViewport = Math.min(window.innerWidth, window.innerHeight) < 768;
  const cores = navigator.hardwareConcurrency ?? 8;
  // deviceMemory is non-standard (Chromium only); default high when absent.
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

  // Low: phones / weak hardware.
  if ((coarsePointer && smallViewport) || cores <= 4 || memory <= 4) {
    return 'low';
  }

  // Medium: tablets / coarse-pointer-but-roomy, or modest core counts.
  if (coarsePointer || cores <= 6) {
    return 'medium';
  }

  return 'high';
}
