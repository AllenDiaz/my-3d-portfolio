'use client';

import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, ExternalLink } from 'lucide-react';

const ExperienceTimeline = () => {
  const experiences = [
    {
      title: 'Senior Full-Stack Developer',
      company: 'Tech Innovations Inc.',
      location: 'Remote',
      period: '2022 - Present',
      type: 'Full-time',
      description: 'Leading development of enterprise-level web applications using React, Next.js, and Node.js. Architecting scalable solutions and mentoring junior developers.',
      achievements: [
        'Led a team of 5 developers in building a SaaS platform serving 10K+ users',
        'Improved application performance by 40% through optimization',
        'Implemented CI/CD pipeline reducing deployment time by 60%',
        'Introduced code review practices improving code quality',
      ],
      technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Full-Stack Developer',
      company: 'Digital Solutions Co.',
      location: 'Manila, Philippines',
      period: '2020 - 2022',
      type: 'Full-time',
      description: 'Developed and maintained multiple client projects using modern web technologies. Collaborated with cross-functional teams to deliver high-quality solutions.',
      achievements: [
        'Built 15+ responsive web applications from scratch',
        'Integrated third-party APIs and payment gateways',
        'Reduced page load time by 50% through optimization',
        'Achieved 98% client satisfaction rating',
      ],
      technologies: ['React', 'Node.js', 'MongoDB', 'Express.js', 'Redux'],
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Frontend Developer',
      company: 'Creative Web Agency',
      location: 'Cebu, Philippines',
      period: '2019 - 2020',
      type: 'Full-time',
      description: 'Created engaging user interfaces and interactive web experiences. Worked closely with designers to implement pixel-perfect designs.',
      achievements: [
        'Developed 20+ landing pages with high conversion rates',
        'Implemented responsive designs across all devices',
        'Collaborated with UX team to improve user flows',
        'Introduced modern CSS practices and animations',
      ],
      technologies: ['HTML/CSS', 'JavaScript', 'React', 'Sass', 'Figma'],
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Junior Web Developer',
      company: 'Startup Hub',
      location: 'Manila, Philippines',
      period: '2018 - 2019',
      type: 'Full-time',
      description: 'Started my professional journey building websites and learning modern development practices. Gained foundational experience in full-stack development.',
      achievements: [
        'Built and deployed 10+ websites for small businesses',
        'Learned modern JavaScript frameworks and tools',
        'Participated in agile development processes',
        'Contributed to open-source projects',
      ],
      technologies: ['HTML/CSS', 'JavaScript', 'PHP', 'MySQL', 'WordPress'],
      color: 'from-orange-500 to-red-500',
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
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
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
      className="space-y-8"
    >
      {/* Section Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <h3 className="text-4xl font-bold text-white">
          Work <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Experience</span>
        </h3>
        <p className="text-gray-400 max-w-2xl mx-auto">
          My professional journey and key accomplishments throughout my career
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-0 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform lg:-translate-x-1/2" />

        {/* Experience Items */}
        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={`${exp.company}-${exp.period}`}
              variants={itemVariants}
              className={`relative flex items-center ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } flex-col lg:gap-12`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 lg:left-1/2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transform lg:-translate-x-1/2 -translate-y-1/2 top-8 z-10 ring-4 ring-black" />

              {/* Content Card */}
              <div className={`w-full lg:w-[calc(50%-2rem)] ml-8 lg:ml-0 ${
                index % 2 === 0 ? '' : 'lg:text-right'
              }`}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all ${
                    index % 2 === 0 ? '' : 'lg:ml-auto'
                  }`}
                >
                  {/* Header */}
                  <div className={`flex items-start gap-4 mb-4 ${
                    index % 2 === 0 ? '' : 'lg:flex-row-reverse'
                  }`}>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${exp.color} flex-shrink-0`}>
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex-1 ${index % 2 === 0 ? '' : 'lg:text-right'}`}>
                      <h4 className="text-2xl font-bold text-white mb-1">{exp.title}</h4>
                      <div className="flex items-center gap-2 text-blue-400 font-semibold mb-2 flex-wrap">
                        <span>{exp.company}</span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {exp.period}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {exp.location}
                        </span>
                        <span className="px-2 py-1 bg-blue-500/20 rounded-full text-xs">
                          {exp.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className={`text-gray-300 mb-4 ${index % 2 === 0 ? '' : 'lg:text-right'}`}>
                    {exp.description}
                  </p>

                  {/* Achievements */}
                  <div className="mb-4">
                    <h5 className={`text-white font-semibold mb-3 ${index % 2 === 0 ? '' : 'lg:text-right'}`}>
                      Key Achievements:
                    </h5>
                    <ul className={`space-y-2 ${index % 2 === 0 ? '' : 'lg:text-right'}`}>
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div className={`flex flex-wrap gap-2 ${
                    index % 2 === 0 ? '' : 'lg:justify-end'
                  }`}>
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-xs text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ExperienceTimeline;
