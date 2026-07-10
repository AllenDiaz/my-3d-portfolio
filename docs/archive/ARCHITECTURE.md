# 3D Portfolio - Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         app/page.tsx                             │
│                    (Main Landing Page)                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Scene3D.tsx                                 │
│           (Canvas Wrapper + Renderer Config)                     │
│  • WebGL settings                                                │
│  • Adaptive DPR [1, 2]                                           │
│  • Suspense + Loader                                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PerformanceOptimizer.tsx                        │
│              (Adaptive Quality Management)                        │
│  • AdaptiveDpr                                                   │
│  • AdaptiveEvents                                                │
│  • PerformanceMonitor                                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MainScene.tsx                               │
│                 (Scene Composition Hub)                          │
└──┬───────┬────────┬────────┬────────┬────────┬────────┬─────────┘
   │       │        │        │        │        │        │
   ▼       ▼        ▼        ▼        ▼        ▼        ▼
┌──────┐ ┌────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│Sound │ │Setup│ │Walls │ │Room  │ │Parts │ │Holo  │ │Items │
└──────┘ └────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘
                                                        │
                                                        ▼
                                              ┌─────────────────┐
                                              │ Post-Processing │
                                              └─────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT BREAKDOWN                           │
└─────────────────────────────────────────────────────────────────┘

1. AmbientSound.tsx
   └─ Web Audio API
      ├─ Sine wave drones (55Hz, 82.5Hz, 110Hz, 165Hz)
      ├─ LFO modulation
      ├─ White noise filter
      └─ Click/hover sounds

2. SceneSetup.tsx
   ├─ CinematicCamera.tsx
   │  ├─ GSAP animations
   │  ├─ 3-phase intro
   │  └─ Breathing effect
   ├─ OrbitControls
   │  ├─ Rotation
   │  ├─ Pan
   │  └─ Zoom
   ├─ Lighting System
   │  ├─ Ambient light
   │  ├─ Directional lights (2x)
   │  ├─ Point lights (3x)
   │  └─ Spotlight
   └─ Environment map

3. BinaryWall.tsx (x3)
   ├─ Custom shader material
   │  ├─ Vertex shader
   │  └─ Fragment shader
   ├─ Canvas texture generation
   ├─ Flicker animations
   └─ Positions: Left, Right, Front

4. OfficeRoom.tsx
   ├─ Floor (MeshReflectorMaterial)
   │  ├─ Real-time reflections
   │  ├─ Blur + mixing
   │  └─ Depth falloff
   ├─ Walls (x4)
   ├─ Ceiling
   ├─ Desk
   │  ├─ Desktop
   │  └─ Legs (x4)
   ├─ Chair
   │  ├─ Seat
   │  └─ Backrest
   ├─ Bookshelf
   │  ├─ Frame
   │  ├─ Shelves (x3)
   │  └─ Books (x6)
   ├─ Side Table
   │  ├─ Top
   │  └─ Leg
   └─ Window Frame

5. FloatingParticles.tsx
   ├─ 300 particle points
   ├─ Physics simulation
   │  ├─ Position updates
   │  ├─ Velocity vectors
   │  └─ Boundary checks
   ├─ Sinusoidal motion
   └─ Additive blending

6. HolographicDisplay.tsx
   ├─ Custom shader plane
   │  ├─ Grid pattern
   │  ├─ Scan lines
   │  └─ Pulse effect
   ├─ Point light glow
   └─ Particle ring

7. Interactive Items
   ├─ Computer.tsx (x3)
   │  ├─ Monitor base
   │  ├─ Stand
   │  ├─ Frame
   │  ├─ Screen (dynamic texture)
   │  ├─ Hover glow
   │  └─ Click → ProjectPanel
   ├─ DeskLamp.tsx (x1)
   │  ├─ Base
   │  ├─ Arm + joints
   │  ├─ Lamp head
   │  ├─ Light bulb
   │  ├─ Spotlight
   │  └─ Click → Toggle lights
   └─ DeskItem.tsx (x5)
      ├─ Keyboard
      ├─ Mouse
      ├─ Notebook
      ├─ Coffee cup
      └─ Phone

8. PostProcessing.tsx
   ├─ EffectComposer
   │  ├─ Bloom
   │  │  ├─ Intensity: 0.3-0.5
   │  │  ├─ Threshold: 0.2
   │  │  └─ Mipmapping
   │  ├─ SSAO
   │  │  ├─ Samples: 30
   │  │  ├─ Rings: 4
   │  │  └─ Intensity: 30-50
   │  ├─ DepthOfField
   │  │  ├─ Focus: 0.01
   │  │  ├─ Focal length: 0.2
   │  │  └─ Bokeh: 2-3
   │  ├─ Vignette
   │  │  ├─ Offset: 0.3
   │  │  └─ Darkness: 0.5-0.7
   │  └─ ChromaticAberration
   │     └─ Offset: [0.0005, 0.0005]
   └─ Multisampling: 8x

