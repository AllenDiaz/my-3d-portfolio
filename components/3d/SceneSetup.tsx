'use client';

import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

export default function SceneSetup() {
  const { camera } = useThree();

  useEffect(() => {
    // Set initial camera position
    camera.position.set(0, 1.5, 5);
  }, [camera]);

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 1.5, 5]} fov={50} />

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={15}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        target={[0, 1, 0]}
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
      />

      {/* Lighting */}
      {/* Ambient Light */}
      <ambientLight intensity={0.3} />

      {/* Main Directional Light */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill Light */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
      />

      {/* Desk Light */}
      <pointLight
        position={[0, 2, -2]}
        intensity={0.6}
        distance={5}
        color="#ffd89b"
        castShadow
      />

      {/* Accent Lights */}
      <pointLight
        position={[-4, 2, -4]}
        intensity={0.3}
        distance={3}
        color="#4a90e2"
      />

      <pointLight
        position={[4, 2, -3]}
        intensity={0.3}
        distance={3}
        color="#9b59b6"
      />

      {/* Ceiling Light */}
      <spotLight
        position={[0, 5.5, 0]}
        angle={Math.PI / 3}
        penumbra={0.5}
        intensity={0.4}
        castShadow
        color="#ffffff"
      />

      {/* Environment Map for Reflections */}
      <Environment preset="city" />
    </>
  );
}
