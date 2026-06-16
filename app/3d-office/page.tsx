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
import RestrictedLinkModal from '@/components/ui/RestrictedLinkModal';
import AllProjectsModal from '@/components/ui/AllProjectsModal';
import SceneLoader from '@/components/ui/SceneLoader';
import { useStore } from '@/store/useStore';

// Dynamically import 3D components to avoid SSR issues
const Scene3D = dynamic(() => import('@/components/3d/Scene3D'), {
  ssr: false,
  loading: () => <SceneLoader />,
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
  const showRestrictedLinkModal = useStore((state) => state.showRestrictedLinkModal);
  const setShowRestrictedLinkModal = useStore((state) => state.setShowRestrictedLinkModal);
  const restrictedLinkType = useStore((state) => state.restrictedLinkType);
  const showAllProjectsModal = useStore((state) => state.showAllProjectsModal);
  const setShowAllProjectsModal = useStore((state) => state.setShowAllProjectsModal);
  
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
        <div className="absolute top-24 right-4 sm:right-6 z-10 pointer-events-none hidden md:block">
          <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 sm:p-4 text-white max-w-xs">
            <h3 className="text-sm font-semibold mb-2 text-gray-300">
              Object IDs
            </h3>
            <ul className="space-y-1 text-xs text-gray-400">
              <li>📱 Tablet → All projects</li>
              <li>🪪 ID Card → All Work Experience</li>
              <li>📱 iPad → All projects</li>
              <li>🏆 Certificate → Professional Certifications</li>
              <li>💻 Computer → Featured Projects</li>
              <li>☕ Coffee → Message for Employer/Client</li>
              <li>🪑 Chair → Sytem Notification</li>
              <li>⌨️  Keyboard → Skills and Technologies</li>
              <li>📄 Paper → Resume</li>
            </ul>
          </div>
        </div>

        {/* Mobile Instructions - Shown only on small screens */}
        <div className="absolute top-24 left-4 right-4 z-10 pointer-events-none md:hidden">
          <div className="bg-black/60 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 text-white">
            <p className="text-xs text-gray-300 text-center">
              <span className="font-semibold">Tap</span> objects to explore • <span className="font-semibold">Swipe</span> to rotate
            </p>
          </div>
        </div>

        {/* Floating UI Overlay */}
        <ProjectPanel />

        {/* Instructions Overlay - Desktop */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none hidden sm:block">
          <div className="bg-black/80 dark:bg-black/90 backdrop-blur-sm text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-gray-700 dark:border-gray-600 text-xs sm:text-sm transition-colors">
            <span className="font-semibold">Click</span> objects to explore • <span className="font-semibold">Drag</span> to rotate • <span className="font-semibold">Scroll</span> to zoom
          </div>
        </div>

        {/* Mobile Bottom Instructions */}
        <div className="absolute bottom-6 left-4 right-4 z-30 pointer-events-none sm:hidden">
          <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-gray-700 text-xs text-center">
            <span className="font-semibold">Tap</span> to interact • <span className="font-semibold">Pinch</span> to zoom
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
      
      {/* Restricted Link Modal */}
      <RestrictedLinkModal
        isOpen={showRestrictedLinkModal}
        onClose={() => setShowRestrictedLinkModal(false)}
        linkType={restrictedLinkType || 'code'}
      />
      
      {/* All Projects Modal */}
      <AllProjectsModal
        isOpen={showAllProjectsModal}
        onClose={() => setShowAllProjectsModal(false)}
      />
    </main>
  );
}
