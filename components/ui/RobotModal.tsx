'use client';

import { Bot, Activity, Clock } from 'lucide-react';
import ModalShell from './ModalShell';
import type { RobotConfig } from '@/components/3d/Robots/robotConfig';

interface RobotModalProps {
  isOpen: boolean;
  onClose: () => void;
  robot: RobotConfig | null;
}

/** Fun flavor card for a clicked service robot: designation, task, uptime. */
export default function RobotModal({ isOpen, onClose, robot }: RobotModalProps) {
  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-sm" ariaLabel="Service robot">
      <div className="overflow-hidden rounded-2xl border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-teal-600 to-emerald-600 p-6">
          <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
            <Bot className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{robot?.designation ?? 'Service Unit'}</h2>
            <p className="font-mono text-sm text-white/80">Allen&apos;s agent · online</p>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3 p-6">
          <div className="flex items-center gap-4 rounded-lg border border-zinc-700/60 bg-white/5 p-3">
            <Activity className="h-5 w-5 shrink-0 text-teal-300" />
            <span className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">Current task</span>
              <span className="font-mono text-sm text-gray-200">{robot?.task ?? '—'}</span>
            </span>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-zinc-700/60 bg-white/5 p-3">
            <Clock className="h-5 w-5 shrink-0 text-emerald-300" />
            <span className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">Uptime</span>
              <span className="font-mono text-sm text-gray-200">{robot?.uptime ?? '—'}</span>
            </span>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
