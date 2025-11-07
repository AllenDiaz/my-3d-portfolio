'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingParticlesProps {
  count?: number;
}

export default function FloatingParticles({ count = 200 }: FloatingParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

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
        size={0.03}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
