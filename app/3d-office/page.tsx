'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import ProjectPanel from '@/components/ui/ProjectPanel';
import SystemNotification from '@/components/ui/SystemNotification';
import CVModal from '@/components/ui/CVModal';
import PaperNotification from '@/components/ui/PaperNotification';
import SkillsModal from '@/components/ui/SkillsModal';
import ExperienceModal from '@/components/ui/ExperienceModal';
import CertificateModal from '@/components/ui/CertificateModal';
import { useStore } from '@/store/useStore';

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
  const showChairNotification = useStore((state) => state.showChairNotification);
  const setShowChairNotification = useStore((state) => state.setShowChairNotification);
  const showCoffeeNotification = useStore((state) => state.showCoffeeNotification);
  const setShowCoffeeNotification = useStore((state) => state.setShowCoffeeNotification);
  const showSkillsModal = useStore((state) => state.showSkillsModal);
  const setShowSkillsModal = useStore((state) => state.setShowSkillsModal);
  const showExperienceModal = useStore((state) => state.showExperienceModal);
  const setShowExperienceModal = useStore((state) => state.setShowExperienceModal);
  const showCertificateModal = useStore((state) => state.showCertificateModal);
  const setShowCertificateModal = useStore((state) => state.setShowCertificateModal);
  const showCVModal = useStore((state) => state.showCVModal);
  const setShowCVModal = useStore((state) => state.setShowCVModal);
  
  return (
    <main className="relative bg-black dark:bg-black transition-colors">
      {/* Navigation */}
      <Navbar />

      {/* 3D Office Experience */}
      <div className="relative w-full h-screen bg-black dark:bg-black overflow-hidden transition-colors">
        {/* 3D Scene Background */}
        <Scene3D>
          <MainScene />
        </Scene3D>

        {/* Object Interaction Guidelines */}
        <div className="absolute top-24 right-6 z-10 pointer-events-none">
          <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 text-white max-w-xs">
            <h3 className="text-sm font-semibold mb-2 text-gray-300">
              Object IDs
            </h3>
            <ul className="space-y-1 text-xs text-gray-400">
              <li>📱 Tablet → All projects</li>
              <li>🪪 ID Card → All Work Experience</li>
              <li>🏆 Certificate → Professional Certifications</li>
              <li>💻 Computer → Featured Projects</li>
              <li>☕ Coffee → Message for Employer/Client</li>
              <li>🪑 Chair → Sytem Notification</li>
              <li>⌨️  Keyboard → Skills and Technologies</li>
              <li>📄 Paper → Resume</li>
            </ul>
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

      {/* System Notification for Chair */}
      <SystemNotification
        isOpen={showChairNotification}
        onClose={() => setShowChairNotification(false)}
        message="$ git commit -m 'feat: add dedicated developer to your team' && git push origin production --force-with-excellence 🚀 Ready to merge innovation, dedication, and peace of mind into your codebase!"
      />
      
      {/* Paper Notification for Coffee */}
      <PaperNotification
        isOpen={showCoffeeNotification}
        onClose={() => setShowCoffeeNotification(false)}
      />
      
      {/* Skills Modal */}
      <SkillsModal
        isOpen={showSkillsModal}
        onClose={() => setShowSkillsModal(false)}
      />
      
      {/* Experience Modal */}
      <ExperienceModal
        isOpen={showExperienceModal}
        onClose={() => setShowExperienceModal(false)}
      />
      
      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
      />
      
      {/* CV Modal */}
      <CVModal
        isOpen={showCVModal}
        onClose={() => setShowCVModal(false)}
      />
    </main>
  );
}
