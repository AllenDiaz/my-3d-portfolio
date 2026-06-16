/**
 * Centralized site configuration used by metadata, sitemap, and robots.
 *
 * Set NEXT_PUBLIC_SITE_URL in your environment (e.g. Vercel project settings)
 * to your production origin so canonical URLs, Open Graph, sitemap, and robots
 * all point at the right host. The fallback is only used in local dev.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
).replace(/\/$/, '');

export const SITE = {
  name: 'Allen Diaz — Portfolio',
  shortName: 'Allen Diaz',
  title: 'Allen Diaz — Full-Stack Developer & 3D Portfolio',
  description:
    'Interactive 3D portfolio of Allen Diaz, a full-stack developer specializing in web, AI, and cloud applications. Explore projects, skills, and experience.',
  /** Default social share image (must exist under /public). */
  ogImage: '/images/profile-picture.jpg',
  author: 'Allen Diaz',
  keywords: [
    'Allen Diaz',
    'full-stack developer',
    'software engineer',
    'web developer',
    '3D portfolio',
    'Next.js',
    'React',
    'Three.js',
    'TypeScript',
    'AI',
    'cloud',
  ],
} as const;
