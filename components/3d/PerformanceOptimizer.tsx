'use client';

import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei';
import { useStore } from '@/store/useStore';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

export default function PerformanceOptimizer({ children }: PerformanceOptimizerProps) {
  const qualityTier = useStore((state) => state.qualityTier);
  const setQualityTier = useStore((state) => state.setQualityTier);

  return (
    <>
      {/* Adaptive DPR - reduces pixel ratio when FPS drops (works within Scene3D's dpr bounds) */}
      <AdaptiveDpr pixelated />

      {/* Adaptive Events - throttles events when performance is low */}
      <AdaptiveEvents />

      {/* Performance Monitor - if a device that passed detection still struggles,
          step the quality tier down so particles/post-processing back off. */}
      <PerformanceMonitor
        onDecline={() => {
          if (qualityTier === 'high') setQualityTier('medium');
          else if (qualityTier === 'medium') setQualityTier('low');
        }}
      />

      {children}
    </>
  );
}
