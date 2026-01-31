'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CVModal({ isOpen, onClose }: CVModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Binary rain configuration
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    const messages = ['HIRE', 'ME', '01', '10', 'HIRE ME'];
    
    // Animation function
    const drawBinaryRain = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        // Randomly select text (mostly binary, sometimes "HIRE ME")
        const text = Math.random() > 0.95 
          ? messages[Math.floor(Math.random() * messages.length)]
          : Math.random() > 0.5 ? '1' : '0';
        
        // Color gradient effect
        const greenShade = Math.floor(150 + Math.random() * 105);
        ctx.fillStyle = `rgb(0, ${greenShade}, 0)`;
        
        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Reset drop to top randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
    };
    
    const interval = setInterval(drawBinaryRain, 50);
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);
  
  const handleDownload = () => {
    // Open CV in new tab for download
    window.open('/AllenDiaz_CV.pdf', '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with binary rain */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />
          </motion.div>

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-6xl h-[90vh] bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95 border-2 border-green-500/50 rounded-lg shadow-2xl overflow-hidden backdrop-blur-sm pointer-events-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between border-b-2 border-green-500/50">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-white" />
                  <div>
                    <h2 className="text-white text-xl font-mono font-bold">CURRICULUM_VITAE.PDF</h2>
                    <p className="text-green-200 text-xs font-mono">STATUS: READY_FOR_REVIEW</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded transition-colors font-mono text-sm"
                    aria-label="Download CV"
                  >
                    <Download className="w-4 h-4" />
                    DOWNLOAD
                  </button>
                  <button
                    onClick={onClose}
                    className="text-white hover:bg-white/20 rounded p-2 transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* PDF Viewer */}
              <div className="relative w-full h-[calc(100%-5rem)] bg-gray-900">
                <iframe
                  src="/AllenDiaz_CV.pdf"
                  className="w-full h-full border-0"
                  title="Allen Diaz CV"
                />
                
                {/* Overlay message */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-r from-green-600/90 to-emerald-600/90 text-white px-6 py-3 rounded-lg font-mono text-sm backdrop-blur-sm border border-green-400/50 shadow-lg"
                  >
                    <span className="text-green-200">$ git checkout</span> <span className="text-white font-bold">hire-allen-diaz</span>
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="ml-1"
                    >
                      _
                    </motion.span>
                  </motion.div>
                </div>
              </div>

              {/* Footer with system info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-green-900/80 to-emerald-900/80 px-6 py-2 flex items-center justify-between text-xs font-mono text-green-300 border-t border-green-500/30 backdrop-blur-sm">
                <span>DOCUMENT_TYPE: PROFESSIONAL_CV</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  SYSTEM_READY
                </span>
              </div>

              {/* Scanline effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-scan"></div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 -z-10 blur-2xl opacity-30 bg-gradient-to-br from-green-500 to-emerald-500 pointer-events-none"></div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
