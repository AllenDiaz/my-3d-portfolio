'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Award, BookOpen, Calendar } from 'lucide-react';

const EducationSection = () => {
  const education = [
    {
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of the Philippines',
      location: 'Manila, Philippines',
      period: '2014 - 2018',
      gpa: '3.8/4.0',
      description: 'Focused on software engineering, data structures, algorithms, and web development. Active member of the Computer Science Society.',
      achievements: [
        'Dean\'s Lister for 6 consecutive semesters',
        'Best Capstone Project Award',
        'Graduated with Honors',
      ],
      relevant: ['Software Engineering', 'Web Development', 'Database Systems', 'Algorithm Design'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      degree: 'Full-Stack Web Development Bootcamp',
      school: 'Coding Dojo',
      location: 'Online',
      period: '2018',
      gpa: 'Certificate of Completion',
      description: 'Intensive 14-week program covering full-stack web development with focus on modern JavaScript frameworks and best practices.',
      achievements: [
        'Built 10+ full-stack applications',
        'Top performer in cohort',
        'Completed advanced JavaScript track',
      ],
      relevant: ['React', 'Node.js', 'MongoDB', 'Express.js', 'RESTful APIs'],
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const certifications = [
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023',
      icon: '☁️',
    },
    {
      name: 'Google Cloud Professional Developer',
      issuer: 'Google Cloud',
      date: '2023',
      icon: '🌐',
    },
    {
      name: 'Meta React Developer Professional',
      issuer: 'Meta (Facebook)',
      date: '2022',
      icon: '⚛️',
    },
    {
      name: 'MongoDB Certified Developer',
      issuer: 'MongoDB University',
      date: '2022',
      icon: '🍃',
    },
    {
      name: 'Advanced JavaScript Certification',
      issuer: 'freeCodeCamp',
      date: '2021',
      icon: '📜',
    },
    {
      name: 'UI/UX Design Certification',
      issuer: 'Coursera',
      date: '2021',
      icon: '🎨',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Education Section */}
      <div className="space-y-8">
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h3 className="text-4xl font-bold text-white">
            Education & <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Learning</span>
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            My academic background and continuous learning journey
          </p>
        </motion.div>

        {/* Education Cards */}
        <div className="grid lg:grid-cols-2 gap-8">
          {education.map((edu, index) => (
            <motion.div
              key={edu.degree}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${edu.color} flex-shrink-0`}>
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">{edu.degree}</h4>
                  <div className="text-blue-400 font-semibold mb-1">{edu.school}</div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {edu.period}
                    </span>
                    <span className="px-2 py-1 bg-green-500/20 rounded-full text-xs text-green-400">
                      {edu.gpa}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                {edu.description}
              </p>

              {/* Achievements */}
              <div className="mb-4">
                <h5 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  Achievements
                </h5>
                <ul className="space-y-1">
                  {edu.achievements.map((achievement, i) => (
                    <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-yellow-400">★</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Relevant Coursework */}
              <div>
                <h5 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  Key Subjects
                </h5>
                <div className="flex flex-wrap gap-2">
                  {edu.relevant.map((course) => (
                    <span
                      key={course}
                      className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-xs text-gray-300"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-2">
            Professional <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Certifications</span>
          </h3>
          <p className="text-gray-400">
            Continuous learning through industry-recognized certifications
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -3 }}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all cursor-pointer"
            >
              <div className="text-4xl mb-3">{cert.icon}</div>
              <h4 className="text-white font-semibold mb-2 text-sm">{cert.name}</h4>
              <div className="text-xs text-gray-400 mb-1">{cert.issuer}</div>
              <div className="text-xs text-blue-400 font-medium">{cert.date}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Learning Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {[
          { label: 'Courses Completed', value: '50+', icon: '📚' },
          { label: 'Certifications', value: '10+', icon: '🏆' },
          { label: 'Learning Hours', value: '1000+', icon: '⏱️' },
          { label: 'Skills Mastered', value: '30+', icon: '💡' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default EducationSection;
