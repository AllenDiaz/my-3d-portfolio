'use client';

import { OrbitControls, Environment, SoftShadows } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { QUALITY_PRESETS } from '@/lib/deviceTier';
import CinematicCamera from './CinematicCamera';

interface SceneSetupProps {
  enableCinematicIntro?: boolean;
}

export default function SceneSetup({ enableCinematicIntro = true }: SceneSetupProps) {
  const { camera } = useThree();
  const lightsOn = useStore((state) => state.lightsOn);
  const qualityTier = useStore((state) => state.qualityTier);
  const preset = QUALITY_PRESETS[qualityTier];

  // Desk-lamp spotlight needs an explicit target object placed on the desk
  const lampSpotRef = useRef<THREE.SpotLight>(null);
  const lampTargetRef = useRef<THREE.Object3D>(null);

  useEffect(() => {
    if (lampSpotRef.current && lampTargetRef.current) {
      lampSpotRef.current.target = lampTargetRef.current;
      lampSpotRef.current.target.updateMatrixWorld();
    }
  }, []);

  useEffect(() => {
    // Set initial camera position if not using cinematic intro
    if (!enableCinematicIntro) {
      camera.position.set(0, 1.45, 3.6);
    }
  }, [camera, enableCinematicIntro]);

  return (
    <>
      {/* Percentage-closer soft shadows (PCSS) on the high tier for soft, realistic
          shadow penumbra. Cheaper tiers fall back to the PCF map set in Scene3D. */}
      {preset.softShadows === 'pcss' && (
        <SoftShadows size={25} samples={16} focus={0.5} />
      )}

      {/* Subtle exponential fog so the room dissolves into the void rather than a wall.
          Color matches the canvas background (#0a0a0a) for a seamless fade. */}
      <fogExp2 attach="fog" args={['#0a0a0a', 0.03]} />

      {/* Camera */}
      {enableCinematicIntro ? (
        <CinematicCamera />
      ) : null}

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={15}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        target={[0, 1.05, -1.9]}
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
      />

      {/* Lighting - "late-night dev studio": cool indigo base, warm amber key,
          teal neon spill from the binary walls */}
      {/* Ambient base (cool, dim) */}
      <ambientLight color="#16213a" intensity={lightsOn ? 0.22 : 0.05} />

      {/* Main Directional Light */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={lightsOn ? 0.8 : 0.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill Light (cool, soft) */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={lightsOn ? 0.2 : 0.05}
        color="#2a3a5e"
      />

      {/* Desk lamp - warm amber practical, the emotional key light */}
      <pointLight
        position={[0, 2, -2]}
        intensity={lightsOn ? 0.9 : 0.1}
        distance={4}
        color="#ffb066"
        castShadow
      />

      {/* Desk-lamp pool - a defined warm cone landing on the desk surface */}
      <object3D ref={lampTargetRef} position={[0, 0.75, -2]} />
      <spotLight
        ref={lampSpotRef}
        position={[0.6, 3.2, -0.6]}
        angle={0.5}
        penumbra={0.9}
        intensity={lightsOn ? 1.6 : 0.12}
        distance={7}
        decay={1.5}
        color="#ffb066"
      />

      {/* Neon spill from the binary walls (teal/green, on-palette) */}
      <pointLight
        position={[-4, 2, -4]}
        intensity={lightsOn ? 0.3 : 0.06}
        distance={5}
        color="#22d3a0"
      />

      <pointLight
        position={[4, 2, -3]}
        intensity={lightsOn ? 0.3 : 0.06}
        distance={5}
        color="#22d3a0"
      />

      {/* Ceiling Light */}
      <spotLight
        position={[0, 5.5, 0]}
        angle={Math.PI / 3}
        penumbra={0.5}
        intensity={lightsOn ? 0.4 : 0.05}
        castShadow
        color="#ffffff"
      />

      {/* Environment Map for Reflections - warmer night interior, story-consistent */}
      <Environment preset="night" environmentIntensity={0.4} />
    </>
  );
}
