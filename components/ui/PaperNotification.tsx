'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Coffee } from 'lucide-react';
import { useEffect } from 'react';

interface PaperNotificationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaperNotification({ isOpen, onClose }: PaperNotificationProps) {
  useEffect(() => {
    if (isOpen) {
      // Auto-close after 10 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Paper Note */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateZ: -5 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotateZ: 2,
              y: [0, -10, 0]
            }}
            exit={{ opacity: 0, scale: 0.8, rotateZ: 5 }}
            transition={{ 
              type: 'spring', 
              damping: 15, 
              stiffness: 200,
              y: {
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[500px] max-w-[90vw]"
          >
            {/* Paper with shadow */}
            <div className="relative bg-amber-50 rounded-sm shadow-2xl p-10 border-2 border-amber-300"
              style={{
                boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)'
              }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-amber-800 hover:text-amber-950 transition-colors rounded-full p-1 hover:bg-amber-200/50"
                aria-label="Close notification"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Coffee Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    ease: "easeInOut"
                  }}
                  className="bg-amber-900/10 p-4 rounded-full"
                >
                  <Coffee className="w-12 h-12 text-amber-900" strokeWidth={2.5} />
                </motion.div>
              </div>

              {/* Handwritten-style message */}
              <div className="text-center space-y-6 relative z-10">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold text-gray-900 leading-relaxed"
                  style={{
                    fontFamily: "'Caveat', cursive, sans-serif",
                    textShadow: '0px 0px 1px rgba(0,0,0,0.2)'
                  }}
                >
                  "Hire me, and I'll turn
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl font-bold text-gray-900 leading-relaxed"
                  style={{
                    fontFamily: "'Caveat', cursive, sans-serif",
                    textShadow: '0px 0px 1px rgba(0,0,0,0.2)'
                  }}
                >
                  coffee into results."
                </motion.p>

                {/* Coffee stain decoration */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.3 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-amber-800/20 blur-sm"
                />
              </div>

              {/* Paper texture overlay */}
              <div 
                className="absolute inset-0 opacity-5 pointer-events-none rounded-sm"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.4"/%3E%3C/svg%3E")'
                }}
              />

              {/* Paper fold effect */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-200/50 rounded-bl-3xl" 
                style={{
                  clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
                  boxShadow: 'inset -2px 2px 4px rgba(0,0,0,0.1)'
                }}
              />
            </div>

            {/* Pin/Tack at top */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <motion.div
                animate={{ rotateZ: [0, -5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="w-3 h-3 bg-red-500 rounded-full shadow-lg"
                style={{
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.5)'
                }}
              />
              <div className="w-1 h-6 bg-gray-400 mx-auto -mt-0.5" 
                style={{
                  clipPath: 'polygon(40% 0, 60% 0, 50% 100%)'
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
