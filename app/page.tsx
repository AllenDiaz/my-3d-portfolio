'use client';

import dynamic from 'next/dynamic';
import ProjectPanel from '@/components/ui/ProjectPanel';

// Dynamically import 3D components to avoid SSR issues
const Scene3D = dynamic(() => import('@/components/3d/Scene3D'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="text-white text-xl">Loading 3D Experience...</div>
    </div>
  ),
});

const MainScene = dynamic(() => import('@/components/3d/MainScene'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Scene */}
      <Scene3D>
        <MainScene />
      </Scene3D>

      {/* Floating UI Overlay */}
      <ProjectPanel />

      {/* Instructions Overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-gray-700 text-sm">
          <span className="font-semibold">Click</span> objects to explore • <span className="font-semibold">Drag</span> to rotate • <span className="font-semibold">Scroll</span> to zoom
        </div>
      </div>
    </div>
  );
}
