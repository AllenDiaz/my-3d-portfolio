'use client';

import { motion } from 'framer-motion';
import { 
  Code2, 
  Database, 
  Layout, 
  Server, 
  Wrench,
  Palette
} from 'lucide-react';

const SkillsSection = () => {
  const skillCategories = [
    {
      category: 'Frontend',
      icon: Layout,
      color: 'from-blue-500 to-cyan-500',
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
      skills: [
        { name: 'Node.js', level: 90 },
        { name: 'Express.js', level: 85 },
        { name: 'Python', level: 75 },
        { name: 'REST API', level: 90 },
        { name: 'GraphQL', level: 80 },
        { name: 'Microservices', level: 75 },
      ],
    },
    {
      category: 'Database',
      icon: Database,
      color: 'from-purple-500 to-pink-500',
      skills: [
        { name: 'MongoDB', level: 85 },
        { name: 'PostgreSQL', level: 80 },
        { name: 'MySQL', level: 80 },
        { name: 'Redis', level: 75 },
        { name: 'Firebase', level: 85 },
      ],
    },
    {
      category: 'DevOps & Tools',
      icon: Wrench,
      color: 'from-orange-500 to-red-500',
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
      skills: [
        { name: 'Figma', level: 85 },
        { name: 'UI/UX Design', level: 80 },
        { name: 'Adobe XD', level: 75 },
        { name: 'Responsive Design', level: 90 },
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
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
          Skills & <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Technologies</span>
        </h3>
        <p className="text-gray-400 max-w-2xl mx-auto">
          A comprehensive overview of my technical expertise and proficiency levels
        </p>
      </motion.div>

      {/* Skills Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all"
          >
            {/* Category Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color}`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-white">{category.category}</h4>
            </div>

            {/* Skills List */}
            <div className="space-y-4">
              {category.skills.map((skill, skillIndex) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium">{skill.name}</span>
                    <span className="text-blue-400 text-sm font-semibold">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ 
                        duration: 1, 
                        delay: categoryIndex * 0.1 + skillIndex * 0.05,
                        ease: "easeOut" 
                      }}
                      className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Technology Badges */}
      <motion.div variants={itemVariants} className="pt-8">
        <h4 className="text-2xl font-bold text-white mb-6 text-center">Tech Stack</h4>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            'React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 
            'PostgreSQL', 'Tailwind CSS', 'Three.js', 'GraphQL', 
            'Docker', 'AWS', 'Git', 'Figma', 'Redux', 'Express.js',
            'Python', 'Firebase', 'Vercel', 'REST API', 'Webpack'
          ].map((tech) => (
            <motion.span
              key={tech}
              whileHover={{ scale: 1.1, y: -2 }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-lg text-gray-300 text-sm font-medium hover:from-blue-500/30 hover:to-purple-500/30 transition-all cursor-default"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SkillsSection;
