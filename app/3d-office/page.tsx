'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import ProjectPanel from '@/components/ui/ProjectPanel';
import LightToggle from '@/components/ui/LightToggle';

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

export default function ThreeDOfficePage() {
  return (
    <main className="relative bg-black dark:bg-black transition-colors">
      {/* Navigation */}
      <Navbar />

      {/* Light Toggle Button */}
      <LightToggle />

      {/* 3D Office Experience */}
      <div className="relative w-full h-screen bg-black dark:bg-black overflow-hidden transition-colors">
        {/* 3D Scene Background */}
        <Scene3D>
          <MainScene />
        </Scene3D>

        {/* Page Title Overlay */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="text-center space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              3D <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Office Portfolio</span>
            </h1>
            <p className="text-gray-400">Click on objects to explore my projects</p>
          </div>
        </div>

        {/* Floating UI Overlay */}
        <ProjectPanel />

        {/* Instructions Overlay */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="bg-black/80 dark:bg-black/90 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-gray-700 dark:border-gray-600 text-sm transition-colors">
            <span className="font-semibold">Click</span> objects to explore • <span className="font-semibold">Drag</span> to rotate • <span className="font-semibold">Scroll</span> to zoom
          </div>
        </div>
      </div>
    </main>
  );
}
