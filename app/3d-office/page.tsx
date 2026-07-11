'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Play, RotateCcw, SkipForward, Volume2, VolumeX, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
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
import ContactModal from '@/components/ui/ContactModal';
import AvatarModal from '@/components/ui/AvatarModal';
import RobotModal from '@/components/ui/RobotModal';
import TourOverlay from '@/components/ui/TourOverlay';
import SceneLoader from '@/components/ui/SceneLoader';
import { useStore, isAnyOverlayOpen } from '@/store/useStore';

// Dynamically import 3D components to avoid SSR issues
const Scene3D = dynamic(() => import('@/components/3d/Scene3D'), {
  ssr: false,
  loading: () => <SceneLoader />,
});

const MainScene = dynamic(() => import('@/components/3d/MainScene'), {
  ssr: false,
});

// Every clickable object in the scene and what it opens — keep in sync with
// the interactive components mounted in MainScene.tsx.
const GUIDE_ITEMS = [
  { icon: '💻', object: 'Monitors', action: 'Featured projects' },
  { icon: '📱', object: 'Tablet', action: 'Browse all projects' },
  { icon: '⌨️', object: 'Keyboard', action: 'Skills & technologies' },
  { icon: '🖱️', object: 'Mouse', action: 'Reset the camera view' },
  { icon: '📓', object: 'Notebook', action: 'Resume & bio' },
  { icon: '🪪', object: 'ID card', action: 'Work experience' },
  { icon: '🏆', object: 'Certificate', action: 'Certifications' },
  { icon: '📞', object: 'Phone', action: 'Contact me' },
  { icon: '💡', object: 'Desk lamp', action: 'Toggle the room lights' },
  { icon: '🧍', object: 'Allen', action: 'About me' },
  { icon: '🤖', object: 'Robots', action: 'Meet the AI agents' },
  { icon: '☕', object: 'Coffee', action: 'A note for you' },
  { icon: '🪑', object: 'Chair', action: 'A little surprise' },
] as const;

