'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HolographicDisplayProps {
  position?: [number, number, number];
}

export default function HolographicDisplay({ position = [0, 1.5, -3] }: HolographicDisplayProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
    
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(0x00ffff) }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float time;
      
      void main() {
        vUv = uv;
        vPosition = position;
        
        vec3 pos = position;
        pos.y += sin(pos.x * 5.0 + time) * 0.05;
        pos.x += cos(pos.y * 5.0 + time) * 0.05;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // Grid pattern
        vec2 grid = abs(fract(vUv * 10.0 - 0.5) - 0.5) / fwidth(vUv * 10.0);
        float gridLine = min(grid.x, grid.y);
        float gridStrength = 1.0 - min(gridLine, 1.0);
        
        // Scan line effect
        float scanLine = sin(vUv.y * 50.0 - time * 2.0) * 0.5 + 0.5;
        
        // Pulsing effect
        float pulse = sin(time * 2.0) * 0.3 + 0.7;
        
        // Final color
        vec3 finalColor = color * (gridStrength * 0.5 + scanLine * 0.3) * pulse;
        float alpha = (gridStrength * 0.7 + scanLine * 0.3) * pulse;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });

  return (
    <group position={position}>
      {/* Main holographic display */}
      <mesh ref={meshRef}>
        <planeGeometry args={[1, 1, 32, 32]} />
        <primitive object={shaderMaterial} ref={materialRef} attach="material" />
      </mesh>
      
      {/* Glow effect */}
      <pointLight
        position={[0, 0, 0.1]}
        intensity={0.5}
        distance={2}
        color="#00ffff"
      />
      
      {/* Particle ring */}
      <points>
        <ringGeometry args={[0.6, 0.65, 32]} />
        <pointsMaterial
          size={0.02}
          color="#00ffff"
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
