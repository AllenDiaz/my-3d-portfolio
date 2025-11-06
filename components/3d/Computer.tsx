'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Mesh } from 'three';
import { useStore } from '@/store/useStore';

interface ComputerProps {
  position: [number, number, number];
  projectId: string;
}

export default function Computer({ position, projectId }: ComputerProps) {
  const monitorRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { setActiveProject, setShowProjectPanel, projects } = useStore();

  // Subtle floating animation
  useFrame((state) => {
    if (monitorRef.current && hovered) {
      monitorRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  const handleClick = () => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setActiveProject(project);
      setShowProjectPanel(true);
    }
  };

  return (
    <group position={position}>
      {/* Monitor Base */}
      <mesh position={[0, -0.05, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.02]} />
        <meshStandardMaterial 
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Monitor Stand */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.3]} />
        <meshStandardMaterial 
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Monitor Frame */}
      <mesh 
        ref={monitorRef}
        position={[0, 0.3, 0]} 
        castShadow
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.7, 0.45, 0.05]} />
        <meshStandardMaterial 
          color={hovered ? "#1a1a1a" : "#0a0a0a"}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Monitor Screen */}
      <mesh 
        position={[0, 0.3, 0.026]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[0.62, 0.37]} />
        <meshStandardMaterial 
          color={hovered ? "#4a90e2" : "#1a3a52"}
          emissive={hovered ? "#4a90e2" : "#0a1a2a"}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Hover Text */}
      {hovered && (
        <Html
          position={[0, 0.6, 0]}
          center
          distanceFactor={1.5}
          style={{
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm border border-gray-700">
            Click to view project
          </div>
        </Html>
      )}

      {/* Screen Glow */}
      {hovered && (
        <pointLight
          position={[0, 0.3, 0.15]}
          intensity={0.5}
          distance={1}
          color="#4a90e2"
        />
      )}
    </group>
  );
}
