feat: Add interactive 3D office environment with clickable portfolio objects

## Summary
Implemented a fully interactive 3D workspace where users can explore the portfolio by navigating through a virtual office and clicking on objects to reveal projects and information.

## Components Added

### 3D Scene Infrastructure
- Scene3D: Canvas wrapper with Three.js configuration and loading states
- MainScene: Scene composition orchestrating all 3D elements
- SceneSetup: Camera controls (OrbitControls) and multi-source lighting system

### Interactive 3D Models
- OfficeRoom: Complete office environment (walls, floor, ceiling, desk, chair, bookshelf, side table, window)
- Computer: Three clickable monitors with hover effects and glow animations
- DeskItem: Five interactive desk objects (keyboard, mouse, notebook, coffee cup, phone)

### UI Components
- ProjectPanel: Animated modal with glassmorphism design displaying project details, technologies, and links

### State Management
- useStore: Zustand store managing selected objects, active projects, and UI visibility

## Features
✨ Click on monitors to view project details
🖱️ Hover effects with animations and tooltips
🎮 Orbit controls for camera navigation (drag, zoom, pan)
💡 Dynamic lighting with shadows and reflections
🎨 Modern glassmorphism UI with smooth animations
📦 Modular, reusable component architecture
🏗️ TypeScript for type safety

## Technologies Used
- @react-three/fiber & @react-three/drei
- Three.js for 3D graphics
- Zustand for state management
- Framer Motion for UI animations
- Lucide React for icons
- Next.js with dynamic imports

## File Structure
```
components/
├── 3d/
│   ├── Scene3D.tsx
│   ├── MainScene.tsx
│   ├── SceneSetup.tsx
│   ├── OfficeRoom.tsx
│   ├── Computer.tsx
│   └── DeskItem.tsx
├── ui/
│   └── ProjectPanel.tsx
store/
└── useStore.ts
```

## Testing
✅ Build successful with no errors
✅ All components properly typed
✅ Dynamic imports prevent SSR issues
✅ Optimized performance settings

---
Commit Type: Feature Addition
Breaking Changes: None
Scope: Portfolio 3D Experience
