'use client';

import Navbar from '@/components/Navbar';
import AboutMe from '@/components/AboutMe';

export default function AboutPage() {
  return (
    <main className="relative bg-black min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* About Me Section with proper spacing for navbar */}
      <div className="pt-20">
        <AboutMe />
      </div>
    </main>
  );
}
