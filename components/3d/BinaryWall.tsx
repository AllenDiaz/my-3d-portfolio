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
        intensity: { value: 1.5 }
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
        
        void main() {
          vec2 uv = vUv;
          
          // Scrolling effect
          uv.y += time * 0.05;
          
          // Get texture color
          vec4 texColor = texture2D(map, uv);
          
          // Add glow
          float glow = sin(time * 2.0 + vUv.y * 10.0) * 0.5 + 0.5;
          vec3 finalColor = texColor.rgb * glowColor * intensity * (0.7 + glow * 0.3);
          
          // Fade edges
          float edgeFade = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
          edgeFade *= smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
          
          gl_FragColor = vec4(finalColor, texColor.a * edgeFade);
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
