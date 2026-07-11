import { create } from 'zustand';
import type { Object3D } from 'three';
import { projectsData, type Project } from '@/data/projects';
import type { QualityTier } from '@/lib/deviceTier';
import type { RobotConfig } from '@/components/3d/Robots/robotConfig';
import type { FocusId } from '@/components/3d/cameraPoses';

// Re-export Project type for convenience
export type { Project };

// Default camera framing shared by the cinematic intro, the skip-intro snap,
// and the reset-view glide (SceneSetup's OrbitControls target matches).
export const REST_CAMERA_POSITION: [number, number, number] = [0, 1.45, 3.6];
export const REST_CAMERA_TARGET: [number, number, number] = [0, 1.05, -1.9];

// A click-to-focus flight request. SceneSetup flies the camera to the pose for
// `id` and fires `onArrive` (typically the object's modal opener) just before
// the camera settles. Setting focusRequest back to null while focusActive asks
// for the return flight to the pre-focus view.
export interface FocusRequest {
  id: FocusId;
  onArrive?: () => void;
  token: number;
}

interface StoreState {
  // Active project being displayed
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  
  // UI visibility states
  showProjectPanel: boolean;
  setShowProjectPanel: (show: boolean) => void;
  
  // Cinematic intro state: true while the fly-in timeline runs. Setting it
  // false mid-flight (the "Skip intro" button) makes CinematicCamera kill the
  // timeline and snap to the resting shot.
  introPlaying: boolean;
  setIntroPlaying: (playing: boolean) => void;

  // Bumping this token asks SceneSetup to glide the camera back to the
  // default framing (wired to the desk mouse and the overlay reset button).
  cameraResetToken: number;
  requestCameraReset: () => void;

  // Click-to-focus camera flights. `focusActive` is owned by SceneSetup and
  // stays true from flight start until the return flight completes.
  focusRequest: FocusRequest | null;
  focusActive: boolean;
  setFocusActive: (active: boolean) => void;
  requestCameraFocus: (id: FocusId, onArrive?: () => void) => void;
  clearCameraFocus: () => void;

  // Light mode state
  lightsOn: boolean;
  setLightsOn: (lightsOn: boolean) => void;

  // Ambient/interaction sound mute (session-scoped)
  soundMuted: boolean;
  setSoundMuted: (muted: boolean) => void;

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

  // Avatar ("About Allen") Modal state
  showAvatarModal: boolean;
  setShowAvatarModal: (show: boolean) => void;

  // Which robot Allen is currently tuning up (one-at-a-time lock); drives both
  // the robot's "being serviced" phase and Allen's fixing animation.
  servicingRobotId: string | null;
  setServicingRobotId: (id: string | null) => void;

  // Live world anchor at Allen's hands (set by the Avatar); a serviced agent
  // floats to this so it always sits in his hands. Non-reactive ref holder.
  serviceAnchor: Object3D | null;
  setServiceAnchor: (obj: Object3D | null) => void;

  // Robot flavor Modal state + which robot was clicked
  showRobotModal: boolean;
  selectedRobot: RobotConfig | null;
  /** Pass the robot to open its card; pass false to close (clears selection). */
  setShowRobotModal: (show: boolean, robot?: RobotConfig | null) => void;

  // All Projects Modal state
  showAllProjectsModal: boolean;
  setShowAllProjectsModal: (show: boolean) => void;
  
  // Restricted Link Modal state
  showRestrictedLinkModal: boolean;
  restrictedLinkType: 'code' | 'live' | null;
  setShowRestrictedLinkModal: (show: boolean, linkType?: 'code' | 'live') => void;
  
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
  activeProject: null,
  setActiveProject: (project) => set({ activeProject: project }),
  
  showProjectPanel: false,
  setShowProjectPanel: (show) => set({ showProjectPanel: show }),
  
  introPlaying: false,
  setIntroPlaying: (playing) => set({ introPlaying: playing }),

  cameraResetToken: 0,
  requestCameraReset: () => set({ cameraResetToken: get().cameraResetToken + 1 }),

  focusRequest: null,
  focusActive: false,
  setFocusActive: (active) => set({ focusActive: active }),
  requestCameraFocus: (id, onArrive) => {
    // The intro timeline owns the camera; open the target UI without a flight.
    if (get().introPlaying) {
      onArrive?.();
      return;
    }
    const prev = get().focusRequest;
    set({ focusRequest: { id, onArrive, token: (prev?.token ?? 0) + 1 } });
  },
  clearCameraFocus: () => {
    if (!get().focusRequest && !get().focusActive) return;
    set({ focusRequest: null });
  },

  lightsOn: true,
  setLightsOn: (lightsOn) => set({ lightsOn }),

  soundMuted: false,
  setSoundMuted: (muted) => set({ soundMuted: muted }),

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

  showAvatarModal: false,
  setShowAvatarModal: (show) => set({ showAvatarModal: show }),

  servicingRobotId: null,
  setServicingRobotId: (id) => set({ servicingRobotId: id }),

  serviceAnchor: null,
  setServiceAnchor: (obj) => set({ serviceAnchor: obj }),

  showRobotModal: false,
  selectedRobot: null,
  setShowRobotModal: (show, robot) =>
    set({ showRobotModal: show, selectedRobot: show ? robot ?? null : null }),

  showAllProjectsModal: false,
  setShowAllProjectsModal: (show) => set({ showAllProjectsModal: show }),
  
  showRestrictedLinkModal: false,
  restrictedLinkType: null,
  setShowRestrictedLinkModal: (show, linkType) => set({ 
    showRestrictedLinkModal: show, 
    restrictedLinkType: linkType || null 
  }),
  
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

/** True while any modal or notification overlay is showing (used to hold off
 *  ambient camera behaviors like the idle attract orbit). */
export function isAnyOverlayOpen(state: StoreState): boolean {
  return (
    state.showProjectPanel ||
    state.showSkillsModal ||
    state.showExperienceModal ||
    state.showCertificateModal ||
    state.showCVModal ||
    state.showContactModal ||
    state.showAvatarModal ||
    state.showRobotModal ||
    state.showAllProjectsModal ||
    state.showRestrictedLinkModal ||
    state.showChairNotification ||
    state.showCoffeeNotification
  );
}
