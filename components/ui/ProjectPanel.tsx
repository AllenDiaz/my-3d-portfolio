'use client';

import { useStore } from '@/store/useStore';
import { X, ExternalLink, Github, ArrowRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ProjectPanel() {
  const { activeProject, showProjectPanel, setShowProjectPanel, setActiveProject } = useStore();
  const router = useRouter();

  const handleClose = () => {
    setShowProjectPanel(false);
    setTimeout(() => setActiveProject(null), 300);
  };

  const handleViewAllProjects = () => {
    handleClose();
    setTimeout(() => router.push('/projects'), 400);
  };

  return (
    <AnimatePresence mode="wait">
      {showProjectPanel && activeProject && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm z-40 transition-colors"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: {
                type: 'spring',
                damping: 20,
                stiffness: 250,
                mass: 0.8
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.9, 
              y: 20,
              transition: { duration: 0.2 }
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4"
          >
            <div className="bg-zinc-900 dark:bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-800 dark:border-zinc-700 overflow-hidden transition-colors">
              {/* Header */}
              <div className="relative h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8">
                {/* Featured Badge */}
                {activeProject.featured && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"
                  >
                    <Star className="w-4 h-4 text-white fill-white" />
                    <span className="text-xs font-bold text-white uppercase tracking-wide">
                      Featured
                    </span>
                  </motion.div>
                )}
                
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
                    {activeProject.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {activeProject.technologies.length > 5 && (
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white/70 font-medium">
                        +{activeProject.technologies.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {activeProject.description}
                </p>
                
                {/* Long Description if available */}
                {activeProject.longDescription && (
                  <p className="text-gray-400 dark:text-gray-300 text-sm leading-relaxed mb-6 transition-colors">
                    {activeProject.longDescription}
                  </p>
                )}

                {/* Project Metadata */}
                {(activeProject.category || activeProject.completedDate || activeProject.role) && (
                  <div className="flex flex-wrap gap-4 mb-6 text-sm">
                    {activeProject.category && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Category:</span>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded capitalize">
                          {activeProject.category}
                        </span>
                      </div>
                    )}
                    {activeProject.completedDate && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Completed:</span>
                        <span className="text-gray-300">{activeProject.completedDate}</span>
                      </div>
                    )}
                    {activeProject.role && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Role:</span>
                        <span className="text-gray-300">{activeProject.role}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Links */}
                <div className="flex flex-wrap gap-4">
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

                {/* View All Projects Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={handleViewAllProjects}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all font-semibold group shadow-lg hover:shadow-xl"
                >
                  <span>View All Projects</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
