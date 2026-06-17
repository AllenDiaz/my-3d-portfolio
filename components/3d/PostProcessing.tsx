'use client';

import { EffectComposer, Bloom, DepthOfField, Vignette, ChromaticAberration, N8AO, Noise } from '@react-three/postprocessing';
import { useStore } from '@/store/useStore';
import { QUALITY_PRESETS } from '@/lib/deviceTier';

export default function PostProcessing() {
  const lightsOn = useStore((state) => state.lightsOn);
  const qualityTier = useStore((state) => state.qualityTier);
  const preset = QUALITY_PRESETS[qualityTier];

  // Low-end devices skip post-processing entirely.
  if (preset.postProcessing === 'off') return null;

  // Reduced tier: cheaper AO and no Depth-of-Field / Chromatic Aberration.
  if (preset.postProcessing === 'reduced') {
    return (
      <EffectComposer multisampling={preset.multisampling}>
        <Bloom
          intensity={lightsOn ? 0.5 : 0.3}
          luminanceThreshold={0.25}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <N8AO
          aoRadius={0.5}
          intensity={lightsOn ? 1 : 2}
          aoSamples={3}
          denoiseSamples={2}
          denoiseRadius={6}
          distanceFalloff={1}
          color="black"
        />
        <Vignette offset={0.3} darkness={lightsOn ? 0.5 : 0.7} />
      </EffectComposer>
    );
  }

  // Full tier: all effects.
  return (
    <EffectComposer multisampling={preset.multisampling}>
      {/* Bloom for glowing monitors and neon - deliberate emissive glow */}
      <Bloom
        intensity={lightsOn ? 0.6 : 0.35}
        luminanceThreshold={0.22}
        luminanceSmoothing={0.9}
        mipmapBlur
      />

      {/* N8AO (Ambient Occlusion) - Better alternative to SSAO */}
      <N8AO
        aoRadius={0.5}
        intensity={lightsOn ? 1 : 2}
        aoSamples={6}
        denoiseSamples={4}
        denoiseRadius={12}
        distanceFalloff={1}
        color="black"
      />

      {/* Depth of Field - focal plane on the desk, softer aperture */}
      <DepthOfField
        focusDistance={0.035}
        focalLength={0.08}
        bokehScale={lightsOn ? 2 : 3}
        height={480}
      />

      {/* Vignette to frame the stage */}
      <Vignette
        offset={0.35}
        darkness={lightsOn ? 0.55 : 0.7}
      />

      {/* Chromatic aberration - subtle but now actually perceptible */}
      <ChromaticAberration
        offset={[0.0012, 0.0012] as [number, number]}
      />

      {/* Film grain - cinematic late-night finish (high tier only) */}
      <Noise premultiply opacity={0.025} />
    </EffectComposer>
  );
}
