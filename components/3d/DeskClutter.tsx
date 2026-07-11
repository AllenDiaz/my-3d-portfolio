'use client';

/**
 * Small non-interactive desk decor that reinforces the developer narrative:
 * a cluster of sticky notes (an active task list) and a USB hub with LED dots.
 * Pure procedural geometry, no store interaction. The micro-motion here (LED
 * blink patterns, top-note flutter) is a handful of sin() evals per frame —
 * cheap enough to run on every tier.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NOTE_COLORS = ['#fde047', '#fca5a5', '#86efac'] as const;

function StickyNotes({ position }: { position: [number, number, number] }) {
  const topNoteRef = useRef<THREE.Mesh>(null);

  // The top note flutters as if caught by a draft; the notes lie flat (the
  // group is rotated -π/2 on X), so local z is world-up and rotation.z spins
  // in the desk plane.
  useFrame((state) => {
    const note = topNoteRef.current;
    if (!note) return;
    const t = state.clock.elapsedTime;
    note.rotation.z = 0.12 + Math.sin(t * 1.7) * 0.02;
    note.position.z = 0.002 + (Math.sin(t * 2.3) + 1) * 0.002;
  });

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0.15]}>
      {NOTE_COLORS.map((color, i) => (
        <mesh
          key={color}
          ref={i === NOTE_COLORS.length - 1 ? topNoteRef : undefined}
          position={[i * 0.015, i * 0.012, i * 0.001]}
          rotation={[0, 0, (i - 1) * 0.12]}
          castShadow
        >
          <boxGeometry args={[0.11, 0.11, 0.003]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function UsbHub({ position }: { position: [number, number, number] }) {
  const powerLedRef = useRef<THREE.MeshStandardMaterial>(null);
  const dataLedRef = useRef<THREE.MeshStandardMaterial>(null);

  // Power LED: slow heartbeat double-blink. Data LED: erratic transfer
  // flicker. Both just modulate emissiveIntensity — no allocations.
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (powerLedRef.current) {
      const phase = (t % 2.4) / 2.4;
      const beat = (phase < 0.06 || (phase > 0.14 && phase < 0.2)) ? 2.6 : 1.2;
      powerLedRef.current.emissiveIntensity = beat;
    }
    if (dataLedRef.current) {
      const busy = Math.sin(t * 7.3) * Math.sin(t * 3.1) > 0.15;
      dataLedRef.current.emissiveIntensity = busy ? 2.4 : 0.6;
    }
  });

  return (
    <group position={position}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[0.14, 0.025, 0.06]} />
        <meshStandardMaterial color="#101010" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* LED indicator dots — power (steady heartbeat) + data (activity) */}
      <mesh position={[-0.04, 0.014, 0.02]}>
        <cylinderGeometry args={[0.004, 0.004, 0.002, 12]} />
        <meshStandardMaterial ref={powerLedRef} color="#22d3a0" emissive="#22d3a0" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-0.015, 0.014, 0.02]}>
        <cylinderGeometry args={[0.004, 0.004, 0.002, 12]} />
        <meshStandardMaterial ref={dataLedRef} color="#22d3a0" emissive="#22d3a0" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

export default function DeskClutter() {
  return (
    <group>
      {/* Sticky-note cluster to the right of the desk */}
      <StickyNotes position={[1.15, 0.78, -1.6]} />
      {/* USB hub to the left */}
      <UsbHub position={[-1.0, 0.79, -1.45]} />
    </group>
  );
}
