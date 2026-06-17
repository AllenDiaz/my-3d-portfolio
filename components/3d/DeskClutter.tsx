'use client';

/**
 * Small non-interactive desk decor that reinforces the developer narrative:
 * a cluster of sticky notes (an active task list) and a USB hub with LED dots.
 * Pure procedural geometry, no store interaction.
 */

const NOTE_COLORS = ['#fde047', '#fca5a5', '#86efac'] as const;

function StickyNotes({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0.15]}>
      {NOTE_COLORS.map((color, i) => (
        <mesh
          key={color}
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
  return (
    <group position={position}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[0.14, 0.025, 0.06]} />
        <meshStandardMaterial color="#101010" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* LED indicator dots */}
      {[-0.04, -0.015].map((x) => (
        <mesh key={x} position={[x, 0.014, 0.02]}>
          <cylinderGeometry args={[0.004, 0.004, 0.002, 12]} />
          <meshStandardMaterial color="#22d3a0" emissive="#22d3a0" emissiveIntensity={2} />
        </mesh>
      ))}
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
