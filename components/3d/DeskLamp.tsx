'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Mesh } from 'three';
import { useStore } from '@/store/useStore';

interface DeskLampProps {
  position?: [number, number, number];
}

export default function DeskLamp({ position = [1.2, 0.82, -1.5] }: DeskLampProps) {
  const lampRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { lightsOn, setLightsOn } = useStore();

  // Subtle animation when hovered
  useFrame((state) => {
    if (lampRef.current && hovered) {
      lampRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
  });

  const handleClick = () => {
    setLightsOn(!lightsOn);
  };

  return (
    <group position={position}>
      {/* Base */}
      <mesh 
        position={[0, 0, 0]} 
        castShadow
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.08, 0.1, 0.02]} />
        <meshStandardMaterial 
          color={hovered ? "#2a2a2a" : "#1a1a1a"}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Arm Base */}
      <mesh 
        ref={lampRef}
        position={[0, 0.12, 0]} 
        castShadow
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.015, 0.015, 0.25]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Arm Joint */}
      <mesh 
        position={[0, 0.24, 0]} 
        castShadow
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.02]} />
        <meshStandardMaterial 
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Upper Arm */}
      <mesh 
        position={[0.08, 0.32, 0]} 
        rotation={[0, 0, -Math.PI / 6]}
        castShadow
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.012, 0.012, 0.18]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Lamp Head */}
      <mesh 
        position={[0.15, 0.38, 0]} 
        rotation={[0, 0, Math.PI / 3]}
        castShadow
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <coneGeometry args={[0.06, 0.12, 16]} />
        <meshStandardMaterial 
          color={lightsOn ? "#ffd700" : "#1a1a1a"}
          metalness={0.7}
          roughness={0.3}
          emissive={lightsOn ? "#ffa500" : "#000000"}
          emissiveIntensity={lightsOn ? 0.3 : 0}
        />
      </mesh>

      {/* Light Bulb Inside */}
      {lightsOn && (
        <mesh position={[0.15, 0.34, 0]}>
          <sphereGeometry args={[0.015]} />
          <meshStandardMaterial 
            color="#ffffff"
            emissive="#ffff00"
            emissiveIntensity={2}
          />
        </mesh>
      )}

      {/* Spotlight from lamp */}
      {lightsOn && (
        <>
          <spotLight
            position={[0.15, 0.38, 0]}
            angle={Math.PI / 4}
            penumbra={0.5}
            intensity={1.5}
            distance={3}
            color="#ffd89b"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            target-position={[0.3, 0, 0]}
          />
          <pointLight
            position={[0.15, 0.38, 0]}
            intensity={0.5}
            distance={1}
            color="#ffa500"
          />
        </>
      )}

      {/* Hover tooltip */}
      {hovered && (
        <Html
          position={[0, 0.5, 0]}
          center
          distanceFactor={2}
          style={{
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <div className="bg-black/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap backdrop-blur-sm border border-gray-700">
            {lightsOn ? 'Turn off lights' : 'Turn on lights'}
          </div>
        </Html>
      )}
    </group>
  );
}
