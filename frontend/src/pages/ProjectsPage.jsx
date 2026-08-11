import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import NeumorphicButton from '../components/ui/NeumorphicButton';
import ProjectModal from '../components/ui/ProjectModal';
import { ExternalLink, Github, ArrowRight, Maximize2, RefreshCw, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getProjects } from '../services/projectsService';

const CATEGORIES = [
  'All',
  'E-Commerce & Digital Retail',
  'SaaS & Enterprise Systems',
  'Enterprise SaaS',
  'Healthcare & Biotech',
  'Fintech & Web3',
  'Productivity & Collaboration',
];

// ── Loading Skeleton ────────────────────────────────────────────────────────
const ProjectSkeleton = () => (
  <div className="animate-pulse rounded-3xl bg-white/5 dark:bg-white/[0.03] border border-white/10 p-6 space-y-4">
    <div className="aspect-video rounded-2xl bg-white/10" />
    <div className="h-3 w-1/4 rounded bg-white/10" />
    <div className="h-5 w-3/4 rounded bg-white/10" />
    <div className="h-3 w-full rounded bg-white/10" />
    <div className="h-3 w-2/3 rounded bg-white/10" />
    <div className="flex gap-2 pt-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-5 w-14 rounded-md bg-white/10" />
      ))}
    </div>
    <div className="pt-4 border-t border-white/10 flex justify-between">
      <div className="h-8 w-24 rounded-xl bg-white/10" />
      <div className="flex gap-2">
        <div className="h-8 w-24 rounded-xl bg-white/10" />
        <div className="h-8 w-24 rounded-xl bg-white/10" />
      </div>
    </div>
  </div>
);

// ── Project Card ─────────────────────────────────────────────────────────────
const ProjectCard = ({ project, index, isDark, onQuickView, onNavigate }) => {
  const projectImage = project.image || project.cover_image || '/images/ecom.jpg';
  const tags = Array.isArray(project.technologies)
    ? project.technologies
    : Array.isArray(project.tags)
    ? project.tags
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      layout
    >
      <GlassCard neumorphic gradientBorder className="p-6 sm:p-8 space-y-6 flex flex-col justify-between h-full">
        <div className="space-y-4">
          {/* Thumbnail */}
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 group cursor-pointer" onClick={() => onQuickView(project)}>
            <img
              src={projectImage}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => { e.target.src = '/images/ecom.jpg'; }}
            />
            <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
              <NeumorphicButton variant="primary" icon={Maximize2} onClick={() => onQuickView(project)}>
                Quick View
              </NeumorphicButton>
            </div>
          </div>

          {/* Meta */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C63FF] dark:text-[#7C5CFF]">
              {project.category}
            </span>
            <h3 className="text-xl font-black text-[#1B2430] dark:text-[#F8FAFC] mt-1 leading-snug">
              {project.title}
            </h3>
            <p className="text-xs text-[#667085] dark:text-[#CBD5E1] mt-2 leading-relaxed line-clamp-2">
              {project.subtitle || project.description}
            </p>
          </div>

          {/* Tech Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 5).map((tag, tIdx) => (
              <span
                key={tIdx}
                className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#6C63FF]/10 text-[#6C63FF] dark:text-[#7C5CFF] border border-[#6C63FF]/20"
              >
                {tag}
              </span>
            ))}
            {tags.length > 5 && (
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/5 text-[#667085]">
                +{tags.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
          <NeumorphicButton
            variant="primary"
            onClick={() => onNavigate(`/projects/${project.slug || project.id}`)}
            icon={ArrowRight}
            title="Read the full case study"
          >
            Case Study
          </NeumorphicButton>

          <div className="flex items-center gap-2 flex-wrap">
            {(project.live_demo || project.liveDemo) && (
              <NeumorphicButton
                variant="glass"
                onClick={() => window.open(project.live_demo || project.liveDemo, '_blank')}
                icon={ExternalLink}
                title="Open live demo"
              >
                View Live
              </NeumorphicButton>
            )}
            {(project.github_url || project.github) && (
              <NeumorphicButton
                variant="glass"
                onClick={() => window.open(project.github_url || project.github, '_blank')}
                icon={Github}
                title="Browse source code on GitHub"
              >
                GitHub
              </NeumorphicButton>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export const ProjectsPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedModalProject, setSelectedModalProject] = useState(null);
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProjects = () => {
    setLoading(true);
    setError(false);
    getProjects()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjectsList(data);
        } else {
          setProjectsList([]);
        }
      })
      .catch((err) => {
        console.error('Failed to load projects:', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const filteredProjects = selectedCategory === 'All'
    ? projectsList
    : projectsList.filter((p) => p.category === selectedCategory);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Portfolio Archive"
          title="Digital Applications & Case Studies"
          subtitle="Explore the complete spectrum of custom web applications, e-commerce engines, and enterprise design systems."
        />

        {/* ── Category Filter Pills ── */}
        <div className="relative mb-12">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] ${
                    isActive
                      ? isDark
                        ? 'bg-[#7C5CFF] text-white shadow-lg shadow-[#7C5CFF]/30'
                        : 'bg-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/30'
                      : isDark
                        ? 'glass-card-dark text-[#CBD5E1] hover:text-white hover:bg-white/10'
                        : 'glass-card-light text-[#667085] hover:text-[#1B2430] hover:bg-black/5'
                  }`}
                >
                  {cat}
                  {isActive && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-2xl ring-2 ring-[#6C63FF]/40 dark:ring-[#7C5CFF]/40 pointer-events-none"
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active filter count badge */}
          {selectedCategory !== 'All' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-[#667085] dark:text-[#CBD5E1] mt-2"
            >
              Showing <span className="font-bold text-[#6C63FF] dark:text-[#7C5CFF]">{filteredProjects.length}</span> project{filteredProjects.length !== 1 ? 's' : ''} in <span className="font-bold">{selectedCategory}</span>
            </motion.p>
          )}
        </div>

        {/* ── Loading State ── */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[...Array(4)].map((_, i) => <ProjectSkeleton key={i} />)}
          </div>
        )}

        {/* ── Error State ── */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-4 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
              <RefreshCw className="w-7 h-7 text-rose-400" />
            </div>
            <p className="text-[#667085] dark:text-[#CBD5E1] text-sm">Failed to load projects. Please check your connection.</p>
            <NeumorphicButton variant="primary" onClick={fetchProjects} icon={RefreshCw}>
              Try Again
            </NeumorphicButton>
          </motion.div>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-4 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#6C63FF]/10 flex items-center justify-center">
              <FolderOpen className="w-7 h-7 text-[#6C63FF]" />
            </div>
            <p className="font-bold text-[#1B2430] dark:text-[#F8FAFC]">No projects in this category yet</p>
            <p className="text-sm text-[#667085] dark:text-[#CBD5E1]">Try selecting a different filter or check back soon.</p>
            <NeumorphicButton variant="secondary" onClick={() => setSelectedCategory('All')}>
              Show All Projects
            </NeumorphicButton>
          </motion.div>
        )}

        {/* ── Projects Grid ── */}
        {!loading && !error && filteredProjects.length > 0 && (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={selectedCategory}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  isDark={isDark}
                  onQuickView={setSelectedModalProject}
                  onNavigate={navigate}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* ── Quick View Modal ── */}
      {selectedModalProject && (
        <ProjectModal
          project={selectedModalProject}
          onClose={() => setSelectedModalProject(null)}
        />
      )}
    </PageWrapper>
  );
};

export default ProjectsPage;
