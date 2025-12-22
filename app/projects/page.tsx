'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore, type Project } from '@/store/useStore';
import { Github, ExternalLink, Star, Search, Filter, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const categories = ['all', 'web', 'mobile', 'ai', 'fullstack', 'data', 'other'] as const;
type Category = typeof categories[number];

export default function ProjectsPage() {
  const { allProjects, getProjectsByCategory } = useStore();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = allProjects.filter((project) => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredProjects = filteredProjects.filter(p => p.featured);
  const regularProjects = filteredProjects.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 text-white">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-30 backdrop-blur-md bg-zinc-900/80 border-b border-zinc-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  All Projects
                </h1>
                <p className="text-gray-400 mt-1">
                  {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <h2 className="text-2xl font-bold">Featured Projects</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} featured />
              ))}
            </div>
          </motion.section>
        )}

        {/* Regular Projects */}
        {regularProjects.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-8">All Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </motion.section>
        )}

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-zinc-800 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No projects found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  index: number;
  featured?: boolean;
}

function ProjectCard({ project, index, featured = false }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative bg-zinc-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-zinc-700 hover:border-zinc-600 transition-all duration-300 ${
        featured ? 'md:col-span-1' : ''
      }`}
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg">
          <Star className="w-3 h-3 text-white fill-white" />
          <span className="text-xs font-bold text-white uppercase tracking-wide">
            Featured
          </span>
        </div>
      )}

      {/* Image or Gradient Placeholder */}
      <div className={`relative ${featured ? 'h-64' : 'h-48'} bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden`}>
        <motion.div
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full bg-gradient-to-br from-blue-600/50 via-purple-600/50 to-pink-600/50"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
          {project.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-zinc-700/50 text-xs text-gray-300 rounded"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 bg-zinc-700/30 text-xs text-gray-400 rounded">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded capitalize">
            {project.category}
          </span>
          {project.completedDate && (
            <span>{project.completedDate}</span>
          )}
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors text-sm"
            >
              <Github className="w-4 h-4" />
              Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Live
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
