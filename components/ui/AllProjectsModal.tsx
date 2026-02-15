'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Star, Lock, FileText, Search, Code2, Cpu, Smartphone, Globe, Database } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useState, useMemo } from 'react';
import Image from 'next/image';

interface AllProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AllProjectsModal({ isOpen, onClose }: AllProjectsModalProps) {
  const { allProjects, setActiveProject, setShowProjectPanel, setShowRestrictedLinkModal } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'web' | 'mobile' | 'ai' | 'fullstack' | 'data'>('all');

  // Filter projects based on search and category
  const filteredProjects = useMemo(() => {
    let result = allProjects;

    // Filter by category
    if (activeFilter !== 'all') {
      result = result.filter(project => project.categories.includes(activeFilter));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some(tech => tech.toLowerCase().includes(query))
      );
    }

    return result;
  }, [allProjects, searchQuery, activeFilter]);

  const handleProjectClick = (project: any) => {
    setActiveProject(project);
    setShowProjectPanel(true);
    onClose();
  };

  const handleLinkClick = (e: React.MouseEvent, url: string | undefined, linkType: 'code' | 'live') => {
    e.preventDefault();
    e.stopPropagation();
    
    if (url === 'RESTRICTED') {
      onClose();
      setTimeout(() => setShowRestrictedLinkModal(true, linkType), 300);
    } else if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const categories = [
    { id: 'all', label: 'All Projects', icon: Globe },
    { id: 'fullstack', label: 'Full Stack', icon: Code2 },
    { id: 'ai', label: 'AI/ML', icon: Cpu },
    { id: 'web', label: 'Web', icon: Globe },
    { id: 'mobile', label: 'Mobile', icon: Smartphone },
    { id: 'data', label: 'Data', icon: Database },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-7xl max-h-[90vh] bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-purple-500/50 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between border-b-2 border-purple-500/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white text-2xl font-bold">All Projects</h2>
                    <p className="text-purple-100 text-sm">{filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} Found</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search and Filters */}
              <div className="p-6 border-b border-white/10">
                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects by name, description, or technology..."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                  />
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveFilter(category.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        activeFilter === category.id
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <category.icon className="w-4 h-4" />
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Projects Grid */}
              <div className="overflow-y-auto max-h-[calc(90vh-16rem)] p-6">
                {filteredProjects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Code2 className="w-16 h-16 text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-400 mb-2">No Projects Found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleProjectClick(project)}
                        className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-purple-500/20 hover:scale-105"
                      >
                        {/* Project Image */}
                        <div className="relative h-48 bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden">
                          {project.thumbnailUrl ? (
                            <Image
                              src={project.thumbnailUrl}
                              alt={project.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Code2 className="w-16 h-16 text-white/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          
                          {/* Featured Badge */}
                          {project.featured && (
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg">
                              <Star className="w-3 h-3 text-white fill-white" />
                              <span className="text-xs font-bold text-white uppercase tracking-wide">
                                Featured
                              </span>
                            </div>
                          )}

                          {/* IEEE Badge */}
                          {project.publicationUrl && (
                            <div className="absolute top-3 right-3 px-2.5 py-1 bg-green-500 rounded-full shadow-lg">
                              <span className="text-xs font-bold text-white uppercase tracking-wide">
                                IEEE
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Project Info */}
                        <div className="p-4">
                          <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {project.description}
                          </p>

                          {/* Technologies */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.technologies.slice(0, 3).map((tech: string) => (
                              <span
                                key={tech}
                                className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-500">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            {project.githubUrl && (
                              <button
                                onClick={(e) => handleLinkClick(e, project.githubUrl, 'code')}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm"
                              >
                                {project.githubUrl === 'RESTRICTED' ? (
                                  <>
                                    <Lock className="w-3.5 h-3.5" />
                                    Code
                                  </>
                                ) : (
                                  <>
                                    <Github className="w-3.5 h-3.5" />
                                    Code
                                  </>
                                )}
                              </button>
                            )}
                            {project.liveUrl && (
                              <button
                                onClick={(e) => handleLinkClick(e, project.liveUrl, 'live')}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                              >
                                {project.liveUrl === 'RESTRICTED' ? (
                                  <>
                                    <Lock className="w-3.5 h-3.5" />
                                    Live
                                  </>
                                ) : (
                                  <>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Live
                                  </>
                                )}
                              </button>
                            )}
                            {project.publicationUrl && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(project.publicationUrl, '_blank');
                                }}
                                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                IEEE
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Scanline effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent animate-scan"></div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 -z-10 blur-2xl opacity-30 bg-gradient-to-br from-purple-500 to-blue-500 pointer-events-none"></div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