┌─────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT                            │
└─────────────────────────────────────────────────────────────────┘

store/useStore.ts (Zustand)
├─ selectedObject: string | null
├─ activeProject: Project | null
├─ showProjectPanel: boolean
├─ isAnimatingCamera: boolean
├─ lightsOn: boolean (NEW)
└─ projects: Project[]

┌─────────────────────────────────────────────────────────────────┐
│                      RENDER PIPELINE                             │
└─────────────────────────────────────────────────────────────────┘

1. Geometry Pass
   └─ Render all meshes with materials

2. Shadow Pass
   └─ Calculate shadows from lights

3. Reflection Pass
   └─ Render floor reflections

4. Post-Processing Pass
   ├─ SSAO calculation
   ├─ Bloom extraction
   ├─ Depth of Field blur
   ├─ Vignette overlay
   └─ Chromatic Aberration

5. Final Composite
   └─ Combine all passes → Screen

┌─────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE FLOW                              │
└─────────────────────────────────────────────────────────────────┘

PerformanceMonitor
       │
       ├─ FPS > 50 ──→ onIncline() ──→ Increase DPR to 2.0
       │                                  └─ Better quality
       │
       └─ FPS < 30 ──→ onDecline() ──→ Decrease DPR to 1.0
                                          └─ Better performance

AdaptiveDpr
   └─ Adjusts pixel ratio based on performance

AdaptiveEvents
   └─ Throttles mouse/touch events when needed

┌─────────────────────────────────────────────────────────────────┐
│                    INTERACTION FLOW                              │
└─────────────────────────────────────────────────────────────────┘

User Action          Component           Effect
──────────────────────────────────────────────────────────────────
Click Monitor    →   Computer.tsx    →   Open ProjectPanel
Click Lamp       →   DeskLamp.tsx    →   Toggle lightsOn state
Hover Item       →   DeskItem.tsx    →   Show label + animate
Drag Camera      →   OrbitControls   →   Rotate view
Scroll           →   OrbitControls   →   Zoom in/out
Page Load        →   CinematicCamera →   Intro animation
Any Interaction  →   AmbientSound    →   Initialize audio

┌─────────────────────────────────────────────────────────────────┐
│                    DATA FLOW                                     │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │  useStore    │
                    │  (Zustand)   │
                    └───────┬──────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
    ┌────────┐        ┌─────────┐       ┌──────────┐
    │DeskLamp│        │Computer │       │SceneSetup│
    │(lightsOn)       │(projects)       │(lightsOn)│
    └────────┘        └─────────┘       └──────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    FILE DEPENDENCIES                             │
└─────────────────────────────────────────────────────────────────┘

MainScene.tsx depends on:
├─ AmbientSound.tsx
├─ SceneSetup.tsx
│  └─ CinematicCamera.tsx
├─ BinaryWall.tsx
├─ OfficeRoom.tsx
├─ FloatingParticles.tsx
├─ HolographicDisplay.tsx
├─ Computer.tsx
├─ DeskItem.tsx
├─ DeskLamp.tsx
├─ PostProcessing.tsx
└─ store/useStore.ts

All components depend on:
├─ @react-three/fiber
├─ @react-three/drei
├─ three
└─ React

```

## Component Communication

```
┌─────────────────────────────────────────────────────────────────┐
│                    EVENT PROPAGATION                             │
└─────────────────────────────────────────────────────────────────┘

DeskLamp.tsx
    │
    ├─ onClick() ──→ setLightsOn(!lightsOn)
    │                      │
    │                      └──→ useStore.lightsOn updated
    │                                │
    │                                ├──→ SceneSetup.tsx (reads lightsOn)
    │                                │         └──→ Adjusts light intensity
    │                                │
    │                                └──→ PostProcessing.tsx (reads lightsOn)
    │                                          └──→ Adjusts effect intensity
    │
    └─ Render update with new emissive value

Computer.tsx
    │
    └─ onClick() ──→ setActiveProject(project)
                           │
                           └──→ setShowProjectPanel(true)
                                      │
                                      └──→ UI/ProjectPanel renders
```

This architecture ensures:
- ✅ Modular component design
- ✅ Clear separation of concerns
- ✅ Efficient state management
- ✅ Optimal performance
- ✅ Easy maintenance and expansion
