'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { Loader } from '@react-three/drei';
import PerformanceOptimizer from './PerformanceOptimizer';
import { useStore } from '@/store/useStore';
import { detectDeviceTier, QUALITY_PRESETS, type QualityTier } from '@/lib/deviceTier';

interface Scene3DProps {
  children: React.ReactNode;
}

export default function Scene3D({ children }: Scene3DProps) {
  const setQualityTier = useStore((state) => state.setQualityTier);

  // Scene3D is dynamically imported with ssr:false, so this only runs client-side.
  // Detect synchronously via lazy init so the first Canvas render already uses the
  // correct DPR on mobile, then publish the tier to the store for the rest of the scene.
  const [tier] = useState<QualityTier>(detectDeviceTier);

  useEffect(() => {
    setQualityTier(tier);
  }, [tier, setQualityTier]);

  const preset = QUALITY_PRESETS[tier];

  return (
    <>
      <Canvas
        shadows
        camera={{
          position: [0, 1.5, 5],
          fov: 50,
          near: 0.1,
          far: 100
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        dpr={[1, preset.dprMax]}
        style={{
          width: '100%',
          height: '100vh',
          background: '#0a0a0a'
        }}
      >
        <Suspense fallback={null}>
          <PerformanceOptimizer>
            {children}
          </PerformanceOptimizer>
        </Suspense>
      </Canvas>
      <Loader
        containerStyles={{
          background: '#0a0a0a'
        }}
        innerStyles={{
          background: '#333'
        }}
        barStyles={{
          background: '#fff'
        }}
        dataStyles={{
          color: '#fff'
        }}
      />
    </>
  );
}
