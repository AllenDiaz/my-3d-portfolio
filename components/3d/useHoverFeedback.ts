'use client';

import { useState, useCallback } from 'react';
import type { ThreeEvent } from '@react-three/fiber';

/**
 * Unified hover feedback for interactive 3D objects: tracks hover state,
 * manages the pointer cursor consistently, and plays the synth blips exposed
 * by AmbientSound (hover blip on pointer-over, click blip on pointer-down —
 * both respect the store's mute flag inside AmbientSound). Spread `hoverProps`
 * onto the object's root mesh/group; read `hovered` to drive emissive/scale
 * visuals.
 */
export function useHoverFeedback() {
  const [hovered, setHovered] = useState(false);

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
  }, []);

  return { hovered, hoverProps: { onPointerOver, onPointerOut, onPointerDown } };
}
