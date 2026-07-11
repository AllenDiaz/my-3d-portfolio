'use client';

import { useState, useCallback, useRef } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import type { Object3D } from 'three';
import gsap from 'gsap';

/**
 * Unified hover feedback for interactive 3D objects: tracks hover state,
 * manages the pointer cursor consistently, and plays the synth blips exposed
 * by AmbientSound (hover blip on pointer-over, click blip on pointer-down —
 * both respect the store's mute flag inside AmbientSound). Spread `hoverProps`
 * onto the object's root mesh/group; read `hovered` to drive emissive/scale
 * visuals.
 *
 * Optionally attach the returned `pulseRef` to the object's root group to get
 * a quick confirmation scale-pulse on pointer-down (backward compatible —
 * components that don't attach it behave as before).
 */
export function useHoverFeedback() {
  const [hovered, setHovered] = useState(false);
  const pulseRef = useRef<Object3D>(null);

  const onPointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
    window.playHoverSound?.();
  }, []);

  const onPointerOut = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
  }, []);

  const onPointerDown = useCallback(() => {
    window.playClickSound?.();
    const target = pulseRef.current;
    if (target) {
      gsap.fromTo(
        target.scale,
        { x: 1, y: 1, z: 1 },
        { x: 1.05, y: 1.05, z: 1.05, duration: 0.09, yoyo: true, repeat: 1, ease: 'power2.out', overwrite: true }
      );
    }
  }, []);

  return { hovered, pulseRef, hoverProps: { onPointerOver, onPointerOut, onPointerDown } };
}
