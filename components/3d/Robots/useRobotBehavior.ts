'use client';

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { SERVICE_DURATION, SERVICE_LIFT, SERVICE_SPOT, type RobotConfig } from './robotConfig';
import { useStore } from '@/store/useStore';

/**
 * Per-robot patrol + tune-up state machine.
 *
 *   idle ─dwell→ walking ─(tune-up timer & lock free)→ toService
 *        toService ─arrive→ beingServiced ─(Allen finishes)→ returning ─→ idle
 *
 * - walking: linear-interpolates along the closed `waypoints` loop.
 * - toService: the agent walks to SERVICE_SPOT in front of Allen.
 * - beingServiced: it floats up to Allen's hands, spins and glows while he
 *   "fixes/upgrades" it (gated by the shared servicingRobotId lock so only one
 *   agent is serviced at a time), then leaves a little better (upgrades++).
 *
 * All machine state lives in refs, so the loop never triggers a React
 * re-render. The owning component calls `advance(delta, elapsed)` from its
 * useFrame; the hook mutates the group transform and the status-light material
 * imperatively.
 */

export type RobotPhase = 'idle' | 'walking' | 'toService' | 'beingServiced' | 'returning';

export function useRobotBehavior(config: RobotConfig, animated: boolean) {
  const groupRef = useRef<THREE.Group>(null);
  const statusRef = useRef<THREE.Mesh>(null);

  const phase = useRef<RobotPhase>('idle');
  const pos = useRef(new THREE.Vector3(config.home[0], config.home[1], config.home[2]));
  const yaw = useRef(config.homeYaw);
  const wpIndex = useRef(0);
  const dwell = useRef(1);
  const lift = useRef(0); // eased vertical lift while being serviced
  const serviceT = useRef(0);
  const upgrades = useRef(0); // how many tune-ups this agent has received
  const nextServiceAt = useRef(-1); // lazily seeded on the first advance() call

  const temps = useMemo(
    () => ({ dir: new THREE.Vector3(), target: new THREE.Vector3() }),
    [],
  );

  // Per-robot phase offset so hover/scan don't move in lockstep across the fleet.
  const seed = useMemo(() => config.home[0] * 1.7 + config.home[2] * 0.9, [config]);

  // Seat the robot at its home transform before first paint (no origin flash).
  useLayoutEffect(() => {
    if (!animated || !groupRef.current) return;
    groupRef.current.position.copy(pos.current);
    groupRef.current.rotation.y = yaw.current;
  }, [animated, pos, yaw]);

  // Release the service lock if this robot unmounts mid-tune-up (e.g. tier change),
  // so Allen doesn't get stuck working on nothing.
  useEffect(
    () => () => {
      if (useStore.getState().servicingRobotId === config.id) {
        useStore.getState().setServicingRobotId(null);
      }
    },
    [config.id],
  );

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

    if (nextServiceAt.current < 0) {
      nextServiceAt.current = elapsed + 8 + Math.random() * 12;
    }

    const store = useStore.getState();
    const stepLen = config.speed * delta;
    const wps = config.waypoints;

    switch (phase.current) {
      case 'idle':
        dwell.current -= delta;
        yaw.current += delta * 0.7; // slow in-place scan while waiting
        if (dwell.current <= 0) phase.current = 'walking';
        break;

      case 'walking': {
        const wp = wps[wpIndex.current];
        temps.target.set(wp[0], 0, wp[2]);
        if (stepToward(temps.target, stepLen)) {
          wpIndex.current = (wpIndex.current + 1) % wps.length;
        }
        // Time for a tune-up? Only if no other agent currently holds the lock.
        if (elapsed >= nextServiceAt.current) {
          if (store.servicingRobotId === null) {
            store.setServicingRobotId(config.id); // claim Allen
            phase.current = 'toService';
          } else {
            nextServiceAt.current = elapsed + 4 + Math.random() * 5; // retry later
          }
        }
        break;
      }

      case 'toService': {
        temps.target.set(SERVICE_SPOT[0], 0, SERVICE_SPOT[2]);
        if (stepToward(temps.target, stepLen)) {
          phase.current = 'beingServiced';
          serviceT.current = 0;
        }
        break;
      }

      case 'beingServiced': {
        // Hold position in front of Allen, spin slowly while he works.
        yaw.current += delta * 2.2;
        serviceT.current += delta;
        if (serviceT.current >= SERVICE_DURATION) {
          upgrades.current += 1; // leaves a little better
          if (store.servicingRobotId === config.id) store.setServicingRobotId(null);
          phase.current = 'returning';
        }
        break;
      }

      case 'returning': {
        const dest = config.usesDock ? config.home : wps[wpIndex.current];
        temps.target.set(dest[0], 0, dest[2]);
        if (stepToward(temps.target, stepLen)) {
          phase.current = 'idle';
          dwell.current = config.usesDock ? 3 + Math.random() * 2 : 0.5 + Math.random() * 1.5;
          if (config.usesDock) wpIndex.current = 0;
          nextServiceAt.current = elapsed + 12 + Math.random() * 12;
        }
        break;
      }
    }

    // Ease the vertical lift (rises to SERVICE_LIFT only while being serviced).
    const liftTarget = phase.current === 'beingServiced' ? SERVICE_LIFT : 0;
    lift.current += (liftTarget - lift.current) * Math.min(1, delta * 3);

    // Constant gentle hover (slightly stronger the more tuned-up it is).
    const hover = Math.sin(elapsed * 2 + seed) * (0.02 + upgrades.current * 0.004);
    g.position.set(pos.current.x, pos.current.y + lift.current + hover, pos.current.z);

    // A subtle "polish" scale pulse while being worked on.
    const scale = phase.current === 'beingServiced' ? 1 + Math.sin(elapsed * 8) * 0.04 : 1;
    g.scale.setScalar(scale);

    // Smoothly rotate toward the target facing (shortest angle).
    let dy = yaw.current - g.rotation.y;
    dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    g.rotation.y += dy * Math.min(1, delta * 6);

    // Status light: bright cyan upgrade pulse while serviced, amber while busy,
    // green while idle/patrolling.
    const mat = statusRef.current?.material as THREE.MeshStandardMaterial | undefined;
    if (mat) {
      if (phase.current === 'beingServiced') {
        mat.color.set('#a5f3fc');
        mat.emissive.set('#a5f3fc');
        mat.emissiveIntensity = 1.3 + Math.sin(elapsed * 12) * 0.6;
      } else {
        const busy = phase.current === 'toService' || phase.current === 'returning';
        const color = busy ? '#fbbf24' : '#34d399';
        mat.color.set(color);
        mat.emissive.set(color);
        mat.emissiveIntensity = 0.6 + Math.sin(elapsed * (busy ? 6 : 3)) * 0.4;
      }
    }
  }

  return { groupRef, statusRef, advance };
}
