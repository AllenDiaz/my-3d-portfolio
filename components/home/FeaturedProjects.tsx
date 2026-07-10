'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, FileText, Star } from 'lucide-react';
import { getFeaturedProjects, type Project } from '@/data/projects';

/**
 * Landing-page showcase of real project screenshots.
 * First featured project gets a wide spotlight card; the next three fill a row.
 */
export default function FeaturedProjects() {
  const [spotlight, ...rest] = getFeaturedProjects();
  const secondary = rest.slice(0, 3);

  if (!spotlight) return null;

  return (
    <section
      id="featured-work"
      className="relative py-20 px-8 bg-black transition-colors scroll-mt-20"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Featured{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Work
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl">
              A few things I&apos;ve shipped — from enterprise AI platforms to
              IEEE-published research
            </p>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors whitespace-nowrap"
          >
            View all projects
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Spotlight card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <SpotlightCard project={spotlight} />
        </motion.div>

        {/* Secondary cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {secondary.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpotlightCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <div className="relative grid lg:grid-cols-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-white/25 hover:bg-white/10 transition-all">
        {/* Screenshot */}
        <div className="relative h-64 lg:h-auto lg:min-h-[22rem] overflow-hidden">
          {project.imageUrl && (
            <Image
              src={project.imageUrl}
              alt={`${project.title} screenshot`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/40" />
        </div>

        {/* Content */}
        <div className="relative p-8 lg:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full text-yellow-300 text-xs font-bold uppercase tracking-wide">
              <Star className="w-3 h-3 fill-yellow-300" />
              Flagship Project
            </span>
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 leading-relaxed mb-6">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.slice(0, 6).map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-2 text-blue-400 font-semibold group-hover:gap-3 transition-all">
            View case study
            <ArrowUpRight className="w-5 h-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`} className="group block h-full">
      <div className="relative h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-white/25 hover:bg-white/10 transition-all">
        {/* Screenshot */}
        <div className="relative h-44 overflow-hidden">
          {project.thumbnailUrl && (
            <Image
              src={project.thumbnailUrl}
              alt={`${project.title} screenshot`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {project.publicationUrl && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/20 border border-green-400/30 backdrop-blur-sm rounded-full text-green-300 text-xs font-semibold">
              <FileText className="w-3 h-3" />
              IEEE Published
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
