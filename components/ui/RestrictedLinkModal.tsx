'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Building2 } from 'lucide-react';

interface RestrictedLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkType: 'code' | 'live';
  projectId?: string;
}

export default function RestrictedLinkModal({ isOpen, onClose, linkType, projectId }: RestrictedLinkModalProps) {
  const isYelpCamp = projectId === 'yelpcamp-fullstack';
  const isPhiRecord = projectId === 'phirecord-healthcare-system';
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md mx-4"
          >
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl shadow-2xl border border-zinc-700 overflow-hidden">
              {/* Header with animated gradient */}
              <div className="relative p-6 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors backdrop-blur-sm z-10"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                <div className="relative z-10 flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-full"
                  >
                    <Lock className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Restricted Access
                    </h2>
                    <p className="text-white/80 text-sm mt-1">
                      {linkType === 'code' ? 'Source Code' : 'Live Demo'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {isYelpCamp && linkType === 'live' ? (
                  <>
                    <div className="flex items-start gap-3 mb-6">
                      <div className="p-2 bg-blue-500/20 rounded-lg mt-1">
                        <Building2 className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          Demo Available in Interview
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          This project is not currently deployed to a public server. However, I can demonstrate 
                          the full functionality during an interview using the local Docker development environment.
                        </p>
                      </div>
                    </div>

                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-6">
                      <p className="text-gray-400 text-xs leading-relaxed">
                        <strong className="text-gray-300">What I can show:</strong> Complete walkthrough of the application 
                        including user authentication, campground CRUD operations, interactive maps with clustering, 
                        image uploads, review system, and the full Docker containerized setup.
                      </p>
                    </div>
                  </>
                ) : isPhiRecord && linkType === 'live' ? (
                  <>
                    <div className="flex items-start gap-3 mb-6">
                      <div className="p-2 bg-orange-500/20 rounded-lg mt-1">
                        <Building2 className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          Deployed in Rural Health Facilities
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          This healthcare management system is deployed exclusively for rural health facilities 
                          in the Philippines. Access is restricted to authorized medical personnel only.
                        </p>
                      </div>
                    </div>

                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-6">
                      <p className="text-gray-400 text-xs leading-relaxed">
                        <strong className="text-gray-300">Published Research:</strong> View the IEEE publication 
                        for technical details and architecture overview.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3 mb-6">
                      <div className="p-2 bg-orange-500/20 rounded-lg mt-1">
                        <Building2 className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          Proprietary Company Project
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          This project was developed exclusively for and is owned by the company I work for. 
                          The {linkType === 'code' ? 'source code' : 'live application'} is proprietary and 
                          only accessible within the company's internal network.
                        </p>
                      </div>
                    </div>

                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-6">
                      <p className="text-gray-400 text-xs leading-relaxed">
                        <strong className="text-gray-300">Note:</strong> While I cannot share the {linkType === 'code' ? 'code' : 'demo'}, 
                        I'm happy to discuss the technical implementation, architecture decisions, and problem-solving 
                        approaches used in this project during an interview or consultation.
                      </p>
                    </div>
                  </>
                )}

                {/* Action Button */}
                <button
                  onClick={onClose}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl"
                >
                  I Understand
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
