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
  categories: ('web' | 'mobile' | 'ai' | 'fullstack' | 'data' | 'other')[];
  featured: boolean;
  imageUrl?: string;
  thumbnailUrl?: string;
  /** Gallery screenshots shown on the project detail page. */
  images?: string[];
  githubUrl?: string;
  liveUrl?: string;
  demoVideoUrl?: string;
  publicationUrl?: string;
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
    description: 'Enterprise LLM document-extraction platform: a Gemini 2.0 (Vertex AI) pipeline that parses PDF/image invoices into 15+ structured fields with per-field confidence scoring and validation. Processes 10,000+ invoices monthly at 95%+ accuracy — my production AI-engineering work.',
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
    categories: ['fullstack', 'ai'],
    featured: true,
    thumbnailUrl: '/images/projects/dora/dora-1.png',
    imageUrl: '/images/projects/dora/dora-1.png',
    images: [
      '/images/projects/dora/dora-1.png',
      '/images/projects/dora/dora-2.png',
      '/images/projects/dora/dora-3.png',
      '/images/projects/dora/dora-4.png',
    ],
    githubUrl: 'RESTRICTED',
    liveUrl: 'RESTRICTED',
    completedDate: '2025-12',
    teamSize: 1,
    role: 'Full Stack Developer & AI Engineer',
  },

  // ==================================================================
  // TODO(allen): AGENTIC PROJECT PLACEHOLDERS — fill with REAL shipped
  // work, then set `featured: true` to surface on the office monitors.
  // Nothing here is real yet; replace every field before publishing.
  // Delete any placeholder you don't have a real project for.
  // ==================================================================
  {
    id: 'agentic-placeholder-1',
    title: 'TODO: Agentic AI Project #1',
    description:
      'TODO: describe a real agent you built — e.g. an LLM tool-calling agent with an eval loop. Cover what it does, the orchestration, and a concrete result.',
    longDescription: `TODO: replace with the real story.

**What it does:** ...
**Agentic architecture:** tool-calling / planning / memory / orchestration (LangGraph or custom)
**Evals:** how you measure and guard quality
**Result:** a concrete, honest outcome (throughput, accuracy, time saved)`,
    technologies: ['Anthropic SDK', 'MCP', 'RAG', 'pgvector', 'Python', 'TypeScript'],
    categories: ['ai', 'fullstack'],
    featured: false,
    role: 'AI Engineer',
  },
  {
    id: 'agentic-placeholder-2',
    title: 'TODO: Agentic AI Project #2',
    description:
      'TODO: a second real agentic/LLM project — RAG assistant, multi-step agent, MCP integration, etc. Keep every claim truthful and specific.',
    longDescription: `TODO: replace with the real story (or delete this entry).`,
    technologies: ['OpenAI SDK', 'LangGraph', 'RAG', 'Vector DB', 'Next.js'],
    categories: ['ai'],
    featured: false,
    role: 'AI Engineer',
  },

  // ===============================
  // CHURCH WEBSITE PROJECT - FEATURED
  // ===============================
  {
    id: 'friends-connection-ministry',
    title: 'Friends Connection Baptist Church Website',
    description: 'A comprehensive church website built with Next.js 15, TypeScript, and Tailwind CSS. Features 9 complete pages including an interactive event calendar with past and upcoming events, ministries showcase, and full church information system.',
    longDescription: `A modern, full-featured church website built with Next.js 15, TypeScript, and Tailwind CSS. Comprises 9 complete pages with responsive design, interactive navigation, and comprehensive church information system.

**9 Complete Pages:**
• Home - Landing page with church introduction and mission
• About - Church history, beliefs, and leadership
• Services - Worship service times and details
• Ministries - Ministry programs and activities showcase
• Events - Interactive calendar with past and upcoming events
• Contact - Contact information and inquiry form
• Gallery - Photo gallery of church events and activities
• Resources - Sermons, bulletins, and downloadable materials
• Give - Online giving and donation information

**Key Features:**
• Interactive Event Calendar: Dynamic event management with calendar view, filtering by month/year
• Past Events Archive: Comprehensive archive of previous church events with photos and details
• Upcoming Events Display: Featured upcoming events with countdown timers and registration links
• Responsive Navigation: Mobile hamburger menu with smooth transitions
• Server-Side Rendering: Optimized performance with Next.js App Router
• TypeScript Integration: Full type safety across all components
• Modern UI/UX: Clean design with Tailwind CSS utilities
• Optimized Font Loading: Geist font family for modern aesthetics
• SEO Optimized: Meta tags and structured data for search engines

**Event Management System:**
The event page features a sophisticated calendar system that allows users to:
• View events in calendar format with monthly navigation
• Filter events by category (worship, fellowship, outreach, youth)
• See detailed event information including time, location, and description
• Browse past events archive with photo galleries
• Register for upcoming events with integrated forms
• Export events to personal calendars (iCal/Google Calendar)

**Design Features:**
• Mobile-first responsive design approach
• Clean white/gray palette with blue accents for CTAs
• Consistent typography with Geist font family
• Sticky navbar with smooth scroll behavior
• Card-based layouts for content organization
• Hover effects and smooth transitions
• Semantic HTML and ARIA labels for accessibility
• Dark mode support with system preference detection

**Technical Implementation:**
• Component-based architecture with reusable UI elements
• Client and Server Components optimization
• Image optimization with Next.js Image component
• Form validation with real-time feedback
• Loading states and error handling
• Progressive Web App (PWA) capabilities

**Learning Outcomes:**
• Next.js 15 App Router architecture
• TypeScript in React applications
• Tailwind CSS utility-first approach
• Component-based design patterns
• Responsive web design principles
• Modern React patterns (Server Components)
• Event management system implementation
• Calendar UI/UX design patterns

**Performance Metrics:**
• Fast page loads with Next.js SSR
• 100% TypeScript coverage
• 9 fully responsive pages
• Mobile-first design
• Latest Next.js 15 & React 19
• Lighthouse score: 95+ across all categories`,
    technologies: [
      'Next.js 15',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'ESLint',
      'PostCSS'
    ],
    categories: ['web', 'fullstack'],
    featured: true,
    thumbnailUrl: '/images/projects/fc/fc1.png',
    imageUrl: '/images/projects/fc/fc1.png',
    images: [
      '/images/projects/fc/fc1.png',
      '/images/projects/fc/fc2.png',
      '/images/projects/fc/fc3.png',
      '/images/projects/fc/fc4.png',
      '/images/projects/fc/fc5.png',
      '/images/projects/fc/fc6.png',
    ],
    githubUrl: 'https://github.com/AllenDiaz/Friends-Connection-Baptist-Church',
    liveUrl: 'https://www.friendsconnection.org/',
    completedDate: '2024-12',
    teamSize: 1,
    role: 'Full Stack Developer',
  },

  // ===============================
  // PHIRECORD - HEALTHCARE MANAGEMENT SYSTEM - FEATURED
  // ===============================
  {
    id: 'phirecord-healthcare-system',
    title: 'PhiRecord - Healthcare Management System',
    description: 'Enterprise-grade healthcare management system for medical records management in rural health facilities across the Philippines. Features multi-role authentication, HIPAA-compliant data handling, and inter-hospital referral system. Published in IEEE 2024 ISCI.',
    longDescription: `Comprehensive healthcare management system designed to streamline medical records management across hospitals, healthcare professionals, and patients in the Philippines. Built with security and scalability at its core, facilitating secure management of Protected Health Information (PHI) with HIPAA-compliant data handling.

**Academic Recognition:**
Published and presented at 2024 IEEE 6th Symposium on Computers & Informatics (ISCI)
IEEE Publication: https://ieeexplore.ieee.org/document/10668022

**Multi-Role Authentication System:**
• Role-Based Access Control (RBAC) for 4 user types: Admin, Hospital, Doctor, and Patient
• Two-Factor Authentication (2FA) via Email (PHPMailer) and SMS (Twilio)
• Secure Session Management with CSRF protection
• Pending Approval Workflow for new registrations with ID verification
• Session Fixation Prevention with session regeneration on login

**Medical Records Management:**
• Admission Forms - Complete patient admission records with vital signs tracking
• Prenatal Checkup Forms - Specialized maternal healthcare records with gravida/para tracking
• Medical Certificates - Digital certificate generation and management
• Prescription Management - Doctor-issued prescriptions linked to patient records
• Soft Deletes - Archive system for historical records with audit trail

**Hospital Management Dashboard:**
• Patient Management - Track active, pending, and archived patient records
• Doctor Management - Verify and manage healthcare providers
• Inter-Hospital Referral System - Transfer patient records between facilities
• Real-time Analytics - Dashboard metrics for administrative oversight
• Role-specific dashboards with intuitive navigation

**Document Management:**
• PDF Generation - Export medical records and certificates (DomPDF/TCPDF)
• Secure File Upload - Document verification with League Flysystem
• Profile Management - User profile pictures and ID document storage
• MIME type and size restrictions for security

**Communication System:**
• Email Notifications - Automated emails for registration approval and login codes
• SMS Verification - Phone-based OTP for enhanced security (Twilio SDK)
• Request System - Patient requests for medical documents with approval workflow
• Real-time validation with client-side form validation

**Architecture Highlights:**
• Clean Architecture Principles - Separation of Concerns with Controllers, Services, Entities, and Repositories
• Design Patterns - Repository, Service Layer, Factory, Provider, Middleware, and DTOs
• Dependency Injection - Constructor injection with PHP-DI 6 for testability
• PSR Standards - PSR-4 autoloading, PSR-7 HTTP messages
• Normalized Database Schema - 3NF design with proper entity relationships

**Security Implementation:**
• Role-Based Middleware - Route protection per user role
• CSRF Token Validation - Form tampering prevention
• XSS Protection - Output escaping and input sanitization
• SQL Injection Prevention - Prepared statements via Doctrine ORM
• Password Hashing - bcrypt/Argon2 secure hashing
• File Upload Validation - MIME type and size restrictions

**Project Metrics:**
• 15,000+ Lines of PHP Code
• 50+ Database Migrations (version-controlled)
• 20+ Specialized Controllers
• 17+ Doctrine Entities
• 19+ Business Logic Services
• 15+ Custom Middleware Components
• 100+ RESTful API Routes

**Business Impact:**
• Reduces administrative overhead by 60%
• Improves patient data accessibility by 80%
• Enables seamless inter-hospital collaboration
• Ensures compliance with healthcare data regulations
• Digital record management eliminates physical storage needs
• Faster patient processing with quick medical history access

**Technical Challenges Solved:**
• Multi-Tenant Architecture - Isolated hospital data with shared infrastructure
• Complex Permissions - Granular access control for sensitive medical data
• Document Generation - Dynamic PDF creation from database records
• Two-Factor Authentication - Multi-channel verification system (Email/SMS)
• Zero-Downtime Database Migrations - Version-controlled schema updates
• Session Security - Protection against hijacking and fixation
• Optimized Database Queries - Eager loading to prevent N+1 queries

**Deployment & DevOps:**
• Dockerized Infrastructure - Easy deployment across environments with Docker Compose
• Nginx Configuration - High-performance web server setup
• MySQL Container - Production database with InnoDB engine
• Asset Optimization - Minified CSS/JS with Webpack Encore
• PHPUnit Testing - Unit testing framework for code quality`,
    technologies: [
      'PHP 8.1',
      'Slim Framework 4',
      'Doctrine ORM 2',
      'Doctrine DBAL 3',
      'PHP-DI 6',
      'MySQL 8.0',
      'Bootstrap 5.3',
      'jQuery',
      'DataTables',
      'Webpack Encore',
      'Docker',
      'Docker Compose',
      'Nginx',
      'Twilio SDK',
      'PHPMailer',
      'DomPDF',
      'TCPDF',
      'Symfony Console',
      'PHPUnit',
      'Composer',
      'Git'
    ],
    categories: ['fullstack', 'data'],
    featured: true,
    thumbnailUrl: '/images/projects/pr/pr1.jpeg',
    imageUrl: '/images/projects/pr/pr1.jpeg',
    images: [
      '/images/projects/pr/pr1.jpeg',
      '/images/projects/pr/pr2.jpeg',
      '/images/projects/pr/pr3.jpeg',
      '/images/projects/pr/pr4.jpeg',
      '/images/projects/pr/pr5.jpeg',
      '/images/projects/pr/pr6.jpeg',
      '/images/projects/pr/pr7.jpeg',
      '/images/projects/pr/pr8.jpeg',
    ],
    githubUrl: 'https://github.com/AllenDiaz/Phirecord',
    liveUrl: 'RESTRICTED',
    publicationUrl: 'https://ieeexplore.ieee.org/document/10668022',
    completedDate: '2024-08',
    teamSize: 1,
    role: 'Full Stack Developer & System Architect',
  },

  // ===============================
  // 3D INTERACTIVE PORTFOLIO - FEATURED
  // ===============================
  {
    id: '3d-interactive-portfolio',
    title: '3D Interactive Portfolio with React Three Fiber',
    description: 'Immersive 3D portfolio experience built with Next.js 15, React Three Fiber, and advanced WebGL techniques. Features cinematic camera animations, real-time reflections, custom GLSL shaders, particle systems, and performance optimization for 60 FPS across all devices.',
    longDescription: `A cutting-edge, fully interactive 3D portfolio showcasing modern web technologies and advanced 3D graphics programming. Built with Next.js 15, React Three Fiber, and Three.js, featuring professional-grade visual effects and optimized performance.

**Immersive 3D Experience:**
• Cinematic Camera Introduction - GSAP-powered 3-phase animation (aerial view → zoom → settle) with camera shake
• Interactive 3D Office Environment - Fully explorable workspace with realistic materials and lighting
• Real-Time Reflections - MeshReflectorMaterial with 512x512 resolution and depth-based falloff
• Dynamic Lighting System - Toggleable desk lamp with ambient, directional, and spotlight sources
• Particle System - 300 floating particles with realistic physics and organic movement

**Advanced Visual Effects:**
• Post-Processing Pipeline - Bloom, SSAO, Depth of Field, Vignette, and Chromatic Aberration
• Custom GLSL Shaders - Holographic display with animated grid patterns and scan line effects
• PBR Materials - Physically-based rendering with high metalness (0.9-0.95) and environment reflections
• Binary Shader Walls - Matrix-style animated binary code with custom fragment shaders
• Dynamic Screen Content - Canvas-based procedural textures with project information

**Interactive Elements:**
• Clickable Project Monitors - Three interactive displays showing featured projects
• Interactive Desk Objects - 5 desk items (keyboard, mouse, tablet, coffee mug, phone) with hover effects
• Animated Character - 3D character model with smooth animations and interactions
• Ambient Sound System - Multi-layered audio with Web Audio API (sine waves, LFO modulation, white noise)
• Theme Toggle - Dark/light mode with smooth transitions and system preference detection

**Performance Optimization:**
• Adaptive Device Pixel Ratio - Automatically adjusts quality based on device capabilities
• Real-Time FPS Monitoring - Performance optimizer that maintains 60 FPS across devices
• Event Throttling - Optimized event handlers to prevent performance degradation
• Lazy Loading - Dynamic imports for 3D components with Next.js dynamic loading
• LOD System - Level of detail management for complex geometries

**Technical Architecture:**
• React Three Fiber - Declarative 3D rendering with React components
• Three.js Core - Advanced WebGL rendering and shader programming
• Zustand State Management - Global state for UI interactions and project data
• Framer Motion - Smooth UI animations and transitions
• GSAP - Professional-grade camera animations and timeline control
• @react-three/drei - Utility components (OrbitControls, Environment, MeshReflectorMaterial)
• @react-three/postprocessing - Post-processing effects pipeline

**Component Architecture:**
• Scene3D.tsx - Canvas wrapper with performance optimization and adaptive DPR
• MainScene.tsx - Scene composition integrating all 3D elements
• SceneSetup.tsx - Camera controls, multi-light setup, and environment configuration
• PerformanceOptimizer.tsx - Real-time performance monitoring and quality adjustment
• PostProcessing.tsx - Visual effects pipeline with bloom, SSAO, and DOF
• CinematicCamera.tsx - GSAP-powered camera animation sequences
• HolographicDisplay.tsx - Custom shader-based holographic element
• FloatingParticles.tsx - Particle system with physics simulation
• AmbientSound.tsx - Web Audio API sound system with multiple layers
• Computer.tsx - Interactive monitors with dynamic canvas textures
• DeskLamp.tsx - Toggleable lighting with realistic shadows
• OfficeRoom.tsx - Complete office environment with reflective surfaces
• BinaryWall.tsx - Animated shader walls with Matrix-style effects

**Key Features Showcase:**
• Multi-Category Project System - Projects can have multiple categories (fullstack + ai, web + fullstack)
• IEEE Publication Integration - Academic publication links with green badge indicators
• Restricted Content System - Modal system for restricted GitHub repos and live demos
• Responsive Design - Mobile-first approach with adaptive layouts
• Image Galleries - Multi-image support for project showcases
• Real-Time Search & Filtering - Advanced project filtering by category and search terms
• Project Detail Pages - Dynamic routes with comprehensive project information
• About Section - Education, experience timeline, and skills showcase with modals

**Development Excellence:**
• 100% TypeScript - Full type safety across all components
• Modular Architecture - Clean separation of concerns with reusable components
• Custom Hooks - useStore for global state, useFrame for animations
• Performance Monitoring - Built-in FPS counter and quality adjustment
• Comprehensive Documentation - Detailed README files and code comments
• Zero Lint Errors - ESLint configuration with strict rules
• Modern React Patterns - Server components, client components, and async data

**Visual Quality:**
• Professional Cinematic Quality - Film-grade post-processing effects
• Photorealistic Materials - PBR workflow with proper metalness and roughness
• Living Atmosphere - Particle system creates depth and realism
• Smooth Animations - 60 FPS maintained across all interactions
• Multi-Sensory Experience - Audio-visual immersion with ambient soundscape

**Browser Technologies:**
• WebGL 2.0 - Advanced 3D graphics rendering
• Web Audio API - Real-time audio synthesis and effects
• Canvas API - Procedural texture generation
• WebGL Shaders - Custom GLSL vertex and fragment shaders
• Performance API - Real-time performance measurement
• Intersection Observer - Efficient viewport detection

**Project Metrics:**
• 10 New 3D Components - Advanced interactive elements
• 5 Enhanced Components - Upgraded existing features
• 15+ Custom Files - Comprehensive architecture
• 300+ Particles - Real-time physics simulation
• 60 FPS Target - Optimized for smooth performance
• Multi-Platform Support - Desktop, tablet, and mobile responsive

**Learning Outcomes:**
• Advanced Three.js and React Three Fiber development
• Custom GLSL shader programming (vertex + fragment)
• Performance optimization for real-time 3D graphics
• GSAP animation sequencing and timeline control
• Web Audio API multi-layer sound synthesis
• PBR material creation and lighting design
• Post-processing effects pipeline implementation
• State management with Zustand
• Next.js 15 App Router with dynamic imports
• TypeScript advanced patterns and generics`,
    technologies: [
      'Next.js 15',
      'React 19',
      'React Three Fiber',
      'Three.js',
      'TypeScript',
      'GSAP',
      'Zustand',
      '@react-three/drei',
      '@react-three/postprocessing',
      'Framer Motion',
      'Tailwind CSS',
      'WebGL',
      'GLSL Shaders',
      'Web Audio API',
      'Canvas API',
      'Vercel'
    ],
    categories: ['web', 'fullstack'],
    featured: true,
    thumbnailUrl: '/images/projects/p/p1.png',
    imageUrl: '/images/projects/p/p1.png',
    images: [
      '/images/projects/p/p1.png',
      '/images/projects/p/p2.png',
      '/images/projects/p/p3.png',
      '/images/projects/p/p4.png',
      '/images/projects/p/p5.png',
      '/images/projects/p/p6.png',
    ],
    githubUrl: 'https://github.com/AllenDiaz/my-3d-portfolio',
    liveUrl: 'https://allen-diaz-porfolio.vercel.app/',
    completedDate: '2026-02',
    teamSize: 1,
    role: 'Full Stack Developer & 3D Graphics Engineer',
  },

  // ===============================
  // YELPCAMP - FULL-STACK WEB APPLICATION - FEATURED
  // ===============================
  {
    id: 'yelpcamp-fullstack',
    title: 'YelpCamp - Campground Discovery Platform',
    description: 'Modern full-stack web application for discovering, sharing, and reviewing campgrounds. Migrated from monolithic EJS to decoupled REST API + Next.js 16 architecture with JWT authentication, MapTiler clustering, Cloudinary uploads, and Docker containerization.',
    longDescription: `A production-ready, full-stack web application that allows users to discover, share, and review campgrounds. Features a decoupled architecture with RESTful API backend and responsive Next.js frontend, demonstrating advanced web development skills including authentication, cloud services integration, interactive mapping, and containerization.

**Architecture Migration Achievement:**
Successfully migrated from monolithic server-rendered architecture (Express + EJS + Passport.js sessions) to modern decoupled architecture (Express REST API + Next.js + JWT) demonstrating ability to refactor and modernize legacy codebases.

**User Authentication & Authorization:**
• JWT-based Stateless Authentication - Token-based auth with automatic refresh and logout
• Secure Password Hashing - bcrypt implementation with salt rounds
• Protected Routes - Role-based access control for campground authors
• Persistent Authentication State - Token management with Zustand state
• Authorization Middleware - Express middleware for protected API endpoints
• Automatic Token Expiration - Secure session management with token refresh

**Campground Management System:**
• Full CRUD Operations - Create, read, update, and delete campgrounds
• Multi-Image Upload - Support for multiple images per campground via Cloudinary SDK
• Interactive Image Carousel - Gallery with navigation controls
• Automatic Geocoding - Convert text addresses to coordinates with MapTiler API
• Author Authorization - Only campground creators can edit/delete their listings
• Form Validation - Client-side (React Hook Form) and server-side (Joi) validation
• Image Management - Upload, preview, and delete functionality

**Interactive Mapping Features:**
• Dynamic Cluster Map - MapTiler SDK with real-time clustering of nearby campgrounds
• Individual Location Maps - Preview map for each campground detail page
• Interactive Markers - Clickable markers with popup campground information
• Zoom Controls - Full navigation with zoom and pan capabilities
• Geospatial Queries - MongoDB geospatial indexing for location-based searches
• Custom Styling - Teal-themed map markers matching brand identity

**Review & Rating System:**
• Star Rating System - 1-5 star visual rating with user feedback
• Text Reviews - Detailed user reviews with author attribution
• Review Authorization - Users can only delete their own reviews
• Aggregate Ratings - Display average ratings per campground
• Review Counts - Total review statistics per location
• Chronological Display - Newest reviews first with timestamps

**Modern UI/UX Design:**
• Dark Mode Support - Three theme options (Light, Dark, System) with localStorage persistence
• Responsive Design - Mobile-first approach working seamlessly on all devices
• Toast Notifications - User feedback for actions (success, error, info)
• Loading States - Skeleton screens and spinners for better UX
• Error Handling - Comprehensive error messages with recovery options
• Form Validation Feedback - Real-time validation with error messages
• Smooth Animations - Tailwind CSS transitions and hover effects

**API Architecture & Security:**
• RESTful API Design - 12+ endpoints following REST principles
• Interactive Swagger Documentation - OpenAPI 3.0 specs at /api-docs
• JWT Token Management - Secure stateless authentication
• NoSQL Injection Prevention - Express Mongo Sanitize middleware
• XSS Protection - sanitize-html for user input
• Security Headers - Helmet middleware for HTTP headers
• CORS Configuration - Cross-origin resource sharing setup
• Request Logging - Morgan HTTP request logger
• Schema Validation - Joi validation for all API requests

**Database Design & Optimization:**
• MongoDB with Mongoose ODM - NoSQL database with schema validation
• Normalized Schema Design - User → Campground → Review relationships
• Referenced Relationships - Population for efficient queries
• Virtual Properties - Computed fields for dynamic data
• Cascade Delete Operations - Automatic cleanup of related documents
• Geospatial Indexing - 2dsphere index for location queries
• Compound Indexes - Optimized query performance

**Cloud Services Integration:**
• Cloudinary SDK - Cloud-based image storage and transformation
• Image Upload Pipeline - Multer middleware for file handling
• Image Optimization - Automatic compression and format conversion
• CDN Delivery - Fast image loading via Cloudinary CDN
• Storage Management - Programmatic image deletion
• Multiple Upload Support - Batch image processing

**Frontend Architecture:**
• Next.js 16 App Router - Modern React framework with server components
• TypeScript - Full type safety with interfaces and types
• Zustand State Management - Lightweight global state
• TanStack Query - Data fetching, caching, and synchronization
• React Hook Form - Declarative form validation
• Axios with Interceptors - HTTP client with token injection
• Custom Hooks - Reusable logic for auth, API calls, and theme
• Component Library - 15+ reusable UI components

**Backend Architecture:**
• Node.js + Express.js - RESTful API server
• Middleware Pattern - Authentication, validation, error handling
• Controller Pattern - Separation of route handlers
• Model Pattern - Mongoose schemas and methods
• Service Layer - Business logic abstraction
• Error Handling Middleware - Centralized error management
• Async Error Wrapper - Clean async/await error handling

**DevOps & Containerization:**
• Docker Containerization - Multi-container setup with Docker Compose
• Development Dockerfile - Hot-reload with nodemon and volume mounting
• Production Dockerfile - Optimized multi-stage builds
• MongoDB Container - Persistent volume for database
• Environment Configuration - Separate dev/prod environment variables
• Container Orchestration - Service communication and networking
• Health Checks - Container readiness and liveness probes

**Development Workflow:**
• Git Version Control - Feature branches and meaningful commits
• Environment Variables - Configuration management with .env
• Seed Data - Testing data for development
• API Testing - Swagger UI for endpoint testing
• Hot Module Replacement - Fast development iteration
• Error Logging - Comprehensive logging for debugging

**Key Features Showcase:**
• Landing Page - Hero section with call-to-action and featured campgrounds
• Browse Gallery - Grid view with images, ratings, and quick info
• Cluster Map Page - Explore campgrounds geographically with clustering
• Campground Details - Full information with reviews, images, and location map
• User Dashboard - Manage your campground listings
• Create/Edit Forms - Multi-step forms with validation
• Review Management - Add, view, and delete reviews
• Theme Persistence - User preferences saved across sessions
• Mobile Navigation - Hamburger menu with smooth transitions

**Technical Challenges Solved:**
• JWT Migration - Converted from session-based Passport.js to stateless JWT authentication
• Token Management - Implemented automatic token refresh and expiration handling
• Image Pipeline - Built complete upload, storage, and deletion workflow with Cloudinary
• Map Integration - Integrated MapTiler SDK with clustering and geocoding
• State Synchronization - Managed global state across multiple components
• Docker Networking - Configured multi-container communication
• CORS Issues - Resolved cross-origin authentication challenges
• Type Safety - Implemented comprehensive TypeScript interfaces

**Security Implementations:**
• Password Encryption - bcrypt with configurable salt rounds
• JWT Secret Management - Environment variable security
• Input Sanitization - Prevention of NoSQL injection and XSS
• HTTP Security Headers - Helmet middleware configuration
• CSRF Protection - Token-based form security
• Rate Limiting - API endpoint throttling (future enhancement)
• Secure Cookie Handling - httpOnly and secure flags

**Performance Optimizations:**
• Image CDN - Cloudinary for fast image delivery
• Database Indexing - Optimized query performance
• API Caching - TanStack Query caching strategy
• Lazy Loading - Code splitting with Next.js dynamic imports
• Optimized Bundle Size - Tree shaking and minification
• Geospatial Queries - Efficient location-based searches

**Project Metrics:**
• 5,000+ Lines of Code
• 12+ RESTful API Endpoints
• 15+ React Components
• 3 Database Models (User, Campground, Review)
• 20+ Implemented Features
• Comprehensive Swagger API Documentation
• Docker Multi-Container Setup
• Full TypeScript Coverage

**Learning Outcomes:**
• Architectural refactoring from monolithic to microservices-ready
• JWT authentication and token lifecycle management
• RESTful API design and documentation
• Docker containerization and orchestration
• Cloud services integration (Cloudinary, MapTiler)
• TypeScript for type-safe development
• Modern React patterns with Next.js 16
• Database design and optimization
• Security best practices implementation
• DevOps workflow and deployment strategies`,
    technologies: [
      'Next.js 16',
      'Express.js',
      'TypeScript',
      'React',
      'Node.js',
      'MongoDB',
      'Mongoose',
      'JWT',
      'Bcrypt',
      'Zustand',
      'TanStack Query',
      'React Hook Form',
      'Axios',
      'Tailwind CSS 4',
      'MapTiler SDK',
      'Cloudinary',
      'Multer',
      'Joi',
      'Swagger',
      'Docker',
      'Docker Compose',
      'Helmet',
      'Morgan',
      'Git'
    ],
    categories: ['fullstack', 'web'],
    featured: true,
    thumbnailUrl: '/images/projects/camp/camp1.png',
    imageUrl: '/images/projects/camp/camp1.png',
    images: [
      '/images/projects/camp/camp1.png',
      '/images/projects/camp/camp2.png',
      '/images/projects/camp/camp3.png',
      '/images/projects/camp/camp4.png',
      '/images/projects/camp/camp5.png',
    ],
    githubUrl: 'https://github.com/AllenDiaz/YelpCamp-Replicate',
    liveUrl: 'RESTRICTED',
    completedDate: '2024-11',
    teamSize: 1,
    role: 'Full Stack Developer',
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
export const getProjectsByCategory = (category: 'web' | 'mobile' | 'ai' | 'fullstack' | 'data' | 'other'): Project[] => {
  return projectsData.filter(project => project.categories.includes(category));
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
export const getAllCategories = (): ('web' | 'mobile' | 'ai' | 'fullstack' | 'data' | 'other')[] => {
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
    project.categories.forEach(category => {
      acc[category] = (acc[category] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
};
