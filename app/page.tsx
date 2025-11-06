'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Link from 'next/link';
import { ArrowRight, Code2, User, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic import of 3D components with no SSR
const Scene3D = dynamic(() => import('@/components/3d/Scene3D'), { ssr: false });
const MainScene = dynamic(() => import('@/components/3d/MainScene'), { ssr: false });

export default function Home() {
  const features = [
    {
      icon: FolderOpen,
      title: '3D Portfolio',
      description: 'Explore my projects in an interactive 3D office environment',
      href: '/3d-office',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: User,
      title: 'About Me',
      description: 'Learn about my skills, experience, and professional journey',
      href: '/about',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Code2,
      title: 'Projects',
      description: 'View my latest work and technical achievements',
      href: '/projects',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <main className="relative bg-black dark:bg-black min-h-screen transition-colors">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section with 3D Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* 3D Office Background */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={
            <div className="w-full h-full bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
              <div className="text-white text-xl">Loading 3D Scene...</div>
            </div>
          }>
            <Scene3D>
              <MainScene />
            </Scene3D>
          </Suspense>
        </div>

        {/* Overlay gradient for better text readability - pointer-events-none allows 3D interaction */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 dark:from-black/70 dark:via-black/50 dark:to-black/90 z-10 pointer-events-none transition-colors" />

        {/* Hero Content - pointer-events-none on container, interactive elements have pointer-events-auto */}
        <div className="relative z-20 w-full pointer-events-none">
          <Hero />
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="relative py-20 px-8 bg-gradient-to-b from-black via-gray-900 to-black dark:from-black dark:via-gray-900 dark:to-black transition-colors">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Explore My <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Portfolio</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover my work, skills, and professional experience through interactive sections
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={feature.href}>
                  <div className="group relative h-full bg-white/5 dark:bg-white/5 backdrop-blur-md border border-white/10 dark:border-white/10 rounded-2xl p-8 hover:bg-white/10 dark:hover:bg-white/10 transition-all hover:scale-105 hover:border-white/20 cursor-pointer">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {feature.description}
                    </p>

                    {/* Link */}
                    <div className="flex items-center gap-2 text-blue-400 font-semibold group-hover:gap-3 transition-all">
                      <span>Explore</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>

                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-8 bg-black dark:bg-black border-t border-white/10 dark:border-white/10 transition-colors">
        <div className="container mx-auto max-w-7xl text-center">
          <p className="text-gray-400 dark:text-gray-400">
            © {new Date().getFullYear()} Allen Diaz. Built with Next.js, Three.js & Tailwind CSS.
          </p>
        </div>
      </footer>
    </main>
  );
}
