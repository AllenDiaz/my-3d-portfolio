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
  categories: ('web' | 'mobile' | 'ai' | 'fullstack' | 'data' | 'other')[];
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
  // FEATURED PROJECT - DORA
  // ===============================
  {
    id: 'dora-invoice-processor',
    title: 'Document Recognition Assistant (DORA)',
    description: 'Enterprise AI-powered invoice processing platform that automates document extraction, validation, and export workflows. Processes 10,000+ invoices monthly with 95%+ accuracy using Google Cloud AI (Gemini 2.0).',
    longDescription: `Enterprise AI-powered invoice processing platform that automates document extraction, validation, and export workflows. Successfully processes 10,000+ invoices monthly with 95%+ accuracy using Google Cloud AI (Gemini 2.0).

**Key Achievements:**
• AI-Powered Invoice Extraction: Extracts 15+ fields from PDF/image invoices with intelligent parsing and confidence scoring
• Zero-Downtime Database Migration: Migrated from BigQuery to Cloud SQL PostgreSQL maintaining 100% uptime
• SharePoint Integration: Automated file synchronization via Microsoft Graph API with batch processing
• Professional Excel Export: Oracle EBS integration-ready format with auto-formatting
• Advanced UI/UX: Split-screen PDF viewer with dark/light theme and keyboard shortcuts

**Technical Highlights:**
• Processing Speed: 50-100 invoices/minute
• Accuracy: 95%+ field extraction confidence
• Uptime: 99.9% during migration period
• User Efficiency: 70% reduction in manual data entry
• Monthly Volume: 10,000+ invoices processed

**Architecture:**
Backend: FastAPI (Python 3.11), SQLAlchemy, PostgreSQL (Cloud SQL), BigQuery
Frontend: Next.js 14 (App Router), shadcn/ui, Tailwind CSS, PDF.js
AI/ML: Google Vertex AI (Gemini 2.0 Flash)
Infrastructure: GCP, Docker, Cloud Run, Kubernetes (GKE), Helm, GitHub Actions`,
    technologies: [
      'FastAPI',
      'Python 3.11',
      'PostgreSQL',
      'BigQuery',
      'Google Vertex AI',
      'Gemini 2.0',
      'Next.js 14',
      'React',
      'TypeScript',
      'shadcn/ui',
      'Tailwind CSS',
      'PDF.js',
      'SQLAlchemy',
      'Docker',
      'Kubernetes',
      'Helm',
      'GitHub Actions',
      'Google Cloud Platform',
      'Cloud Run',
      'Microsoft Graph API'
    ],
    categories: ['fullstack', 'ai'],
    featured: true,
    thumbnailUrl: '/images/projects/dora/dora-1.png',
    imageUrl: '/images/projects/dora/dora-1.png',
    githubUrl: 'RESTRICTED',
    liveUrl: 'RESTRICTED',
    completedDate: '2025-12',
    teamSize: 1,
    role: 'Full Stack Developer & AI Engineer',
  },

  // ===============================
  // CHURCH WEBSITE PROJECT - FEATURED
  // ===============================
  {
    id: 'friends-connection-ministry',
    title: 'Friends Connection Baptist Church Website',
    description: 'A comprehensive church website built with Next.js 15, TypeScript, and Tailwind CSS. Features 9 complete pages including an interactive event calendar with past and upcoming events, ministries showcase, and full church information system.',
    longDescription: `A modern, full-featured church website built with Next.js 15, TypeScript, and Tailwind CSS. Comprises 9 complete pages with responsive design, interactive navigation, and comprehensive church information system.

**9 Complete Pages:**
• Home - Landing page with church introduction and mission
• About - Church history, beliefs, and leadership
• Services - Worship service times and details
• Ministries - Ministry programs and activities showcase
• Events - Interactive calendar with past and upcoming events
• Contact - Contact information and inquiry form
• Gallery - Photo gallery of church events and activities
• Resources - Sermons, bulletins, and downloadable materials
• Give - Online giving and donation information

**Key Features:**
• Interactive Event Calendar: Dynamic event management with calendar view, filtering by month/year
• Past Events Archive: Comprehensive archive of previous church events with photos and details
• Upcoming Events Display: Featured upcoming events with countdown timers and registration links
• Responsive Navigation: Mobile hamburger menu with smooth transitions
• Server-Side Rendering: Optimized performance with Next.js App Router
• TypeScript Integration: Full type safety across all components
• Modern UI/UX: Clean design with Tailwind CSS utilities
• Optimized Font Loading: Geist font family for modern aesthetics
• SEO Optimized: Meta tags and structured data for search engines

**Event Management System:**
The event page features a sophisticated calendar system that allows users to:
• View events in calendar format with monthly navigation
• Filter events by category (worship, fellowship, outreach, youth)
• See detailed event information including time, location, and description
• Browse past events archive with photo galleries
• Register for upcoming events with integrated forms
• Export events to personal calendars (iCal/Google Calendar)

**Design Features:**
• Mobile-first responsive design approach
• Clean white/gray palette with blue accents for CTAs
• Consistent typography with Geist font family
• Sticky navbar with smooth scroll behavior
• Card-based layouts for content organization
• Hover effects and smooth transitions
• Semantic HTML and ARIA labels for accessibility
• Dark mode support with system preference detection

**Technical Implementation:**
• Component-based architecture with reusable UI elements
• Client and Server Components optimization
• Image optimization with Next.js Image component
• Form validation with real-time feedback
• Loading states and error handling
• Progressive Web App (PWA) capabilities

**Learning Outcomes:**
• Next.js 15 App Router architecture
• TypeScript in React applications
• Tailwind CSS utility-first approach
• Component-based design patterns
• Responsive web design principles
• Modern React patterns (Server Components)
• Event management system implementation
• Calendar UI/UX design patterns

**Performance Metrics:**
• Fast page loads with Next.js SSR
• 100% TypeScript coverage
• 9 fully responsive pages
• Mobile-first design
• Latest Next.js 15 & React 19
• Lighthouse score: 95+ across all categories`,
    technologies: [
      'Next.js 15',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'ESLint',
      'PostCSS'
    ],
    categories: ['web', 'fullstack'],
    featured: true,
    thumbnailUrl: '/images/projects/fc/fc1.png',
    imageUrl: '/images/projects/fc/fc1.png',
    githubUrl: 'https://github.com/AllenDiaz/Friends-Connection-Baptist-Church',
    liveUrl: 'https://www.friendsconnection.org/',
    completedDate: '2024-12',
    teamSize: 1,
    role: 'Full Stack Developer',
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
export const getProjectsByCategory = (category: 'web' | 'mobile' | 'ai' | 'fullstack' | 'data' | 'other'): Project[] => {
  return projectsData.filter(project => project.categories.includes(category));
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
export const getAllCategories = (): ('web' | 'mobile' | 'ai' | 'fullstack' | 'data' | 'other')[] => {
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
    project.categories.forEach(category => {
      acc[category] = (acc[category] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
};
