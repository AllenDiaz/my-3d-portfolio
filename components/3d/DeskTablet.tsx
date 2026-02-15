'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Mesh, CanvasTexture } from 'three';
import { useStore } from '@/store/useStore';

interface DeskTabletProps {
  position: [number, number, number];
}

export default function DeskTablet({ position }: DeskTabletProps) {
  const tabletRef = useRef<Mesh>(null);
  const screenRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const setShowAllProjectsModal = useStore((state) => state.setShowAllProjectsModal);

  // Create tablet screen texture
  const screenTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1e1b4b');
      gradient.addColorStop(0.5, '#312e81');
      gradient.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Grid pattern
      ctx.strokeStyle = '#8b5cf620';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
      
      // App icon style header
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(canvas.width / 2 - 40, 60, 80, 80);
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.strokeRect(canvas.width / 2 - 40, 60, 80, 80);
      
      // Grid icon inside
      ctx.fillStyle = '#a78bfa';
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          ctx.fillRect(
            canvas.width / 2 - 30 + col * 20,
            70 + row * 20,
            15,
            15
          );
        }
      }
      
      // Main text
      ctx.fillStyle = '#e0e7ff';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('View All', canvas.width / 2, 190);
      ctx.fillText('Projects', canvas.width / 2, 230);
      
      // Subtitle
      ctx.font = '18px sans-serif';
      ctx.fillStyle = '#c7d2fe';
      ctx.fillText('Tap to explore', canvas.width / 2, 270);
      
      // Project count badge
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 310, 25, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('15+', canvas.width / 2, 318);
      
      // Bottom decorative line
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 100, canvas.height - 30);
      ctx.lineTo(canvas.width / 2 + 100, canvas.height - 30);
      ctx.stroke();
    }
    
    const texture = new CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Floating animation
  useFrame((state) => {
    if (tabletRef.current) {
      if (hovered) {
        tabletRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.015;
        tabletRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.02;
      } else {
        tabletRef.current.position.y = position[1];
        tabletRef.current.rotation.z = 0;
      }
    }
    
    // Screen glow animation
    if (screenRef.current && screenTexture) {
      const material = screenRef.current.material as any;
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = hovered 
          ? 0.7 + Math.sin(state.clock.elapsedTime * 4) * 0.15 
          : 0.4;
      }
    }
  });

  const handleClick = () => {
    setShowAllProjectsModal(true);
  };

  return (
    <group position={position}>
      {/* Tablet Body */}
      <mesh 
        ref={tabletRef}
        rotation={[-Math.PI / 6, 0, 0]}
        castShadow
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.35, 0.02, 0.26]} />
        <meshStandardMaterial 
          color={hovered ? "#2d2d2d" : "#1a1a1a"}
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Tablet Screen */}
      <mesh 
        ref={screenRef}
        position={[0, 0.011, 0]}
        rotation={[-Math.PI / 6, 0, 0]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[0.32, 0.24]} />
        <meshStandardMaterial 
          map={screenTexture}
          emissive="#6366f1"
          emissiveMap={screenTexture}
          emissiveIntensity={hovered ? 0.7 : 0.4}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Screen Bezel Highlight */}
      <mesh 
        position={[0, 0.012, 0]}
        rotation={[-Math.PI / 6, 0, 0]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <ringGeometry args={[0.16, 0.165, 32]} />
        <meshStandardMaterial 
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={hovered ? 0.8 : 0.3}
          transparent
          opacity={hovered ? 0.6 : 0.3}
        />
      </mesh>

      {/* Hover Tooltip */}
      {hovered && (
        <Html
          position={[0, 0.25, 0]}
          center
          distanceFactor={1.5}
          style={{
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap backdrop-blur-sm border border-purple-400 shadow-lg">
            🚀 Browse Full Portfolio
          </div>
        </Html>
      )}

      {/* Screen Glow Light */}
      {hovered && (
        <pointLight
          position={[0, 0.05, 0.1]}
          intensity={0.8}
          distance={0.8}
          color="#6366f1"
          decay={2}
        />
      )}

      {/* Ambient Glow */}
      <pointLight
        position={[0, 0.05, 0.1]}
        intensity={hovered ? 0.4 : 0.2}
        distance={0.5}
        color="#8b5cf6"
        decay={2}
      />
    </group>
  );
}
