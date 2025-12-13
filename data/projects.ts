/**
 * Projects Data
 * Centralized repository of all portfolio projects
 * Organized by category with featured projects highlighted
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  category: 'web' | 'mobile' | 'ai' | 'fullstack' | 'data' | 'other';
  featured: boolean;
  imageUrl?: string;
  thumbnailUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  demoVideoUrl?: string;
  completedDate?: string;
  teamSize?: number;
  role?: string;
}

export const projectsData: Project[] = [
  // ===============================
  // FEATURED PROJECTS (Web)
  // ===============================
  {
    id: 'proj-001',
    title: '3D Interactive Portfolio',
    description: 'An immersive 3D office environment showcasing projects through interactive objects powered by Three.js and React Three Fiber.',
    longDescription: 'A cutting-edge portfolio website featuring a fully interactive 3D office environment. Users can explore the virtual space, interact with objects like monitors and desk items, and discover projects in an engaging way. Built with performance optimization techniques including lazy loading, code splitting, and dynamic imports. Features include cinematic camera animations, post-processing effects, ambient sound, and a holographic display system.',
    technologies: ['Next.js 15', 'React Three Fiber', 'Three.js', 'TypeScript', 'Zustand', 'Tailwind CSS', 'GSAP', 'Framer Motion'],
    category: 'web',
    featured: true,
    thumbnailUrl: '/images/projects/3d-portfolio-thumb.jpg',
    imageUrl: '/images/projects/3d-portfolio-full.jpg',
    githubUrl: 'https://github.com/yourusername/3d-portfolio',
    liveUrl: 'https://yourportfolio.com',
    demoVideoUrl: 'https://youtube.com/demo',
    completedDate: '2025-12',
    teamSize: 1,
    role: 'Full Stack Developer & 3D Artist',
  },
  {
    id: 'proj-002',
    title: 'E-Commerce Platform Pro',
    description: 'Full-featured e-commerce platform with real-time inventory, payment processing, and advanced admin dashboard.',
    longDescription: 'A comprehensive e-commerce solution built for scalability and performance. Features include real-time inventory management, secure payment processing via Stripe, order tracking, customer reviews, wishlist functionality, and an advanced admin dashboard with analytics. Implemented server-side rendering for optimal SEO, integrated CDN for fast image delivery, and utilized Redis for caching. The platform handles thousands of products and concurrent users with ease.',
    technologies: ['Next.js', 'React', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Stripe', 'Redis', 'AWS S3', 'TypeScript'],
    category: 'fullstack',
    featured: true,
    thumbnailUrl: '/images/projects/ecommerce-thumb.jpg',
    imageUrl: '/images/projects/ecommerce-full.jpg',
    githubUrl: 'https://github.com/yourusername/ecommerce-pro',
    liveUrl: 'https://ecommerce-demo.com',
    completedDate: '2025-10',
    teamSize: 3,
    role: 'Lead Full Stack Developer',
  },
  {
    id: 'proj-003',
    title: 'AI-Powered Content Generator',
    description: 'Advanced AI tool that generates high-quality blog posts, social media content, and marketing copy using GPT-4 and custom fine-tuned models.',
    longDescription: 'An intelligent content generation platform leveraging OpenAI GPT-4 API and custom fine-tuned language models. The application features a user-friendly interface for generating various types of content including blog articles, social media posts, email campaigns, and ad copy. Includes advanced features like tone adjustment, SEO optimization suggestions, plagiarism detection, and content scheduling. Built with a robust backend to handle API rate limiting and implement cost-effective token management.',
    technologies: ['Python', 'FastAPI', 'OpenAI GPT-4', 'React', 'TypeScript', 'MongoDB', 'Docker', 'Kubernetes', 'Celery', 'Redis'],
    category: 'ai',
    featured: true,
    thumbnailUrl: '/images/projects/ai-content-thumb.jpg',
    imageUrl: '/images/projects/ai-content-full.jpg',
    githubUrl: 'https://github.com/yourusername/ai-content-gen',
    liveUrl: 'https://ai-content-generator.com',
    completedDate: '2025-09',
    teamSize: 2,
    role: 'AI Engineer & Full Stack Developer',
  },
  
  // ===============================
  // WEB PROJECTS
  // ===============================
  {
    id: 'proj-004',
    title: 'Real-Time Collaboration Tool',
    description: 'A collaborative workspace with real-time document editing, video conferencing, and team chat features.',
    longDescription: 'A comprehensive collaboration platform enabling teams to work together seamlessly. Features include real-time document editing with operational transformation, integrated video conferencing using WebRTC, team chat with message history, file sharing with drag-and-drop functionality, and project management tools. Implemented websocket connections for instant updates and optimized for low-latency communication across distributed teams.',
    technologies: ['React', 'Socket.io', 'WebRTC', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'Yjs', 'Tailwind CSS'],
    category: 'web',
    featured: false,
    thumbnailUrl: '/images/projects/collab-thumb.jpg',
    imageUrl: '/images/projects/collab-full.jpg',
    githubUrl: 'https://github.com/yourusername/collab-tool',
    liveUrl: 'https://collab-demo.com',
    completedDate: '2025-08',
    teamSize: 4,
    role: 'Frontend Lead & WebRTC Specialist',
  },
  {
    id: 'proj-005',
    title: 'Animated Portfolio Website',
    description: 'A stunning portfolio website with smooth scroll animations, particle effects, and interactive 3D elements.',
    longDescription: 'A visually captivating portfolio website featuring advanced CSS animations, GSAP-powered scroll effects, and subtle 3D interactions. Includes a project gallery with filtering capabilities, an animated about section with timeline, and a contact form with real-time validation. Optimized for performance with lazy loading images and efficient animation techniques. Fully responsive across all devices with mobile-first design approach.',
    technologies: ['Next.js', 'React', 'GSAP', 'Three.js', 'Framer Motion', 'Tailwind CSS', 'TypeScript'],
    category: 'web',
    featured: false,
    thumbnailUrl: '/images/projects/animated-portfolio-thumb.jpg',
    imageUrl: '/images/projects/animated-portfolio-full.jpg',
    githubUrl: 'https://github.com/yourusername/animated-portfolio',
    liveUrl: 'https://animated-portfolio.com',
    completedDate: '2025-07',
    teamSize: 1,
    role: 'Full Stack Developer & UI/UX Designer',
  },

  // ===============================
  // MOBILE PROJECTS
  // ===============================
  {
    id: 'proj-006',
    title: 'Fitness Tracking App',
    description: 'Cross-platform mobile app for tracking workouts, nutrition, and health metrics with AI-powered recommendations.',
    longDescription: 'A comprehensive fitness tracking application built with React Native for iOS and Android. Features include workout logging with custom exercise library, calorie and macro tracking, integration with Apple Health and Google Fit, progress visualization with charts, AI-powered workout recommendations based on user goals, and social features for sharing achievements. Implements offline-first architecture with background sync.',
    technologies: ['React Native', 'Expo', 'TypeScript', 'Firebase', 'TensorFlow Lite', 'GraphQL', 'Apollo Client', 'React Navigation'],
    category: 'mobile',
    featured: true,
    thumbnailUrl: '/images/projects/fitness-app-thumb.jpg',
    imageUrl: '/images/projects/fitness-app-full.jpg',
    githubUrl: 'https://github.com/yourusername/fitness-tracker',
    liveUrl: 'https://apps.apple.com/fitness-tracker',
    completedDate: '2025-11',
    teamSize: 2,
    role: 'Mobile Developer & UX Designer',
  },
  {
    id: 'proj-007',
    title: 'Recipe Sharing Community',
    description: 'Mobile app for discovering, sharing, and saving recipes with social features and meal planning tools.',
    longDescription: 'A social recipe platform where users can discover new dishes, share their own recipes, and plan weekly meals. Features include advanced search with dietary filters, step-by-step cooking mode with timers, ingredient scaling, shopping list generation, user profiles with follower system, recipe ratings and comments, and photo upload with automatic enhancement. Integrated with nutrition API for automatic nutritional information.',
    technologies: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS Amplify', 'GraphQL', 'Redis', 'Cloudinary'],
    category: 'mobile',
    featured: false,
    thumbnailUrl: '/images/projects/recipe-app-thumb.jpg',
    imageUrl: '/images/projects/recipe-app-full.jpg',
    githubUrl: 'https://github.com/yourusername/recipe-community',
    liveUrl: 'https://play.google.com/recipe-app',
    completedDate: '2025-06',
    teamSize: 3,
    role: 'Full Stack Mobile Developer',
  },

  // ===============================
  // FULL STACK PROJECTS
  // ===============================
  {
    id: 'proj-008',
    title: 'Task Management SaaS',
    description: 'Enterprise-grade task management platform with team collaboration, automation, and advanced analytics.',
    longDescription: 'A robust SaaS application for project and task management with enterprise features. Includes customizable workflows, automated task assignment based on workload, time tracking with detailed reports, team performance analytics, integration with popular tools (Slack, GitHub, Jira), role-based access control, and multi-workspace support. Built with microservices architecture for scalability and deployed on Kubernetes cluster with auto-scaling capabilities.',
    technologies: ['Next.js', 'Node.js', 'NestJS', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'TypeScript', 'GraphQL', 'Bull Queue'],
    category: 'fullstack',
    featured: false,
    thumbnailUrl: '/images/projects/task-saas-thumb.jpg',
    imageUrl: '/images/projects/task-saas-full.jpg',
    githubUrl: 'https://github.com/yourusername/task-saas',
    liveUrl: 'https://taskmanager-saas.com',
    completedDate: '2025-05',
    teamSize: 5,
    role: 'Backend Lead & DevOps Engineer',
  },
  {
    id: 'proj-009',
    title: 'Learning Management System',
    description: 'Comprehensive LMS for online courses with video streaming, quizzes, certificates, and student progress tracking.',
    longDescription: 'A full-featured Learning Management System designed for educational institutions and online course creators. Features include course creation with multimedia content support, adaptive video streaming with multiple quality options, interactive quizzes with instant feedback, discussion forums, student analytics dashboard, automated certificate generation, payment integration for course sales, and email notifications. Implemented CDN for global content delivery and load balancing for high concurrent users.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'AWS S3', 'CloudFront', 'Stripe', 'Socket.io', 'FFmpeg', 'Docker'],
    category: 'fullstack',
    featured: false,
    thumbnailUrl: '/images/projects/lms-thumb.jpg',
    imageUrl: '/images/projects/lms-full.jpg',
    githubUrl: 'https://github.com/yourusername/lms-platform',
    liveUrl: 'https://learning-platform.com',
    completedDate: '2025-04',
    teamSize: 4,
    role: 'Full Stack Developer',
  },

  // ===============================
  // DATA & AI PROJECTS
  // ===============================
  {
    id: 'proj-010',
    title: 'Predictive Analytics Dashboard',
    description: 'Machine learning-powered analytics platform for business intelligence with real-time data visualization.',
    longDescription: 'An advanced analytics platform leveraging machine learning algorithms to provide predictive insights for business decision-making. Features include real-time data ingestion from multiple sources, interactive dashboards with customizable widgets, predictive models for sales forecasting, customer churn prediction, anomaly detection in metrics, automated report generation, and export capabilities. Built with scalable data pipeline using Apache Kafka and Spark for processing large datasets.',
    technologies: ['Python', 'Scikit-learn', 'TensorFlow', 'Pandas', 'React', 'D3.js', 'FastAPI', 'PostgreSQL', 'Apache Kafka', 'Docker'],
    category: 'data',
    featured: false,
    thumbnailUrl: '/images/projects/analytics-thumb.jpg',
    imageUrl: '/images/projects/analytics-full.jpg',
    githubUrl: 'https://github.com/yourusername/predictive-analytics',
    liveUrl: 'https://analytics-demo.com',
    completedDate: '2025-03',
    teamSize: 3,
    role: 'Data Engineer & ML Developer',
  },
  {
    id: 'proj-011',
    title: 'Image Recognition API',
    description: 'RESTful API for object detection and image classification using deep learning models.',
    longDescription: 'A production-ready API service for image analysis using state-of-the-art deep learning models. Supports multiple use cases including object detection, image classification, facial recognition, text extraction (OCR), and image similarity search. Implemented model optimization techniques for faster inference, batch processing for bulk uploads, and caching layer for frequently requested predictions. Deployed with horizontal scaling and load balancing to handle high throughput.',
    technologies: ['Python', 'PyTorch', 'YOLO', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'Nginx', 'AWS EC2', 'S3'],
    category: 'ai',
    featured: false,
    thumbnailUrl: '/images/projects/image-api-thumb.jpg',
    imageUrl: '/images/projects/image-api-full.jpg',
    githubUrl: 'https://github.com/yourusername/image-recognition-api',
    liveUrl: 'https://api.imagerecognition.com',
    completedDate: '2025-02',
    teamSize: 2,
    role: 'ML Engineer & Backend Developer',
  },

  // ===============================
  // OTHER PROJECTS
  // ===============================
  {
    id: 'proj-012',
    title: 'Developer Portfolio Template',
    description: 'Open-source portfolio template for developers with dark mode, blog, and project showcase.',
    longDescription: 'A modern, customizable portfolio template designed specifically for developers. Features a clean and professional design with dark/light mode toggle, MDX-powered blog with syntax highlighting, animated project cards with filtering, contact form with email integration, SEO optimization, responsive design, and easy customization through configuration files. Built with performance in mind achieving perfect Lighthouse scores. Includes comprehensive documentation and deployment guides.',
    technologies: ['Next.js', 'React', 'TypeScript', 'MDX', 'Tailwind CSS', 'Framer Motion', 'next-themes'],
    category: 'other',
    featured: false,
    thumbnailUrl: '/images/projects/template-thumb.jpg',
    imageUrl: '/images/projects/template-full.jpg',
    githubUrl: 'https://github.com/yourusername/dev-portfolio-template',
    liveUrl: 'https://dev-portfolio-template.vercel.app',
    completedDate: '2025-01',
    teamSize: 1,
    role: 'Creator & Maintainer',
  },
  {
    id: 'proj-013',
    title: 'Chrome Extension Suite',
    description: 'Collection of productivity Chrome extensions including tab manager, time tracker, and note-taking tool.',
    longDescription: 'A suite of browser extensions designed to enhance productivity. Includes a smart tab manager with grouping and session saving, a Pomodoro timer with task integration, a quick note-taking tool with cloud sync, a web clipper for saving articles, and a focus mode that blocks distracting websites. All extensions share a unified design language and can work together through a central dashboard. Built with modern web technologies and Chrome Extension Manifest V3.',
    technologies: ['TypeScript', 'React', 'Chrome Extension API', 'IndexedDB', 'Webpack', 'Tailwind CSS'],
    category: 'other',
    featured: false,
    thumbnailUrl: '/images/projects/chrome-ext-thumb.jpg',
    imageUrl: '/images/projects/chrome-ext-full.jpg',
    githubUrl: 'https://github.com/yourusername/productivity-extensions',
    liveUrl: 'https://chrome.google.com/webstore/productivity-suite',
    completedDate: '2024-12',
    teamSize: 1,
    role: 'Extension Developer',
  },
  {
    id: 'proj-014',
    title: 'Weather Forecast Progressive Web App',
    description: 'Beautiful PWA for weather forecasts with offline support, location-based alerts, and radar maps.',
    longDescription: 'A Progressive Web App delivering accurate weather forecasts with a delightful user experience. Features include current conditions, hourly and 10-day forecasts, interactive radar maps, severe weather alerts, location search with autocomplete, favorite locations management, and fully offline functionality with service workers. Integrated with multiple weather APIs for comprehensive data. Installable on mobile devices and works seamlessly offline after initial load.',
    technologies: ['React', 'TypeScript', 'Service Workers', 'Workbox', 'Mapbox', 'OpenWeather API', 'IndexedDB', 'Vite'],
    category: 'web',
    featured: false,
    thumbnailUrl: '/images/projects/weather-pwa-thumb.jpg',
    imageUrl: '/images/projects/weather-pwa-full.jpg',
    githubUrl: 'https://github.com/yourusername/weather-pwa',
    liveUrl: 'https://weather-forecast-pwa.com',
    completedDate: '2024-11',
    teamSize: 1,
    role: 'Frontend Developer',
  },
  {
    id: 'proj-015',
    title: 'Blockchain Voting System',
    description: 'Secure and transparent voting platform built on blockchain technology ensuring vote integrity.',
    longDescription: 'A decentralized voting system leveraging blockchain technology to ensure transparency, security, and immutability of votes. Features include voter authentication with cryptographic signatures, anonymous voting while maintaining auditability, real-time vote counting with public verification, smart contracts for automated tallying, and a user-friendly interface for voters and administrators. Deployed on Ethereum testnet with plans for mainnet deployment. Includes comprehensive security audits and compliance with electoral standards.',
    technologies: ['Solidity', 'Ethereum', 'Web3.js', 'React', 'Hardhat', 'IPFS', 'MetaMask', 'Node.js', 'TypeScript'],
    category: 'other',
    featured: false,
    thumbnailUrl: '/images/projects/blockchain-vote-thumb.jpg',
    imageUrl: '/images/projects/blockchain-vote-full.jpg',
    githubUrl: 'https://github.com/yourusername/blockchain-voting',
    liveUrl: 'https://blockchain-voting-demo.com',
    completedDate: '2024-10',
    teamSize: 2,
    role: 'Blockchain Developer',
  },
];

// ===============================
// UTILITY FUNCTIONS
// ===============================

/**
 * Get all featured projects
 */
