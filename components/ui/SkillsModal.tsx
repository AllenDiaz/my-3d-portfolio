'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Code2, Database, Layout, Server, Wrench, Palette } from 'lucide-react';
import { useState } from 'react';

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SkillsModal({ isOpen, onClose }: SkillsModalProps) {
  const [activeTab, setActiveTab] = useState(0);

  const skillCategories = [
    {
      category: 'Frontend',
      icon: Layout,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/50',
      skills: [
        { name: 'React', level: 95 },
        { name: 'Next.js', level: 90 },
        { name: 'TypeScript', level: 90 },
        { name: 'JavaScript', level: 95 },
        { name: 'HTML/CSS', level: 95 },
        { name: 'Tailwind CSS', level: 90 },
        { name: 'Three.js', level: 80 },
        { name: 'Redux', level: 85 },
      ],
    },
    {
      category: 'Backend',
      icon: Server,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/50',
      skills: [
        { name: 'Node.js', level: 90 },
        { name: 'Express.js', level: 85 },
        { name: 'Python', level: 90 },
        { name: 'REST API', level: 90 },
        { name: 'GraphQL', level: 80 },
        { name: 'Microservices', level: 75 },
      ],
    },
    {
      category: 'Database',
      icon: Database,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/50',
      skills: [
        { name: 'MongoDB', level: 85 },
        { name: 'PostgreSQL', level: 90 },
        { name: 'MySQL', level: 80 },
        { name: 'Redis', level: 75 },
        { name: 'Firebase', level: 85 },
      ],
    },
    {
      category: 'DevOps',
      icon: Wrench,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/50',
      skills: [
        { name: 'Git/GitHub', level: 95 },
        { name: 'Docker', level: 80 },
        { name: 'AWS', level: 75 },
        { name: 'CI/CD', level: 80 },
        { name: 'Webpack', level: 75 },
        { name: 'Vercel', level: 90 },
      ],
    },
    {
      category: 'Design',
      icon: Palette,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500/50',
      skills: [
        { name: 'Figma', level: 85 },
        { name: 'UI/UX Design', level: 80 },
        { name: 'Adobe XD', level: 75 },
        { name: 'Responsive Design', level: 90 },
      ],
    },
  ];

  const techStack = [
    'React', 'Next.js', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Node.js', 'MongoDB',
    'Tailwind CSS', 'Three.js', 'GraphQL', 'Docker', 'GCP', 'AWS', 'Azure', 'Git',
    'Linux', 'Figma', 'Redux', 'Express.js', 'Python', 'Javascript', 'Laravel',
    'Firebase', 'Vercel', 'REST API', 'Webpack'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-blue-500/50 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between border-b-2 border-blue-500/50">
                <div className="flex items-center gap-3">
                  <Code2 className="w-6 h-6 text-white" />
                  <div>
                    <h2 className="text-white text-2xl font-bold">Skills & Technologies</h2>
                    <p className="text-blue-100 text-sm">Technical Expertise Overview</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-8rem)] p-6">
                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                  {skillCategories.map((category, index) => (
                    <button
                      key={category.category}
                      onClick={() => setActiveTab(index)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                        activeTab === index
                          ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <category.icon className="w-5 h-5" />
                      {category.category}
                    </button>
                  ))}
                </div>

                {/* Active Category Skills */}
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8"
                >
                  <div className={`bg-white/5 backdrop-blur-md border ${skillCategories[activeTab].borderColor} rounded-2xl p-8`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${skillCategories[activeTab].color}`}>
                        {(() => {
                          const IconComponent = skillCategories[activeTab].icon;
                          return <IconComponent className="w-8 h-8 text-white" />;
                        })()}
                      </div>
                      <h3 className="text-3xl font-bold text-white">{skillCategories[activeTab].category}</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {skillCategories[activeTab].skills.map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="space-y-2"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-gray-200 font-medium text-lg">{skill.name}</span>
                            <span className="text-blue-400 text-sm font-bold">{skill.level}%</span>
                          </div>
                          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, delay: index * 0.05, ease: 'easeOut' }}
                              className={`h-full bg-gradient-to-r ${skillCategories[activeTab].color} rounded-full shadow-lg`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Tech Stack Badges */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <h4 className="text-2xl font-bold text-white mb-6 text-center">Complete Tech Stack</h4>
                  <div className="flex flex-wrap justify-center gap-3">
                    {techStack.map((tech, index) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-lg text-gray-300 text-sm font-medium hover:from-blue-500/30 hover:to-purple-500/30 transition-all cursor-default"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scanline effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent animate-scan"></div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 -z-10 blur-2xl opacity-30 bg-gradient-to-br from-blue-500 to-purple-500 pointer-events-none"></div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
