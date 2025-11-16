'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Award, BookOpen, Calendar } from 'lucide-react';
import Image from 'next/image';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { useState } from 'react';

const EducationSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);

  const education = [
    {
      degree: 'Bachelor of Science in Information Technology',
      school: 'Central Luzon State University',
      location: 'Nueva Ecija, Philippines',
      period: '2019 - 2024',
      gpa: 'University Scholar',
      description: 'Major in Systems Development with focus on software development, web technologies, and database management. Recognized as University Scholar for academic excellence.',
      achievements: [
        'University Scholar',
        'Major in Systems Development',
        'Strong foundation in IT systems and software development',
      ],
      relevant: ['Systems Development', 'Web Technologies', 'Database Management', 'Software Engineering', 'IT Infrastructure'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      degree: 'Web Developer Bootcamp',
      school: 'Colt Steele',
      location: 'Online',
      period: '2025',
      gpa: 'Certificate of Completion',
      description: 'Comprehensive web development course covering full-stack development with modern tools and best practices.',
      achievements: [
        'Completed comprehensive web development curriculum',
        'Built multiple full-stack projects',
        'Mastered modern web technologies',
      ],
      relevant: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'RESTful APIs'],
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const certifications = [
    {
      name: 'The Web Developer Bootcamp 2025',
      issuer: 'Colt Steele - Udemy',
      date: '2025',
      image: '/images/the-web-developer-bootcamp-2025.jpg',
      description: 'Comprehensive full-stack web development bootcamp covering HTML, CSS, JavaScript, Node.js, Express, MongoDB, and modern web technologies.',
      category: ['Full-Stack Development', 'Front-End Development', 'Back-End Development', 'Programming Fundamentals'],
    },
    {
      name: 'Generative AI for Everyone',
      issuer: 'Arizona State University and US ASEAN Center',
      date: '2025',
      image: '/images/generative-ai-for-everyone-academy.jpg',
      description: 'Explored generative AI concepts, applications, and ethical considerations in modern AI systems.',
      category: ['Artificial Intelligence', 'Professional Development'],
    },
    {
      name: 'IBM JavaScript Full Stack Specialization',
      issuer: 'IBM - Coursera',
      date: '2024',
      image: '/images/IBM-JAVASCRIPT-FULLSTACK-SPECIALIZATIONS.jpeg',
      description: 'Complete full-stack JavaScript specialization covering front-end and back-end development with modern frameworks.',
      category: ['Full-Stack Development', 'Front-End Development', 'Back-End Development', 'Software Engineering'],
    },
    {
      name: 'Industry Professional Credentials Track',
      issuer: 'Arizona State University and US ASEAN Center',
      date: '2024',
      image: '/images/Industy-professional-credentials-track.jpeg',
      description: 'Professional development program focused on industry-relevant skills and career advancement.',
      category: ['Professional Development'],
    },
    {
      name: 'AWS Academy Graduate',
      issuer: 'Amazon Web Services',
      date: '2024',
      image: '/images/AWS_Academy_Graduate_Certificate.jpg',
      description: 'Completed AWS Academy curriculum covering cloud computing fundamentals and AWS services architecture.',
      category: ['Cloud Computing', 'DevOps & Cloud'],
    },
    {
      name: 'JavaScript Full Stack Capstone Project',
      issuer: 'IBM - Coursera',
      date: '2024',
      image: '/images/javascript_full_stack_capstone_project_certificate.jpeg',
      description: 'Built and deployed a comprehensive full-stack application demonstrating end-to-end development skills.',
      category: ['Full-Stack Development', 'Software Engineering', 'Front-End Development', 'Back-End Development'],
    },
    {
      name: 'Developing Back-End Apps with Node.js and Express',
      issuer: 'IBM - Coursera',
      date: '2024',
      image: '/images/developing_back_end_apps_with_nodejs_and_express_certificate.jpeg',
      description: 'Mastered server-side development with Node.js and Express framework for building scalable APIs.',
      category: ['Back-End Development', 'Full-Stack Development', 'Software Engineering'],
    },
    {
      name: 'Developing Front-End Apps with React',
      issuer: 'IBM - Coursera',
      date: '2024',
      image: '/images/developing_front_end_apps_with_react_certificate.jpeg',
      description: 'Advanced React development including hooks, state management, and component architecture.',
      category: ['Front-End Development', 'Full-Stack Development', 'Software Engineering'],
    },
    {
      name: 'Node.js & MongoDB: Developing Back-End Database Applications',
      issuer: 'IBM - Coursera',
      date: '2024',
      image: '/images/nodejs_mongodb_developing_back_end_database_applications_certificate.jpeg',
      description: 'Database integration with Node.js and MongoDB for building data-driven applications.',
      category: ['Back-End Development', 'Full-Stack Development', 'Cloud Computing'],
    },
    {
      name: 'Application Development using Microservices and Serverless',
      issuer: 'IBM - Coursera',
      date: '2024',
      image: '/images/application_development_using_microservices_and_serverless_certificate.jpeg',
      description: 'Modern cloud-native architecture patterns including microservices and serverless computing.',
      category: ['Cloud Computing', 'DevOps & Cloud', 'Software Engineering', 'Back-End Development'],
    },
    {
      name: 'Introduction to Containers with Docker, Kubernetes & OpenShift',
      issuer: 'IBM - Coursera',
      date: '2024',
      image: '/images/introduction_to_containers_w_docker_kubernetes_openshift_certificate.jpeg',
      description: 'Container orchestration and deployment using Docker, Kubernetes, and OpenShift platforms.',
      category: ['DevOps & Cloud', 'Cloud Computing', 'Software Engineering'],
    },
    {
      name: 'Getting Started with Git and GitHub',
      issuer: 'IBM - Coursera',
      date: '2024',
      image: '/images/getting_started_with_git_and_github_certificate.jpeg',
      description: 'Version control fundamentals and collaborative development workflows with Git and GitHub.',
      category: ['DevOps & Cloud', 'Software Engineering', 'Professional Development'],
    },
    {
      name: 'JavaScript Programming Essentials',
      issuer: 'IBM - Coursera',
      date: '2024',
      image: '/images/javascript_programming_essentials_certificate.jpeg',
      description: 'Core JavaScript concepts including ES6+, async programming, and modern JavaScript features.',
      category: ['Programming Fundamentals', 'Front-End Development', 'Back-End Development'],
    },
    {
      name: 'Introduction to HTML, CSS, and JavaScript',
      issuer: 'IBM - Coursera',
      date: '2024',
      image: '/images/introduction_to_html_css_javascript_certificate.jpeg',
      description: 'Foundational web development skills covering HTML5, CSS3, and JavaScript fundamentals.',
      category: ['Programming Fundamentals', 'Front-End Development', 'Full-Stack Development'],
    },
    {
      name: 'Introduction to Software Engineering',
      issuer: 'IBM - Coursera',
      date: '2024',
      image: '/images/introduction_to_software_engineering_certificate.jpeg',
      description: 'Software development lifecycle, methodologies, and best practices in software engineering.',
      category: ['Software Engineering', 'Professional Development'],
    },
    {
      name: 'Data Analysis with OpenAI API: Save Time with GenAI',
      issuer: 'Coursera Project Network',
      date: '2024',
      image: '/images/data_analysis_with_openai_api_save_time_with_genai_certificate.jpeg',
      description: 'Leveraging OpenAI API for automated data analysis and insights generation.',
      category: ['Artificial Intelligence', 'Programming Fundamentals'],
    },
    {
      name: 'Data Balancing with Gen AI: Credit Card Fraud Detection',
      issuer: 'Coursera Project Network',
      date: '2024',
      image: '/images/data_balancing_with_gen_ai_credit_card_fraud_detection_certificate.jpeg',
      description: 'Applied generative AI techniques for data balancing in fraud detection systems.',
      category: ['Artificial Intelligence', 'Software Engineering'],
    },
    {
      name: 'GitHub Copilot for Beginners: Write Software with AI',
      issuer: 'Coursera Project Network',
      date: '2024',
      image: '/images/github_copilot_for_beginners_write_software_with_ai_certificate.jpeg',
      description: 'AI-assisted coding with GitHub Copilot for accelerated software development.',
      category: ['Artificial Intelligence', 'Software Engineering', 'Professional Development'],
    },
    {
      name: 'ChatGPT for Beginners: Save Time with Microsoft Excel',
      issuer: 'Coursera Project Network',
      date: '2024',
      image: '/images/chatgpt_for_beginners_save_time_with_microsoft_excel_certificate.jpeg',
      description: 'Using ChatGPT to automate and enhance Excel workflows and data analysis.',
      category: ['Artificial Intelligence', 'Professional Development'],
    },
    {
      name: 'ChatGPT Playground for Beginners: Intro to NLP & AI',
      issuer: 'Coursera Project Network',
      date: '2024',
      image: '/images/chatgpt_playground_for_beginners_intro_to_nlp_ai_certificate.jpeg',
      description: 'Introduction to natural language processing and AI using ChatGPT playground.',
      category: ['Artificial Intelligence', 'Programming Fundamentals'],
    },
    {
      name: 'Copy.ai for Beginners: Generate Texts for Various Use Cases',
      issuer: 'Coursera Project Network',
      date: '2024',
      image: '/images/copyai_for_beginners_generate_texts_for_various_use_cases_certificate.jpeg',
      description: 'AI-powered content generation for marketing, copywriting, and creative writing.',
      category: ['Artificial Intelligence', 'Professional Development'],
    },
    {
      name: 'Jasper AI: Writing a Product Review Blog Post',
      issuer: 'Coursera Project Network',
      date: '2024',
      image: '/images/jasper_ai_writing_a_product_review_blog_post_certificate.jpeg',
      description: 'Creating professional product reviews and blog content using Jasper AI.',
      category: ['Artificial Intelligence', 'Professional Development'],
    },
    {
      name: 'OpenAI for Beginners: Programmatic Prompting',
      issuer: 'Coursera Project Network',
      date: '2024',
      image: '/images/open_ai_for_beginners_programmatic_prompting_certificate.jpeg',
      description: 'Programmatic interaction with OpenAI APIs for automated AI-powered solutions.',
      category: ['Artificial Intelligence', 'Programming Fundamentals', 'Back-End Development'],
    },
    {
      name: 'Queries with OpenAI: Translate Natural Text to SQL',
      issuer: 'Coursera Project Network',
      date: '2024',
      image: '/images/queries_with_openai_translate_natural_text_to_sql_certificate.jpeg',
      description: 'Converting natural language queries into SQL using OpenAI for database interactions.',
      category: ['Artificial Intelligence', 'Back-End Development'],
    },
    {
      name: 'Learn to Code with AI',
      issuer: 'Coursera Project Network',
      date: '2024',
      image: '/images/learn_to_code_with_AI_certificate.jpeg',
      description: 'Leveraging AI tools to accelerate coding learning and development productivity.',
      category: ['Artificial Intelligence', 'Programming Fundamentals', 'Professional Development'],
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

  const categories = ['All', 'Artificial Intelligence', 'Full-Stack Development', 'Front-End Development', 'Back-End Development', 'Cloud Computing', 'DevOps & Cloud', 'Software Engineering', 'Programming Fundamentals', 'Professional Development'];

  const filteredCertifications = selectedCategory === 'All' 
    ? certifications 
    : certifications.filter(cert => cert.category.includes(selectedCategory));

  const displayedCertifications = showAll ? filteredCertifications : filteredCertifications.slice(0, 6);

  const getCategoryCount = (category: string) => {
    if (category === 'All') return certifications.length;
    return certifications.filter(c => c.category.includes(category)).length;
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
          <p className="text-gray-400 mb-6">
            {certifications.length} industry-recognized certifications across multiple domains
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {category}
                <span className="ml-2 text-xs opacity-70">
                  ({getCategoryCount(category)})
                </span>
              </button>
            ))}
          </div>
        </div>

        <PhotoProvider>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedCertifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -3 }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all cursor-pointer"
              >
                <PhotoView src={cert.image}>
                  <div className="relative h-48 w-full bg-white/5">
                    <Image
                      src={cert.image}
                      alt={cert.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </PhotoView>
                <div className="p-4">
                  <h4 className="text-white font-semibold mb-2 text-sm line-clamp-2">{cert.name}</h4>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">{cert.description}</p>
                  <div className="flex items-center gap-1 flex-wrap mb-2">
                    {cert.category.map((cat) => (
                      <span key={cat} className="px-2 py-1 bg-blue-500/20 rounded-full text-xs text-blue-400 font-medium">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 truncate">{cert.issuer}</span>
                    <span className="text-xs text-blue-400 font-medium">{cert.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </PhotoProvider>

        {/* Show More/Less Button */}
        {filteredCertifications.length > 6 && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              {showAll ? 'Show Less' : `Show More (${filteredCertifications.length - 6} more)`}
            </button>
          </div>
        )}
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