export const getFeaturedProjects = (): Project[] => {
  return projectsData.filter(project => project.featured);
};

/**
 * Get projects by category
 */
export const getProjectsByCategory = (category: Project['category']): Project[] => {
  return projectsData.filter(project => project.category === category);
};

/**
 * Get project by ID
 */
export const getProjectById = (id: string): Project | undefined => {
  return projectsData.find(project => project.id === id);
};

/**
 * Search projects by title, description, or technologies
 */
export const searchProjects = (query: string): Project[] => {
  const lowercaseQuery = query.toLowerCase();
  return projectsData.filter(project => 
    project.title.toLowerCase().includes(lowercaseQuery) ||
    project.description.toLowerCase().includes(lowercaseQuery) ||
    project.technologies.some(tech => tech.toLowerCase().includes(lowercaseQuery))
  );
};

/**
 * Get all unique categories
 */
export const getAllCategories = (): Project['category'][] => {
  return ['web', 'mobile', 'ai', 'fullstack', 'data', 'other'];
};

/**
 * Get all unique technologies across projects
 */
export const getAllTechnologies = (): string[] => {
  const techSet = new Set<string>();
  projectsData.forEach(project => {
    project.technologies.forEach(tech => techSet.add(tech));
  });
  return Array.from(techSet).sort();
};

/**
 * Get projects count by category
 */
export const getProjectsCountByCategory = (): Record<string, number> => {
  return projectsData.reduce((acc, project) => {
    acc[project.category] = (acc[project.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};
