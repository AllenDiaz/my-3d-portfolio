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

      // Confined to the lit desk volume so motes read as "dust in the light"
      positions[i3] = (Math.random() - 0.5) * 10; // x: ±5
      positions[i3 + 1] = Math.random() * 5; // y
      positions[i3 + 2] = -1.5 + (Math.random() - 0.5) * 8; // z centred on the desk

      // Gentle drift
      velocities[i3] = (Math.random() - 0.5) * 0.012;
      velocities[i3 + 1] = Math.random() * 0.006 + 0.006; // slow upward drift
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.012;
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

      // Weak attractor toward the desk-lamp pool so motes gather in the warm
      // light (only within ~2 units; same loop, no extra cost)
      const dx = -positions[i3];
      const dy = 1.2 - positions[i3 + 1];
      const dz = -2 - positions[i3 + 2];
      if (dx * dx + dy * dy + dz * dz < 4) {
        positions[i3] += dx * 0.0008;
        positions[i3 + 1] += dy * 0.0008;
        positions[i3 + 2] += dz * 0.0008;
      }

      // Recycle particles that leave the confined desk volume
      if (positions[i3 + 1] > 5) {
        positions[i3 + 1] = 0;
      }
      if (Math.abs(positions[i3]) > 5) {
        positions[i3] = (Math.random() - 0.5) * 10;
      }
      if (positions[i3 + 2] < -5.5 || positions[i3 + 2] > 2.5) {
        positions[i3 + 2] = -1.5 + (Math.random() - 0.5) * 8;
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
