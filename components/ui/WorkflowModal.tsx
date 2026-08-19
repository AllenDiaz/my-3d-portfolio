'use client';

import { Bot, Terminal, Wrench, GitBranch, CheckCircle2, Rocket } from 'lucide-react';
import ModalShell from './ModalShell';

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * "How I build with agents" — the real agentic dev loop Allen runs day to day.
 * Opened from the desk mouse. Honest, workflow-first content (not a product
 * pitch): the tools and the loop, mirroring the robots-as-agents scene theme.
 */

const STEPS = [
  {
    icon: Terminal,
    title: 'Plan with Claude Code',
    desc: 'Brainstorm the design, scope the change, and turn it into a written plan before touching code.',
  },
  {
    icon: GitBranch,
    title: 'Fan out subagents',
    desc: 'Parallel agents explore the codebase and draft changes independently — more coverage, less waiting.',
  },
  {
    icon: Wrench,
    title: 'Tool-calling against the repo',
    desc: 'Agents read, edit, run type-checks and builds through tools — grounded in the real project, not guesses.',
  },
  {
    icon: CheckCircle2,
    title: 'Eval + self-critique loop',
    desc: 'Every change is verified and reviewed — the loop repeats until it actually passes, not just compiles.',
  },
  {
    icon: Rocket,
    title: 'Ship it',
    desc: 'Granular commits, human review at the gates, then deploy. The agent keeps watching for the next change.',
  },
];

const TOOLS = [
  'Claude Code',
  'Subagents',
  'MCP',
  'Anthropic / OpenAI SDK',
  'Vertex AI · Gemini',
  'RAG',
  'pgvector',
  'Evals',
  'Prompt engineering',
];

export default function WorkflowModal({ isOpen, onClose }: WorkflowModalProps) {
  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-2xl" ariaLabel="How I build with agents">
      <div className="max-h-[85vh] overflow-y-auto overflow-hidden rounded-2xl border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-teal-600 to-indigo-600 p-6">
          <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
            <Bot className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">How I build with agents</h2>
            <p className="font-mono text-sm text-white/80">My daily agentic dev loop</p>
          </div>
        </div>

        {/* Intro */}
        <div className="px-6 pt-6">
          <p className="text-sm leading-relaxed text-gray-300">
            I build both <span className="text-teal-300">with</span> agents and{' '}
            <span className="text-teal-300">for</span> agents — Claude Code and subagents are my daily driver
            for shipping full-stack work faster, and the same primitives (tool-calling, RAG, evals) go into the
            products I ship. Here&apos;s the loop.
          </p>
        </div>

        {/* Steps */}
        <ol className="space-y-3 p-6">
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <li
              key={title}
              className="flex gap-4 rounded-lg border border-zinc-700/60 bg-white/5 p-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500/30 to-indigo-500/30 text-teal-300">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  <span className="mr-2 font-mono text-teal-400/80">{i + 1}.</span>
                  {title}
                </h3>
                <p className="mt-1 text-sm text-gray-400">{desc}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Tools */}
        <div className="border-t border-zinc-700/60 px-6 pb-6 pt-5">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Tools in the loop
          </h4>
          <div className="flex flex-wrap gap-2">
            {TOOLS.map((tool) => (
              <span
                key={tool}
                className="rounded-lg border border-white/10 bg-gradient-to-r from-teal-500/15 to-indigo-500/15 px-3 py-1.5 font-mono text-xs text-gray-300"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
