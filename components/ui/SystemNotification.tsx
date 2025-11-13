'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SystemNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function SystemNotification({ isOpen, onClose, message }: SystemNotificationProps) {
  const [timestamp] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    if (isOpen) {
      // Auto-close after 15 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 15000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-8 right-8 z-50 w-96 max-w-[calc(100vw-4rem)]"
        >
          {/* System Notification Window */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-cyan-500/50 rounded-lg shadow-2xl overflow-hidden">
            {/* Title Bar */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-mono font-bold">SYSTEM.NOTIFICATION</span>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded p-1 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification Body */}
            <div className="p-6">
              {/* Icon and Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-cyan-500/20 p-3 rounded-lg border border-cyan-500/50">
                  <MessageSquare className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-mono font-bold text-lg mb-1">
                    NEW MESSAGE
                  </h3>
                  <p className="text-cyan-400 text-xs font-mono">
                    [{timestamp}] - CHAIR_INTERACTION_EVENT
                  </p>
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-black/50 border border-cyan-500/30 rounded p-4 mb-4">
                <p className="text-gray-100 leading-relaxed font-mono text-sm">
                  {message}
                </p>
              </div>

              {/* System Footer */}
              <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                <span>STATUS: <span className="text-green-400">ACTIVE</span></span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  ONLINE
                </span>
              </div>
            </div>

            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scan"></div>
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 -z-10 blur-xl opacity-50 bg-gradient-to-br from-cyan-500 to-blue-500"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
