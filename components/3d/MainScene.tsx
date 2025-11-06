'use client';

import OfficeRoom from './OfficeRoom';
import Computer from './Computer';
import DeskItem from './DeskItem';
import SceneSetup from './SceneSetup';

export default function MainScene() {
  return (
    <>
      {/* Scene Setup (Lights, Camera, Controls) */}
      <SceneSetup />

      {/* Office Environment */}
      <OfficeRoom />

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
    </>
  );
}
