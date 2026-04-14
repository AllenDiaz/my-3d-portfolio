'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, Calendar, MapPin, ExternalLink, Award } from 'lucide-react';
import { useState } from 'react';

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExperienceModal({ isOpen, onClose }: ExperienceModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const experiences = [
    {
      title: 'Senior Full Stack Engineer',
      company: 'Safeway Albertsons Philtech',
      location: 'Philippines',
      period: 'April 2026 - Present',
      type: 'Full-time',
      description: 'Promoted to Senior Full Stack Engineer, continuing to drive innovation and technical excellence in the AI Team INCITE (Innovation & Continuous Improvement Team).',
      achievements: [
        'Leading full-stack development initiatives for AI-powered systems',
        'Mentoring junior developers and conducting code reviews',
        'Architecting scalable solutions using modern tech stack',
        'Driving best practices and technical standards across the team',
      ],
      technologies: ['Next.js', 'TypeScript', 'FastAPI', 'PostgreSQL', 'GCP', 'Docker'],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/50',
    },
    {
      title: 'Full Stack Engineer',
      company: 'Safeway Albertsons Philtech',
      location: 'Philippines',
      period: 'June 2025 - April 2026',
      type: 'Full-time',
      description: 'Worked for the AI Team INCITE (Innovation & Continuous Improvement Team). Led the Full Stack AI system project for Philtech Finance - a Document Analyzer and Reviewer.',
      achievements: [
        'Built UI from scratch using Next.js with Tailwind CSS and TypeScript',
        'Developed 14 backend endpoints using FastAPI with SQLAlchemy ORM and Pydantic',
        'Implemented Docker containerization for frontend and backend',
        'Deployed system on Google Cloud Platform (GCP) with Cloud SQL (PostgreSQL) and Cloud Storage',
      ],
      technologies: ['Next.js', 'TypeScript', 'FastAPI', 'PostgreSQL', 'GCP', 'Docker'],
      color: 'from-purple-500 to-blue-500',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/50',
    },
    {
      title: 'Software Engineer Apprentice',
      company: 'Safeway Albertsons Philtech',
      location: 'Philippines',
      period: 'September 2024 - June 2025',
      type: 'Full-time',
      description: 'Dev/Support role managing and troubleshooting technology issues for Albertsons Companies Retail, encompassing 2,200 stores.',
      achievements: [
        'Developed Expense Tracker (APC BOOTCAMP)',
        'NodeJS Project Involvement',
        'Used Linux and shell scripting for POS issues via ServiceNow',
        'Investigated POS system problems using Linux, Cloud, Database, and Logs',
        'Created query runbook documentation for MongoDB and Azure project',
      ],
      technologies: ['Node.js', 'Linux', 'MongoDB', 'Azure', 'ServiceNow'],
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/50',
    },
    {
      title: 'Full Stack Developer Freelancer',
      company: 'Freelance',
      location: 'Remote',
      period: 'August 2020 - September 2024',
      type: 'Freelance',
      description: 'Creating system solutions for small businesses and organizations. Notable client: International Baptist Church of Pinellas INC in Florida, USA.',
      achievements: [
        'Built custom systems for small businesses and organizations',
        'Developed solutions for college students',
        'Delivered full-stack applications tailored to client needs',
        'Maintained long-term client relationships',
      ],
      technologies: ['React', 'Node.js', 'MongoDB', 'Express.js', 'AWS'],
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/50',
    },
    {
      title: 'Web Developer Intern',
      company: 'International Philippine Technologies',
      location: 'Philippines',
      period: 'July 2023 - November 2023',
      type: 'Internship',
      description: 'Collaborated on 3 different web development projects using React, Node.js, and PHP technologies. Trained in adapting to different technologies and programming languages.',
      achievements: [
        'Worked on 3 diverse web development projects',
        'Gained experience with React, Node.js, and PHP',
        'Adapted quickly to different tech stacks',
        'Collaborated with development teams',
      ],
      technologies: ['React', 'Node.js', 'PHP', 'JavaScript'],
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/50',
    },
  ];

  const selectedExp = experiences[selectedIndex];

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
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-purple-500/50 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between border-b-2 border-purple-500/50">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-white" />
                  <div>
                    <h2 className="text-white text-2xl font-bold">Work Experience</h2>
                    <p className="text-purple-100 text-sm">Professional Journey & Achievements</p>
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
                {/* Timeline Navigation */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                  {experiences.map((exp, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                        selectedIndex === index
                          ? `bg-gradient-to-r ${exp.color} text-white shadow-lg scale-105`
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {exp.company}
                    </button>
                  ))}
                </div>

                {/* Selected Experience Detail */}
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`bg-white/5 backdrop-blur-md border ${selectedExp.borderColor} rounded-2xl p-8`}>
                    {/* Header Section */}
                    <div className="flex items-start gap-6 mb-6">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${selectedExp.color} flex-shrink-0`}>
                        <Briefcase className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-white mb-2">{selectedExp.title}</h3>
                        <div className="flex items-center gap-2 text-blue-400 font-semibold mb-3 text-lg">
                          <span>{selectedExp.company}</span>
                          <ExternalLink className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-4 text-gray-400 flex-wrap">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {selectedExp.period}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {selectedExp.location}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedExp.bgColor} border ${selectedExp.borderColor}`}>
                            {selectedExp.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <p className="text-gray-300 text-lg leading-relaxed">
                        {selectedExp.description}
                      </p>
                    </div>

                    {/* Achievements */}
                    <div className="mb-6">
                      <h4 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-400" />
                        Key Achievements
                      </h4>
                      <div className="grid gap-3">
                        {selectedExp.achievements.map((achievement, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-3 bg-white/5 p-4 rounded-lg"
                          >
                            <span className="text-green-400 text-xl flex-shrink-0 mt-1">✓</span>
                            <span className="text-gray-300">{achievement}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h4 className="text-white font-bold text-xl mb-4">Technologies Used</h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedExp.technologies.map((tech, index) => (
                          <motion.span
                            key={tech}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.1, y: -2 }}
                            className={`px-4 py-2 bg-gradient-to-r ${selectedExp.color} backdrop-blur-sm border ${selectedExp.borderColor} rounded-lg text-white font-medium shadow-lg`}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-1">{experiences.length}</div>
                    <div className="text-sm text-gray-400">Positions</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">3+</div>
                    <div className="text-sm text-gray-400">Years</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">20+</div>
                    <div className="text-sm text-gray-400">Projects</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-pink-400 mb-1">15+</div>
                    <div className="text-sm text-gray-400">Technologies</div>
                  </div>
                </div>
              </div>

              {/* Scanline effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent animate-scan"></div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 -z-10 blur-2xl opacity-30 bg-gradient-to-br from-purple-500 to-pink-500 pointer-events-none"></div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
