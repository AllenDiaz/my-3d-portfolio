'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural rain streaks on the window glass — no textures, one small plane,
 * a fully self-contained fragment shader. High tier only (gated by the
 * `windowRain` preset flag at the mount site in OfficeRoom).
 *
 * Two layers: hashed columns of falling streaks (bright head, fading tail,
 * slight diagonal drift) plus a sparse grid of static droplets that fade in
 * and out. Additive-blended and kept dimmer than the lit city windows behind
 * it so it reads as weather, not a curtain.
 */
export default function WindowRain() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;

        float hash(float n) {
          return fract(sin(n * 127.1) * 43758.5453123);
        }
        float hash2(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        void main() {
          // Slight diagonal drift, like wind pushing the streaks
          vec2 uv = vec2(vUv.x + vUv.y * 0.03, vUv.y);

          // --- Layer 1: falling streaks in hashed columns ---
          float streaks = 0.0;
          const float COLS = 40.0;
          float col = floor(uv.x * COLS);
          float colHash = hash(col);
          // Per-column speed (0.25..0.6) and phase offset
          float speed = 0.25 + colHash * 0.35;
          float phase = colHash * 7.0;
          float y = fract(uv.y * 3.0 + time * speed + phase);
          // Bright head with a fading tail below it
          float tail = smoothstep(0.0, 0.55, y) * smoothstep(1.0, 0.93, y);
          // Thin the streak horizontally within its column
          float xInCol = fract(uv.x * COLS);
          float core = smoothstep(0.42, 0.5, xInCol) * smoothstep(0.58, 0.5, xInCol);
          // Only ~55% of columns carry a streak at a time
          float active = step(0.45, hash(col + 13.0));
          streaks = tail * core * active;

          // --- Layer 2: sparse static droplets, fading in/out over ~4s ---
          vec2 cell = floor(vUv * vec2(26.0, 14.0));
          vec2 inCell = fract(vUv * vec2(26.0, 14.0));
          float dropHash = hash2(cell);
          vec2 dropPos = vec2(0.3 + 0.4 * hash2(cell + 1.7), 0.3 + 0.4 * hash2(cell + 3.1));
          float dropDist = length(inCell - dropPos);
          float drop = smoothstep(0.09, 0.02, dropDist);
          float dropLife = sin(time * 1.6 * (0.5 + dropHash) + dropHash * 20.0) * 0.5 + 0.5;
          // Only ~30% of cells hold a droplet
          drop *= step(0.7, dropHash) * dropLife;

          // Cool rain color, overall gain kept subordinate to the city lights
          vec3 color = vec3(0.78, 0.86, 1.0);
          float brightness = streaks * 0.35 + drop * 0.22;

          gl_FragColor = vec4(color * brightness, brightness);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  useEffect(() => {
    return () => {
      shaderMaterial.dispose();
    };
  }, [shaderMaterial]);

  // Sits inside OfficeRoom's window group: just in front of the glass pane
  // (local z = -0.02) and behind the mullions (z = +0.01).
  return (
    <mesh position={[0, 0, -0.01]}>
      <planeGeometry args={[5.9, 2.7]} />
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}
