'use client';

import { useStore } from '@/store/useStore';
import { X, ExternalLink, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectPanel() {
  const { activeProject, showProjectPanel, setShowProjectPanel, setActiveProject } = useStore();

  const handleClose = () => {
    setShowProjectPanel(false);
    setTimeout(() => setActiveProject(null), 300);
  };

  return (
    <AnimatePresence>
      {showProjectPanel && activeProject && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm z-40 transition-colors"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4"
          >
            <div className="bg-zinc-900 dark:bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-800 dark:border-zinc-700 overflow-hidden transition-colors">
              {/* Header */}
              <div className="relative h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors backdrop-blur-sm"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="h-full flex flex-col justify-end">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {activeProject.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {activeProject.description}
                </p>

                {/* Links */}
                <div className="flex gap-4">
                  {activeProject.githubUrl && (
                    <a
                      href={activeProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors font-medium"
                    >
                      <Github className="w-5 h-5" />
                      View Code
                    </a>
                  )}
                  {activeProject.liveUrl && (
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Live Demo
                    </a>
                  )}
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t border-zinc-800 dark:border-zinc-700 transition-colors">
                  <h3 className="text-white font-semibold mb-3">Key Features</h3>
                  <ul className="space-y-2 text-gray-400 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Modern and responsive design</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Optimized performance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Clean and maintainable code</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
