'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BinaryWallProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
}

export default function BinaryWall({ 
  position = [0, 0, -5], 
  rotation = [0, 0, 0],
  width = 10,
  height = 6
}: BinaryWallProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Generate random binary characters
  const binaryText = useMemo(() => {
    const chars = '01';
    const rows = 40;
    const cols = 80;
    let text = '';
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        text += chars[Math.floor(Math.random() * chars.length)];
      }
      text += '\n';
    }
    return text;
  }, []);

  // Create canvas texture with binary code
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Binary text
      ctx.font = '16px monospace';
      ctx.fillStyle = '#00ff00';
      
      const lines = binaryText.split('\n');
      lines.forEach((line, i) => {
        ctx.fillText(line, 10, (i + 1) * 20);
      });
    }
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [binaryText]);

  // Shader material for glowing effect
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        map: { value: texture },
        glowColor: { value: new THREE.Color(0x00ff00) },
        intensity: { value: 2.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform sampler2D map;
        uniform vec3 glowColor;
        uniform float intensity;
        varying vec2 vUv;
        
        // Pseudo-random function for more chaotic behavior
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        void main() {
          vec2 uv = vUv;
          
          // Slow, eerie scrolling effect
          uv.y += time * 0.03;
          
          // Get texture color
          vec4 texColor = texture2D(map, uv);
          
          // SURREAL INTERMITTENT APPEARANCE SYSTEM
          // Creates unpredictable, unsettling patterns where code appears and vanishes
          
          // Multiple independent flicker layers with different frequencies
          float flicker1 = sin(time * 2.3 + vUv.x * 12.0) * 0.5 + 0.5;
          float flicker2 = sin(time * 3.7 + vUv.y * 9.0 + vUv.x * 3.0) * 0.5 + 0.5;
          float flicker3 = cos(time * 1.8 + vUv.x * 7.0 - vUv.y * 5.0) * 0.5 + 0.5;
          float flicker4 = sin(time * 4.2) * 0.5 + 0.5;
          
          // Add random noise for more erratic behavior
          float noise = random(vUv + time * 0.1);
          float noiseFactor = smoothstep(0.3, 0.7, noise);
          
          // Vertical sections that flicker independently (creates eerie patchy effect)
          float sectionFlicker = sin(floor(vUv.x * 8.0) + time * 2.0) * 0.5 + 0.5;
          
          // Horizontal waves of disappearance
          float waveDisappear = sin(vUv.y * 6.0 - time * 1.5) * 0.5 + 0.5;
          
          // Combined visibility - always visible but with varying intensity
          float visibility = flicker1 * flicker2 * flicker3 * flicker4;
          visibility *= mix(0.7, 1.0, noiseFactor);
          visibility *= mix(0.6, 1.0, sectionFlicker);
          visibility *= mix(0.7, 1.0, waveDisappear);
          
          // Keep it always visible (minimum 0.6, maximum 1.0)
          visibility = mix(0.6, 1.0, visibility);
          
          // When visible, add pulsing intensity (brighter)
          float pulse = sin(time * 2.0 + vUv.x * 8.0 + vUv.y * 6.0) * 0.2 + 0.9;
          
          // Ethereal glow effect when visible (increased brightness)
          float glow = sin(time * 1.2 + vUv.y * 4.0) * 0.3 + 1.0;
          
          // Final color with enhanced brightness and glow
          vec3 finalColor = texColor.rgb * glowColor * intensity * glow * pulse * 1.5;
          
          // Critical: Alpha becomes 0 when disappeared - LEAVES NO TRACE
          // This creates the eerie sense of complete absence
          float alpha = texColor.a * visibility;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, [texture]);

  // Animate shader
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[width, height, 1, 1]} />
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}
