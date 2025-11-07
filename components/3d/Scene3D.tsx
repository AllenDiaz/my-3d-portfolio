'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Loader } from '@react-three/drei';
import PerformanceOptimizer from './PerformanceOptimizer';

interface Scene3DProps {
  children: React.ReactNode;
}

export default function Scene3D({ children }: Scene3DProps) {
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
        dpr={[1, 2]}
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
