'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { animated, useSpring } from '@react-spring/three';

interface AnimatedCharacterProps {
  position?: [number, number, number];
  scale?: number;
  visible?: boolean;
}

export default function AnimatedCharacter({ 
  position = [0, 0, 0], 
  scale = 1,
  visible = false
}: AnimatedCharacterProps) {
  const group = useRef<THREE.Group>(null);
  const [isWaving, setIsWaving] = useState(false);
  
  // Animate character appearing
  const { characterScale, characterY } = useSpring({
    characterScale: visible ? scale : 0,
    characterY: visible ? position[1] : position[1] - 2,
    config: { tension: 120, friction: 14 }
  });

  // Wave animation
  useEffect(() => {
    if (visible) {
      setTimeout(() => setIsWaving(true), 500);
      setTimeout(() => setIsWaving(false), 2500);
    }
  }, [visible]);

  // Gentle breathing animation
  useFrame((state) => {
    if (group.current && visible) {
      const time = state.clock.getElapsedTime();
      group.current.position.y = position[1] + Math.sin(time * 1.5) * 0.01;
    }
  });

  if (!visible) return null;

  return (
    <animated.group 
      ref={group} 
      position-x={position[0]}
      position-y={characterY}
      position-z={position[2]}
      scale={characterScale}
    >
      {/* Head (better proportions, healthy skin tone) */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial 
          color="#ffe0c7" 
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      
      {/* Jawline definition (handsome feature) */}
      <mesh position={[0, 1.0, 0.05]} castShadow>
        <boxGeometry args={[0.12, 0.08, 0.12]} />
        <meshStandardMaterial 
          color="#ffd4b0" 
          roughness={0.6}
        />
      </mesh>
      
      {/* Stylish Hair (modern, handsome) */}
      <mesh position={[0, 1.25, 0]} rotation={[0.15, 0, 0]} castShadow>
        <sphereGeometry args={[0.16, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Hair volume (top) */}
      <mesh position={[0, 1.32, -0.02]} rotation={[0.3, 0, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Stylish side bangs */}
      <mesh position={[-0.09, 1.20, 0.10]} rotation={[0.2, -0.4, -0.2]} castShadow>
        <boxGeometry args={[0.04, 0.15, 0.08]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0.09, 1.20, 0.10]} rotation={[0.2, 0.4, 0.2]} castShadow>
        <boxGeometry args={[0.04, 0.15, 0.08]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Front hair sweep */}
      <mesh position={[0.05, 1.23, 0.13]} rotation={[0.4, 0.3, 0]} castShadow>
        <boxGeometry args={[0.08, 0.12, 0.03]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Eyes (friendly, confident look) */}
      <group>
        {/* Left Eye - larger and more expressive */}
        <mesh position={[-0.05, 1.12, 0.13]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#2c5282" emissive="#3182ce" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[-0.045, 1.125, 0.145]}>
          <sphereGeometry args={[0.015, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        {/* Right Eye - larger and more expressive */}
        <mesh position={[0.05, 1.12, 0.13]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#2c5282" emissive="#3182ce" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0.055, 1.125, 0.145]}>
          <sphereGeometry args={[0.015, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        {/* Eye highlights (sparkle for handsome look) */}
        <mesh position={[-0.04, 1.13, 0.15]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0.06, 1.13, 0.15]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
        </mesh>
        
        {/* Eyebrows (confident, friendly) */}
        <mesh position={[-0.05, 1.16, 0.135]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.05, 0.008, 0.015]} />
          <meshStandardMaterial color="#1a120a" />
        </mesh>
        <mesh position={[0.05, 1.16, 0.135]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.05, 0.008, 0.015]} />
          <meshStandardMaterial color="#1a120a" />
        </mesh>
      </group>
      
      {/* Happy Smile - BIG cheerful grin curving UP! */}
      <group>
        {/* Left side of smile curving up */}
        <mesh position={[-0.04, 1.02, 0.145]} rotation={[0, 0, -0.5]}>
          <capsuleGeometry args={[0.003, 0.045, 4, 8]} />
          <meshStandardMaterial color="#c94444" />
        </mesh>
        
        {/* Right side of smile curving up */}
        <mesh position={[0.04, 1.02, 0.145]} rotation={[0, 0, 0.5]}>
          <capsuleGeometry args={[0.003, 0.045, 4, 8]} />
          <meshStandardMaterial color="#c94444" />
        </mesh>
        
        {/* Center of smile */}
        <mesh position={[0, 1.0, 0.145]}>
          <capsuleGeometry args={[0.003, 0.06, 4, 8]} />
          <meshStandardMaterial color="#c94444" />
        </mesh>
        
        {/* Smile dimples/cheek highlights (adds charm and happiness) */}
        <mesh position={[-0.09, 1.04, 0.13]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#ffc9a0" transparent opacity={0.5} />
        </mesh>
        <mesh position={[0.09, 1.04, 0.13]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#ffc9a0" transparent opacity={0.5} />
        </mesh>
      </group>
      
      {/* Nose (defined, handsome feature) */}
      <mesh position={[0, 1.08, 0.145]} rotation={[1.3, 0, 0]}>
        <coneGeometry args={[0.015, 0.03, 8]} />
        <meshStandardMaterial color="#ffc9a0" />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.1]} />
        <meshStandardMaterial color="#ffe0c7" roughness={0.6} />
      </mesh>
      
      {/* Body (shirt) - sitting position */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.35, 0.5, 0.22]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.7} />
      </mesh>
      
      {/* Collar */}
      <mesh position={[0, 0.92, 0.08]}>
        <boxGeometry args={[0.36, 0.06, 0.06]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      
      {/* Left Arm */}
      <group position={[-0.22, 0.75, 0]} rotation={[0, 0, isWaving ? 0.8 : 0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.045, 0.35]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
        {/* Left Hand */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#ffe0c7" roughness={0.6} />
        </mesh>
      </group>
      
      {/* Right Arm (waving arm) */}
      <group 
        position={[0.22, 0.75, 0]} 
        rotation={[isWaving ? -1.2 : 0, 0, isWaving ? -1.5 : -0.3]}
      >
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.045, 0.35]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
        {/* Right Hand */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#ffe0c7" roughness={0.6} />
        </mesh>
      </group>
      
      {/* Hips - sitting on chair */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.35, 0.2, 0.3]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      
      {/* Left Thigh (sitting, going forward) */}
      <group position={[-0.1, 0.3, 0.2]} rotation={[1.3, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.055, 0.35]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>
      
      {/* Right Thigh (sitting, going forward) */}
      <group position={[0.1, 0.3, 0.2]} rotation={[1.3, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.055, 0.35]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>
      
      {/* Left Lower Leg (bent down) */}
      <group position={[-0.1, 0.05, 0.4]} rotation={[0, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.055, 0.05, 0.3]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Left Foot */}
        <mesh position={[0, -0.2, 0.08]} rotation={[1.5, 0, 0]} castShadow>
          <boxGeometry args={[0.09, 0.05, 0.16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>
      
      {/* Right Lower Leg (bent down) */}
      <group position={[0.1, 0.05, 0.4]} rotation={[0, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.055, 0.05, 0.3]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Right Foot */}
        <mesh position={[0, -0.2, 0.08]} rotation={[1.5, 0, 0]} castShadow>
          <boxGeometry args={[0.09, 0.05, 0.16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>
      
      {/* Sparkle effect when appearing */}
      {visible && (
        <>
          <pointLight position={[0, 1.3, 0.3]} intensity={0.5} distance={1} color="#60a5fa" />
          <pointLight position={[0.3, 0.9, 0.3]} intensity={0.3} distance={0.8} color="#a78bfa" />
        </>
      )}
    </animated.group>
  );
}
