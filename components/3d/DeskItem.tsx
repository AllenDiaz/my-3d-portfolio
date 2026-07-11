'use client';

import { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';
import { Mesh } from 'three';
import * as THREE from 'three';
import { useHoverFeedback } from './useHoverFeedback';
import { useStore } from '@/store/useStore';
import { QUALITY_PRESETS } from '@/lib/deviceTier';

const KEY_COLS = 12;
const KEY_ROWS = 5;
const KEY_COUNT = KEY_COLS * KEY_ROWS;
const KEY_REST_Y = 0.02;
const RIPPLE_DURATION = 0.5;

/**
 * Keyboard key caps rendered as a single InstancedMesh (one draw call).
 * While hovered, a deterministic "ghost typist" dips 2–3 keys per beat; a
 * click sends a radial press-ripple across the deck. Both are pure CPU-side
 * matrix writes (≤60/frame) and only run while hovered/rippling.
 */
function KeyboardKeys({ hovered, pressToken }: { hovered: boolean; pressToken: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dipsRef = useRef(new Float32Array(KEY_COUNT));
  const rippleStartRef = useRef(-Infinity);
  const seenPressTokenRef = useRef(0);
  const settledRef = useRef(false);

  const layout = useMemo(() => {
    const startX = -0.209;
    const startZ = -0.07;
    const gapX = 0.038;
    const gapZ = 0.035;
    const keys: { x: number; z: number; dist: number }[] = [];
    for (let r = 0; r < KEY_ROWS; r++) {
      for (let c = 0; c < KEY_COLS; c++) {
        const x = startX + c * gapX;
        const z = startZ + r * gapZ;
        keys.push({ x, z, dist: Math.hypot(x, z) });
      }
    }
    return keys;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const writeMatrices = (mesh: THREE.InstancedMesh, dips: Float32Array) => {
    for (let i = 0; i < KEY_COUNT; i++) {
      dummy.position.set(layout[i].x, KEY_REST_Y - dips[i], layout[i].z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  };

  useEffect(() => {
    if (ref.current) writeMatrices(ref.current, dipsRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;

    if (pressToken !== seenPressTokenRef.current) {
      seenPressTokenRef.current = pressToken;
      rippleStartRef.current = t;
    }

    const rippleElapsed = t - rippleStartRef.current;
    const rippling = rippleElapsed >= 0 && rippleElapsed <= RIPPLE_DURATION;
    if (!hovered && !rippling) {
      // One final restore pass after activity ends, then skip entirely
      if (!settledRef.current) {
        dipsRef.current.fill(0);
        writeMatrices(mesh, dipsRef.current);
        settledRef.current = true;
      }
      return;
    }
    settledRef.current = false;

    // Deterministic ghost typing: each 120ms beat picks a few pseudo-random keys
    const beat = Math.floor(t / 0.12);
    const dips = dipsRef.current;
    const ease = Math.min(1, delta * 25);
    for (let i = 0; i < KEY_COUNT; i++) {
      let target = 0;
      if (hovered) {
        const pick = Math.abs(Math.sin(beat * 12.9898 + i * 78.233) * 43758.5453) % 1;
        if (pick > 0.95) target = 0.006;
      }
      if (rippling) {
        const wave = Math.sin(layout[i].dist * 30 - rippleElapsed * 20);
        if (wave > 0) {
          target = Math.max(target, wave * 0.008 * (1 - rippleElapsed / RIPPLE_DURATION));
        }
      }
      dips[i] += (target - dips[i]) * ease;
    }
    writeMatrices(mesh, dips);
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, KEY_COUNT]} castShadow>
      <boxGeometry args={[0.03, 0.012, 0.028]} />
      <meshStandardMaterial color="#0a0a0a" metalness={0.1} roughness={0.85} />
    </instancedMesh>
  );
}

interface DeskItemProps {
  position: [number, number, number];
  itemType: 'keyboard' | 'mouse' | 'notebook' | 'coffee' | 'phone' | 'badge' | 'certificate';
  onClick?: () => void;
  label?: string;
}

export default function DeskItem({ position, itemType, onClick, label }: DeskItemProps) {
  const itemRef = useRef<Mesh>(null);
  const { hovered, pulseRef, hoverProps } = useHoverFeedback();
  const qualityTier = useStore((state) => state.qualityTier);
  const physical = QUALITY_PRESETS[qualityTier].physicalMaterials;
  // Bumped on keyboard clicks to trigger the key-cap press ripple
  const [keyPressToken, setKeyPressToken] = useState(0);

  useFrame((state) => {
    if (itemRef.current && hovered) {
      itemRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.1;
      itemRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.01;
    }
  });

  const handleClick = () => {
    if (itemType === 'keyboard') setKeyPressToken((token) => token + 1);
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
            {/* Keys - instanced for a dense, detailed keyboard in one draw call */}
            <KeyboardKeys hovered={hovered} pressToken={keyPressToken} />
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
            {/* Cup — ceramic sheen on tiers with physical materials */}
            <mesh castShadow>
              <cylinderGeometry args={[0.04, 0.035, 0.08]} />
              {physical ? (
                <meshPhysicalMaterial
                  color={hovered ? "#ffffff" : "#e0e0e0"}
                  roughness={0.4}
                  sheen={0.5}
                  sheenColor="#fff4e0"
                  clearcoat={0.3}
                  clearcoatRoughness={0.25}
                />
              ) : (
                <meshStandardMaterial
                  color={hovered ? "#ffffff" : "#e0e0e0"}
                  roughness={0.3}
                />
              )}
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
              {physical ? (
                <meshPhysicalMaterial
                  color={hovered ? "#ffffff" : "#e0e0e0"}
                  roughness={0.4}
                  sheen={0.5}
                  sheenColor="#fff4e0"
                  clearcoat={0.3}
                  clearcoatRoughness={0.25}
                />
              ) : (
                <meshStandardMaterial
                  color={hovered ? "#ffffff" : "#e0e0e0"}
                  roughness={0.3}
                />
              )}
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

      case 'badge':
        return (
          <group>
            {/* ID Card Body */}
            <mesh castShadow>
              <boxGeometry args={[0.12, 0.01, 0.16]} />
              <meshStandardMaterial 
                color={hovered ? "#ffffff" : "#f0f0f0"}
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>
            {/* Blue Header Strip */}
            <mesh position={[0, 0.011, 0.05]} castShadow>
              <boxGeometry args={[0.11, 0.001, 0.04]} />
              <meshStandardMaterial 
                color={hovered ? "#3b82f6" : "#2563eb"}
                emissive={hovered ? "#3b82f6" : "#000000"}
                emissiveIntensity={hovered ? 0.3 : 0}
              />
            </mesh>
            {/* Photo Area */}
            <mesh position={[0, 0.011, 0]} castShadow>
              <boxGeometry args={[0.045, 0.001, 0.05]} />
              <meshStandardMaterial 
                color="#6b7280"
                roughness={0.8}
              />
            </mesh>
            {/* Lanyard Clip */}
            <mesh position={[0, 0.015, 0.08]} castShadow>
              <cylinderGeometry args={[0.008, 0.008, 0.008]} />
              <meshStandardMaterial 
                color="#9ca3af"
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
            {/* Glow effect when hovered */}
            {hovered && (
              <pointLight
                position={[0, 0.1, 0]}
                intensity={0.3}
                distance={0.5}
                color="#3b82f6"
              />
            )}
          </group>
        );

      case 'certificate':
        return (
          <group>
            {/* Certificate Frame */}
            <mesh castShadow>
              <boxGeometry args={[0.14, 0.01, 0.18]} />
              <meshStandardMaterial 
                color={hovered ? "#8b4513" : "#654321"}
                roughness={0.6}
                metalness={0.1}
              />
            </mesh>
            {/* Certificate Paper */}
            <mesh position={[0, 0.011, 0]} castShadow>
              <boxGeometry args={[0.12, 0.001, 0.16]} />
              <meshStandardMaterial 
                color={hovered ? "#fef3c7" : "#fde68a"}
                roughness={0.7}
                emissive={hovered ? "#fcd34d" : "#000000"}
                emissiveIntensity={hovered ? 0.2 : 0}
              />
            </mesh>
            {/* Gold Seal */}
            <mesh position={[0, 0.012, -0.05]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.002, 16]} />
              <meshStandardMaterial 
                color="#fbbf24"
                metalness={0.9}
                roughness={0.1}
                emissive={hovered ? "#fbbf24" : "#000000"}
                emissiveIntensity={hovered ? 0.4 : 0}
              />
            </mesh>
            {/* Ribbon Decoration */}
            <mesh position={[0, 0.012, -0.05]} castShadow>
              <cylinderGeometry args={[0.007, 0.007, 0.003, 8]} />
              <meshStandardMaterial 
                color="#dc2626"
                roughness={0.4}
              />
            </mesh>
            {/* Glow effect when hovered */}
            {hovered && (
              <pointLight
                position={[0, 0.1, 0]}
                intensity={0.4}
                distance={0.5}
                color="#fbbf24"
              />
            )}
          </group>
        );

      default:
        return null;
    }
  };

  return (
    <Select enabled={hovered}>
    <group
      ref={itemRef}
      position={position}
      onClick={handleClick}
      {...hoverProps}
    >
      {/* Inner group takes the click confirmation pulse (outer group already
          animates position/rotation on hover) */}
      <group ref={pulseRef}>{renderItem()}</group>

      {hovered && label && (
        <Html
          position={[0, 0.15, 0]}
          zIndexRange={[40, 0]}
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
    </Select>
  );
}
