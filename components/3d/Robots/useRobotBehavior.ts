'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { RobotConfig } from './robotConfig';

/**
 * Per-robot patrol/serve state machine.
 *
 *   idle ─dwell→ walking ─(serve timer)→ serving ─(bob done)→ returning ─→ idle
 *
 * - walking: linear-interpolates along the closed `waypoints` loop.
 * - serving: walks to `serveTarget` (near Allen's chair), pauses and bobs.
 * - returning: heads back to the current waypoint, then idles briefly.
 *
 * All machine state lives in refs, so the loop never triggers a React
 * re-render. The owning component calls `advance(delta, elapsed)` from its
 * useFrame; the hook mutates the group transform and the status-light material
 * imperatively (green = idle, amber = busy). On the low tier the component
 * passes `animated = false` and simply never calls `advance`.
 */

export type RobotPhase = 'idle' | 'walking' | 'serving' | 'returning';

export function useRobotBehavior(config: RobotConfig, animated: boolean) {
  const groupRef = useRef<THREE.Group>(null);
  const statusRef = useRef<THREE.Mesh>(null);

  const phase = useRef<RobotPhase>('idle');
  const pos = useRef(new THREE.Vector3(config.home[0], config.home[1], config.home[2]));
  const yaw = useRef(config.homeYaw);
  const wpIndex = useRef(0);
  const dwell = useRef(1);
  const bobT = useRef(0);
  const nextServeAt = useRef(-1); // lazily seeded on the first advance() call

  const temps = useMemo(
    () => ({ dir: new THREE.Vector3(), target: new THREE.Vector3() }),
    [],
  );

  // Seat the robot at its home transform before first paint (no origin flash).
  useLayoutEffect(() => {
    if (!animated || !groupRef.current) return;
    groupRef.current.position.copy(pos.current);
    groupRef.current.rotation.y = yaw.current;
  }, [animated, pos, yaw]);

  /** Move `pos` toward `dest` by at most `stepLen`; set facing. Returns arrived. */
  function stepToward(dest: THREE.Vector3, stepLen: number): boolean {
    const dir = temps.dir.subVectors(dest, pos.current);
    dir.y = 0;
    const dist = dir.length();
    if (dist > 1e-4) {
      yaw.current = Math.atan2(dir.x, dir.z); // face travel direction
      pos.current.addScaledVector(dir.normalize(), Math.min(stepLen, dist));
    }
    return dist <= stepLen + 1e-3;
  }

  function advance(delta: number, elapsed: number): void {
    const g = groupRef.current;
    if (!g) return;

    if (nextServeAt.current < 0) nextServeAt.current = elapsed + 10 + Math.random() * 10;

    const stepLen = config.speed * delta;
    const wps = config.waypoints;

    switch (phase.current) {
      case 'idle':
        dwell.current -= delta;
        if (dwell.current <= 0) phase.current = 'walking';
        break;

      case 'walking': {
        const wp = wps[wpIndex.current];
        temps.target.set(wp[0], 0, wp[2]);
        if (stepToward(temps.target, stepLen)) {
          wpIndex.current = (wpIndex.current + 1) % wps.length;
        }
        if (elapsed >= nextServeAt.current) {
          phase.current = 'serving';
          bobT.current = 0;
          nextServeAt.current = Number.POSITIVE_INFINITY;
        }
        break;
      }

      case 'serving': {
        temps.target.set(config.serveTarget[0], 0, config.serveTarget[2]);
        if (stepToward(temps.target, stepLen)) {
          bobT.current += delta; // arrived — pause and bob
          if (bobT.current > 2.5) phase.current = 'returning';
        }
        break;
      }

      case 'returning': {
        const wp = wps[wpIndex.current];
        temps.target.set(wp[0], 0, wp[2]);
        if (stepToward(temps.target, stepLen)) {
          phase.current = 'idle';
          dwell.current = 0.5 + Math.random() * 1.5;
          nextServeAt.current = elapsed + 12 + Math.random() * 12;
        }
        break;
      }
    }

    // Gentle bob only once the robot has reached the serve point.
    const bob = phase.current === 'serving' && bobT.current > 0
      ? Math.abs(Math.sin(bobT.current * 5)) * 0.05
      : 0;
    g.position.set(pos.current.x, pos.current.y + bob, pos.current.z);

    // Smoothly rotate toward the target facing (shortest angle).
    let dy = yaw.current - g.rotation.y;
    dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    g.rotation.y += dy * Math.min(1, delta * 6);

    // Status light: amber + faster pulse while busy, green + slower while idle.
    const busy = phase.current === 'serving' || phase.current === 'returning';
    const mat = statusRef.current?.material as THREE.MeshStandardMaterial | undefined;
    if (mat) {
      const color = busy ? '#fbbf24' : '#34d399';
      mat.color.set(color);
      mat.emissive.set(color);
      mat.emissiveIntensity = 0.6 + Math.sin(elapsed * (busy ? 6 : 3)) * 0.4;
    }
  }

  return { groupRef, statusRef, advance };
}
