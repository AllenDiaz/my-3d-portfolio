'use client';

import { useProgress } from '@react-three/drei';

/**
 * Branded loading screen for the 3D experience. When the asset loader is active
 * it shows real percentage from drei's useProgress; otherwise it shows an
 * indeterminate "booting" state (e.g. while the code chunk downloads).
 */
export default function SceneLoader() {
  const { progress, active } = useProgress();
  const pct = Math.round(progress);

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-5 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="font-mono text-sm tracking-wide text-gray-400">
        {active ? `Booting workspace… ${pct}%` : 'Initializing workspace…'}
      </div>

      <div className="h-1 w-64 overflow-hidden rounded-full bg-white/10">
        {active ? (
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        ) : (
          <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
        )}
      </div>

      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-600">
        Allen Diaz · 3D Portfolio
      </div>
    </div>
  );
}
