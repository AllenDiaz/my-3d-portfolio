'use client';

import { EffectComposer, Bloom, DepthOfField, Vignette, ChromaticAberration, N8AO, Noise, Outline } from '@react-three/postprocessing';
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
        <Outline edgeStrength={3} visibleEdgeColor={0x22d3a0} hiddenEdgeColor={0x22d3a0} blur />
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

      {/* Depth of Field - focus locked to the desk/monitors via a world target so
          it stays correct as the user orbits (not a fixed focusDistance) */}
      <DepthOfField
        target={[0, 1.05, -1.9]}
        focalLength={0.025}
        bokehScale={lightsOn ? 2.5 : 3}
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

      {/* Hover outline for interactive objects */}
      <Outline edgeStrength={3.5} visibleEdgeColor={0x22d3a0} hiddenEdgeColor={0x22d3a0} blur />

      {/* Film grain - cinematic late-night finish (high tier only) */}
      <Noise premultiply opacity={0.025} />
    </EffectComposer>
  );
}
