'use client';

import OfficeRoom from './OfficeRoom';
import Computer from './Computer';
import DeskItem from './DeskItem';
import DeskLamp from './DeskLamp';
import SceneSetup from './SceneSetup';
import BinaryWall from './BinaryWall';
import PostProcessing from './PostProcessing';
import FloatingParticles from './FloatingParticles';
import AmbientSound from './AmbientSound';
import HolographicDisplay from './HolographicDisplay';
import AnimatedCharacter from './AnimatedCharacter';
import { useStore } from '@/store/useStore';

export default function MainScene() {
  const lightsOn = useStore((state) => state.lightsOn);
  const showCharacter = useStore((state) => state.showCharacter);
  
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

      {/* Animated Character - appears when chair is clicked */}
      {showCharacter && (
        <AnimatedCharacter 
          position={[0, 0.55, 1]} 
          scale={1}
          visible={showCharacter}
        />
      )}

      {/* Atmospheric Particles */}
      <FloatingParticles count={300} />

      {/* Holographic Display */}
      <HolographicDisplay position={[0, 2, -4.5]} />

      {/* Interactive Computers/Monitors */}
      <Computer position={[-0.5, 0.8, -1.9]} projectId="1" />
      <Computer position={[0.5, 0.8, -1.9]} projectId="2" />
      
      {/* A third monitor on the side table */}
      <Computer position={[4, 0.65, -3]} projectId="3" />

      {/* Desk Items */}
      <DeskItem 
        position={[-0.8, 0.82, -1.5]} 
        itemType="keyboard" 
        label="Skills & Technologies"
      />
      
      <DeskItem 
        position={[-0.3, 0.82, -1.5]} 
        itemType="mouse" 
        label="Navigate"
      />
      
      <DeskItem 
        position={[0.9, 0.82, -1.3]} 
        itemType="notebook" 
        label="Resume & Bio"
      />
      
      <DeskItem 
        position={[1.1, 0.82, -1.8]} 
        itemType="coffee" 
        label="Coffee break!"
      />
      
      <DeskItem 
        position={[-1.1, 0.82, -1.7]} 
        itemType="phone" 
        label="Contact Me"
      />

      {/* Interactive Desk Lamp */}
      <DeskLamp position={[1.2, 0.82, -1.5]} />

      {/* Post-Processing Effects */}
      <PostProcessing />
    </>
  );
}
