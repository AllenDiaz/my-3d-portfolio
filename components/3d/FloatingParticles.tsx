'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingParticlesProps {
  count?: number;
}

export default function FloatingParticles({ count = 200 }: FloatingParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Soft circular sprite so particles read as dust/bokeh motes, not hard squares
  const spriteTexture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.4, 'rgba(255,255,255,0.6)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Create particle positions and velocities
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Random positions within room bounds
      positions[i3] = (Math.random() - 0.5) * 18; // x
      positions[i3 + 1] = Math.random() * 6; // y
      positions[i3 + 2] = (Math.random() - 0.5) * 18; // z
      
      // Random velocities for floating effect
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = Math.random() * 0.01 + 0.01; // Upward drift
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    return { positions, velocities };
  }, [count]);

  // Animate particles
  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Update positions with velocity
      positions[i3] += particles.velocities[i3];
      positions[i3 + 1] += particles.velocities[i3 + 1];
      positions[i3 + 2] += particles.velocities[i3 + 2];
      
      // Add subtle sinusoidal movement
      positions[i3] += Math.sin(time * 0.5 + i) * 0.001;
      positions[i3 + 2] += Math.cos(time * 0.5 + i) * 0.001;
      
      // Reset particles that float too high or drift out of bounds
      if (positions[i3 + 1] > 6) {
        positions[i3 + 1] = 0;
      }
      
      // Keep particles within room bounds
      if (Math.abs(positions[i3]) > 9) {
        positions[i3] = (Math.random() - 0.5) * 18;
      }
      if (Math.abs(positions[i3 + 2]) > 9) {
        positions[i3 + 2] = (Math.random() - 0.5) * 18;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Rotate entire particle system slowly
    pointsRef.current.rotation.y = time * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
          args={[particles.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        map={spriteTexture}
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
