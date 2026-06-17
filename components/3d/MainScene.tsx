'use client';

import { useMemo } from 'react';
import OfficeRoom from './OfficeRoom';
import Computer from './Computer';
import DeskItem from './DeskItem';
import DeskTablet from './DeskTablet';
import SceneSetup from './SceneSetup';
import BinaryWall from './BinaryWall';
import PostProcessing from './PostProcessing';
import FloatingParticles from './FloatingParticles';
import AmbientSound from './AmbientSound';
import HolographicDisplay from './HolographicDisplay';
import { useStore } from '@/store/useStore';
import { QUALITY_PRESETS } from '@/lib/deviceTier';

export default function MainScene() {
  const lightsOn = useStore((state) => state.lightsOn);
  const qualityTier = useStore((state) => state.qualityTier);

  // Device tier is detected in Scene3D and stored globally; read the preset here
  const preset = QUALITY_PRESETS[qualityTier];
  const setShowCVModal = useStore((state) => state.setShowCVModal);
  const setShowCoffeeNotification = useStore((state) => state.setShowCoffeeNotification);
  const setShowSkillsModal = useStore((state) => state.setShowSkillsModal);
  const setShowExperienceModal = useStore((state) => state.setShowExperienceModal);
  const setShowCertificateModal = useStore((state) => state.setShowCertificateModal);
  const setShowContactModal = useStore((state) => state.setShowContactModal);
  const featuredProjects = useStore((state) => state.featuredProjects);
  
  // Get first 3 featured projects for monitors
  const monitorProjects = useMemo(() => {
    return featuredProjects().slice(0, 3);
  }, [featuredProjects]);
  
  return (
    <>
      {/* Ambient Sound System */}
      <AmbientSound enabled={true} />
      
      {/* Scene Setup (Lights, Camera, Controls) */}
      <SceneSetup enableCinematicIntro={true} />

      {/* Binary Wall - Intermittent surreal effect */}
      {/* NO BACK WALL - Creates eerie absence behind desk/chair */}
      
      {/* Left Wall - Flickering binary */}
      <BinaryWall position={[-9.95, 3, 0]} rotation={[0, Math.PI / 2, 0]} width={20} height={6} />
      
      {/* Right Wall - Flickering binary */}
      <BinaryWall position={[9.95, 3, 0]} rotation={[0, -Math.PI / 2, 0]} width={20} height={6} />
      
      {/* Front Wall - Flickering binary */}
      <BinaryWall position={[0, 3, 10]} rotation={[0, Math.PI, 0]} width={20} height={6} />

      {/* Office Environment */}
      <OfficeRoom />

      {/* Atmospheric Particles - count scales with device tier */}
      <FloatingParticles count={preset.particleCount} />

      {/* Holographic Display */}
      <HolographicDisplay position={[0, 2, -4.5]} />

      {/* Interactive Computers/Monitors - Featured Projects Only */}
      {monitorProjects.length >= 1 && (
        <Computer position={[-0.5, 0.8, -1.9]} projectId={monitorProjects[0].id} />
      )}
      {monitorProjects.length >= 2 && (
        <Computer position={[0.5, 0.8, -1.9]} projectId={monitorProjects[1].id} />
      )}
      {monitorProjects.length >= 3 && (
        <Computer position={[4, 0.65, -3]} projectId={monitorProjects[2].id} />
      )}

      {/* Desk Items */}
      <DeskItem 
        position={[-0.8, 0.82, -1.5]} 
        itemType="keyboard" 
        label="Skills & Technologies"
        onClick={() => setShowSkillsModal(true)}
      />
      
      <DeskItem 
        position={[-0.3, 0.82, -1.5]} 
        itemType="mouse" 
        label="Navigate"
      />
      
      {/* Interactive Desk Tablet - Navigate to Projects Page */}
      <DeskTablet position={[0.3, 0.82, -1.25]} />
      
      <DeskItem 
        position={[0.9, 0.82, -1.3]} 
        itemType="notebook" 
        label="Resume & Bio"
        onClick={() => setShowCVModal(true)}
      />
      
      <DeskItem 
        position={[1.1, 0.82, -1.8]} 
        itemType="coffee" 
        label="Coffee break!"
        onClick={() => setShowCoffeeNotification(true)}
      />
      
      <DeskItem
        position={[-1.1, 0.82, -1.7]}
        itemType="phone"
        label="Contact Me"
        onClick={() => setShowContactModal(true)}
      />
      
      <DeskItem 
        position={[1.3, 0.82, -1.7]} 
        itemType="badge" 
        label="Work Experience"
        onClick={() => setShowExperienceModal(true)}
      />
      
      <DeskItem 
        position={[-1.3, 0.82, -1.3]} 
        itemType="certificate" 
        label="Certifications"
        onClick={() => setShowCertificateModal(true)}
      />

      {/* Post-Processing Effects */}
      <PostProcessing />
    </>
  );
}
