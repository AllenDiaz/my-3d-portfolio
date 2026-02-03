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
    category: 'ai',
    featured: true,
    thumbnailUrl: '/images/projects/dora/dora-1.png',
    imageUrl: '/images/projects/dora/dora-1.png',
    githubUrl: 'RESTRICTED',
    liveUrl: 'RESTRICTED',
    completedDate: '2025-12',
    teamSize: 1,
    role: 'Full Stack Developer & AI Engineer',
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
