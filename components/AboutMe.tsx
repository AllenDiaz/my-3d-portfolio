'use client';

import { motion } from 'framer-motion';
import { 
  Code2, 
  Database, 
  Layout, 
  Server, 
  Smartphone, 
  GitBranch,
  Download,
  GraduationCap,
  Briefcase,
  Award,
  CheckCircle2
} from 'lucide-react';
import SkillsSection from '@/components/about/SkillsSection';
import ExperienceTimeline from '@/components/about/ExperienceTimeline';
import EducationSection from '@/components/about/EducationSection';

const AboutMe = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const stats = [
    { icon: Briefcase, label: 'Years Experience', value: '3+' },
    { icon: Code2, label: 'Projects Completed', value: '30+' },
    { icon: Award, label: 'Certifications', value: '35+' },
    { icon: GitBranch, label: 'Open Source', value: '10+' },
  ];

  return (
    <section id="about" className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-20 px-8">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-20"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-5xl lg:text-6xl font-bold text-white">
              About <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Me</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Learn more about my journey, skills, and experience in software development
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all"
              >
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bio Section */}
          <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Bio Content */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white mb-4">My Story</h3>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  I'm <span className="text-blue-400 font-semibold">Allen Diaz</span>, a Full-Stack Engineer 
                  with 3+ years of experience turning ideas into powerful, scalable web applications. My journey 
                  began in high school with a simple curiosity about how the web works—and evolved into a passion 
                  for building efficient, user-friendly digital solutions.
                </p>
                <p>
                  I thrive on solving complex problems, exploring new technologies, and contributing to open-source 
                  projects. When I'm not coding, you'll find me running, shooting hoops on the basketball court, 
                  or sharing knowledge with the developer community. For me, continuous learning isn't just a 
                  habit—it's a mindset.
                </p>
              </div>

              {/* What I Do */}
              <div className="space-y-4 mt-8">
                <h4 className="text-2xl font-bold text-white">What I Do</h4>
                <div className="grid gap-4">
                  {[
                    { icon: Layout, title: 'Frontend Development', desc: 'Creating responsive and interactive UIs with React, Next.js, and modern CSS' },
                    { icon: Server, title: 'Backend Development', desc: 'Building robust APIs and server-side logic with Node.js and databases' },
                    { icon: Smartphone, title: 'Responsive Design', desc: 'Ensuring seamless experiences across all devices and screen sizes' },
                    { icon: Code2, title: '3D Web Experiences', desc: 'Developing immersive 3D interfaces using Three.js and WebGL' },
                  ].map((service) => (
                    <div
                      key={service.title}
                      className="flex gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                    >
                      <service.icon className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <h5 className="text-white font-semibold mb-1">{service.title}</h5>
                        <p className="text-sm text-gray-400">{service.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Quick Facts & Download */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Quick Facts</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Location', value: 'Remote / Philippines' },
                    { label: 'Email', value: 'allendiaz.developer@gmail.com' },
                    { label: 'Availability', value: 'Open to opportunities' },
                    { label: 'Languages', value: 'English, Filipino' },
                    { label: 'Work Style', value: 'Remote, Hybrid, On-site' },
                  ].map((fact) => (
                    <div key={fact.label} className="flex justify-between items-start border-b border-white/10 pb-3">
                      <span className="text-gray-400 font-medium">{fact.label}</span>
                      <span className="text-white text-right">{fact.value}</span>
                    </div>
                  ))}
                </div>

                {/* Download Resume Button */}
                <motion.a
                  href="/AllenDiaz_CV.pdf"
                  download
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-8 w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download Full Resume
                </motion.a>
              </div>

              {/* Certifications / Achievements */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Certifications</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {[
                    'Udemy Web Developer Bootcamp 2025 – Colt Steele',
                    'IBM Full-Stack JavaScript Developer Specialization',
                    'GenAI for Data-Driven Solutions – US ASEAN Center',
                    'AWS Academy Cloud Foundations – AWS',
                    'Google Cloud Fundamentals: Core Infrastructure – Google',
                    'Introduction to Microsoft Azure Cloud Services – Microsoft',
                    'Introduction to Containers with Docker, Kubernetes & OpenShift – IBM',
                    'Get Started with Cloud Native, DevOps, Agile, and NoSQL – IBM',
                  ].map((cert) => (
                    <div key={cert} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{cert}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                    <span className="text-gray-400 text-sm italic">...and more</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skills Section */}
          <SkillsSection />

          {/* Experience Timeline */}
          <ExperienceTimeline />

          {/* Education Section */}
          <EducationSection />
        </motion.div>
      </div>
    </section>
  );
};

export default AboutMe;
