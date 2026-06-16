'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Mesh, CanvasTexture } from 'three';
import { useStore } from '@/store/useStore';
import { QUALITY_PRESETS } from '@/lib/deviceTier';

interface ComputerProps {
  position: [number, number, number];
  projectId: string;
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

export default function Computer({ position, projectId }: ComputerProps) {
  const monitorRef = useRef<Mesh>(null);
  const screenRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { setActiveProject, setShowProjectPanel, getProjectById, qualityTier } = useStore();
  const physical = QUALITY_PRESETS[qualityTier].physicalMaterials;
  
  // Get the actual project data
  const project = useMemo(() => getProjectById(projectId), [projectId, getProjectById]);

  // Create dynamic screen texture with project info
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

  // Subtle floating animation
  useFrame((state) => {
    if (monitorRef.current && hovered) {
      monitorRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
    
    // Animate screen texture
    if (screenRef.current && screenTexture) {
      const material = screenRef.current.material as any;
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = hovered ? 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.1 : 0.3;
      }
    }
  });

  const handleClick = () => {
    if (project) {
      setActiveProject(project);
      setShowProjectPanel(true);
    }
  };

  return (
    <group position={position}>
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
        ref={monitorRef}
        position={[0, 0.3, 0]}
        castShadow
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.7, 0.45, 0.05]} />
        <ChromeMaterial physical={physical} color={hovered ? "#1a1a1a" : "#0a0a0a"} />
      </mesh>

      {/* Monitor Screen */}
      <mesh 
        ref={screenRef}
        position={[0, 0.3, 0.026]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[0.62, 0.37]} />
        <meshStandardMaterial 
          map={screenTexture}
          emissive="#4a90e2"
          emissiveMap={screenTexture}
          emissiveIntensity={hovered ? 0.6 : 0.3}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Hover Text */}
      {hovered && project && (
        <Html
          position={[0, 0.6, 0]}
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
  );
}
