# Customization Guide

## Adding Your Own Projects

Edit `store/useStore.ts` and replace the sample projects with your actual work:

```typescript
projects: [
  {
    id: '1',
    title: 'Your Project Name',
    description: 'Detailed description of what the project does',
    technologies: ['React', 'Node.js', 'MongoDB', 'etc'],
    githubUrl: 'https://github.com/yourusername/project',
    liveUrl: 'https://your-project-live-url.com'
  },
  // Add more projects...
],
```

## Customizing Colors

### Room Colors
In `components/3d/OfficeRoom.tsx`:
- Floor: Change `color="#1a1a1a"` 
- Walls: Change `color="#0f0f0f"`
- Desk: Change `color="#2a2a2a"`

### Monitor Colors
In `components/3d/Computer.tsx`:
- Screen color: Change `color="#1a3a52"`
- Hover glow: Change `color="#4a90e2"`

### UI Colors
In `components/ui/ProjectPanel.tsx`:
- Gradient: Modify `from-blue-600 via-purple-600 to-pink-600`
- Background: Change `bg-zinc-900`

## Adjusting Camera

In `components/3d/SceneSetup.tsx`:

```typescript
<PerspectiveCamera 
  makeDefault 
  position={[0, 1.5, 5]}  // Change starting position
  fov={50}                 // Change field of view
/>

<OrbitControls
  minDistance={2}          // Minimum zoom
  maxDistance={15}         // Maximum zoom
  target={[0, 1, 0]}       // What camera looks at
/>
```

## Adding More Interactive Objects

1. **Add a new desk item:**
```typescript
// In components/3d/MainScene.tsx
<DeskItem 
  position={[x, y, z]} 
  itemType="your-type"
  label="Your Label"
  onClick={() => {
    // Your custom action
  }}
/>
```

2. **Add a new item type:**
Edit `components/3d/DeskItem.tsx` and add to the switch statement:
```typescript
case 'your-item':
  return (
    <mesh castShadow>
      {/* Your 3D geometry */}
    </mesh>
  );
```

## Modifying Lighting

In `components/3d/SceneSetup.tsx`:

```typescript
// Adjust light intensity
<ambientLight intensity={0.3} />  // Overall brightness

// Change light colors
<pointLight color="#ffd89b" />    // Warm desk light
<pointLight color="#4a90e2" />    // Cool accent light

// Reposition lights
<directionalLight position={[x, y, z]} />
```

## Changing Room Layout

In `components/3d/OfficeRoom.tsx`:

- Move desk: Change `position={[0, 0, -2]}`
- Resize furniture: Modify `args={[width, height, depth]}`
- Add new furniture: Copy and modify existing groups

## Performance Optimization

### Reduce Shadow Quality
```typescript
// In components/3d/SceneSetup.tsx
shadow-mapSize-width={1024}   // Lower from 2048
shadow-mapSize-height={1024}
```

### Simplify Geometry
```typescript
// Use lower polygon counts
<sphereGeometry args={[0.15, 8, 8]} />  // Lower last two numbers
```

### Disable Shadows on Small Objects
```typescript
<mesh>  // Remove castShadow and receiveShadow props
  <boxGeometry args={[1, 1, 1]} />
</mesh>
```

## Mobile Optimization

Add to `components/3d/SceneSetup.tsx`:

```typescript
const isMobile = window.innerWidth < 768;

<OrbitControls
  enableZoom={!isMobile}
  touchSensitivity={isMobile ? 2 : 1}
/>
```

## Adding Sound Effects

1. Install howler: `npm install howler @types/howler`

2. In your click handler:
```typescript
import { Howl } from 'howler';

const clickSound = new Howl({
  src: ['/sounds/click.mp3']
});

const handleClick = () => {
  clickSound.play();
  // ... rest of code
};
```

## Adding More Monitors

In `components/3d/MainScene.tsx`:

```typescript
<Computer 
  position={[x, y, z]}  // Your position
  projectId="4"         // New project ID
/>
```

Then add project "4" to the store.

## Custom Animations

Add to any component:

```typescript
import { useFrame } from '@react-three/fiber';

useFrame((state) => {
  if (meshRef.current) {
    // Rotate
    meshRef.current.rotation.y += 0.01;
    
    // Float
    meshRef.current.position.y = 
      initialY + Math.sin(state.clock.elapsedTime) * 0.1;
    
    // Scale pulse
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    meshRef.current.scale.set(scale, scale, scale);
  }
});
```

## Debugging Tips

1. **See what you're clicking:**
```typescript
onClick={(e) => {
  console.log('Clicked:', e.object.name);
  console.log('Position:', e.point);
}}
```

2. **Check performance:**
```typescript
// Add to Scene3D.tsx
import { Stats } from '@react-three/drei';

<Canvas>
  <Stats />  {/* Shows FPS */}
  {/* ... */}
</Canvas>
```

3. **View scene in isolation:**
Comment out other components in `MainScene.tsx` to debug individual elements.

## Common Issues

**Objects not visible?**
- Check position coordinates
- Verify camera is looking at object
- Ensure object has material

**No shadows?**
- Add `castShadow` to object
- Add `receiveShadow` to floor
- Enable shadows on lights

**Performance issues?**
- Reduce shadow map size
- Lower geometry complexity
- Use fewer lights
- Disable environment map

**Click not working?**
- Ensure mesh has onClick handler
- Check if object is behind another mesh
- Verify OrbitControls not blocking events
