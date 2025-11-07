'use client';

import { useState } from 'react';
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

export default function PerformanceOptimizer({ children }: PerformanceOptimizerProps) {
  const [dpr, setDpr] = useState(1.5);

  return (
    <>
      {/* Adaptive DPR - reduces pixel ratio when FPS drops */}
      <AdaptiveDpr pixelated />
      
      {/* Adaptive Events - throttles events when performance is low */}
      <AdaptiveEvents />
      
      {/* Performance Monitor - adjusts quality based on FPS */}
      <PerformanceMonitor
        onIncline={() => setDpr(2)} // Increase quality when performance is good
        onDecline={() => setDpr(1)} // Decrease quality when performance drops
      />
      
      {children}
    </>
  );
}
