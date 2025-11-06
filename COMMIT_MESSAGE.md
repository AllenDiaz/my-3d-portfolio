feat: Add interactive Hero/Landing section with professional profile overlay

## Summary
Implemented a stunning Hero/Landing section that overlays the 3D office environment, showcasing professional information, skills, and call-to-action elements with modern glassmorphism design.

## New Component Added

### Hero.tsx
- **Professional Headline**: Large, gradient-styled name with job title
- **Tagline & Description**: Brief introduction highlighting expertise and passion
- **Tech Stack Pills**: Interactive badges displaying key technologies (React, Next.js, TypeScript, Three.js, Node.js, TailwindCSS)
- **CTA Buttons**: 
  - View My Work (primary with gradient hover effect)
  - Contact Me (secondary with glassmorphism)
  - Download Resume (tertiary)
- **Social Links**: GitHub, LinkedIn, Email with hover animations
- **Professional Photo Section**: 
  - Circular photo container with animated gradient border
  - Placeholder with initials (ready for actual photo)
  - Floating stats card (Years Experience, Projects, Satisfaction)
- **Scroll Indicator**: Animated mouse icon encouraging exploration

## Key Features
✨ Smooth entrance animations with staggered children
🎨 Glassmorphism design (backdrop blur, transparency, subtle borders)
🖼️ Professional photo section with gradient effects
📊 Stats display with experience metrics
💫 Hover effects and micro-interactions
📱 Responsive layout (desktop optimized)
� Direct links to GitHub, LinkedIn, and email
📄 Resume download functionality
⬇️ Animated scroll indicator

## Design Elements
- **Color Scheme**: Blue to purple gradient accents on dark background
- **Typography**: Bold headings with gradient text effects
- **Glassmorphism**: Semi-transparent backgrounds with backdrop blur
- **Animations**: Framer Motion for smooth transitions and hover states
- **Icons**: Lucide React for consistent iconography

## Information Sourced from CV
- Name: Allen Diaz
- Title: Full-Stack Developer & Creative Problem Solver
- GitHub: https://github.com/AllenDiaz
- LinkedIn: https://www.linkedin.com/in/allen-diaz-525071258/
- Email: allendiaz.developer@gmail.com
- Technologies: React, Next.js, TypeScript, Three.js, Node.js, TailwindCSS

## Technical Implementation
- Framer Motion variants for coordinated animations
- TypeScript with proper type safety (const assertions for ease arrays)
- Pointer-events optimization (only interactive elements accept clicks)
- Z-index layering (Hero at z-10, above 3D scene)
- Absolute positioning for overlay effect
- Container max-width for optimal reading

## File Structure
```
components/
├── Hero.tsx (NEW)
app/
└── page.tsx (UPDATED - Hero integration)
```

## Integration
- Hero section positioned as absolute overlay on 3D scene
- Maintains non-intrusive design allowing 3D interaction
- Instructions moved to bottom for better visibility
- All interactive elements have proper pointer-events

## Testing
✅ Build successful with no errors
✅ TypeScript compilation passes
✅ Animations work smoothly
✅ Responsive design verified
✅ All links properly configured

---
Commit Type: Feature Addition
Breaking Changes: None
Scope: Hero/Landing Section
Related to: 3D Portfolio Experience
