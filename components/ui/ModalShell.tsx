'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Tailwind max-width class for the panel (default max-w-2xl). */
  maxWidthClass?: string;
  /** Show the built-in top-right close button (default true). Set false when the
   *  child renders its own close control (e.g. a custom gradient header). */
  showClose?: boolean;
  /** Accessible label for the dialog. */
  ariaLabel?: string;
  /** z-index class for stacking (default z-[100]). */
  zIndexClass?: string;
}

/**
 * Reusable modal scaffold: dimmed backdrop, centered spring-animated panel,
 * Escape-to-close, click-outside-to-close, and dialog a11y. Replaces the
 * glassmorphism backdrop/container boilerplate duplicated across the *Modal
 * components — children supply only the inner content.
 */
export default function ModalShell({
  isOpen,
  onClose,
  children,
  maxWidthClass = 'max-w-2xl',
  showClose = true,
  ariaLabel,
  zIndexClass = 'z-[100]',
}: ModalShellProps) {
  // Close on Escape while open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 flex items-center justify-center p-4 ${zIndexClass}`}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`relative w-full ${maxWidthClass}`}
          >
            {showClose && (
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 z-20 rounded-full border border-white/20 bg-black/50 p-2 text-white transition-colors hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
