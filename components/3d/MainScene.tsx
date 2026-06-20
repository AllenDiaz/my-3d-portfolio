'use client';

import { useMemo } from 'react';
import OfficeRoom from './OfficeRoom';
import Computer from './Computer';
import DeskItem from './DeskItem';
import DeskTablet from './DeskTablet';
import DeskClutter from './DeskClutter';
import SceneSetup from './SceneSetup';
import BinaryWall from './BinaryWall';
import PostProcessing from './PostProcessing';
import FloatingParticles from './FloatingParticles';
import AmbientSound from './AmbientSound';
import HolographicDisplay from './HolographicDisplay';
import CityscapeBackdrop from './CityscapeBackdrop';
import Avatar from './Avatar/Avatar';
import NameTagBillboard from './Avatar/NameTagBillboard';
import ThoughtBubble from './Avatar/ThoughtBubble';
import CoffeeSteam from './Avatar/CoffeeSteam';
import RobotFleet from './Robots/RobotFleet';
import PatrolDebugOverlay from './Robots/PatrolDebugOverlay';
import { Selection } from '@react-three/postprocessing';
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
    <Selection>
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

      {/* Night-city skyline visible through the back-wall window */}
      <CityscapeBackdrop />

      {/* Office Environment */}
      <OfficeRoom />

      {/* Atmospheric Particles - count scales with device tier */}
      <FloatingParticles count={preset.particleCount} />

      {/* Holographic Display */}
      {/* Moved off-centre so it doesn't float inside the window opening */}
      <HolographicDisplay position={[3.4, 1.5, -4.6]} />

      {/* Interactive Computers/Monitors - unified triple array on the desk plane,
          hero project centred, flanking monitors angled inward toward the viewer */}
      {monitorProjects.length >= 1 && (
        <Computer position={[0, 0.8, -2.0]} projectId={monitorProjects[0].id} />
      )}
      {monitorProjects.length >= 2 && (
        <Computer position={[-0.8, 0.8, -1.92]} rotation={[0, 0.18, 0]} projectId={monitorProjects[1].id} />
      )}
      {monitorProjects.length >= 3 && (
        <Computer position={[0.8, 0.8, -1.92]} rotation={[0, -0.18, 0]} projectId={monitorProjects[2].id} />
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

      {/* Rising steam above the coffee mug — tier-gated by steamParticles */}
      <CoffeeSteam position={[1.1, 0.95, -1.8]} count={preset.steamParticles} enabled={preset.steamParticles > 0} />
      
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

      {/* Procedural avatar of the owner — standing to the LEFT side of the chair
          (chair is at x = -2.5, z = -1.5), turned to face the desk/monitors while
          he contemplates his next agent (see ThoughtBubble below).
          rotationY is negative so his front (-z) swings toward +x/-z (the desk). */}
      <Avatar pose="standing" position={[-3.55, 0, -1.5]} rotationY={-1.4} />

      {/* Allen's thought bubble — placed so its trail bubbles descend onto his
          head (head top ≈ [-3.55, 1.85, -1.5] at his standing position). */}
      <ThoughtBubble position={[-3.1, 2.8, -1.4]} />

      {/* Holographic ID badge floating above the desk */}
      <NameTagBillboard position={[0, 2.2, -2.4]} />

      {/* Ambient service robots */}
      <RobotFleet />

      {/* Dev-only patrol-path overlay (renders only with ?debug=robots) */}
      <PatrolDebugOverlay />

      {/* Non-interactive desk decor (sticky notes, USB hub) */}
      <DeskClutter />

      {/* Post-Processing Effects */}
      <PostProcessing />
    </Selection>
  );
}
