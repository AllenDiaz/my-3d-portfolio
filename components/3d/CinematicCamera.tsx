'use client';

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';

export default function CinematicCamera() {
  const { camera } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!cameraRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    // Cinematic intro animation
    const timeline = gsap.timeline({
      defaults: { duration: 2.5, ease: 'power2.inOut' }
    });

    // Start from far away and high up
    cameraRef.current.position.set(0, 8, 15);
    cameraRef.current.lookAt(0, 2, 0);

    timeline
      // Zoom in and lower
      .to(cameraRef.current.position, {
        x: 0,
        y: 3,
        z: 8,
        duration: 3,
        ease: 'power3.inOut'
      })
      // Final position with slight rotation
      .to(cameraRef.current.position, {
        x: 0,
        y: 1.5,
        z: 5,
        duration: 2,
        ease: 'power2.out'
      })
      // Add a slight camera shake at the end for impact
      .to(cameraRef.current.position, {
        x: '+=0.05',
        y: '+=0.05',
        duration: 0.1,
        yoyo: true,
        repeat: 3
      });

  }, []);

  // Subtle camera breathing effect
  useFrame((state) => {
    if (!cameraRef.current || !hasAnimated.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Very subtle breathing motion
    cameraRef.current.position.y += Math.sin(time * 0.5) * 0.001;
    cameraRef.current.position.x += Math.cos(time * 0.3) * 0.0005;
  });

  return (
    <PerspectiveCamera 
      ref={cameraRef}
      makeDefault 
      position={[0, 8, 15]} 
      fov={50}
      near={0.1}
      far={100}
    />
  );
}
