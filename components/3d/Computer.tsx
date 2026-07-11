'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';
import { Mesh, CanvasTexture, Group } from 'three';
import { useStore } from '@/store/useStore';
import { QUALITY_PRESETS } from '@/lib/deviceTier';
import { useHoverFeedback } from './useHoverFeedback';
import { createTerminalPainter } from './LiveCodeScreen';
import type { FocusId } from './cameraPoses';

interface ComputerProps {
  position: [number, number, number];
  projectId: string;
  rotation?: [number, number, number];
  /** When set, clicking flies the camera to this pose before the panel opens. */
  focusId?: FocusId;
  /** Hero monitor: screen runs a live typing terminal (tier-gated by screenAnimationHz). */
  live?: boolean;
}

/**
 * Polished chrome material for the monitor body. Uses meshPhysicalMaterial (clearcoat)
 * on capable tiers for believable lacquer/glass; falls back to meshStandardMaterial on low.
 */
function ChromeMaterial({ physical, color }: { physical: boolean; color: string }) {
  if (physical) {
    return (
      <meshPhysicalMaterial
        color={color}
        metalness={0.9}
        roughness={0.08}
        clearcoat={1}
        clearcoatRoughness={0.1}
        envMapIntensity={1.5}
      />
    );
  }
  return (
    <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} envMapIntensity={1.5} />
  );
}

