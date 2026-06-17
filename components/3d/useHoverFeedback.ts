'use client';

import { useState, useCallback } from 'react';
import type { ThreeEvent } from '@react-three/fiber';

/**
 * Unified hover feedback for interactive 3D objects: tracks hover state and
 * manages the pointer cursor consistently (every clickable object should show a
 * pointer cursor and stop event propagation). Spread `hoverProps` onto the
 * object's root mesh/group; read `hovered` to drive emissive/scale visuals.
 */
export function useHoverFeedback() {
  const [hovered, setHovered] = useState(false);

  const onPointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const onPointerOut = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
  }, []);

  return { hovered, hoverProps: { onPointerOver, onPointerOut } };
}
