import { create } from 'zustand';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
}

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
  
  // Projects data
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}

export const useStore = create<StoreState>((set) => ({
  selectedObject: null,
  setSelectedObject: (objectId) => set({ selectedObject: objectId }),
  
  activeProject: null,
  setActiveProject: (project) => set({ activeProject: project }),
  
  showProjectPanel: false,
  setShowProjectPanel: (show) => set({ showProjectPanel: show }),
  
  isAnimatingCamera: false,
  setIsAnimatingCamera: (isAnimating) => set({ isAnimatingCamera: isAnimating }),
  
  projects: [
    {
      id: '1',
      title: 'Project Alpha',
      description: 'A full-stack web application with modern technologies',
      technologies: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com'
    },
    {
      id: '2',
      title: 'Project Beta',
      description: '3D interactive portfolio with Three.js',
      technologies: ['Three.js', 'React Three Fiber', 'Next.js'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com'
    },
    {
      id: '3',
      title: 'Project Gamma',
      description: 'E-commerce platform with payment integration',
      technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Tailwind'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com'
    }
  ],
  setProjects: (projects) => set({ projects }),
}));