export default function Computer({ position, projectId, rotation = [0, 0, 0], focusId, live = false }: ComputerProps) {
  const groupRef = useRef<Group>(null);
  const screenRef = useRef<Mesh>(null);
  const { hovered, pulseRef, hoverProps } = useHoverFeedback();
  const { setActiveProject, setShowProjectPanel, getProjectById, qualityTier, requestCameraFocus } = useStore();
  const physical = QUALITY_PRESETS[qualityTier].physicalMaterials;
  const liveHz = QUALITY_PRESETS[qualityTier].screenAnimationHz;

  // Get the actual project data
  const project = useMemo(() => getProjectById(projectId), [projectId, getProjectById]);

  const isLive = live && liveHz > 0 && !!project;

  // Live terminal screen: a redrawable canvas texture repainted at liveHz in
  // useFrame below (texture *upload* happens only on repaint frames)
  const liveScreen = useMemo(() => {
    if (!isLive || !project) return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const paint = createTerminalPainter(project);
    paint(ctx, 0);
    const texture = new CanvasTexture(canvas);
    texture.needsUpdate = true;
    return { texture, ctx, paint };
  }, [isLive, project]);
  // Ref alias for the frame loop (mutating hook-returned values directly is
  // disallowed by the react-hooks lint rules)
  const liveScreenRef = useRef(liveScreen);
  useEffect(() => {
    liveScreenRef.current = liveScreen;
  }, [liveScreen]);
  const repaintAccum = useRef(0);

  // Create dynamic screen texture with project info (static monitors)
  const screenTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    
    if (ctx && project) {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a1929');
      gradient.addColorStop(1, '#1a3a52');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Grid pattern
      ctx.strokeStyle = '#4a90e220';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
      
      // Featured badge
      if (project.featured) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('★ FEATURED', 20, 30);
      }
      
      // Project title - wrap if too long
      ctx.fillStyle = '#4a90e2';
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      const title = project.title;
      const maxWidth = canvas.width - 40;
      const words = title.split(' ');
      let line = '';
      let y = canvas.height / 2 - 30;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, canvas.width / 2, y);
          line = words[i] + ' ';
          y += 28;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, y);
      
      // Click prompt
      ctx.font = '14px monospace';
      ctx.fillStyle = '#6ab0f3';
      ctx.fillText('Click to view details', canvas.width / 2, canvas.height - 40);
      
      // Category badges
      ctx.font = '12px monospace';
      ctx.fillStyle = '#8b5cf6';
      ctx.textAlign = 'center';
      const categoriesText = project.categories.map(c => c.toUpperCase()).join(' | ');
      ctx.fillText(categoriesText, canvas.width / 2, canvas.height - 20);
      
      // Decorative elements
      ctx.fillStyle = '#4a90e240';
      ctx.fillRect(20, canvas.height - 60, 60, 3);
      ctx.fillRect(canvas.width - 80, canvas.height - 60, 60, 3);
    }
    
    const texture = new CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [projectId, project]);

  // Subtle floating animation - move the whole monitor together so its parts
  // stay aligned (previously only the frame mesh moved, detaching it on hover)
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + (hovered ? Math.sin(state.clock.elapsedTime * 2) * 0.02 : 0);
    }

    // Animate screen texture
    if (screenRef.current) {
      const material = screenRef.current.material as any;
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = hovered ? 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.1 : 0.3;
      }
    }

    // Repaint the live terminal at the tier's Hz (not every frame)
    const screen = liveScreenRef.current;
    if (screen) {
      repaintAccum.current += delta;
      const interval = 1 / liveHz;
      if (repaintAccum.current >= interval) {
        repaintAccum.current %= interval;
        screen.paint(screen.ctx, state.clock.elapsedTime);
        screen.texture.needsUpdate = true;
      }
    }
  });

  const handleClick = () => {
    if (!project) return;
    const openPanel = () => {
      setActiveProject(project);
      setShowProjectPanel(true);
    };
    if (focusId) {
      requestCameraFocus(focusId, openPanel);
    } else {
      openPanel();
    }
  };

  return (
    <Select enabled={hovered}>
    <group ref={groupRef} position={position} rotation={rotation}>
    {/* Inner group takes the click confirmation pulse (outer bobs on hover) */}
    <group ref={pulseRef}>
      {/* Monitor Base */}
      <mesh position={[0, -0.05, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.02, 48]} />
        <ChromeMaterial physical={physical} color="#0a0a0a" />
      </mesh>

      {/* Monitor Stand */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 32]} />
        <ChromeMaterial physical={physical} color="#0a0a0a" />
      </mesh>

      {/* Monitor Frame */}
      <mesh
        position={[0, 0.3, 0]}
        castShadow
        onClick={handleClick}
        {...hoverProps}
      >
        <boxGeometry args={[0.7, 0.45, 0.05]} />
        <ChromeMaterial physical={physical} color={hovered ? "#1a1a1a" : "#0a0a0a"} />
      </mesh>

      {/* Raised bezel bars framing the screen for depth */}
      <mesh position={[0, 0.5, 0.027]} castShadow>
        <boxGeometry args={[0.7, 0.04, 0.02]} />
        <ChromeMaterial physical={physical} color="#141414" />
      </mesh>
      <mesh position={[0, 0.1, 0.027]} castShadow>
        <boxGeometry args={[0.7, 0.04, 0.02]} />
        <ChromeMaterial physical={physical} color="#141414" />
      </mesh>
      <mesh position={[-0.33, 0.3, 0.027]} castShadow>
        <boxGeometry args={[0.04, 0.45, 0.02]} />
        <ChromeMaterial physical={physical} color="#141414" />
      </mesh>
      <mesh position={[0.33, 0.3, 0.027]} castShadow>
        <boxGeometry args={[0.04, 0.45, 0.02]} />
        <ChromeMaterial physical={physical} color="#141414" />
      </mesh>

      {/* Monitor Screen */}
      <mesh
        ref={screenRef}
        position={[0, 0.3, 0.026]}
        onClick={handleClick}
        {...hoverProps}
      >
        <planeGeometry args={[0.62, 0.37]} />
        <meshStandardMaterial
          map={liveScreen?.texture ?? screenTexture}
          emissive={isLive ? '#22d3a0' : '#4a90e2'}
          emissiveMap={liveScreen?.texture ?? screenTexture}
          emissiveIntensity={hovered ? 0.6 : 0.3}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Glass sheen over the screen (clearcoat, no transmission - cheap for 3 monitors) */}
      {physical && (
        <mesh position={[0, 0.3, 0.028]}>
          <planeGeometry args={[0.62, 0.37]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.1}
            roughness={0.06}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.08}
            envMapIntensity={1.8}
          />
        </mesh>
      )}

      {/* Hover Text */}
      {hovered && project && (
        <Html
          position={[0, 0.6, 0]}
          zIndexRange={[40, 0]}
          center
          distanceFactor={1.5}
          style={{
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm border border-gray-700">
            {project.featured && <span className="text-yellow-400 mr-2">★</span>}
            {project.title}
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
    </group>
    </Select>
  );
}
