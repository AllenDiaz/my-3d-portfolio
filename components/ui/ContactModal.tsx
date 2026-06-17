'use client';

import { Mail, Github, Linkedin, Phone } from 'lucide-react';
import ModalShell from './ModalShell';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONTACTS = [
  {
    icon: Mail,
    label: 'Email',
    value: 'allendiaz.developer@gmail.com',
    href: 'mailto:allendiaz.developer@gmail.com',
    accent: 'text-blue-400',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'github.com/AllenDiaz',
    href: 'https://github.com/AllenDiaz',
    accent: 'text-gray-300',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'Allen Diaz',
    href: 'https://www.linkedin.com/in/allen-diaz',
    accent: 'text-sky-400',
  },
];

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-md" ariaLabel="Contact">
      <div className="overflow-hidden rounded-2xl border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-600 p-6">
          <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
            <Phone className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Let&apos;s talk</h2>
            <p className="font-mono text-sm text-white/80">Open to roles &amp; freelance</p>
          </div>
        </div>

        {/* Contact list */}
        <div className="space-y-3 p-6">
          {CONTACTS.map(({ icon: Icon, label, value, href, accent }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-4 rounded-lg border border-zinc-700/60 bg-white/5 p-3 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <Icon className={`h-5 w-5 shrink-0 ${accent}`} />
              <span className="flex flex-col">
                <span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
                <span className="font-mono text-sm text-gray-200">{value}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}
