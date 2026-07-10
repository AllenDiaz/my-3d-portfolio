'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Star, Calendar, User, FolderOpen, FileText } from 'lucide-react';
import { useStore, type Project } from '@/store/useStore';
import Image from 'next/image';
import Link from 'next/link';
import RestrictedLinkModal from '@/components/ui/RestrictedLinkModal';

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const router = useRouter();
  const { allProjects, showRestrictedLinkModal, restrictedLinkType, setShowRestrictedLinkModal } = useStore();
  const [project, setProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    params.then((p) => {
      const foundProject = allProjects.find((proj) => proj.id === p.slug);
      setProject(foundProject || null);
    });
  }, [params, allProjects]);

  const handleLinkClick = (e: React.MouseEvent, url: string | undefined, linkType: 'code' | 'live') => {
    if (url === 'RESTRICTED') {
      e.preventDefault();
      setShowRestrictedLinkModal(true, linkType);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <button
            onClick={() => router.push('/projects')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const projectImages =
    project.images ?? (project.thumbnailUrl ? [project.thumbnailUrl] : []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 text-white">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-30 backdrop-blur-md bg-zinc-900/80 border-b border-zinc-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4">
          <button
            onClick={() => router.push('/projects')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </button>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 text-sm text-gray-500 min-w-0">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-white transition-colors">
              Projects
            </Link>
            <span>/</span>
            <span className="text-gray-300 truncate">{project.title}</span>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {project.title}
                </h1>
                {project.featured && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg">
                    <Star className="w-4 h-4 text-white fill-white" />
                    <span className="text-xs font-bold text-white uppercase tracking-wide">
                      Featured
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xl text-gray-300 mb-6">
                {project.description}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                {project.categories && project.categories.length > 0 && (
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    <div className="flex gap-2">
                      {project.categories.map(cat => (
                        <span key={cat} className="capitalize">{cat}</span>
                      ))}
                    </div>
                  </div>
                )}
                {project.completedDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{project.completedDate}</span>
                  </div>
                )}
                {project.role && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{project.role}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl === 'RESTRICTED' ? '#' : project.githubUrl}
                target={project.githubUrl === 'RESTRICTED' ? undefined : '_blank'}
                rel={project.githubUrl === 'RESTRICTED' ? undefined : 'noopener noreferrer'}
                onClick={(e) => handleLinkClick(e, project.githubUrl, 'code')}
                className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors font-medium"
              >
                <Github className="w-5 h-5" />
                {project.githubUrl === 'RESTRICTED' ? 'View Code (Restricted)' : 'View Code'}
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl === 'RESTRICTED' ? '#' : project.liveUrl}
                target={project.liveUrl === 'RESTRICTED' ? undefined : '_blank'}
                rel={project.liveUrl === 'RESTRICTED' ? undefined : 'noopener noreferrer'}
                onClick={(e) => handleLinkClick(e, project.liveUrl, 'live')}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                <ExternalLink className="w-5 h-5" />
                {project.liveUrl === 'RESTRICTED' ? 'Live Demo (Restricted)' : 'Live Demo'}
              </a>
            )}
            {project.publicationUrl && (
              <a
                href={project.publicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
              >
                <FileText className="w-5 h-5" />
                View Publication (IEEE)
              </a>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Image Gallery */}
            {projectImages.length > 0 && (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700">
                  <Image
                    src={projectImages[currentImageIndex]}
                    alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                  {projectImages.length > 1 && (
                    <span className="absolute bottom-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs text-gray-300">
                      {currentImageIndex + 1} / {projectImages.length}
                    </span>
                  )}
                </div>
                {projectImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {projectImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === idx
                            ? 'border-blue-500 scale-105'
                            : 'border-zinc-700 hover:border-zinc-600'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Long Description */}
            {project.longDescription && (
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-4">About This Project</h2>
                <LongDescription text={project.longDescription} />
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Technologies */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-zinc-700/50 text-sm text-gray-300 rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Info */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Project Info</h3>
              <dl className="space-y-3 text-sm">
                {project.teamSize && (
                  <>
                    <dt className="text-gray-500">Team Size</dt>
                    <dd className="text-gray-300 font-medium">
                      {project.teamSize} {project.teamSize === 1 ? 'person' : 'people'}
                    </dd>
                  </>
                )}
                {project.completedDate && (
                  <>
                    <dt className="text-gray-500">Completed Date</dt>
                    <dd className="text-gray-300 font-medium">{project.completedDate}</dd>
                  </>
                )}
                {project.categories && project.categories.length > 0 && (
                  <>
                    <dt className="text-gray-500">Categories</dt>
                    <dd className="text-gray-300 font-medium">
                      <div className="flex flex-wrap gap-2">
                        {project.categories.map(cat => (
                          <span key={cat} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded capitalize text-xs">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </>
                )}
              </dl>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Restricted Link Modal */}
      <RestrictedLinkModal
        isOpen={showRestrictedLinkModal}
        onClose={() => setShowRestrictedLinkModal(false)}
        linkType={restrictedLinkType || 'code'}
        projectId={project?.id}
      />
    </div>
  );
}

/** Render inline **bold** markdown within a line of text. */
function InlineBold({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, idx) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={idx} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={idx}>{part}</span>
        )
      )}
    </>
  );
}

/**
 * Structured renderer for longDescription: full-bold lines become section
 * headings, consecutive "•" lines become bullet lists, everything else is a
 * paragraph — instead of dumping the whole thing as flat paragraphs.
 */
function LongDescription({ text }: { text: string }) {
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = (key: string) => {
    if (bullets.length === 0) return;
    const items = bullets;
    bullets = [];
    blocks.push(
      <ul key={key} className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-3 text-gray-300 leading-relaxed">
            <span className="text-blue-400 mt-0.5 flex-shrink-0">▹</span>
            <span>
              <InlineBold text={item} />
            </span>
          </li>
        ))}
      </ul>
    );
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();
    if (!line) return;

    if (line.startsWith('•')) {
      bullets.push(line.slice(1).trim());
      return;
    }

    flushBullets(`ul-${idx}`);

    const headingMatch = line.match(/^\*\*(.+?):?\*\*$/);
    if (headingMatch) {
      blocks.push(
        <h3
          key={`h-${idx}`}
          className="text-lg font-bold text-white pt-2 first:pt-0"
        >
          {headingMatch[1].replace(/:$/, '')}
        </h3>
      );
      return;
    }

    blocks.push(
      <p key={`p-${idx}`} className="text-gray-300 leading-relaxed">
        <InlineBold text={line} />
      </p>
    );
  });

  flushBullets('ul-final');

  return <div className="space-y-4">{blocks}</div>;
}
