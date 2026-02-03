'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Calendar, Filter, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificateModal({ isOpen, onClose }: CertificateModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);

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

  const categories = ['All', 'Artificial Intelligence', 'Full-Stack Development', 'Front-End Development', 'Back-End Development', 'Cloud Computing', 'DevOps & Cloud', 'Software Engineering', 'Programming Fundamentals', 'Professional Development'];

  const filteredCertifications = selectedCategory === 'All' 
    ? certifications 
    : certifications.filter(cert => cert.category.includes(selectedCategory));

  const displayedCertifications = showAll ? filteredCertifications : filteredCertifications.slice(0, 9);

  const getCategoryCount = (category: string) => {
    if (category === 'All') return certifications.length;
    return certifications.filter(c => c.category.includes(category)).length;
  };

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
            <div className="relative w-full max-w-7xl max-h-[90vh] bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-yellow-500/50 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-yellow-600 to-amber-600 px-6 py-4 flex items-center justify-between border-b-2 border-yellow-500/50">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-white" />
                  <div>
                    <h2 className="text-white text-2xl font-bold">Professional Certifications</h2>
                    <p className="text-yellow-100 text-sm">{certifications.length} Industry-Recognized Credentials</p>
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
                {/* Category Filter */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <h3 className="text-white font-semibold">Filter by Category</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowAll(false);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {category} ({getCategoryCount(category)})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Certifications Grid */}
                <PhotoProvider>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedCertifications.map((cert, index) => (
                      <motion.div
                        key={cert.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all group"
                      >
                        {/* Certificate Image */}
                        <PhotoView src={cert.image}>
                          <div className="relative h-48 bg-gray-800 cursor-pointer overflow-hidden">
                            <img
                              src={cert.image}
                              alt={cert.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className="absolute inset-0 hidden items-center justify-center bg-gray-800">
                              <ImageIcon className="w-12 h-12 text-gray-600" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white font-semibold flex items-center gap-2">
                                <ImageIcon className="w-5 h-5" />
                                Click to view
                              </span>
                            </div>
                          </div>
                        </PhotoView>

                        {/* Certificate Details */}
                        <div className="p-4 space-y-3">
                          <h4 className="text-white font-bold text-lg line-clamp-2">{cert.name}</h4>
                          <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold">
                            <Award className="w-4 h-4" />
                            {cert.issuer}
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Calendar className="w-4 h-4" />
                            {cert.date}
                          </div>
                          <p className="text-gray-300 text-sm line-clamp-2">{cert.description}</p>
                          <div className="flex flex-wrap gap-1 pt-2">
                            {cert.category.slice(0, 2).map((cat) => (
                              <span
                                key={cat}
                                className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs text-yellow-300"
                              >
                                {cat}
                              </span>
                            ))}
                            {cert.category.length > 2 && (
                              <span className="px-2 py-1 bg-gray-500/20 border border-gray-500/30 rounded text-xs text-gray-400">
                                +{cert.category.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </PhotoProvider>

                {/* Show More/Less Button */}
                {filteredCertifications.length > 9 && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-yellow-500/50 transition-all"
                    >
                      {showAll ? 'Show Less' : `Show More (${filteredCertifications.length - 9} more)`}
                    </button>
                  </div>
                )}
              </div>

              {/* Scanline effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent animate-scan"></div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 -z-10 blur-2xl opacity-30 bg-gradient-to-br from-yellow-500 to-amber-500 pointer-events-none"></div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
