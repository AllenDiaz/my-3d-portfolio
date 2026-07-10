'use client';

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';
import { useStore, REST_CAMERA_POSITION, REST_CAMERA_TARGET } from '@/store/useStore';

export default function CinematicCamera() {
  const { camera } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const hasAnimated = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const introPlaying = useStore((state) => state.introPlaying);
  const setIntroPlaying = useStore((state) => state.setIntroPlaying);

  // Respect users who prefer reduced motion: skip the fly-in entirely.
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!cameraRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    const cam = cameraRef.current;

    // Reduced motion: snap straight to the resting position, no GSAP fly-in.
    if (prefersReducedMotion) {
      cam.position.set(...REST_CAMERA_POSITION);
      cam.lookAt(...REST_CAMERA_TARGET);
      return;
    }

    // 3-beat cinematic reveal with a parallax arc (left establish -> arc right -> settle)
    setIntroPlaying(true);
    const timeline = gsap.timeline({
      onComplete: () => setIntroPlaying(false),
    });
    timelineRef.current = timeline;

    cam.position.set(-4, 4.5, 9);
    cam.lookAt(0, 1.2, -1);

    timeline
      // Beat 1 - establish
      .to(cam.position, { x: -2.5, y: 2.2, z: 6, duration: 1.8, ease: 'power2.out' })
      // Beat 2 - approach, arcing across to the right
      .to(cam.position, { x: 1.5, y: 1.7, z: 4.4, duration: 2.0, ease: 'power3.inOut' })
      // Beat 3 - settle on the workstation
      .to(cam.position, { x: 0, y: 1.45, z: 3.6, duration: 1.2, ease: 'power2.out' })
      // Subtle FOV "punch" on settle instead of a positional shake
      .to(cam, {
        fov: 48,
        duration: 0.5,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1,
        onUpdate: () => cam.updateProjectionMatrix(),
      }, '-=0.2');

    return () => {
      timeline.kill();
      timelineRef.current = null;
      hasAnimated.current = false;
      setIntroPlaying(false);
    };
  }, [prefersReducedMotion, setIntroPlaying]);

  // "Skip intro": when the flag is cleared while the timeline is still
  // flying, kill it and snap to the resting shot.
  useEffect(() => {
    const cam = cameraRef.current;
    const timeline = timelineRef.current;
    if (introPlaying || !cam || !timeline?.isActive()) return;

    timeline.kill();
    timelineRef.current = null;
    cam.position.set(...REST_CAMERA_POSITION);
    cam.lookAt(...REST_CAMERA_TARGET);
    cam.fov = 50;
    cam.updateProjectionMatrix();
  }, [introPlaying]);

  // Subtle camera breathing effect (disabled under reduced motion)
  useFrame((state) => {
    if (!cameraRef.current || !hasAnimated.current || prefersReducedMotion) return;

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
