'use client';

import { useStore } from '@/store/useStore';
import { X, ExternalLink, Github, ArrowRight, Star, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProjectPanel() {
  const { 
    activeProject, 
    showProjectPanel, 
    setShowProjectPanel, 
    setActiveProject,
    setShowRestrictedLinkModal 
  } = useStore();
  const router = useRouter();

  const handleClose = () => {
    setShowProjectPanel(false);
    setTimeout(() => setActiveProject(null), 300);
  };

  const handleViewAllProjects = () => {
    handleClose();
    setTimeout(() => router.push('/projects'), 400);
  };

  const handleLinkClick = (e: React.MouseEvent, url: string | undefined, linkType: 'code' | 'live') => {
    e.preventDefault();
    e.stopPropagation();
    
    if (url === 'RESTRICTED') {
      setShowRestrictedLinkModal(true, linkType);
    } else if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-2xl max-h-[85vh] overflow-y-auto mx-4"
          >
            <div className="bg-zinc-900 dark:bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-800 dark:border-zinc-700 overflow-hidden transition-colors">
              {/* Header */}
              <div className="relative h-36 sm:h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
                {/* Background Image */}
                {activeProject.thumbnailUrl && (
                  <Image
                    src={activeProject.thumbnailUrl}
                    alt={activeProject.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 90vw, 672px"
                  />
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Featured Badge */}
                {activeProject.featured && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg z-10"
                  >
                    <Star className="w-4 h-4 text-white fill-white" />
                    <span className="text-xs font-bold text-white uppercase tracking-wide">
                      Featured
                    </span>
                  </motion.div>
                )}
                
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors backdrop-blur-sm z-10"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 z-10">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {activeProject.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {activeProject.technologies.length > 5 && (
                      <span className="px-2 sm:px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white/70 font-medium">
                        +{activeProject.technologies.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-8">
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                  {activeProject.description}
                </p>
                
                {/* Long Description if available */}
                {activeProject.longDescription && (
                  <p className="text-gray-400 dark:text-gray-300 text-sm leading-relaxed mb-4 sm:mb-6 transition-colors line-clamp-3">
                    {activeProject.longDescription}
                  </p>
                )}

                {/* Project Metadata */}
                {(activeProject.categories?.length || activeProject.completedDate || activeProject.role) && (
                  <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6 text-xs sm:text-sm">
                    {activeProject.categories && activeProject.categories.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Categories:</span>
                        <div className="flex gap-2 flex-wrap">
                          {activeProject.categories.map(cat => (
                            <span key={cat} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded capitalize">
                              {cat}
                            </span>
                          ))}
                        </div>
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
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {activeProject.githubUrl && (
                    <button
                      onClick={(e) => handleLinkClick(e, activeProject.githubUrl, 'code')}
                      className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      {activeProject.githubUrl === 'RESTRICTED' ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span className="hidden sm:inline">View Code (Restricted)</span>
                          <span className="sm:hidden">Code 🔒</span>
                        </>
                      ) : (
                        <>
                          <Github className="w-4 h-4" />
                          View Code
                        </>
                      )}
                    </button>
                  )}
                  {activeProject.liveUrl && (
                    <button
                      onClick={(e) => handleLinkClick(e, activeProject.liveUrl, 'live')}
                      className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      {activeProject.liveUrl === 'RESTRICTED' ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span className="hidden sm:inline">Live Demo (Restricted)</span>
                          <span className="sm:hidden">Live 🔒</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Additional Info */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-zinc-800 dark:border-zinc-700 transition-colors hidden sm:block">
                  <h3 className="text-white font-semibold mb-3 text-sm sm:text-base">Key Features</h3>
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
                  className="mt-4 sm:mt-6 w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all font-semibold group shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <span>View All Projects</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
