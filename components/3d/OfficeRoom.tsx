'use client';

import { useRef, useState } from 'react';
import { Mesh, BoxGeometry } from 'three';
import { MeshReflectorMaterial, ContactShadows, RoundedBox } from '@react-three/drei';
import { useStore } from '@/store/useStore';
import { ThreeEvent } from '@react-three/fiber';
import { QUALITY_PRESETS } from '@/lib/deviceTier';
import { MATERIALS } from '@/lib/materials';

export default function OfficeRoom() {
  const floorRef = useRef<Mesh>(null);
  const chairRef = useRef<Mesh>(null);
  const [chairHovered, setChairHovered] = useState(false);
  const setShowChairNotification = useStore((state) => state.setShowChairNotification);
  const qualityTier = useStore((state) => state.qualityTier);
  const preset = QUALITY_PRESETS[qualityTier];
  
  const handleChairClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setShowChairNotification(true);
  };
  
  return (
    <group>
      {/* Floor — reflective on capable tiers, plain on low-end (reflections render the
          scene to an offscreen target every frame, the heaviest cost in the room). */}
      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        {preset.reflectionResolution > 0 ? (
          <MeshReflectorMaterial
            blur={[200, 60]}
            resolution={preset.reflectionResolution}
            mixBlur={1}
            mixStrength={0.45}
            roughness={0.6}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#1a1a1a"
            metalness={0.6}
          />
        ) : (
          <meshStandardMaterial color="#161616" roughness={0.6} metalness={0.4} />
        )}
      </mesh>

      {/* Contact shadows ground the desk/chair on capable tiers */}
      {preset.contactShadowResolution > 0 && (
        <ContactShadows
          position={[0, 0.01, -1.5]}
          scale={12}
          resolution={preset.contactShadowResolution}
          blur={2.5}
          opacity={0.6}
          far={4}
          color="#000000"
        />
      )}

      {/* Back Wall */}
      <mesh position={[0, 3, -5]} receiveShadow material={MATERIALS.matteWall}>
        <planeGeometry args={[20, 6]} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-10, 3, 5]} rotation={[0, Math.PI / 2, 0]} receiveShadow material={MATERIALS.matteWall}>
        <planeGeometry args={[20, 6]} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[10, 3, 5]} rotation={[0, -Math.PI / 2, 0]} receiveShadow material={MATERIALS.matteWall}>
        <planeGeometry args={[20, 6]} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#0a0a0a"
          roughness={0.9}
        />
      </mesh>

      {/* Desk Base */}
      <group position={[0, 0, -2]}>
        {/* Desktop — rounded edges for a less blocky look */}
        <RoundedBox args={[3, 0.1, 1.5]} radius={0.02} smoothness={4} position={[0, 0.75, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.6} />
        </RoundedBox>

        {/* Legs (shared dark-metal material) */}
        <mesh position={[-1.3, 0.375, -0.6]} castShadow material={MATERIALS.darkMetal}>
          <boxGeometry args={[0.1, 0.75, 0.1]} />
        </mesh>
        <mesh position={[1.3, 0.375, -0.6]} castShadow material={MATERIALS.darkMetal}>
          <boxGeometry args={[0.1, 0.75, 0.1]} />
        </mesh>
        <mesh position={[-1.3, 0.375, 0.6]} castShadow material={MATERIALS.darkMetal}>
          <boxGeometry args={[0.1, 0.75, 0.1]} />
        </mesh>
        <mesh position={[1.3, 0.375, 0.6]} castShadow material={MATERIALS.darkMetal}>
          <boxGeometry args={[0.1, 0.75, 0.1]} />
        </mesh>
      </group>

      {/* Chair */}
      <group 
        position={[-2.5, 0, -1.5]}
        rotation={[0, Math.PI / 4, 0]}
        onClick={handleChairClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setChairHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setChairHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Seat */}
        <RoundedBox args={[0.6, 0.1, 0.6]} radius={0.03} smoothness={4} position={[0, 0.5, 0]} castShadow>
          <meshStandardMaterial
            color={chairHovered ? "#2a2a4e" : "#1a1a2e"}
            roughness={0.7}
            emissive={chairHovered ? "#3a3a6e" : "#000000"}
            emissiveIntensity={chairHovered ? 0.3 : 0}
          />
        </RoundedBox>

        {/* Backrest */}
        <RoundedBox args={[0.6, 0.8, 0.1]} radius={0.03} smoothness={4} position={[0, 0.9, -0.25]} castShadow>
          <meshStandardMaterial
            color={chairHovered ? "#2a2a4e" : "#1a1a2e"}
            roughness={0.7}
            emissive={chairHovered ? "#3a3a6e" : "#000000"}
            emissiveIntensity={chairHovered ? 0.3 : 0}
          />
        </RoundedBox>

        {/* Central Pole */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.3, 32]} />
          <meshStandardMaterial
            color="#0a0a0a"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Bookshelf */}
      <group position={[-4, 0, -4.8]}>
        {/* Frame */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 3, 0.4]} />
          <meshStandardMaterial 
            color="#1a1a1a"
            roughness={0.8}
          />
        </mesh>
        
        {/* Shelves */}
        {[0.5, 1.5, 2.5].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} castShadow>
            <boxGeometry args={[1.9, 0.05, 0.35]} />
            <meshStandardMaterial 
              color="#2a2a2a"
              roughness={0.6}
            />
          </mesh>
        ))}
        
        {/* Books */}
        {[0.65, 0.75, 0.85, 1.65, 1.75, 2.65].map((y, i) => (
          <mesh key={i} position={[-0.5 + (i % 3) * 0.3, y, 0.05]} castShadow>
            <boxGeometry args={[0.15, 0.25, 0.25]} />
            <meshStandardMaterial 
              color={['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#bb8fce', '#85c1e2'][i]}
              roughness={0.7}
            />
          </mesh>
        ))}
      </group>

      {/* Side Table */}
      <group position={[4, 0, -3]}>
        {/* Table Top */}
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 48]} />
          <meshStandardMaterial
            color="#2a2a2a"
            roughness={0.5}
            metalness={0.5}
          />
        </mesh>

        {/* Leg (shared dark-metal material) */}
        <mesh position={[0, 0.3, 0]} castShadow material={MATERIALS.darkMetal}>
          <cylinderGeometry args={[0.05, 0.08, 0.6, 32]} />
        </mesh>

        {/* Plant Pot */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.15, 32]} />
          <meshStandardMaterial
            color="#8b4513"
            roughness={0.9}
          />
        </mesh>

        {/* Plant */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial
            color="#2d5016"
            roughness={0.8}
          />
        </mesh>
      </group>

      {/* Window Frame (illusion) */}
      <group position={[-8, 2.5, -4.9]}>
        <mesh castShadow>
          <boxGeometry args={[2, 2.5, 0.05]} />
          <meshStandardMaterial 
            color="#87ceeb"
            emissive="#4a90a4"
            emissiveIntensity={0.2}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
        
        {/* Window Frame Border */}
        <lineSegments>
          <edgesGeometry args={[new BoxGeometry(2, 2.5, 0.05)]} />
          <lineBasicMaterial color="#0a0a0a" linewidth={2} />
        </lineSegments>
      </group>
    </group>
  );
}
