# 3D Interactive Portfolio Components

This directory contains all the 3D components for the interactive office/workspace portfolio.

## Component Structure

### Core Components

- **Scene3D.tsx**: Main Canvas wrapper with Three.js configuration
- **MainScene.tsx**: Scene composition bringing all elements together
- **SceneSetup.tsx**: Camera controls, lighting, and environment setup

### Interactive Elements

- **Computer.tsx**: Interactive monitor displays that show project details when clicked
- **DeskItem.tsx**: Interactive desk objects (keyboard, mouse, notebook, coffee, phone)
- **OfficeRoom.tsx**: Complete 3D office environment with walls, floor, furniture

### UI Components (../ui/)

- **ProjectPanel.tsx**: Floating modal that displays project information

## Features

- ✨ Fully interactive 3D workspace
- 🖱️ Click on monitors to view projects
- 📱 Hover effects and animations
- 🎮 Orbit controls for navigation
- 💡 Dynamic lighting system
- 🎨 Modern glassmorphism UI
- 📦 Modular component architecture

## Technologies Used

- @react-three/fiber - React renderer for Three.js
- @react-three/drei - Helpers and abstractions
- zustand - State management
- framer-motion - UI animations
- three.js - 3D graphics library

## Usage

The main scene is rendered in `app/page.tsx`:

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
- Projects data
