import { create } from 'zustand';
import { projectsData, type Project } from '@/data/projects';
import type { QualityTier } from '@/lib/deviceTier';

// Re-export Project type for convenience
export type { Project };

interface StoreState {
  // Selected interactive object
  selectedObject: string | null;
  setSelectedObject: (objectId: string | null) => void;
  
  // Active project being displayed
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  
  // UI visibility states
  showProjectPanel: boolean;
  setShowProjectPanel: (show: boolean) => void;
  
  // Camera animation state
  isAnimatingCamera: boolean;
  setIsAnimatingCamera: (isAnimating: boolean) => void;
  
  // Light mode state
  lightsOn: boolean;
  setLightsOn: (lightsOn: boolean) => void;

  // Rendering quality tier (set once from device detection on mount)
  qualityTier: QualityTier;
  setQualityTier: (tier: QualityTier) => void;
  
  // Chair notification state
  showChairNotification: boolean;
  setShowChairNotification: (show: boolean) => void;
  
  // Coffee notification state
  showCoffeeNotification: boolean;
  setShowCoffeeNotification: (show: boolean) => void;
  
  // Skills Modal state
  showSkillsModal: boolean;
  setShowSkillsModal: (show: boolean) => void;
  
  // Experience Modal state
  showExperienceModal: boolean;
  setShowExperienceModal: (show: boolean) => void;
  
  // Certificate Modal state
  showCertificateModal: boolean;
  setShowCertificateModal: (show: boolean) => void;
  
  // CV Modal state
  showCVModal: boolean;
  setShowCVModal: (show: boolean) => void;

  // Contact Modal state
  showContactModal: boolean;
  setShowContactModal: (show: boolean) => void;
  
  // All Projects Modal state
  showAllProjectsModal: boolean;
  setShowAllProjectsModal: (show: boolean) => void;
  
  // Restricted Link Modal state
  showRestrictedLinkModal: boolean;
  restrictedLinkType: 'code' | 'live' | null;
  setShowRestrictedLinkModal: (show: boolean, linkType?: 'code' | 'live') => void;
  
  // Character visibility state
  showCharacter: boolean;
  setShowCharacter: (show: boolean) => void;
  
  // Projects data
  allProjects: Project[];
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  
  // Project getters and filters
  featuredProjects: () => Project[];
  getProjectsByCategory: (category: 'web' | 'mobile' | 'ai' | 'fullstack' | 'data' | 'other') => Project[];
  searchProjects: (query: string) => Project[];
  getProjectById: (id: string) => Project | undefined;
}

export const useStore = create<StoreState>((set, get) => ({
  selectedObject: null,
  setSelectedObject: (objectId) => set({ selectedObject: objectId }),
  
  activeProject: null,
  setActiveProject: (project) => set({ activeProject: project }),
  
  showProjectPanel: false,
  setShowProjectPanel: (show) => set({ showProjectPanel: show }),
  
  isAnimatingCamera: false,
  setIsAnimatingCamera: (isAnimating) => set({ isAnimatingCamera: isAnimating }),
  
  lightsOn: true,
  setLightsOn: (lightsOn) => set({ lightsOn }),

  // Default to 'high' for SSR; overwritten on mount via detectDeviceTier()
  qualityTier: 'high',
  setQualityTier: (tier) => set({ qualityTier: tier }),
  
  showChairNotification: false,
  setShowChairNotification: (show) => set({ showChairNotification: show }),
  
  showCoffeeNotification: false,
  setShowCoffeeNotification: (show) => set({ showCoffeeNotification: show }),
  
  showSkillsModal: false,
  setShowSkillsModal: (show) => set({ showSkillsModal: show }),
  
  showExperienceModal: false,
  setShowExperienceModal: (show) => set({ showExperienceModal: show }),
  
  showCertificateModal: false,
  setShowCertificateModal: (show) => set({ showCertificateModal: show }),
  
  showCVModal: false,
  setShowCVModal: (show) => set({ showCVModal: show }),

  showContactModal: false,
  setShowContactModal: (show) => set({ showContactModal: show }),
  
  showAllProjectsModal: false,
  setShowAllProjectsModal: (show) => set({ showAllProjectsModal: show }),
  
  showRestrictedLinkModal: false,
  restrictedLinkType: null,
  setShowRestrictedLinkModal: (show, linkType) => set({ 
    showRestrictedLinkModal: show, 
    restrictedLinkType: linkType || null 
  }),
  
  showCharacter: false,
  setShowCharacter: (show) => set({ showCharacter: show }),
  
  // All projects from data file
  allProjects: projectsData,
  
  // Current filtered/displayed projects (defaults to all)
  projects: projectsData,
  setProjects: (projects) => set({ projects }),
  
  // Get only featured projects
  featuredProjects: () => {
    const state = get();
    return state.allProjects.filter(project => project.featured);
  },
  
  // Get projects by category
  getProjectsByCategory: (category: 'web' | 'mobile' | 'ai' | 'fullstack' | 'data' | 'other') => {
    const state = get();
    return state.allProjects.filter(project => project.categories.includes(category));
  },
  
  // Search projects by title, description, or technologies
  searchProjects: (query: string) => {
    const state = get();
    const lowercaseQuery = query.toLowerCase().trim();
    
    if (!lowercaseQuery) {
      return state.allProjects;
    }
    
    return state.allProjects.filter(project =>
      project.title.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      project.longDescription?.toLowerCase().includes(lowercaseQuery) ||
      project.technologies.some(tech => tech.toLowerCase().includes(lowercaseQuery)) ||
      project.categories.some(cat => cat.toLowerCase().includes(lowercaseQuery))
    );
  },
  
  // Get project by ID
  getProjectById: (id: string) => {
    const state = get();
    return state.allProjects.find(project => project.id === id);
  },
}));
