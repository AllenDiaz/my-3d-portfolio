'use client';

import { EffectComposer, Bloom, DepthOfField, Vignette, ChromaticAberration, N8AO } from '@react-three/postprocessing';
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
          luminanceThreshold={0.2}
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
      {/* Bloom for glowing monitors and lights */}
      <Bloom
        intensity={lightsOn ? 0.5 : 0.3}
        luminanceThreshold={0.2}
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

      {/* Depth of Field for cinematic focus */}
      <DepthOfField
        focusDistance={0.01}
        focalLength={0.2}
        bokehScale={lightsOn ? 2 : 3}
        height={480}
      />

      {/* Vignette for atmospheric depth */}
      <Vignette
        offset={0.3}
        darkness={lightsOn ? 0.5 : 0.7}
      />

      {/* Subtle chromatic aberration for realism */}
      <ChromaticAberration
        offset={[0.0005, 0.0005] as [number, number]}
      />
    </EffectComposer>
  );
}
