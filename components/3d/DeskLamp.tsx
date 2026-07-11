'use client';

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { useStore } from '@/store/useStore';
import { QUALITY_PRESETS } from '@/lib/deviceTier';
import { useHoverFeedback } from './useHoverFeedback';

interface DeskLampProps {
  position?: [number, number, number];
}

/**
 * Clickable desk lamp — the light switch for the whole room. Toggling it
 * drives the `lightsOn` store flag, which every scene light and the
 * tone-mapping exposure react to (lights-off = moody late-night mode).
 * The head is angled toward the desk centre; its beam target is aimed there
 * explicitly (a bare `target-position` never updates its matrix).
 */
export default function DeskLamp({ position = [-1.35, 0.8, -2.15] }: DeskLampProps) {
  const groupRef = useRef<THREE.Group>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);
  const { hovered, pulseRef, hoverProps } = useHoverFeedback();
  const { lightsOn, setLightsOn } = useStore();
  const qualityTier = useStore((state) => state.qualityTier);
  const lampShadow = QUALITY_PRESETS[qualityTier].lampShadow;

  useEffect(() => {
    if (spotRef.current && targetRef.current) {
      spotRef.current.target = targetRef.current;
      spotRef.current.target.updateMatrixWorld();
    }
  }, [lightsOn]);

  // Fluorescent strike: when the lamp turns on, the bulb stutters twice
  // before holding steady (bulb mesh mounts with lightsOn, so this runs on
  // each turn-on).
  const bulbMatRef = useRef<THREE.MeshStandardMaterial>(null);
  useEffect(() => {
    if (!lightsOn || !bulbMatRef.current) return;
    const timeline = gsap.timeline();
    timeline
      .fromTo(bulbMatRef.current, { emissiveIntensity: 0 }, { emissiveIntensity: 2, duration: 0.08 })
      .to(bulbMatRef.current, { emissiveIntensity: 0.3, duration: 0.05 })
      .to(bulbMatRef.current, { emissiveIntensity: 2, duration: 0.06 })
      .to(bulbMatRef.current, { emissiveIntensity: 0.6, duration: 0.05 })
      .to(bulbMatRef.current, { emissiveIntensity: 2, duration: 0.11 });
    return () => {
      timeline.kill();
    };
  }, [lightsOn]);

  // Subtle wobble when hovered
  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
  });

  return (
    <Select enabled={hovered}>
      <group
        ref={groupRef}
        position={position}
        onClick={(e) => {
          e.stopPropagation();
          setLightsOn(!lightsOn);
        }}
        {...hoverProps}
      >
        {/* Inner group takes the click confirmation pulse */}
        <group ref={pulseRef}>
        {/* Base */}
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.02]} />
          <meshStandardMaterial
            color={hovered ? '#2a2a2a' : '#1a1a1a'}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Lower arm */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.25]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Arm joint */}
        <mesh position={[0, 0.24, 0]} castShadow>
          <sphereGeometry args={[0.02]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Upper arm */}
        <mesh position={[0.08, 0.32, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.18]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Head — warm amber shade when lit, matching the room's key light */}
        <mesh position={[0.15, 0.38, 0]} rotation={[0, 0, Math.PI / 3]} castShadow>
          <coneGeometry args={[0.06, 0.12, 16]} />
          <meshStandardMaterial
            color={lightsOn ? '#ffb066' : '#1a1a1a'}
            metalness={0.7}
            roughness={0.3}
            emissive={lightsOn ? '#ffa500' : '#000000'}
            emissiveIntensity={lightsOn ? 0.4 : 0}
          />
        </mesh>

        {/* Bulb */}
        {lightsOn && (
          <mesh position={[0.15, 0.34, 0]}>
            <sphereGeometry args={[0.015]} />
            <meshStandardMaterial
              ref={bulbMatRef}
              color="#ffffff"
              emissive="#ffdd88"
              emissiveIntensity={2}
            />
          </mesh>
        )}

        {/* Beam aimed at the desk centre (world [0, 0.8, -2]) */}
        <object3D ref={targetRef} position={[1.35, 0, 0.15]} />
        {lightsOn && (
          <>
            <spotLight
              ref={spotRef}
              position={[0.15, 0.38, 0]}
              angle={Math.PI / 4}
              penumbra={0.6}
              intensity={1.2}
              distance={3}
              decay={1.5}
              color="#ffd89b"
              castShadow={lampShadow}
              shadow-mapSize-width={512}
              shadow-mapSize-height={512}
            />
            <pointLight
              position={[0.15, 0.38, 0]}
              intensity={0.5}
              distance={1}
              color="#ffb066"
            />
          </>
        )}
        </group>

        {/* Hover tooltip */}
        {hovered && (
          <Html
            position={[0, 0.6, 0]}
            zIndexRange={[40, 0]}
            center
            distanceFactor={2}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            <div className="bg-black/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap backdrop-blur-sm border border-gray-700">
              {lightsOn ? '💡 Turn off the lights' : '💡 Turn on the lights'}
            </div>
          </Html>
        )}
      </group>
    </Select>
  );
}
