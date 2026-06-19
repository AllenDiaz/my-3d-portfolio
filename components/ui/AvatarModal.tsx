'use client';

import { Cpu, Sparkles } from 'lucide-react';
import ModalShell from './ModalShell';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Short "About Allen" card shown when the seated avatar is clicked. */
export default function AvatarModal({ isOpen, onClose }: AvatarModalProps) {
  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-md" ariaLabel="About Allen">
      <div className="overflow-hidden rounded-2xl border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-teal-600 to-cyan-600 p-6">
          <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
            <Cpu className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Allen Diaz</h2>
            <p className="font-mono text-sm text-white/80">AI / LLM Engineer</p>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-4 p-6">
          <p className="leading-relaxed text-gray-300">
            That&apos;s me at the desk — an AI/LLM engineer who builds agentic,
            model-native products and the procedural worlds they live in. This
            whole office is hand-built from primitives, no asset files.
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-teal-500/30 bg-teal-500/10 p-3">
            <Sparkles className="h-4 w-4 shrink-0 text-teal-300" />
            <span className="font-mono text-sm text-teal-200">
              Turning late-night ideas into shipping AI.
            </span>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
