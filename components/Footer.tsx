import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

const exploreLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: '3D Office', href: '/3d-office' },
];

const connectLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/AllenDiaz',
    icon: Github,
    external: true,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/allen-diaz-525071258/',
    icon: Linkedin,
    external: true,
  },
  {
    name: 'Email',
    href: 'mailto:allendiaz.developer@gmail.com',
    icon: Mail,
    external: false,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                AD
              </div>
              <span className="text-white font-bold text-lg">Allen Diaz</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Full-Stack &amp; AI Engineer building agentic AI systems and
              immersive web experiences with React, Next.js, and Three.js.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Explore</h3>
            <ul className="space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Connect</h3>
            <ul className="space-y-2">
              {connectLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Allen Diaz. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Built with Next.js, Three.js &amp; Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
