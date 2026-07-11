'use client';

import { OrbitControls, Environment, SoftShadows } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import gsap from 'gsap';
import { useStore, isAnyOverlayOpen, REST_CAMERA_POSITION, REST_CAMERA_TARGET } from '@/store/useStore';
import { QUALITY_PRESETS } from '@/lib/deviceTier';
import { CAMERA_POSES, TOUR_STOPS, type CameraPose } from './cameraPoses';
import CinematicCamera from './CinematicCamera';

const REST_POSE: CameraPose = {
  position: REST_CAMERA_POSITION,
  target: REST_CAMERA_TARGET,
};

// OrbitControls' resting zoom-in limit; focus close-ups sit well inside it, so
// the limit is relaxed during a focus and restored on the return flight.
const DEFAULT_MIN_DISTANCE = 2;
const FOCUS_MIN_DISTANCE = 0.4;
const DEFAULT_FOV = 50;

// Idle attract mode: after this much input silence, slowly auto-orbit the desk.
const ATTRACT_IDLE_MS = 45000;

interface SceneSetupProps {
  enableCinematicIntro?: boolean;
}

export default function SceneSetup({ enableCinematicIntro = true }: SceneSetupProps) {
  const { camera, gl } = useThree();
  const lightsOn = useStore((state) => state.lightsOn);
  const qualityTier = useStore((state) => state.qualityTier);
  const preset = QUALITY_PRESETS[qualityTier];

  // Desk-lamp spotlight needs an explicit target object placed on the desk
  const lampSpotRef = useRef<THREE.SpotLight>(null);
  const lampTargetRef = useRef<THREE.Object3D>(null);

  // Faux-window area light (cool city spill from camera-left)
  const windowLightRef = useRef<THREE.RectAreaLight>(null);

  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cameraResetToken = useStore((state) => state.cameraResetToken);
  const focusRequest = useStore((state) => state.focusRequest);
  const tourActive = useStore((state) => state.tourActive);
  const tourStep = useStore((state) => state.tourStep);

  // View to glide back to when a focus ends (captured at focus start).
  const savedViewRef = useRef<{ position: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  // Pending onArrive callback; killed when a newer flight supersedes it so a
  // stale modal can't open after e.g. spam-clicking two objects.
  const arriveCallRef = useRef<gsap.core.Tween | null>(null);

  // Shared camera flight: kills in-flight tweens, disables controls for the
  // duration (damping would fight GSAP), and snaps under reduced motion.
  const flyTo = useCallback(
    (
      pose: CameraPose,
      opts: {
        duration?: number;
        onArrive?: () => void;
        onComplete?: () => void;
        relaxMinDistance?: boolean;
        /** Tour mode: don't hand the controls back after landing. */
        keepControlsDisabled?: boolean;
      } = {}
    ) => {
      const controls = controlsRef.current;
      if (!controls) return;
      const {
        duration = 1.4,
        onArrive,
        onComplete,
        relaxMinDistance = false,
        keepControlsDisabled = false,
      } = opts;
      const cam = camera as THREE.PerspectiveCamera;
      const targetFov = pose.fov ?? DEFAULT_FOV;

      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(controls.target);
      gsap.killTweensOf(cam);
      arriveCallRef.current?.kill();
      arriveCallRef.current = null;

      controls.autoRotate = false; // a flight always cancels the attract orbit
      controls.enabled = false;
      if (relaxMinDistance) controls.minDistance = FOCUS_MIN_DISTANCE;

      const prefersReducedMotion =
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      if (prefersReducedMotion) {
        camera.position.set(...pose.position);
        controls.target.set(...pose.target);
        cam.fov = targetFov;
        cam.updateProjectionMatrix();
        controls.update();
        controls.enabled = !keepControlsDisabled;
        onArrive?.();
        onComplete?.();
        return;
      }

      const [px, py, pz] = pose.position;
      const [tx, ty, tz] = pose.target;
      gsap.to(camera.position, { x: px, y: py, z: pz, duration, ease: 'power3.inOut' });
      gsap.to(controls.target, {
        x: tx,
        y: ty,
        z: tz,
        duration,
        ease: 'power3.inOut',
        onUpdate: () => controls.update(),
        onComplete: () => {
          controls.enabled = !keepControlsDisabled;
          onComplete?.();
        },
      });
      if (Math.abs(cam.fov - targetFov) > 0.01) {
        gsap.to(cam, {
          fov: targetFov,
          duration,
          ease: 'power2.inOut',
          onUpdate: () => cam.updateProjectionMatrix(),
        });
      }
      if (onArrive) {
        arriveCallRef.current = gsap.delayedCall(Math.max(0, duration - 0.25), onArrive);
      }
    },
    [camera]
  );

  // Fly back out of a focus and hand the controls their resting config back.
  const flyBack = useCallback(
    (pose: CameraPose) => {
      flyTo(pose, {
        onComplete: () => {
          const controls = controlsRef.current;
          if (controls) controls.minDistance = DEFAULT_MIN_DISTANCE;
          useStore.getState().setFocusActive(false);
        },
      });
    },
    [flyTo]
  );

  // Click-to-focus: fly to the requested pose; on clear, glide back to the
  // view the user was at before focusing (rest framing as a fallback).
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const state = useStore.getState();
    if (state.introPlaying) return;

    if (focusRequest) {
      if (!state.focusActive) {
        savedViewRef.current = {
          position: camera.position.clone(),
          target: controls.target.clone(),
        };
        state.setFocusActive(true);
      }
      flyTo(CAMERA_POSES[focusRequest.id], {
        onArrive: focusRequest.onArrive,
        relaxMinDistance: true,
      });
    } else if (state.focusActive) {
      const saved = savedViewRef.current;
      savedViewRef.current = null;
      flyBack(
        saved
          ? {
              position: [saved.position.x, saved.position.y, saved.position.z],
              target: [saved.target.x, saved.target.y, saved.target.z],
            }
          : REST_POSE
      );
    }
  }, [focusRequest, camera, flyTo, flyBack]);

  useEffect(() => {
    // RectAreaLight requires its LTC uniform tables initialised once
    RectAreaLightUniformsLib.init();
    if (windowLightRef.current) {
      // Aim the window light from the back-wall window into the room
      windowLightRef.current.lookAt(0, 1.2, 2);
    }
    if (lampSpotRef.current && lampTargetRef.current) {
      lampSpotRef.current.target = lampTargetRef.current;
      lampSpotRef.current.target.updateMatrixWorld();
    }
  }, []);

  // Mood: redistribute rather than just dim when the lights go off — night
  // mode keeps a slightly higher exposure because the remaining light sources
  // (lamp ember, neon, city spill) are meant to read as the hero look.
  useEffect(() => {
    gl.toneMappingExposure = lightsOn ? 1.35 : 0.9;
  }, [gl, lightsOn]);

  useEffect(() => {
    // Set initial camera position if not using cinematic intro
    if (!enableCinematicIntro) {
      camera.position.set(...REST_CAMERA_POSITION);
    }
  }, [camera, enableCinematicIntro]);

  // Pose-authoring aid (?debug=camera): log the current camera position and
  // orbit target while navigating, throttled to ~2Hz. Mirrors ?debug=robots.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('debug') !== 'camera') return;
    const controls = controlsRef.current;
    if (!controls) return;

    let last = 0;
    const fmt = (v: number) => Math.round(v * 100) / 100;
    const onChange = () => {
      const now = performance.now();
      if (now - last < 500) return;
      last = now;
      const p = camera.position;
      const t = controls.target;
      console.info(
        `[camera] position: [${fmt(p.x)}, ${fmt(p.y)}, ${fmt(p.z)}], target: [${fmt(t.x)}, ${fmt(t.y)}, ${fmt(t.z)}]`
      );
    };
    controls.addEventListener('change', onChange);
    return () => controls.removeEventListener('change', onChange);
  }, [camera]);

  // Idle attract mode: any input stamps the clock and kills the auto-orbit
  // immediately; a throttled frame check re-arms it after 45s of silence
  // (never during the intro, a focus, the tour, an open modal, a flight, or
  // under reduced motion).
  const lastInputRef = useRef(0);
  const attractFrameCounter = useRef(0);
  const reducedMotionRef = useRef(false);
  useEffect(() => {
    lastInputRef.current = performance.now();
    reducedMotionRef.current =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const onInput = () => {
      lastInputRef.current = performance.now();
      const controls = controlsRef.current;
      if (controls) controls.autoRotate = false;
    };
    const events = ['pointerdown', 'wheel', 'keydown', 'touchstart'] as const;
    events.forEach((name) => window.addEventListener(name, onInput, { passive: true }));
    return () => events.forEach((name) => window.removeEventListener(name, onInput));
  }, []);

  useFrame(() => {
    attractFrameCounter.current += 1;
    if (attractFrameCounter.current % 30 !== 0) return;
    const controls = controlsRef.current;
    if (!controls || controls.autoRotate || !controls.enabled) return;
    if (reducedMotionRef.current) return;
    if (performance.now() - lastInputRef.current < ATTRACT_IDLE_MS) return;
    const state = useStore.getState();
    if (state.introPlaying || state.focusActive || state.tourActive || isAnyOverlayOpen(state)) return;
    if (gsap.isTweening(camera.position)) return;
    controls.autoRotateSpeed = 0.4;
    controls.autoRotate = true;
  });

  // Guided tour: fly between stops while active (controls stay parked for the
  // whole ride); on exit, glide back to the resting framing.
  const wasTouringRef = useRef(false);
  useEffect(() => {
    if (!controlsRef.current) return;

    if (tourActive) {
      if (!wasTouringRef.current) {
        wasTouringRef.current = true;
        savedViewRef.current = null; // any focus context is void now
      }
      const stop = TOUR_STOPS[tourStep];
      if (stop) {
        flyTo(stop.pose, { relaxMinDistance: true, keepControlsDisabled: true });
      }
    } else if (wasTouringRef.current) {
      wasTouringRef.current = false;
      flyBack(REST_POSE);
    }
  }, [tourActive, tourStep, flyTo, flyBack]);

  // Reset view: glide camera + orbit target back to the default framing when
  // the store token bumps (desk mouse / overlay button). No-op during the
  // intro fly-in — the timeline owns the camera then. Reset always wins over
  // an active focus: the saved view is dropped so the return lands on REST.
  useEffect(() => {
    if (cameraResetToken === 0) return;
    if (!controlsRef.current || useStore.getState().introPlaying) return;

    savedViewRef.current = null;
    useStore.getState().stopTour();
    useStore.getState().clearCameraFocus();
    flyBack(REST_POSE);
  }, [cameraResetToken, flyBack]);

  return (
    <>
      {/* Percentage-closer soft shadows (PCSS) on the high tier for soft, realistic
          shadow penumbra. Cheaper tiers fall back to the PCF map set in Scene3D. */}
      {preset.softShadows === 'pcss' && (
        <SoftShadows size={25} samples={16} focus={0.5} />
      )}

      {/* Subtle exponential fog so the room dissolves into the void rather than a wall.
          Color matches the canvas background (#0a0a0a) for a seamless fade. */}
      <fogExp2 attach="fog" args={['#0a0a0a', 0.03]} />

      {/* Camera */}
      {enableCinematicIntro ? (
        <CinematicCamera />
      ) : null}

      {/* Camera Controls */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={15}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        target={[0, 1.05, -1.9]}
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
      />

      {/* Lighting - "late-night dev studio": cool indigo base, warm amber key,
          teal neon spill from the binary walls */}
      {/* Ambient base (cool, but bright enough to read the room) */}
      <ambientLight color="#2c3a5c" intensity={lightsOn ? 0.5 : 0.12} />

      {/* Main Directional Light — effectively off at night (no "sun" indoors) */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={lightsOn ? 1.2 : 0.05}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Window key - cool city light spilling in from the back-wall window;
          at night the city becomes the key light */}
      <rectAreaLight
        ref={windowLightRef}
        position={[0, 3, -4.8]}
        width={6}
        height={2.8}
        intensity={lightsOn ? 3.2 : 1.1}
        color="#9db8ff"
      />

      {/* Fill Light (cool, soft) */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={lightsOn ? 0.4 : 0.08}
        color="#3a4a72"
      />

      {/* Desk lamp - warm amber practical, the emotional key light */}
      <pointLight
        position={[0, 2, -2]}
        intensity={lightsOn ? 0.9 : 0.35}
        distance={4}
        color="#ffb066"
        castShadow
      />

      {/* Desk-lamp pool - a defined warm cone landing on the desk surface */}
      <object3D ref={lampTargetRef} position={[0, 0.75, -2]} />
      <spotLight
        ref={lampSpotRef}
        position={[0.6, 3.2, -0.6]}
        angle={0.5}
        penumbra={0.9}
        intensity={lightsOn ? 1.6 : 0.5}
        distance={7}
        decay={1.5}
        color="#ffb066"
      />

      {/* Neon spill from the binary walls (teal/green, on-palette) — the neon
          takes over the room at night */}
      <pointLight
        position={[-4, 2, -4]}
        intensity={lightsOn ? 0.3 : 0.45}
        distance={5}
        color="#22d3a0"
      />

      <pointLight
        position={[4, 2, -3]}
        intensity={lightsOn ? 0.3 : 0.45}
        distance={5}
        color="#22d3a0"
      />

      {/* Ceiling Light */}
      <spotLight
        position={[0, 5.5, 0]}
        angle={Math.PI / 3}
        penumbra={0.5}
        intensity={lightsOn ? 0.7 : 0}
        castShadow
        color="#ffffff"
      />

      {/* Environment Map for Reflections - interior IBL; pulled way down at
          night so the practicals (lamp/neon/city) own the frame */}
      <Environment preset="apartment" environmentIntensity={lightsOn ? 0.85 : 0.2} />
    </>
  );
}
