'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Mesh } from 'three';
import { useStore } from '@/store/useStore';

interface DeskItemProps {
  position: [number, number, number];
  itemType: 'keyboard' | 'mouse' | 'notebook' | 'coffee' | 'phone';
  onClick?: () => void;
  label?: string;
}

export default function DeskItem({ position, itemType, onClick, label }: DeskItemProps) {
  const itemRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (itemRef.current && hovered) {
      itemRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.1;
      itemRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.01;
    }
  });

  const handleClick = () => {
    if (onClick) onClick();
  };

  const renderItem = () => {
    switch (itemType) {
      case 'keyboard':
        return (
          <group>
            {/* Keyboard Base */}
            <mesh castShadow>
              <boxGeometry args={[0.5, 0.03, 0.2]} />
              <meshStandardMaterial 
                color={hovered ? "#2a2a2a" : "#1a1a1a"}
                metalness={0.3}
                roughness={0.7}
              />
            </mesh>
            {/* Keys */}
            {Array.from({ length: 15 }).map((_, i) => (
              <mesh 
                key={i} 
                position={[
                  -0.18 + (i % 5) * 0.09,
                  0.02,
                  -0.06 + Math.floor(i / 5) * 0.06
                ]}
                castShadow
              >
                <boxGeometry args={[0.07, 0.01, 0.05]} />
                <meshStandardMaterial 
                  color="#0a0a0a"
                  metalness={0.1}
                  roughness={0.9}
                />
              </mesh>
            ))}
          </group>
        );

      case 'mouse':
        return (
          <mesh castShadow>
            <boxGeometry args={[0.06, 0.04, 0.09]} />
            <meshStandardMaterial 
              color={hovered ? "#2a2a2a" : "#0a0a0a"}
              metalness={0.5}
              roughness={0.5}
            />
          </mesh>
        );

      case 'notebook':
        return (
          <group>
            {/* Notebook Cover */}
            <mesh castShadow>
              <boxGeometry args={[0.2, 0.02, 0.28]} />
              <meshStandardMaterial 
                color={hovered ? "#8b4513" : "#654321"}
                roughness={0.9}
              />
            </mesh>
            {/* Pages */}
            <mesh position={[0.005, 0.015, 0]} castShadow>
              <boxGeometry args={[0.19, 0.008, 0.27]} />
              <meshStandardMaterial 
                color="#f5f5dc"
                roughness={0.8}
              />
            </mesh>
          </group>
        );

      case 'coffee':
        return (
          <group>
            {/* Cup */}
            <mesh castShadow>
              <cylinderGeometry args={[0.04, 0.035, 0.08]} />
              <meshStandardMaterial 
                color={hovered ? "#ffffff" : "#e0e0e0"}
                roughness={0.3}
              />
            </mesh>
            {/* Coffee */}
            <mesh position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.038, 0.038, 0.02]} />
              <meshStandardMaterial 
                color="#3e2723"
                roughness={0.2}
              />
            </mesh>
            {/* Handle */}
            <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <torusGeometry args={[0.025, 0.005, 8, 16]} />
              <meshStandardMaterial 
                color={hovered ? "#ffffff" : "#e0e0e0"}
                roughness={0.3}
              />
            </mesh>
            {/* Steam effect */}
            {hovered && (
              <pointLight
                position={[0, 0.1, 0]}
                intensity={0.2}
                distance={0.3}
                color="#ffffff"
              />
            )}
          </group>
        );

      case 'phone':
        return (
          <mesh castShadow>
            <boxGeometry args={[0.08, 0.01, 0.15]} />
            <meshStandardMaterial 
              color={hovered ? "#1a1a1a" : "#0a0a0a"}
              metalness={0.8}
              roughness={0.2}
              emissive={hovered ? "#4a90e2" : "#000000"}
              emissiveIntensity={hovered ? 0.3 : 0}
            />
          </mesh>
        );

      default:
        return null;
    }
  };

  return (
    <group 
      ref={itemRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {renderItem()}
      
      {hovered && label && (
        <Html
          position={[0, 0.15, 0]}
          center
          distanceFactor={2}
          style={{
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <div className="bg-black/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap backdrop-blur-sm border border-gray-700">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}