function GuideList() {
  return (
    <ul className="space-y-1.5 text-xs font-mono text-gray-400">
      {GUIDE_ITEMS.map((item) => (
        <li key={item.object} className="flex items-baseline gap-2">
          <span aria-hidden="true">{item.icon}</span>
          <span className="text-gray-300">{item.object}</span>
          <span className="text-gray-500">→</span>
          <span>{item.action}</span>
        </li>
      ))}
    </ul>
  );
}

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
  const showContactModal = useStore((state) => state.showContactModal);
  const setShowContactModal = useStore((state) => state.setShowContactModal);
  const showAvatarModal = useStore((state) => state.showAvatarModal);
  const setShowAvatarModal = useStore((state) => state.setShowAvatarModal);
  const showRobotModal = useStore((state) => state.showRobotModal);
  const setShowRobotModal = useStore((state) => state.setShowRobotModal);
  const selectedRobot = useStore((state) => state.selectedRobot);
  const soundMuted = useStore((state) => state.soundMuted);
  const setSoundMuted = useStore((state) => state.setSoundMuted);
  const introPlaying = useStore((state) => state.introPlaying);
  const setIntroPlaying = useStore((state) => state.setIntroPlaying);
  const requestCameraReset = useStore((state) => state.requestCameraReset);
  const clearCameraFocus = useStore((state) => state.clearCameraFocus);
  const anyOverlayOpen = useStore(isAnyOverlayOpen);
  const tourActive = useStore((state) => state.tourActive);
  const startTour = useStore((state) => state.startTour);
  const stopTour = useStore((state) => state.stopTour);

  const [legendOpen, setLegendOpen] = useState(true);
  const [mobileGuideOpen, setMobileGuideOpen] = useState(false);

  // When the last overlay closes (X, backdrop, Escape, or a notification
  // auto-dismissing), glide the camera back out of its click-to-focus pose.
  // Transition-guarded so a focus flight in progress (modal not open yet)
  // isn't cancelled the moment it starts.
  const wasOverlayOpen = useRef(false);
  useEffect(() => {
    if (wasOverlayOpen.current && !anyOverlayOpen) {
      clearCameraFocus();
    }
    wasOverlayOpen.current = anyOverlayOpen;
  }, [anyOverlayOpen, clearCameraFocus]);

  // Escape ends the tour (which owns the camera) or, otherwise, cancels a
  // focus flight before its modal has opened.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (useStore.getState().tourActive) {
        stopTour();
      } else {
        clearCameraFocus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [clearCameraFocus, stopTour]);

  // Grabbing the scene (canvas) during the tour hands control back.
  useEffect(() => {
    if (!tourActive) return;
    const onPointerDown = (e: PointerEvent) => {
      if (e.target instanceof HTMLCanvasElement) stopTour();
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [tourActive, stopTour]);

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

        {/* Object Interaction Guidelines - collapsible */}
        <div className="absolute top-24 right-4 sm:right-6 z-10 hidden md:block pointer-events-auto">
          <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white max-w-xs overflow-hidden">
            <button
              onClick={() => setLegendOpen((v) => !v)}
              aria-expanded={legendOpen}
              className="flex w-full items-center justify-between gap-4 px-3 sm:px-4 py-2.5 text-left transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer"
            >
              <span className="text-sm font-semibold font-mono text-gray-300">Interaction Guide</span>
              {legendOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </button>
            <AnimatePresence initial={false}>
              {legendOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="px-3 sm:px-4 pb-3"
                >
                  <GuideList />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Instructions - Shown only on small screens */}
        <div className="absolute top-24 left-4 right-4 z-10 pointer-events-none md:hidden">
          <div className="bg-black/60 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 text-white">
            <p className="text-xs font-mono text-gray-300 text-center">
              <span className="font-semibold">Tap</span> objects to explore • <span className="font-semibold">Swipe</span> to rotate
            </p>
          </div>
        </div>

        {/* Floating UI Overlay */}
        <ProjectPanel />

        {/* Instructions Overlay - Desktop */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none hidden sm:block">
          <div className="bg-black/80 dark:bg-black/90 backdrop-blur-sm text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-gray-700 dark:border-gray-600 text-xs sm:text-sm font-mono tracking-wide transition-colors">
            <span className="font-semibold">Click</span> objects to explore • <span className="font-semibold">Drag</span> to rotate • <span className="font-semibold">Scroll</span> to zoom
          </div>
        </div>

        {/* Skip intro — visible only while the fly-in runs */}
        <AnimatePresence>
          {introPlaying && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              onClick={() => setIntroPlaying(false)}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 bg-black/70 hover:bg-black/90 backdrop-blur-sm border border-gray-600 rounded-full text-sm font-mono text-gray-300 hover:text-white transition-colors pointer-events-auto cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
              Skip intro
            </motion.button>
          )}
        </AnimatePresence>

        {/* Mobile interaction guide sheet */}
        <AnimatePresence>
          {mobileGuideOpen && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-24 left-4 right-4 z-30 md:hidden pointer-events-auto"
            >
              <div className="bg-black/85 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 text-white max-h-[50vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold font-mono text-gray-300">Interaction Guide</span>
                  <button
                    onClick={() => setMobileGuideOpen(false)}
                    aria-label="Close interaction guide"
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <GuideList />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scene controls (bottom-right) */}
        <div className="absolute bottom-8 right-4 sm:right-6 z-30 flex flex-col gap-2 pointer-events-auto">
          <button
            onClick={() => setMobileGuideOpen((v) => !v)}
            aria-label="Toggle interaction guide"
            title="Interaction guide"
            className="p-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-gray-700/50 rounded-lg text-gray-300 hover:text-white transition-colors cursor-pointer md:hidden"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          {!introPlaying && !tourActive && (
            <button
              onClick={startTour}
              aria-label="Take a guided tour"
              title="Take a guided tour"
              className="p-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-gray-700/50 rounded-lg text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <Play className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            aria-label={soundMuted ? 'Unmute ambient sound' : 'Mute ambient sound'}
            title={soundMuted ? 'Unmute ambient sound' : 'Mute ambient sound'}
            className="p-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-gray-700/50 rounded-lg text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            {soundMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button
            onClick={requestCameraReset}
            aria-label="Reset camera view"
            title="Reset camera view"
            className="p-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-gray-700/50 rounded-lg text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Guided tour caption card + step controls */}
        <TourOverlay />

        {/* Mobile Bottom Instructions */}
        <div className="absolute bottom-6 left-4 right-4 z-30 pointer-events-none sm:hidden">
          <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-gray-700 text-xs font-mono text-center">
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

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />

      {/* Avatar ("About Allen") Modal */}
      <AvatarModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
      />

      {/* Service Robot flavor Modal */}
      <RobotModal
        isOpen={showRobotModal}
        onClose={() => setShowRobotModal(false)}
        robot={selectedRobot}
      />
    </main>
  );
}
