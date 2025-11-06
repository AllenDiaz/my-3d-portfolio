'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Download, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99] as const,
      },
    },
  };

  return (
    <div className="container mx-auto px-8 lg:px-16">
      <div className="flex items-center justify-between">
        {/* Left Side - Main Hero Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl space-y-6"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-block px-4 py-2 bg-blue-500/10 backdrop-blur-md border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium">
              Available for Opportunities
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              Hi, I'm{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Allen Diaz
              </span>
            </h1>
            <h2 className="text-2xl lg:text-3xl text-gray-300 font-light">
              Full-Stack Developer & Creative Problem Solver
            </h2>
          </motion.div>

          {/* Tagline/Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-400 max-w-2xl leading-relaxed backdrop-blur-sm"
          >
            Passionate about crafting exceptional digital experiences with modern web technologies. 
            Specializing in React, Next.js, and Three.js to build innovative, user-centric applications 
            that make a difference.
          </motion.p>

          {/* Tech Stack Pills */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            {['React', 'Next.js', 'TypeScript', 'Three.js', 'Node.js', 'TailwindCSS'].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-gray-300 text-sm hover:bg-white/10 transition-colors"
              >
                {tech}
              </span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
            <Link href="/3d-office">
              <button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View My Work
                  <ArrowRight className={`w-5 h-5 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </Link>

            <Link href="/about">
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-all hover:scale-105 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                About Me
              </button>
            </Link>

            <a
              href="/Allen_Diaz_Resume.pdf"
              download
              className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-gray-300 font-semibold hover:bg-white/10 transition-all hover:scale-105 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Resume
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex gap-4 pt-2">
            <a
              href="https://github.com/AllenDiaz"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all hover:scale-110"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/allen-diaz-525071258/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="mailto:allendiaz.developer@gmail.com"
              className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all hover:scale-110"
              aria-label="Email"
            >
              <Mail className="w-6 h-6" />
            </a>
          </motion.div>
        </motion.div>

        {/* Right Side - Professional Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="hidden lg:block"
        >
          <div className="relative group">
            {/* Animated background gradient */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
            
            {/* Photo container */}
            <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-white/10 backdrop-blur-sm bg-gradient-to-br from-gray-800 to-gray-900">
              {/* Placeholder - Replace with actual photo */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-6xl font-bold text-white">
                    AD
                  </div>
                  <p className="text-gray-400 text-sm">Professional Photo</p>
                </div>
              </div>
              
              {/* Uncomment when you have a photo */}
              {/* <img
                src="/images/profile.jpg"
                alt="Allen Diaz"
                className="w-full h-full object-cover"
              /> */}
            </div>

            {/* Floating stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-max"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-3 flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">5+</div>
                  <div className="text-xs text-gray-400">Years Exp</div>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-xs text-gray-400">Projects</div>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-xs text-gray-400">Satisfaction</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-gray-400 cursor-pointer hover:text-white transition-colors group">
          <span className="text-sm font-medium">Explore More</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-gray-400 group-hover:border-white transition-colors flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-white"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
