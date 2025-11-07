# 3D Interactive Portfolio Components - Enhanced

This directory contains all the 3D components for the interactive office/workspace portfolio with advanced visual effects and optimizations.

## Component Structure

### Core Components

- **Scene3D.tsx**: Main Canvas wrapper with Three.js configuration and performance optimization
- **MainScene.tsx**: Scene composition bringing all elements together
- **SceneSetup.tsx**: Camera controls, lighting, and environment setup
- **PerformanceOptimizer.tsx**: Adaptive performance management for optimal frame rates

### Interactive Elements

- **Computer.tsx**: Interactive monitor displays with dynamic screen content and PBR materials
- **DeskItem.tsx**: Interactive desk objects (keyboard, mouse, notebook, coffee, phone) with hover effects
- **DeskLamp.tsx**: Toggleable desk lamp with realistic lighting and shadows
- **OfficeRoom.tsx**: Complete 3D office environment with reflective floor and furniture

### Visual Effects

- **PostProcessing.tsx**: Advanced post-processing effects including:
  - Bloom for glowing elements
  - SSAO (Screen Space Ambient Occlusion) for realistic shadows
  - Depth of Field for cinematic focus
  - Vignette for atmospheric depth
  - Chromatic Aberration for subtle realism

- **FloatingParticles.tsx**: Atmospheric particle system with dust motes
- **BinaryWall.tsx**: Animated binary code walls with shader effects
- **HolographicDisplay.tsx**: Futuristic holographic display with custom shaders

### Advanced Features

- **CinematicCamera.tsx**: Smooth camera intro animation using GSAP
- **AmbientSound.tsx**: Web Audio API-based ambient sound system with interaction feedback

### UI Components (../ui/)

- **ProjectPanel.tsx**: Floating modal that displays project information
- **LightToggle.tsx**: Toggle button for scene lighting

## Features

### Visual Enhancements
- ✨ Advanced post-processing effects (Bloom, SSAO, DOF, Vignette)
- 🌟 Physically-Based Rendering (PBR) materials
- 🪞 Real-time floor reflections using MeshReflectorMaterial
- 💫 Atmospheric floating particles
- 🎨 Dynamic screen textures on monitors
- 🔮 Holographic display with custom shaders
- 🌊 Animated binary walls with flickering effects

### Interaction & Animation
- 🖱️ Click on monitors to view projects
- 💡 Interactive desk lamp with light toggle
- 📱 Hover effects on all interactive objects
- 🎬 Cinematic camera introduction sequence
- 🎮 Orbit controls for 360° navigation
- 🎵 Ambient soundscape with interaction feedback

### Performance Optimizations
- ⚡ Adaptive DPR (Device Pixel Ratio)
- 📊 Performance monitoring and auto-adjustment
- 🎯 Level of Detail (LOD) management
- 🔧 Adaptive event throttling
- 🚀 Optimized renderer settings

## Technologies Used

- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Helpers and abstractions (OrbitControls, Environment, MeshReflectorMaterial)
- **@react-three/postprocessing** - Post-processing effects pipeline
- **three.js** - Core 3D graphics library
- **gsap** - Animation library for cinematic camera movements
- **zustand** - State management
- **framer-motion** - UI animations
- **Web Audio API** - Ambient sound system

## Usage

The main scene is rendered in `app/page.tsx` and `app/3d-office/page.tsx`:

```tsx
<Scene3D>
  <MainScene />
</Scene3D>
```

## State Management

Global state is managed in `store/useStore.ts`:
- Selected objects
- Active projects
- UI visibility states
- Light states (on/off)
- Projects data

## Performance Considerations

The scene automatically adapts to device capabilities:
- Reduces quality on lower-end devices
- Throttles events when FPS drops
- Uses adaptive pixel ratio
- Monitors frame rate and adjusts accordingly

## Customization

### Adjusting Visual Effects

Edit `PostProcessing.tsx` to modify:
- Bloom intensity
- SSAO strength
- Depth of field focus
- Vignette darkness

### Modifying Camera Animation

Edit `CinematicCamera.tsx` to change:
- Animation duration
- Camera path
- Easing functions

### Changing Materials

Edit individual component files to adjust:
- Metalness
- Roughness
- Colors
- Environment map intensity

## New Improvements (Latest Update)

1. **Post-Processing Pipeline**: Added bloom, SSAO, depth of field, vignette, and chromatic aberration
2. **Particle System**: Floating atmospheric particles for depth
3. **PBR Materials**: Enhanced materials with proper metalness and roughness values
4. **Reflective Floor**: Real-time reflections on the floor surface
5. **Interactive Lamp**: Desk lamp with toggleable light and realistic shadows
6. **Cinematic Camera**: Smooth intro animation with GSAP
7. **Ambient Sound**: Subtle background audio with interaction feedback
8. **Performance Optimization**: Adaptive quality management
9. **Holographic Display**: Futuristic holographic element with custom shaders
10. **Dynamic Screen Content**: Monitors now display dynamic content with grid patterns

## Troubleshooting

### Performance Issues
- The scene will automatically reduce quality if FPS drops
- You can manually adjust post-processing intensity in `PostProcessing.tsx`
- Reduce particle count in `MainScene.tsx` (currently set to 300)

### Audio Not Playing
- Audio requires user interaction to start (browser security)
- Click anywhere on the page to initialize the audio context

### Camera Not Animating
- Make sure `enableCinematicIntro` is set to `true` in `SceneSetup.tsx`
- The animation only plays once on page load
